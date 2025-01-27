import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { saveAs } from "file-saver";

const ExpenseDetails = () => {
  const [userName, setUserName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("https://finestshare-backend.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUserName(data.user.name); 
      setUserID(data.user.userID);
    } catch (err) {
      setError("Failed to fetch user details");
    }
  };

  const fetchExpenses = async (userID) => {
    try {
      const response = await fetch(
        `https://finestshare-backend.onrender.com/expense/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data); 
    } catch (err) {
      setError("Failed to fetch expenses");
    }
  };

  const exportToCSV = () => {
    const headers = "Expense ID,Description,Amount,Paid By,Date,Type,Category\n";
    const rows = expenses
      .map(
        (expense) =>
          `${expense.expenseID},"${expense.description}",${expense.amount},${
            expense.paidBy === userID ? userName : "Other User"
          },"${new Date(expense.date).toLocaleString()}",${expense.type},${expense.category}`
      )
      .join("\n");

    const csvData = headers + rows;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${userName}_expenses.csv`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserDetails();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userID) {
      fetchExpenses(userID);
      setLoading(false);
    }
  }, [userID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const chartData = {
    labels: expenses.map((expense) => new Date(expense.date).toLocaleDateString()),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((expense) => expense.amount),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
   <div className="p-2 h-screen overflow-y-scroll" suppressHydrationWarning>
     <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }} >
      <h1>Expense Details</h1>
      <p>
        <strong>User Name:</strong> {userName}
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h2>Expense Overview</h2>
        <Line data={chartData} />
      </div>

      {expenses.length > 0 ? (
        <div>
          <h2>Expense List</h2>
          <table
            border="1"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Paid By</th>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.expenseID}>
                  <td>{expense.expenseID}</td>
                  <td>{expense.description}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.paidBy === userID ? userName : "Other User"}</td>
                  <td>{new Date(expense.date).toLocaleString()}</td>
                  <td>{expense.type}</td>
                  <td>{expense.category}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={exportToCSV}
            style={{
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Export as CSV
          </button>
        </div>
      ) : (
        <p>No expenses found.</p>
      )}
      </div>
   </div>
  );
};

export default ExpenseDetails;
