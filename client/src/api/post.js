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
