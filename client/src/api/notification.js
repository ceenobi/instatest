import { axiosInstance } from "@/utils";

export const getNotifications = async (token, page = 1, limit = 20) => {
  try {
    const { data } = await axiosInstance.get(`/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
    });
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationsAsRead = async (notificationIds, token) => {
  try {
    const response = await axiosInstance.patch(
      `/notifications/mark-read`,
      { notificationIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId, token) => {
  try {
    const response = await axiosInstance.delete(
      `/notifications/${notificationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

export const createNotification = async ({
  recipient,
  type,
  post,
  story,
  comment,
  token,
}) => {
  try {
    const response = await axiosInstance.post(
      '/notifications',
      {
        recipient,
        type,
        post,
        story,
        comment,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
