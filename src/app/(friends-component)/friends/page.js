"use client";

import { useState } from "react";

export default function FriendsPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && email.trim()) {
      setPreview(true); 
    }
  };

  const handleSendInvite = async () => {
    if (!email.trim()) {
      alert("Please enter an email address.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to send invites.");
      return;
    }

    try {
      const response = await fetch("https://finestshare-backend.onrender.com/friend/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "friendEmail": email, 
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invite.");
      }

      alert("Invitation sent successfully!");
      setEmail(""); 
      setMessage("");
      setPreview(false); 
    } catch (error) {
      alert(error.message);
    }
  };

  const handleConfirmInvite = () => {
    setPreview(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Invite Friend</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          To:
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown}
          placeholder="Enter an email address and press Enter"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Include an optional message:
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a personal message (optional)"
          className="p-2 border border-gray-300 rounded w-full"
          rows="4"
        />
      </div>
      {!preview ? (
        <button
          onClick={handleConfirmInvite}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Send Invite and Add Friend
        </button>
      ) : (
        <div className="border border-gray-300 rounded p-4 mt-4">
          <h3 className="font-semibold text-lg mb-2">Preview:</h3>
          <p className="mb-2">
            <strong>To:</strong> {email}
          </p>
          <p className="mb-2">
            <strong>Message:</strong> {message || "(No message provided)"}
          </p>
          <button
            onClick={handleSendInvite}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Confirm and Send
          </button>
          <button
            onClick={() => setPreview(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
