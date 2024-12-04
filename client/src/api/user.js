import { axiosInstance } from "@/utils";

export const getUser = async (username, token) => {
  return await axiosInstance.get(`/users/profile/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const changeProfilePhoto = async (data, token, fn) => {
  return await axiosInstance.patch("/users/uploadProfilePic", data, {
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
  return await axiosInstance.patch("/users/updateProfile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateUserPassword = async (data, token) => {
  return await axiosInstance.patch("/users/updatePassword", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const toggleAccountPrivacy = async (token) => {
  return await axiosInstance.patch(
    "/users/togglePrivacy",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteAccount = async (token) => {
  return await axiosInstance.delete("/users/deleteAccount", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const followUser = async (followerId, token) => {
  return await axiosInstance.patch(
    `/users/follow/${followerId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const suggestUsers = async (token) => {
  return await axiosInstance.get("/users/suggest", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFollowers = async (username, token) => {
  return await axiosInstance.get(`/users/followers/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFollowing = async (username, token) => {
  return await axiosInstance.get(`/users/following/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchUsers = async (searchTerm, token) => {
  return await axiosInstance.get(`/users/search?q=${searchTerm}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
