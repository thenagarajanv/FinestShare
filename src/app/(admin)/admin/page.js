"use client";

import InternalNavbar from "@/app/_components/(NavigationBar)/InternalNavbar/page";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale,LinearScale,BarElement,PointElement,LineElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("admin-dashboard");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); 
  }, []); 

  useEffect(() => {

    fetch("https://finestshare-backend.onrender.com/admin/analytics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      });
  }, []);

  const barChartData = {
    labels: ["Users", "Groups", "Expenses"],
    datasets: [
      {
        label: "Statistics",
        data: [
          analyticsData?.users || 0,
          analyticsData?.groups || 0,
          analyticsData?.expenses || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Active Users",
        data: [50, 60, 80, 90, 120, 150],
        borderColor: "#36A2EB",
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Resolved Feedback", "Unresolved Feedback"],
    datasets: [
      {
        data: [
          analyticsData?.resolvedFeedback || 0,
          analyticsData?.unresolvedFeedback || 0,
        ],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#E57373"],
      },
    ],
  };

  const chartOptions1 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://finestshare-backend.onrender.com/admin/analytics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnalyticsData(data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: ['Users', 'Groups', 'Expenses'], 
    datasets: [
      {
        data: [
          analyticsData?.users || 0, 
          analyticsData?.groups || 0,
          analyticsData?.expenses || 0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],  
        hoverBackgroundColor: ['#FF7F9C', '#58A6D2', '#FFD166'],
      },
    ],
  };
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://finestshare-backend.onrender.com/admin/analytics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      });
  }, []);

 useEffect(() => {
    if (activeView === "user-list") {
      setLoading(true);
      fetch("https://finestshare-backend.onrender.com/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const fetchedUsers = Array.isArray(data) ? data : data.users || [];
          const sortedUsers = fetchedUsers.sort((a, b) => a.userID - b.userID);
          setUsers(sortedUsers);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
    } else if (activeView === "feedback") {
      setLoadingFeedback(true);
      fetch("https://finestshare-backend.onrender.com/admin/feedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFeedbacks(data);
          setLoadingFeedback(false);
        })
        .catch((error) => {
          console.error("Error fetching feedback:", error);
          setLoadingFeedback(false);
        });
    }
  }, [token, activeView]);

  const handleResolvedToggle = (id, resolved) => {
    const token = localStorage.getItem("token");

    fetch(`https://finestshare-backend.onrender.com/admin/feedback/resolve/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.id === id ? { ...feedback, resolved: !resolved } : feedback
          )
        );
      })
      .catch((error) => {
        console.error("Error updating feedback status:", error);
      });
  };

  const handleUserAction = (action, userId) => {
    let url = "";
    let method = "POST";

    switch (action) {
      case "block":
        url = `https://finestshare-backend.onrender.com/admin/users/block/${userId}`;
        method = "POST"
        break;
      case "delete":
        url = `https://finestshare-backend.onrender.com/admin/users/${userId}`;
        method = "DELETE";
        break;
      case "promote":
        url = `https://finestshare-backend.onrender.com/admin/users/promote/${userId}`;
        method = "POST"
        break;
      default:
        return;
    }

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        fetch("https://finestshare-backend.onrender.com/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const updatedUsers = Array.isArray(data) ? data : data.users || [];
            setUsers(updatedUsers);
          })
          .catch((error) => {
            console.error("Error fetching updated users:", error);
          });
      })
      .catch((error) => {
        console.error("Error performing action:", error);
      });
  };

  
  const renderActiveView = () => {
    switch (activeView) {
      case "user-list":
        return (
          <div className="p-8 bg-gray-50 min-h-screen cursor-no">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold mb-6 text-gray-700">User List</h1>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full border-collapse">
                <thead className="text-center">
                  <tr className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-center">Profile Picture</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center px-6 py-3 text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.userID} className="border-b text-gray-700 hover:bg-gray-100">
                        <td className="px-6 py-3">{user.userID}</td>
                        <td className="px-6 py-3 text-center">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3">{user.name.toLowerCase()}</td>
                        <td className="px-6 py-3">{user.email.toLowerCase()}</td>
                        <td className="px-6 py-3">{user.role.toLowerCase()}</td>
                        <td className="px-6 py-3 flex space-x-2">
                          <button
                            onClick={() => handleUserAction("block", user.userID)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                          >
                            Block
                          </button>
                          <button
                            onClick={() => handleUserAction("delete", user.userID)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleUserAction("promote", user.userID)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                          >
                            Promote
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center px-6 py-3 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
        case "feedback":
          return (
            <div className="p-8 bg-gray-50 min-h-screen cursor-no">
              <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-700">Feedback</h1>
              </div>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                  <thead className="text-center">
                    <tr className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">User ID</th>
                      <th className="px-6 py-3 text-left">Message</th>
                      <th className="px-6 py-3 text-left">Resolved</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingFeedback ? (
                      <tr>
                        <td colSpan="5" className="text-center px-6 py-3 text-gray-500">
                          Loading feedback...
                        </td>
                      </tr>
                    ) : Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                      feedbacks.map((feedback) => (
                        <tr key={feedback.id} className="border-b text-gray-700 hover:bg-gray-100">
                          <td className="px-6 py-3">{feedback.id}</td>
                          <td className="px-6 py-3">{feedback.userId}</td>
                          <td className="px-6 py-3">{feedback.message}</td>
                          <td className="px-6 py-3">
                            {feedback.resolved ? "Resolved" : "Not Resolved"}
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => handleResolvedToggle(feedback.id, feedback.resolved)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                              {feedback.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center px-6 py-3 text-gray-500">
                          No feedback available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
          case "admin-dashboard":
            return (
              <div className="p-8 bg-gray-50 min-h-screen">
                <div className="flex justify-center items-center">
                  <h1 className="text-2xl font-bold mb-6 text-gray-700">Admin Dashboard</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="p-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">User Statistics</h2>
                    <Bar data={barChartData} options={chartOptions1} />
                  </div>
                  <div className="p-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Monthly Active Users</h2>
                    <Line data={lineChartData} options={chartOptions1} />
                  </div>
                </div>
              </div>
            );
      case "analytics":
        return <div>
          <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-700">Analytics</h1>
            <div className="w-80 h-80">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <InternalNavbar
        setActiveView={setActiveView}
      />
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setActiveView("admin-dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Admin Dashboard
        </button>
        <button
          onClick={() => setActiveView("user-list")}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          User List
        </button>
        <button
          onClick={() => setActiveView("feedback")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md"
        >
          Feedback
        </button>
        <button
          onClick={() => setActiveView("analytics")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Analytics
        </button>
      </div>
      <div>{renderActiveView()}</div>
    </div>
  );
};

export default AdminPage;
