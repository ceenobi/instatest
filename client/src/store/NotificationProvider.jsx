import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/hooks";
import { getNotifications, markNotificationsAsRead } from "@/api/notification";
import { handleError } from "@/utils";
import { NotificationContext } from ".";
import io from "socket.io-client";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const { accessToken, user } = useAuthStore();

  const fetchNotifications = useCallback(async () => {
    if (!accessToken) return;

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
      const res = await markNotificationsAsRead(notificationIds, accessToken);
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
    if (!accessToken || !user?.data?._id) return;

    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('notification', (newNotification) => {
      addNotification(newNotification);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken, user?.data?._id, addNotification]);

  useEffect(() => {
    fetchNotifications();
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
        socket
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
