import { axiosInstance } from "@/utils";

export const createPost = async (data, token, setUploadProgress) => {
  return await axiosInstance.post("/posts/createPost", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      setUploadProgress(progress);
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

export const getUserPosts = async (userId, token) => {
  return await axiosInstance.get(`/posts/getUserPosts/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/posts/handleLikePost/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const savePost = async (postId, token) => {
  return await axiosInstance.patch(
    `/posts/handleSavePost/${postId}`,
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

export const deletePost = async (postId, token) => {
  return await axiosInstance.delete(`/posts/deletePost/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserSavedPosts = async (userId, token) => {
  return await axiosInstance.get(`/posts/getUserSavedPosts/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePost = async (postId, data, token) => {
  return await axiosInstance.patch(`/posts/updatePost/${postId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRandomPosts = async (page, token) => {
  return await axiosInstance.get(`/posts/random?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

