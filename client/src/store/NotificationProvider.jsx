import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/hooks";
import { getNotifications, markNotificationsAsRead } from "@/api/notification";
import { handleError } from "@/utils";
import { NotificationContext } from ".";

//export const NotificationContext = createContext({});

export const NotificationProvider =({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuthStore();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotifications(accessToken);
      if (res.status === 200) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const markAsRead = useCallback(async (notificationIds) => {
    try {
      const res = await markNotificationsAsRead(accessToken, notificationIds);
      if (res.status === 200) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notificationIds.includes(notification._id)
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
      }
    } catch (error) {
      handleError(error);
    }
  }, [accessToken]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchNotifications();
    }
  }, [accessToken, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
