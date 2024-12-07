import { axiosInstance } from "@/utils";

export const createStory = async (storyData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.post("/stories/create", storyData, config);
};

export const getUserStories = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.get(`/stories/user/${userId}`, config);
};

export const getFollowingStories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.get("/stories/following", config);
};

export const viewStory = async (storyId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.patch(`/stories/${storyId}/view`, {}, config);
};

export const deleteStory = async (storyId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.delete(`/stories/${storyId}`, config);
};

export const likeStory = async (storyId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.patch(`/stories/like/${storyId}`, {}, config);
};
