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

export const updateUserProfile = async (data, token) => {
  return await axiosInstance.patch("/user/updateProfile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateUserPassword = async (data, token) => {
  return await axiosInstance.patch("/user/updatePassword", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const toggleAccountPrivacy = async (token) => {
  return await axiosInstance.patch(
    "/user/togglePrivacy",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteAccount = async (token) => {
  return await axiosInstance.delete("/user/deleteAccount", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const followUser = async (followerId, token) => {
  return await axiosInstance.patch(
    `/user/follow/${followerId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const unfollowUser = async (followerId, token) => {
  return await axiosInstance.patch(
    `/user/unfollow/${followerId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
