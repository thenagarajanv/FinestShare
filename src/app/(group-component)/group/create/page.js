"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const CreateGroupSuspense = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <CreateGroup />
    </React.Suspense>
  );
};

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "" }]);
  const [groupType, setGroupType] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;  // Ensure code works in SSR

  const handleAddMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }

    if (!groupType) {
      setError("Group type is required.");
      return;
    }

    if (!members.some((member) => member.name.trim() && member.email.trim())) {
      setError("At least one member with name and email is required.");
      return;
    }

    setError(""); 
    setSuccess(""); 
    setLoading(true); 

    const groupData = {
      groupName: groupName,
      groupType: groupType,
      members,
    };

    if (!token) {
      setError("You must be logged in to create a group.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://fairshare-backend-8kqh.onrender.com/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });
      
      console.log(groupData);

      const result = await response.json();

      console.log(result);
      
      if (response.ok) {
        setSuccess("Group created successfully!");
        setGroupName(""); 
        setMembers([{ name: "", email: "" }]); 
        setGroupType(""); 
      } else {
        setError(result.message || "Failed to create group.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-lg font-bold text-gray-500 mb-2">START A NEW GROUP</h1>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          My group shall be called...
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <h2 className="text-sm font-bold text-gray-500 mb-2">GROUP MEMBERS</h2>
        <p className="text-xs text-gray-400 mb-4">
          Tip: Lots of people to add? Send your friends an invite link.
        </p>
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                value={member.name}
                onChange={(e) =>
                  handleMemberChange(index, "name", e.target.value)
                }
                placeholder="Name"
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
              <input
                type="email"
                value={member.email}
                onChange={(e) =>
                  handleMemberChange(index, "email", e.target.value)
                }
                placeholder="Email address (optional)"
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
              <button
                onClick={() => handleRemoveMember(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddMember}
          className="text-blue-500 text-sm mt-4 hover:underline"
        >
          + Add a person
        </button>

        <h2 className="text-sm font-bold text-gray-500 mt-6 mb-3">GROUP TYPE</h2>
        <select
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={groupType}
          onChange={(e) => setGroupType(e.target.value)} 
        >
          <option value="">Select Group Type</option>
          <option value="Home">Home</option>
          <option value="Trip">Trip</option>
          <option value="Office">Office</option>
          <option value="Couple">Couple</option>
          <option value="Others">Others</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        <button
          onClick={handleSave}
          className="bg-orange-400 text-white font-bold py-2 px-6 rounded-lg w-full hover:bg-orange-600"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default CreateGroupSuspense;
