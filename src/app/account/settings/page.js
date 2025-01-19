"use client";
import InternalNavbar from '@/app/_components/(NavigationBar)/InternalNavbar/page';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); 

  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard"); 
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://fairshare-backend-reti.onrender.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.user);
          setNewName(data.user.name);
          setNewEmail(data.user.email);
          setNewPhone(data.user.phone || "None");
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("phone", newPhone);
    formData.append("password", newPassword);
    if (newAvatar) {
      formData.append("avatar", newAvatar);
    }

    fetch("https://fairshare-backend-reti.onrender.com/auth/me", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data.user);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file); 
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <InternalNavbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">Your Account</h1>
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <img
              src={avatarPreview || userData.image || "/img/default-avatar.png"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                  >
                    Change your avatar
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <label className="font-medium">Your name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <span>{userData.name}</span>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium">Your email address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium">Your phone number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <span>{userData.phone || "None"}</span>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium">Your password</label>
              {isEditing ? (
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <span>••••••••••</span>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium">Your time zone (Default)</label>
              <span>(GMT+05:30) India</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium">Language (Default)</label>
              <span>English</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="font-medium">You are connected with Google.</label>
              <button className="text-blue-600 hover:text-blue-700">Disconnect</button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 justify-end bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  className="ml-4 justify-end px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
