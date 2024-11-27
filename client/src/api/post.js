import { axiosInstance } from "@/utils";

export const createPost = async (data, token, fn) => {
  return await axiosInstance.post("/post/createPost", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      fn(progress);
    },
  });
};

export const getAllPosts = async (token) => {
  return await axiosInstance.get("/post/getAllPosts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/post/likePost/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const unlikePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/post/unlikePost/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const seeWhoLiked = async (postId, token) => {
  return await axiosInstance.get(`/post/seeWhoLiked/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
