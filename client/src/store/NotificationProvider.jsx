import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/hooks";
import { getNotifications, markNotificationsAsRead } from "@/api/notification";
import { handleError } from "@/utils";
import { NotificationContext } from ".";
import {io} from "socket.io-client";

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
      const data = await getNotifications(accessToken);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
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

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      debug: true
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
    });

    newSocket.on('notification', (newNotification) => {
      console.log('Received notification:', newNotification);
      addNotification(newNotification);
    });

    // Enhanced error logging
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        description: error.description,
        context: {
          url: import.meta.env.VITE_SOCKET_URL,
          userId: user?.data?._id,
          socketId: newSocket.id
        }
      });
    });

    setSocket(newSocket);

    return () => {
      console.log('Disconnecting socket:', newSocket.id);
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
