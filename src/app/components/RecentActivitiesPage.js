// import React, { useState, useEffect } from "react";

// const RecentActivitiesPage = () => {
//   const [activities, setActivities] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [groupNotifications, setGroupNotifications] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       fetch("https://fairshare-backend-8kqh.onrender.com/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setUserData(data.user);

//           const userActivities = [
//             ...data.user.expenses.map((expense) => ({
//               description: `You added “${expense.description}” in "${expense.groupName}".`,
//               action: expense.amount > 0 ? "You get back" : "You owe",
//               amount: `$${expense.amount}`,
//             })),
//             ...data.user.groups.map((group) => ({
//               description: `You created the group “${group.groupName}”.`,
//             })),
//           ];

//           setActivities(userActivities);

//           fetch(`https://fairshare-backend-8kqh.onrender.com/expense/user/${data.user.userID}`)
//             .then((response) => response.json())
//             .then((expenseData) => {
//               if (Array.isArray(expenseData)) {
//                 setExpenses(expenseData);

//                 const notifications = expenseData.map((expense) => {
//                   return expense.splits.map((split) => {
//                     const userOwes = split.userID !== data.user.userID; 
//                     return userOwes
//                       ? {
//                           description: `You owe $${split.amount} for the expense "${expense.description}" in the group "${expense.groupID}".`,
//                           groupID: expense.groupID,
//                           amount: split.amount,
//                         }
//                       : null;
//                   });
//                 });

//                 setGroupNotifications(notifications.flat().filter(Boolean));
//               } else {
//                 setError("Expenses data is not available or is not in the expected format.");
//               }
//             })
//             .catch((error) => console.error("Error fetching expenses:", error));
//         })
//         .catch((error) => console.error("Error fetching user data:", error));
//     }
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-semibold">Recent Activities</h1>
//       <div className="mt-6 space-y-4">
//         {activities.map((activity, index) => (
//           <div key={index} className="bg-white p-4 rounded-lg shadow-md">
//             <p className="text-gray-700">{activity.description}</p>
//             {activity.action && (
//               <p className="text-gray-500">
//                 {activity.action} {activity.amount || ""}
//               </p>
//             )}
//             <p className="text-sm text-gray-400">{activity.date}</p>
//           </div>
//         ))}

//         <h2 className="text-xl font-semibold mt-6">Payment Notifications</h2>
//         {groupNotifications.length > 0 ? (
//           <div className="mt-4 space-y-4">
//             {groupNotifications.map((notification, index) => (
//               <div key={index} className="bg-white p-4 rounded-lg shadow-md">
//                 <p className="text-gray-700">{notification.description}</p>
//                 <p className="text-sm text-gray-400">{notification.date}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No payment notifications available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecentActivitiesPage;
import React, { useState, useEffect } from "react";

const RecentActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Fetch user data to get the name
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
