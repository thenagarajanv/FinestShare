"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InternalNavbar from "../_components/(NavigationBar)/InternalNavbar/page";
import DetailsDashboard from "../components/DetailsDashboard";
import { Suspense } from "react";

const Layout = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState("/DashboardPage");
  const [DynamicContent, setDynamicContent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [feedback, setFeedback] = useState("");
  
  const router = useRouter();
  const menuItems = [
    { label: "Dashboard", path: "/DashboardPage", component: "DashboardPage" },
    { label: "Recent Activities", path: "/RecentActivitiesPage", component: "RecentActivitiesPage" },
    { label: "All Expenses", path: "/AllExpenses", component: "AllExpenses" },
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://finestshare-backend.onrender.com/group/user/groups",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setGroups(data.groups || []);
    };

    console.log(groups);
    
    const fetchFriends = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://finestshare-backend.onrender.com/friend/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setFriends(data || []);
    };

    fetchGroups();
    fetchFriends();
  }, []);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const activeItem = menuItems.find(
          (item) => item.path === activeComponent
        );
        if (activeItem) {
          const { default: Component } = await import(
            `../components/${activeItem.component}`
          );
          setDynamicContent(() => Component);
        }
      } catch (error) {
        console.error("Error loading component:", error);
      }
    };

    if (!selectedEntity && !isAddingGroup && !isAddingFriend) {
      loadComponent();
    }
  }, [activeComponent, isAddingGroup, isAddingFriend, selectedEntity]);

  const handleAddGroup = async () => {
    setIsAddingGroup(true);
    setIsAddingFriend(false);
    setSelectedEntity(null);
    try {
      const { default: AddGroupComponent } = await import(
        "../(group-component)/group/create/page.js"
      );
      setDynamicContent(() => AddGroupComponent);
    } catch (error) {
      console.error("Error loading Add Group component:", error);
    }
  };

  // const handleFriendsDelete = async (userId) => {
  //   const token = localStorage.getItem("token");
  
  //   try {
  //     const response = await fetch(
  //       `https://finestshare-backend.onrender.com/friend/remove/${userId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     if (response.ok) {
  //       const updatedFriends = friends.filter((friend) => friend.userID !== userId);
  //       setFriends(updatedFriends);
  
  //       const refreshedResponse = await fetch(
  //         `https://finestshare-backend.onrender.com/friend/`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const refreshedData = await refreshedResponse.json();
  //       setFriends(refreshedData || []);
  //     } else {
  //       console.error("Failed to delete friend");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting friend:", error);
  //   }
  // };
  
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
  
      const userResponse = await fetch("https://finestshare-backend.onrender.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!userResponse.ok) {
        alert("Failed to fetch user details. Please log in again.");
        return;
      }
  
      const userData = await userResponse.json();
      const userId = userData.user.userID;

      const feedbackResponse = await fetch("https://finestshare-backend.onrender.com/auth/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "userId" : userId,
            "message": feedback,
          }),
        }
      );
  
      if (feedbackResponse.ok) {
        alert("Thank you for your feedback!");
        setFeedback("");
      }else{
        const errorData = await feedbackResponse.json();
        alert(`Failed to submit feedback: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      // console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting your feedback. Please try again.");
    }
  };
  

  const handleAddFriend = async () => {
    setIsAddingFriend(true);
    setIsAddingGroup(false);
    setSelectedEntity(null);
    try {
      const { default: AddFriendComponent } = await import(
        "../(friends-component)/friends/page.js"
      );
      setDynamicContent(() => AddFriendComponent);
    } catch (error) {
      console.error("Error loading Add Friend component:", error);
    }
  };

  const handleGroupClick = (group) => {
    setSelectedEntity({ type: "group", data: group });
    setIsAddingGroup(false);
    setIsAddingFriend(false);
    setDynamicContent(() => DetailsDashboard);
  };

  const handleFriendClick = (friend) => {
    if (friend && friend.userID) {
      setSelectedEntity({ type: "friend", data: friend });
      setIsAddingGroup(false);
      setIsAddingFriend(false);
      setDynamicContent(() => DetailsDashboard);
    } else {
      console.error("Invalid friend data:", friend);
    }
  };
  

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full sticky top-0">
        <InternalNavbar />
      </div>

      <div className="flex flex-grow">
        <div className="flex flex-col min-h-screen w-1/4 bg-gray-800 text-white p-4 flex-shrink-0">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    setIsAddingGroup(false);
                    setIsAddingFriend(false);
                    setSelectedEntity(null);
                    setActiveComponent(item.path);
                  }}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeComponent === item.path
                      ? "bg-pink-500"
                      : "bg-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold">Groups</p>
              <button
                className="bg-pink-500 px-2 py-1 rounded"
                onClick={handleAddGroup}
              >
                + Add
              </button>
            </div>
            <div className="mt-4">
            {groups.length === 0 ? (
              <p>No groups found</p>
            ) : (
              groups.map((group) => (
                <div
                  key={group.groupID}
                  className="bg-gray-600 hover:bg-pink-500 p-2 rounded mt-2 cursor-pointer"
                  onClick={() => handleGroupClick(group)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start">
                      <p>{group.groupName}</p>
                    </div>
                    <div className="flex justify-end" onClick={() => router.push(`/group/${group.groupID}/edit`)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill="none">
                        <path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="rgb(255, 255, 255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 20H17" stroke="rgb(255, 255, 255)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold">Friends</p>
              <button
                className="bg-pink-600 px-2 py-1 rounded"
                onClick={handleAddFriend}
              >
                + Add
              </button>
            </div>
            <div className="mt-4">
              {friends.length === 0 ? (
                <p>No friends found</p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.userID}
                    className="bg-gray-600 hover:bg-pink-600 p-2 rounded mt-2 cursor-pointer"
                    onClick={() => handleFriendClick(friend)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex justify-start">
                        <p>{friend.name}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Feedback Section */}
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm font-bold">Feedback</p>
            <form onSubmit={handleFeedbackSubmit} className="mt-4">
              <textarea
                className="w-full p-2 text-black rounded"
                placeholder="Write your feedback here..."
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-4 w-full bg-pink-600 hover:bg-pink-900 text-white py-2 rounded"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
        
        <main className="w-3/4 p-6">
          {selectedEntity ? (
            <Suspense fallback={<div>Loading...</div>}>
            <DynamicContent entity={selectedEntity.data} type={selectedEntity.type} />
            </Suspense>
          ) : DynamicContent ? (
            <Suspense fallback={<div>Loading...</div>}>
            <DynamicContent />
            </Suspense>
          ) : (
            <div>Loading...</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
