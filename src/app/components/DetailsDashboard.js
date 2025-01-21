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
  const [isEditing, setIsEditing] = useState(null);
  const [editExpenseData, setEditExpenseData] = useState({ description: "", category: "" });

  const handleEditExpense = (expense) => {
    setIsEditing(expense.expenseID);
    setEditExpenseData({
      description: expense.description || "",
      category: expense.category || "",
    });
  };
  
  const handleSaveEdit = (expense) => {
    const updatedExpenseData = {
      description: editExpenseData.description,
      category: editExpenseData.category,
    };
  
    fetch(`https://fairshare-backend-8kqh.onrender.com/expense/${expense.expenseID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedExpenseData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          alert("Expense updated successfully.");
          setExpenses(expenses.map((e) => (e.expenseID === expense.expenseID ? { ...e, ...updatedExpenseData } : e)));
        }
      })
      .catch(() => alert("Failed to update expense"));
  
    setIsEditing(null); 
  };

  const handleDeleteExpense = (expense) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (confirmDelete) {
      fetch(`https://fairshare-backend-8kqh.onrender.com/expense/${expense.expenseID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
          } else {
            alert("Expense deleted successfully.");
            setExpenses(expenses.filter((e) => e.expenseID !== expense.expenseID));
          }
        })
        .catch(() => alert("Failed to delete expense."));
    }
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
  
    fetch("https://fairshare-backend-8kqh.onrender.com/expense/settle", {
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
                const isPaidByCurrentUser = expense.paidBy === currentUserID; // Check if the current user paid for the expense

                return (
                  <li key={expense.expenseID} className="bg-white p-4 rounded-md shadow-md">
                    {isEditing === expense.expenseID ? (
                      <div>
                        <input
                          type="text"
                          value={editExpenseData.description}
                          onChange={(e) => setEditExpenseData({ ...editExpenseData, description: e.target.value })}
                          className="p-2 border rounded-md w-full mb-2"
                          placeholder="Description"
                        />
                        <input
                          type="text"
                          value={editExpenseData.category}
                          onChange={(e) => setEditExpenseData({ ...editExpenseData, category: e.target.value })}
                          className="p-2 border rounded-md w-full"
                          placeholder="Category"
                        />
                        <div className="mt-4 flex gap-4">
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white rounded-lg p-2"
                            onClick={() => handleSaveEdit(expense)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-500 hover:bg-gray-700 text-white rounded-lg p-2"
                            onClick={() => setIsEditing(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                              onClick={() => handleSettleUp(expense, userAmount)}
                            >
                              Settle Up
                            </button>
                          </>
                        )}

                        {isPaidByCurrentUser && (
                          <div className="flex gap-4 mt-2">
                            <button
                              className="bg-orange-500 hover:bg-orange-700 text-white rounded-lg p-2"
                              onClick={() => handleEditExpense(expense)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white rounded-lg p-2"
                              onClick={() => handleDeleteExpense(expense)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
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
}

export default DetailsDashboard;

