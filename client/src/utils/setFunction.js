import { likePost, savePost, unlikePost, unsavePost } from "@/api/post";
import { toast } from "sonner";
import handleError from "./handleError";
import { getPostComments } from "@/api/comment";

export const saveUserPost = async (postId, accessToken, setData) => {
  try {
    const res = await savePost(postId, accessToken);
    if (res.status === 200) {
      toast.success(res.data.message);
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
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const unsaveUserPost = async (postId, accessToken, setData) => {
  try {
    const res = await unsavePost(postId, accessToken);
    if (res.status === 200) {
      toast.success(res.data.message);
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
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const savePostPage = async (postId, accessToken, page, setData) => {
  try {
    const res = await savePost(postId, accessToken);
    if (res.status === 200) {
      // Refetch comments
      const updatedData = await getPostComments(postId, accessToken, page);
      setData(updatedData.data);
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

export const unsavePostPage = async (postId, accessToken, page, setData) => {
  try {
    const res = await unsavePost(postId, accessToken);
    if (res.status === 200) {
      // Refetch comments
      const updatedData = await getPostComments(postId, accessToken, page);
      setData(updatedData.data);
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};

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

export const handleUnlike = async (postId, accessToken, setData) => {
  try {
    const res = await unlikePost(postId, accessToken);
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

export const handleLikePostPage = async (
  postId,
  accessToken,
  setData,
  post
) => {
  try {
    const res = await likePost(postId, accessToken);
    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        post: {
          ...post,
          likes: res.data.post.likes,
        },
      }));
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};
export const handleUnlikePostPage = async (
  postId,
  accessToken,
  setData,
  post
) => {
  try {
    const res = await unlikePost(postId, accessToken);
    if (res.status === 200) {
      setData((prev) => ({
        ...prev,
        post: {
          ...post,
          likes: res.data.post.likes,
        },
      }));
      toast.success(res.data.message);
    }
  } catch (error) {
    handleError(toast.error, error);
  }
};
