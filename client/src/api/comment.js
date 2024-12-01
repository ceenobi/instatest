import { axiosInstance } from "@/utils";

export const addPostComment = async (postId, data, token) => {
  return await axiosInstance.post(`/comments/createComment/${postId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getPostComments = async (postId, token, page) => {
  return await axiosInstance.get(
    `/comments/getPostComments/${postId}?page=${page || 1}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteComment = async (commentId, token) => {
  return await axiosInstance.delete(`/comments/deleteComment/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleCommentLike = async (commentId, token) => {
  return await axiosInstance.patch(
    `/comments/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
