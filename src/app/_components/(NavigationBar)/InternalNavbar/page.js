"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NotificationIcon from "../../../../../public/Notification";
import { usePathname } from "next/navigation";
import socket from "../../../../socket.js"; 

const InternalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();
  const getPath = usePathname().split("/").pop(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetch("https://finestshare-backend.onrender.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserName(data.user.name);
          setProfileImage(data.user.image);
          setUserRole(data.user.role);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      setIsLoggedIn(false);
    }

    if (isLoggedIn) {
      socket.connect();
      socket.emit("authenticate", { token });

      socket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prevCount) => prevCount + 1);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [isLoggedIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setUnreadCount(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex items-center text-white text-xl font-extrabold">
              Finest
              <Image
                width={200}
                height={200}
                id="logo"
                src="/img/pnglogo.png"
                className="h-12 w-12"
                alt="Logo"
              />
              SHARE
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-auto relative right-0">
            <div className="relative">
              <button className="relative text-white" onClick={toggleNotifications}>
                <NotificationIcon fill="white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg p-4 max-h-80 overflow-auto">
                  <h4 className="font-bold text-lg">Notifications</h4>
                  {notifications.length > 0 ? (
                    <ul className="space-y-2">
                      {notifications.map((notification, index) => (
                        <li key={index} className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">{notification.action}</p>
                            <p className="text-xs text-gray-500">{notification.description}</p>
                            <p className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No notifications yet.</p>
                  )}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative">
                <button onClick={toggleMenu} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-md">
                  <Image
                    src={profileImage || "/img/heart.png"}
                    width={32}
                    height={32}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  {userName} ▼
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                    {userRole.toLowerCase() === "admin" && (
                      <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </a>
                    )}
                    <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </a>
                    <a href="/account/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md text-left">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/auth/signup" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md">
                  Sign Up
                </a>
                <a href="/auth/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md">
                  Log In
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InternalNavbar;
