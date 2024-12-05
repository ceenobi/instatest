import { likePost, savePost } from "@/api/post";
import { toast } from "sonner";
import handleError from "./handleError";
import {
  deleteComment,
  toggleCommentLike,
} from "@/api/comment";
import { followUser } from "@/api/user";

export const handleLike = async (postId, accessToken, setData) => {
  try {
    const res = await likePost(postId, accessToken);
    if (res.status === 200) {
      toast.success(res.data.message);
      setData((prev) => ({
        ...prev,
        post: res.data.post,
      }));
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const handleSavePost = async (postId, accessToken, setData) => {
  try {
    const res = await savePost(postId, accessToken);
    if (res.status === 200) {
      toast.success(res.data.message);
      setData((prev) => ({
        ...prev,
        post: res.data.post,
      }));
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const handleDeleteComment = async (
  commentId,
  accessToken,
  setData,
  setCommentsArray
) => {
  try {
    const res = await deleteComment(commentId, accessToken);
    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      setCommentsArray((prev) => prev.filter((c) => c._id !== commentId));
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
  setCommentsArray
) => {
  try {
    const res = await toggleCommentLike(commentId, accessToken);
    console.log(res);

    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, likes: res.data.data.likes } : c
        ),
      }));
      setCommentsArray((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, likes: res.data.data.likes } : c
        )
      );
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const toggleFollowUser = async (
  userId,
  setFollowText,
  accessToken,
  setUser,
  setError
) => {
  try {
    setFollowText("Following...");
    const res = await followUser(userId, accessToken);
    if (res.status === 200) {
      toast.success(res.data.message);
      setUser((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          ...res.data.user,
        },
      }));
    }
  } catch (error) {
    handleError(setError, error);
  } finally {
    setFollowText("");
  }
};
