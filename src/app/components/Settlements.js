import React, { useState, useEffect } from "react";

const SettlementsPages = () => {
  const [activities, setActivities] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

          fetch("https://finestshare-backend.onrender.com/expense/settle", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((activitiesData) => {
              if (activitiesData && Array.isArray(activitiesData)) {
                const formattedActivities = activitiesData.map((activity) => {
                  const updatedDescription = activity.description.replace(
                    /Settled (\d+) in group ID undefined\./,
                    `Settled $1 in group ID ${activity.id || "N/A"}.`
                  );

                  return {
                    ...activity,
                    description: updatedDescription,
                  };
                });

                setActivities(formattedActivities);
              } else {
                setError("Activities data is not in the expected format.");
              }
            })
            .catch((error) => {
              console.error("Error fetching activities:", error);
              setError("Failed to fetch activities.");
            })
            .finally(() => setLoading(false));
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data.");
          setLoading(false);
        });
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, []);

  
  return (
    <div className="p-2 h-screen overflow-y-scroll" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">Settlements</h1>
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="loader w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <div className="mt-6 space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <p className="text-gray-700">{activity.description}</p>
                <p className="text-sm text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementsPages;
