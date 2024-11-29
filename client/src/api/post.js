import { axiosInstance } from "@/utils";

export const createPost = async (data, token, fn) => {
  return await axiosInstance.post("/posts/createPost", data, {
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
  return await axiosInstance.get("/posts/getAllPosts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/posts/likePost/${postId}`,
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
    `/posts/unlikePost/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const seeWhoLiked = async (postId, token) => {
  return await axiosInstance.get(`/posts/seeWhoLiked/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const savePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/posts/savePost/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const unsavePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/posts/unsavePost/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
