import { axiosInstance } from "@/utils";

export const getUser = async (username) => {
  return await axiosInstance.get(`/user/${username}`);
};

export const changeProfilePhoto = async (data, token, fn) => {
  return await axiosInstance.patch("/user/uploadProfilePic", data, {
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
