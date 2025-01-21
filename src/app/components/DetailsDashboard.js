import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DetailsDashboard = ({ entity, type }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [settleModal, setSettleModal] = useState({ visible: false, friendID: null, amount: 0 });
  const router = useRouter();
  const token = localStorage.getItem("token");
const [newGroupName, setNewGroupName] = useState(entity.groupName || "");
const [newCategory, setNewCategory] = useState(entity.category || "");

const handleEditGroup = () => {
  const updatedGroupData = {
    groupID: entity.groupID,
    groupName: newGroupName,
    category: newCategory,
  };

  fetch(`https://fairshare-backend-8kqh.onrender.com/group/update/${entity.groupID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedGroupData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
      } else {
        alert("Group updated successfully.");
      }
      setIsEditing(false);
      setNewGroupName(data.groupName);
      setNewCategory(data.category);
    })
    .catch(() => alert("Failed to update group."));
};


  useEffect(() => {
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
    const fetchExpenses = async () => {
      if (type !== "friend") {
        const url =
          type === "group"
            ? `https://fairshare-backend-8kqh.onrender.com/expense/group/${entity.groupID}`
            : `https://fairshare-backend-8kqh.onrender.com/expense/user/${entity.userID}`;

        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch expenses");
          const data = await response.json();
          if (Array.isArray(data)) {
            setExpenses(data);
          } else {
            setError("Invalid expenses format");
          }
        } catch (err) {
          console.error("Error fetching expenses:", err);
          setError("Failed to fetch expenses.");
        }
      }
    };

    if (entity?.userID || entity?.groupID) fetchExpenses();
  }, [entity, type, token]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const friendID = entity.userID || entity.groupID;
        const response = await fetch(`https://fairshare-backend-8kqh.onrender.com/expense/balances/${friendID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch balances");
        const data = await response.json();
        setBalances(data);
      } catch (err) {
        console.error("Error fetching balances:", err);
        setError("Failed to fetch balances.");
      }
    };

    if (entity?.userID || entity?.groupID) fetchBalances();
  }, [entity, token]);

  const handleSettleUp = (expense, amount) => {
    // Check if expense has the expected properties
    if (expense && (expense.groupID || expense.paidBy)) {
      const settleData = type === "group"
        ? { groupID: expense.groupID, amount }
        : { friendID: expense.paidBy, amount };

      setSettleModal({
        visible: true,
        ...settleData,
      });
    } else {
      console.error("Invalid expense data:", expense);
      alert("Invalid expense data.");
    }
  };

  const handlePayment = (method) => {
    const requestBody = {
      friendID: settleModal.friendID || null, 
      groupID: settleModal.groupID || null,   
      amount: settleModal.amount,
    };
  
    fetch("http://192.168.0.127:8080/expense/settle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          alert("Payment settled successfully.");
        }
        setSettleModal({ visible: false, friendID: null, amount: 0 });
      })
      .catch(() => alert("Failed to settle payment."));
  };
  

  return (
    <div className="bg-slate-200 flex flex-col gap-4 p-6 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-black font-extrabold text-2xl">
          {type === "group" ? entity.groupName : `Friend: ${entity.name}`} Dashboard
        </h1>
        {type !== "friend" && (
          <button
            className="block text-white bg-orange-500 rounded-lg p-3"
            onClick={() => router.push(`/add-expense/${entity.groupID || entity.userID}`)}
          >
            Add an Expense
          </button>
        )}
      </div>

      {settleModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold">Settle Amount</h2>
            <p>You owe {settleModal.amount} for this trip.</p>
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

      {type !== "friend" && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">{type === "group" ? "Group" : "Friend"} Expenses</h2>
          {error ? (
            <p className="text-red-500 mt-4">{error}</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {expenses.map((expense) => {
                if (!expense) {
                  console.error("Invalid expense entry:", expense);
                  return null;
                }
                const userSplit = expense.splits?.find((split) => split.userID === currentUserID);
                const userAmount = userSplit ? userSplit.amount : 0;

                return (
                  <li key={expense.expenseID} className="bg-white p-4 rounded-md shadow-md">
                    <h3 className="text-lg font-semibold">{expense.description || "Untitled Expense"}</h3>
                    <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleString()}</p>
                    <p className="text-sm text-gray-700">Category: {expense.category || "Uncategorized"}</p>
                    <p className="text-sm text-gray-700">Total Amount: {expense.amount || "0.00"}</p>
                    {userSplit && (
                      <>
                        <p className="text-sm text-gray-700 font-bold">
                          Your Share: {userAmount || "0.00"}
                        </p>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg p-2 mt-2"
                          onClick={() => handleSettleUp(expense, userAmount)} // Pass the full expense object
                        >
                          Settle Up
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {balances && type === "friend" && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Balances</h2>
          {balances.iOwe?.length > 0 || balances.theyOweMe?.length > 0 ? (
            <>
              {balances.iOwe?.length > 0 && (
                <div>
                  <h3 className="font-bold">I Owe</h3>
                  {balances.iOwe.map((item) => (
                    <p key={item.friend.userID}>
                      {item.friend.name}: {item.amountOwed}
                    </p>
                  ))}
                </div>
              )}
              {balances.theyOweMe?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold">They Owe Me</h3>
                  {balances.theyOweMe.map((item) => (
                    <p key={item.friend.userID}>
                      {item.friend.name}: {item.amountOwed}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>No transactions between you and this user.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailsDashboard;
