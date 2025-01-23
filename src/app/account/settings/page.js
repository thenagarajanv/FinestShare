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
  const [showPassword, setShowPassword] = useState(false); 

  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const fetchUserData = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://finestshare-backend.onrender.com/auth/me", {
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
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address (must contain '@' and end with '.com').");
      return;
    }
  
    if (isNaN(newPhone) || newPhone.trim() === "") {
      alert("Phone number must be a valid number.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])(?=.*[0-9]).{6,}$/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      alert("Password must be at least 6 characters long, contain at least one uppercase letter, one special character, and one number.");
      return;
    }
  
    const updatedData = {};
    if (newName !== userData.name) updatedData.name = newName;
    if (newPhone !== (userData.phone || "None")) updatedData.phone = newPhone;
    if (newPassword) updatedData.password = newPassword;
    if (newAvatar) updatedData.image = avatarPreview;
  
    if (Object.keys(updatedData).length === 0) {
      alert("No changes to save.");
      return;
    }
  
    fetch("https://finestshare-backend.onrender.com/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user data.");
        }
        return response.json();
      })
      .then(() => {
        setIsEditing(false);
        fetchUserData();
        alert("Your changes have been saved successfully!");
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
        alert("Failed to save changes. Please try again.");
      });
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

  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmation) {
      const token = localStorage.getItem("token");
      fetch("https://finestshare-backend.onrender.com/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete account.");
          }
          localStorage.removeItem("token");
          router.push("/");
          alert("Your account has been deleted.");
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          alert("Failed to delete account. Please try again.");
        });
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <InternalNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6 max-w-xl bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center">Your Account</h1>
          <div className="mt-6">
            <div className="flex items-center gap-4 justify-center">
              <img
                src={avatarPreview || userData.image || "/img/heart.png"}
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
                      Change Profile Picture
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center">
                <label className="font-medium">Name</label>
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
                <label className="font-medium">Email Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <span>{userData.email || "None"}</span>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <label className="font-medium">Password</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="px-1 py-1 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? "🫣" : "👀"}
                    </button>
                  </div>
                ) : (
                  <span>••••••••••</span>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveChanges}
                    className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6">
            <div className="flex justify-between">
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete Account
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
