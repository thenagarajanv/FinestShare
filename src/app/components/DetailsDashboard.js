import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DetailsDashboard = ({ entity, type }) => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [settleModal, setSettleModal] = useState({ visible: false, friendID: null, amount: 0 });
  const router = useRouter();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch user ID
    const fetchUserID = async () => {
      try {
        const response = await fetch("https://fairshare-backend-8kqh.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user ID");
        const data = await response.json();
        setCurrentUserID(data.user.userID);
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Failed to fetch user ID.");
      }
    };
    if (token) fetchUserID();
  }, [token]);

  useEffect(() => {
    // Fetch expenses
    const fetchExpenses = () => {
      if (type === "group" && entity?.groupID) {
        fetch(`https://fairshare-backend-8kqh.onrender.com/expense/group/${entity.groupID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => Array.isArray(data) ? setExpenses(data) : setError("Invalid expenses format"))
          .catch((err) => setError("Failed to fetch expenses."));
      } else if (type === "friend" && entity?.userID) {
        fetch(`https://fairshare-backend-8kqh.onrender.com/expense/user/${entity.userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => Array.isArray(data) ? setExpenses(data) : setError("Invalid expenses format"))
          .catch((err) => setError("Failed to fetch expenses."));
      }
    };
    fetchExpenses();
  }, [entity, type, token]);

  const calculateAmount = () => {
    return expenses.reduce((total, expense) => {
      if (expense.paidBy === currentUserID) {
        return total - expense.amount;
      } else {
        return total + expense.amount;
      }
    }, 0);
  };

  const handleSettleUp = () => {
    const amount = calculateAmount();
    if (amount !== 0) {
      setSettleModal({
        visible: true,
        friendID: entity.userID || entity.groupID,
        amount: Math.abs(amount),
      });
    }
  };

  const handlePayment = (method) => {
    fetch("https://fairshare-backend-8kqh.onrender.com/expense/settle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        friendID: settleModal.friendID,
        amount: settleModal.amount,
        method,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Payment settled successfully.");
        setSettleModal({ visible: false, friendID: null, amount: 0 });
      })
      .catch((err) => {
        console.error("Error settling payment:", err);
        alert("Failed to settle payment.");
      });
  };

  if (!entity) {
    return <p>No entity selected.</p>;
  }

  const amountOwed = calculateAmount();

  return (
    <div className="bg-slate-200 flex flex-col gap-4 p-6 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-black font-extrabold text-2xl">
          {type === "group" ? entity.groupName : `Friend: ${entity.name}`} Dashboard
        </h1>
        <div className="flex gap-4">
          <button
            className="block text-white bg-orange-500 rounded-lg p-3"
            onClick={() => router.push(`/add-expense/${entity.groupID || entity.userID}`)}
          >
            Add an Expense
          </button>
          {amountOwed !== 0 && (
            <button
              className="bg-blue-500 rounded-lg p-3 text-white"
              onClick={handleSettleUp}
            >
              Settle Up
            </button>
          )}
        </div>
      </div>
      {settleModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold">Settle Amount</h2>
            <p>You owe {settleModal.amount} to this {type}.</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 rounded-lg p-3 text-white"
                onClick={() => handlePayment("cash")}
              >
                Pay by Cash
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 rounded-lg p-3 text-white"
                onClick={() => handlePayment("razorpay")}
              >
                Pay by Razorpay
              </button>
            </div>
            <button
              className="mt-4 text-red-500 underline"
              onClick={() => setSettleModal({ visible: false, friendID: null, amount: 0 })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold">{type === "group" ? "Group" : "Friend"} Expenses</h2>
        {error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {expenses.map((expense) => (
              <li key={expense.expenseID} className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold">{expense.description || "Untitled Expense"}</h3>
                <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleString()}</p>
                <p className="text-sm text-gray-700">Category: {expense.category || "Uncategorized"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DetailsDashboard;
