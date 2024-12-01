import { likePost, savePost } from "@/api/post";
import { toast } from "sonner";
import handleError from "./handleError";
import {
  deleteComment,
  getPostComments,
  toggleCommentLike,
} from "@/api/comment";

export const handleLike = async (postId, accessToken, setData) => {
  try {
    const res = await likePost(postId, accessToken);
    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              likes: res.data.post.likes,
            };
          }
          return p;
        }),
      }));
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const handleSavePost = async (postId, accessToken, setData) => {
  try {
    const res = await savePost(postId, accessToken);
    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              savedBy: res.data.post?.savedBy,
            };
          }
          return p;
        }),
      }));
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const handleDeleteComment = async (
  commentId,
  accessToken,
  postId,
  setData,
  page,
  setCommentsArray
) => {
  try {
    const res = await deleteComment(commentId, accessToken);
    if (res.status === 200) {
      const updatedData = await getPostComments(postId, accessToken, page);
      setData(updatedData.data);
      setCommentsArray(updatedData.data.comments);
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const handleCommentLike = async (
  commentId,
  accessToken,
  setData,
  postId,
  page,
  setCommentsArray
) => {
  try {
    const res = await toggleCommentLike(commentId, accessToken);
    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        comments: prev.comments.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              likes: res.data.comment?.likes,
            };
          }
          return c;
        }),
      }));
      const getComments = await getPostComments(postId, accessToken, page);
      setData((prev) => ({
        ...prev,
        comments: getComments.data.comments,
      }));
      // Update the commentsArray with the new likes
      setCommentsArray((prev) =>
        prev.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes:
                getComments.data.comments.find((c) => c._id === commentId)
                  ?.likes || comment.likes,
            };
          }
          return comment;
        })
      );
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};
