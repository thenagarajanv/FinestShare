"use client";

import React, { useState, useEffect } from "react";

const RecentActivitiesPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Assuming you fetch recent activities from the API
    // Here, using a static list of activities as an example
    const fetchedActivities = [
      {
        description: "You added “welcome”.",
        action: "You get back",
        amount: "$28,828.00",
        date: "Today",
      },
      {
        description: "You added “welcome” in “madurai”.",
        action: "You do not owe anything",
        date: "Today",
      },
      {
        description: "Guru P. added “food”.",
        action: "You owe",
        amount: "$25.00",
        date: "Friday",
      },
      {
        description: "You created the group “madurai”.",
        date: "Jan 8",
      },
      {
        description: "You created the group “Trips”.",
        date: "Jan 7",
      },
      {
        description: "Undelete group You deleted the group “Sano world”.",
        date: "Dec 26",
      },
      {
        description: "You created the group “Sano world”.",
        date: "Dec 26",
      },
      {
        description: "You created the group “Goa”.",
        date: "Dec 26",
      },
      {
        description: "Undelete group You deleted the group “Goa Guy's ”.",
        date: "Dec 26",
      },
      {
        description: "You created the group “Goa Guy's ”.",
        date: "Dec 26",
      },
    ];

    setActivities(fetchedActivities);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">Recent Activities</h1>
      <div className="mt-6 space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700">{activity.description}</p>
            {activity.action && (
              <p className="text-gray-500">
                {activity.action} {activity.amount || ""}
              </p>
            )}
            <p className="text-sm text-gray-400">{activity.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivitiesPage;
