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
    `/comments/getPostComments/${postId}?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
