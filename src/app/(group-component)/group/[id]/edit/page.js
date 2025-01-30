"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";const EditGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "" }]);
  const [groupType, setGroupType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter(); 

  const groupID = usePathname("").split("/")[2];

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!token) {
        setError("You must be logged in to edit a group.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`https://finestshare-backend.onrender.com/group/${groupID}/details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          const groupData = result.group || {};
          setGroupName(groupData.groupName || "");
          setGroupType(groupData.groupType || "");
          setMembers(
            groupData.members?.map((member) => ({
              name: member.name || "",
              email: member.email || "",
            })) || [{ name: "", email: "" }]
          );
        } else {
          setError(result.message || "Failed to load group details.");
        }
      } catch (error) {
        setError("Something went wrong while fetching group details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [token, groupID]);

  const handleSaveChanges = async () => {
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
      groupName,
      groupType,
      members,
    };

    console.log(groupData);
    console.log(members);
    console.log(groupName);  
    console.log(groupType);
    console.log(groupID);
    
    try {
      const response = await fetch(`https://finestshare-backend.onrender.com/group/${groupID}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Group updated successfully!");
      } else {
        setError(result.message || "Failed to update group.");
      }
    } catch (error) {
      setError("Something went wrong while updating group.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`https://finestshare-backend.onrender.com/group/${groupID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Group deleted successfully!");
        router.push("/dashboard");
      } else {
        setError(result.message || "Failed to delete group.");
      }
    } catch (error) {
      setError("Something went wrong while deleting group.");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading group details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-lg font-bold text-gray-500 mb-2">Edit Group</h1>

        <label className="block text-sm font-bold text-gray-800 mb-1">Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <h2 className="text-sm font-bold text-gray-500 mb-2">Group Members</h2>
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="flex flex-wrap items-center gap-4">
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
                placeholder="Email"
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
          + Add Member
        </button>

        <h2 className="text-sm font-bold text-gray-500 mt-6 mb-3">Group Type</h2>
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

        <div className="flex justify-center items-center">
          <div className="flex gap-5 mt-6">
            <button
                onClick={handleDeleteGroup}
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
                disabled={loading}
              >
              Delete Group
            </button>

            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-900"
              disabled={loading}
            >
              Save Changes
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-900"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroup;
