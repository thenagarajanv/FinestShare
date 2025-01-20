import React, { useState, useEffect } from "react";

const RecentActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("https://fairshare-backend-8kqh.onrender.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.user);

          // Fetch activities using the new API
          fetch("https://fairshare-backend-8kqh.onrender.com/activities", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((activitiesData) => {
              if (activitiesData.activities && Array.isArray(activitiesData.activities)) {
                const formattedActivities = activitiesData.activities.map((activity) => ({
                  ...activity,
                  description: activity.description.replace(
                    "You",
                    data.user.name
                  ),
                }));
                setActivities(formattedActivities);
              } else {
                setError("Activities data is not in the expected format.");
              }
            })
            .catch((error) =>
              console.error("Error fetching activities:", error)
            );
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">Recent Activities</h1>
      {error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.activityID} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700">{activity.description}</p>
              <p className="text-sm text-gray-400">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivitiesPage;
