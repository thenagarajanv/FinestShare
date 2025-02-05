import React, { createContext, useState, useEffect } from "react";
import socket from "../socket";

export const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.connect();
      socket.emit("authenticate", { token });

      socket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAsRead = (activityID) => {
    socket.emit("markAsRead", { activityID });
    setNotifications((prev) =>
      prev.map((n) => (n.activityID === activityID ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => prev - 1);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
