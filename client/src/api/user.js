import { axiosInstance } from "@/utils";

export const getUser = async (username) => {
  return await axiosInstance.get(`/user/${username}`);
};
