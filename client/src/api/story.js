import { axiosInstance } from "@/utils";

export const createStory = async (data, token) => {
  return await axiosInstance.post("/stories/createStory", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
