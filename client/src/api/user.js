import { axiosInstance } from "@/utils";

export const signUpUser = async (formData) => {
  return await axiosInstance.post("/auth/signup", formData);
};

export const signInUser = async (formData) => {
  return await axiosInstance.post("/auth/signin", formData);
};
