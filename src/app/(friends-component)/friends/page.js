"use client";

import React, { useState } from 'react';

export default function FriendsPage() {
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && emailInput.trim()) {
      setEmails((prevEmails) => [...prevEmails, emailInput.trim()]);
      setEmailInput(""); 
    }
  };

  const handleDeleteClick = (index) => {
    setEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };

  const handleSendInvite = async () => {
    if (emails.length === 0) {
      alert("Please enter at least one email address.");
      return;
    }
    
    const token = localStorage.getItem("token"); 
    if (!token) {
      alert("You must be logged in to send invites.");
      return;
    }

    try {
      const response = await fetch("https://fairshare-backend-reti.onrender.com/friend/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          emails,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invites.");
      }

      alert("Invitations sent successfully!");
      setEmails([]);
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
      <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
      <div className="mb-4">
        <label htmlFor="emails" className="block text-sm font-medium mb-2">
          To:
        </label>
        <input
          id="emails"
          type="text"
          value={emailInput}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown}
          placeholder="Enter names or email addresses and press Enter"
          className="p-2 border border-gray-300 rounded w-full"
        />
        <div className="mt-2">
          {emails.length > 0 && (
            <ul className="list-disc pl-5">
              {emails.map((email, index) => (
                <li key={index} className="flex mr-5 justify-between">
                  <span>{email}</span>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
          Send Invites and Add Friends
        </button>
      ) : (
        <div className="border border-gray-300 rounded p-4 mt-4">
          <h3 className="font-semibold text-lg mb-2">Preview:</h3>
          <p className="mb-2">
            <strong>To:</strong> {emails.join(", ")}
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
