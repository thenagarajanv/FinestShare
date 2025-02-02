import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Razorpay from "razorpay";

const DetailsDashboard = ({ entity, type }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [settleModal, setSettleModal] = useState({ visible: false, friendID: null, amount: 0 });
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [newGroupName, setNewGroupName] = useState(entity?.groupName || "");
  const [newCategory, setNewCategory] = useState(entity?.category || "");  
  const [isEditing, setIsEditing] = useState(null);
  const [editExpenseData, setEditExpenseData] = useState({ description: "", category: "" });
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
 
  const handleEditExpense = (expense) => {
    setIsEditing(expense.expenseID);
    setEditExpenseData({
      description: expense.description || "",
      category: expense.category || "",
    });
  };
  
  const [currentDate, setCurrentDate] = useState(null);

  
  const handleSaveEdit = (expense) => {
    const updatedExpenseData = {
      description: editExpenseData.description,
      category: editExpenseData.category,
    };
    
    fetch(`https://finestshare-backend.onrender.com/expense/${expense.expenseID}`, {
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
        fetch(`https://finestshare-backend.onrender.com/expense/${expense.expenseID}`, {
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
      setCurrentDate(new Date().toLocaleString());
    }, []);
    
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  
    script.onload = () => console.log("Razorpay script loaded successfully.");
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  useEffect(() => { 
    const fetchUserID = async () => {
      try {
        const response = await fetch("https://finestshare-backend.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setCurrentUserID(data.user.userID);
        setUserName(data.user.name);
      setUserEmail(data.user.email);
      setUserPhone(data.user.phone);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details.");
    }
    };
  if (token) fetchUserID();
  }, [token]);

  console.log(userName +" "+ userPhone+" "+userEmail);
  
  useEffect(() => {
    const fetchExpenses = async () => {
      if (type !== "friend") {
        const url =
          type === "group"
            ? `https://finestshare-backend.onrender.com/expense/group/${entity.groupID}`
            : `https://finestshare-backend.onrender.com/expense/user/${entity.userID}`;

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
        const response = await fetch(`https://finestshare-backend.onrender.com/expense/balances/${friendID}`, {
          method:"GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch balances");
        const data = await response.json();
        // console.log(data);
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
  
    const handleResponse = async (response) => {
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response from backend:", errorDetails);
        throw new Error(errorDetails.message || "Unknown error occurred.");
      }
      return response.json();
    };
  
    if (method === "cash") {
      fetch("https://finestshare-backend.onrender.com/expense/settle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })
        .then(handleResponse)
        .then((data) => {
          console.log("Payment settled data:", data);
  
          if (data.message) {
            alert(data.message);
          } else {
            alert("Payment settled successfully.");
          }
          setSettleModal({ visible: false, friendID: null, amount: 0 });
        })
        .catch((error) => {
          console.error("Error settling payment:", error);
          alert("Failed to settle payment. Please try again.");
        });
    } else if (method === "razorpay") {
      console.log("Razorpay started..");
  
      if (typeof Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please try again.");
        return;
      }
  
      const options = {
        key: "rzp_test_nTbKdtgjeOQLhc",
        amount: settleModal.amount * 100,
        currency: "INR",
        name: "FairShare",
        description: "Payment Settlement",
        handler: async (response) => {
          try {
            console.log("Razorpay handler response:", response);
            const backendResponse = await fetch("https://finestshare-backend.onrender.com/expense/settle", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            });
            const backendData = await handleResponse(backendResponse);
            if (backendData.message) {
              alert(backendData.message);
            } else {
              alert("Payment settled successfully.");
            }
            setSettleModal({ visible: false, friendID: null, amount: 0 });
          } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred. Please try again.");
          }
        },
        prefill: {
          name: userName || "Your Name",
          email: userEmail || "user@example.com",
          contact: userPhone || "0000000000",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };
  
return (
  <div className="p-2 h-screen overflow-y-scroll" suppressHydrationWarning>
     <div className="bg-slate-200 flex flex-col gap-4 p-6 rounded-md">
    <div className="flex justify-between items-center">
    <h1 className="text-black font-extrabold text-2xl">
      {type === "group" ? entity?.groupName : `Friend: ${entity?.name}`} Dashboard
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
        ) : expenses.length === 0 ? (
          <p className="text-gray-600 mt-4">No expenses yet. Create your expenses below.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {expenses.map((expense) => {
              if (!expense) {
                console.error("Invalid expense entry:", expense);
                return null;
              }

              const userSplit = expense.splits?.find((split) => split.userID === currentUserID);
              const userAmount = userSplit ? userSplit.amount : 0;
              const isPaidByCurrentUser = expense.paidBy === currentUserID;

              return (
                <li key={expense.expenseID} className="bg-white p-4 rounded-md shadow-md">
                  {isEditing === expense.expenseID ? (
                    <div>
                      <input
                        type="text"
                        value={editExpenseData.description}
                        onChange={(e) =>
                          setEditExpenseData({ ...editExpenseData, description: e.target.value })
                        }
                        className="p-2 border rounded-md w-full mb-2"
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        value={editExpenseData.category}
                        onChange={(e) =>
                          setEditExpenseData({ ...editExpenseData, category: e.target.value })
                        }
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
                      <p className="text-sm text-gray-700 font-bold">
                        Your Share: {userAmount || "0.00"}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        {isPaidByCurrentUser && (
                          <div className="flex gap-4">
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
                        {userSplit && (
                          <button
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg p-2"
                            onClick={() => handleSettleUp(expense, userAmount)}
                          >
                            Settle Up
                          </button>
                        )}
                      </div>
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
        {balances.iOwe > 0 || balances.theyOweMe > 0 ? (
          <>
            {balances.iOwe > 0 && (
              <div>
                <h3 className="font-bold">I Owe</h3>
                <p>
                  Total: {balances.iOwe}
                </p>
              </div>
            )}
            {balances.theyOweMe > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">They Owe Me</h3>
                <p>
                  Total: {balances.theyOweMe}
                </p>
              </div>
            )}
          </>
        ) : (
          <p>No outstanding balances.</p>
        )}
      </div>
    )}
  </div>
  </div>
);
}

export default DetailsDashboard;