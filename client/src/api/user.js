import { axiosInstance } from "@/utils";

export const signUpUser = async (formData) => {
  return await axiosInstance.post("/auth/signup", formData);
};

export const signInUser = async (formData) => {
  return await axiosInstance.post("/auth/signin", formData);
};

export const signInViaEmail = async (formData) => {
  return await axiosInstance.post("/auth/signinViaMail", formData);
};

export const verifyLoginLink = async (userId, emailToken) => {
  return await axiosInstance.get(
    `/auth/verifyLoginLink/${userId}/${emailToken}`
  );
};

export const sendVerifyEmailLink = async (userId) => {
  return await axiosInstance.post(`/auth/sendVerifyMail/${userId}`);
};

export const verifyEmail = async (userId, verificationToken) => {
  return await axiosInstance.patch(
    `/auth/verifyEmail/${userId}/${verificationToken}`
  );
};

export const getAuthenticatedUser = async (token) => {
  return await axiosInstance.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
