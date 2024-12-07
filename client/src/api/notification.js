import { axiosInstance } from "@/utils";


export const getNotifications = async (token, page = 1, limit = 20) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
    },
  };
  return await axiosInstance.get("/notifications", config);
};

export const markNotificationsAsRead = async (token, notificationIds) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.patch(
    "/notifications/mark-read",
    { notificationIds },
    config
  );
};

export const deleteNotification = async (token, notificationId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axiosInstance.delete(
    `/notifications/${notificationId}`,
    config
  );
};
