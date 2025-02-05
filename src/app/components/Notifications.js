import React, { useContext } from "react";
import { NotificationsContext } from "../../context/NotificationsContext";

const Notifications = () => {
  const { notifications, unreadCount, markAsRead } = useContext(NotificationsContext);

  return (
    <div>
      <h2>Notifications ({unreadCount} unread)</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.activityID} style={{
            background: notification.isRead ? "#f0f0f0" : "#fff",
            padding: "10px",
            margin: "5px 0",
            border: "1px solid #ccc",
          }}>
            <p><strong>Action:</strong> {notification.action}</p>
            <p><strong>Description:</strong> {notification.description}</p>
            <p><strong>Time:</strong> {new Date(notification.timestamp).toLocaleString()}</p>
            {!notification.isRead && (
              <button onClick={() => markAsRead(notification.activityID)}>
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
