import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DetailsDashboard = ({ entity, type }) => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentUserID, setCurrentUserID] = useState(null);
  const router = useRouter();
  const token = localStorage.getItem("token");

  const categories = {
    Entertainment: ["Games", "Movies"],
    "Food and drink": ["Dining out", "Groceries"],
    Home: ["Electronics"],
    Life: ["Transportation"],
    Uncategorized: [],
    General: [],
    Utilities: [],
    Fitness: ["Gym", "Yoga", "Equipment"],
  };

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const response = await fetch("https://fairshare-backend-8kqh.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user ID");
        }
        const data = await response.json();
        setCurrentUserID(data.user.userID); 
        
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Failed to fetch user ID.");
      }
    };

    if (token) {
      fetchUserID();
    }
  }, [token]);

  const handleDelete = (expenseID) => {
    fetch(`https://fairshare-backend-8kqh.onrender.com/expense/${expenseID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete expense.");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message || "Expense deleted successfully.");
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.expenseID !== expenseID)
        );
      })
      .catch((err) => {
        console.error("Error deleting expense:", err);
        setError("Failed to delete expense.");
      });
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense.expenseID);
    setEditForm({
      description: expense.description,
      category: expense.category,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (expenseID) => {
    fetch(`http://192.168.0.127:8080/expense/${expenseID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update expense.");
        }
        return response.json();
      })
      .then((updatedExpense) => {
        alert("Expense updated successfully.");
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense.expenseID === expenseID ? updatedExpense : expense
          )
        );
        setEditingExpense(null);
      })
      .catch((err) => {
        console.error("Error updating expense:", err);
        setError("Failed to update expense.");
      });
  };

  useEffect(() => {
    const fetchExpenses = () => {
      if (type === "group" && entity?.groupID) {
        fetch(`https://fairshare-backend-8kqh.onrender.com/expense/group/${entity.groupID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setExpenses(data);
            } else {
              setError("Expenses data is not in the expected format.");
            }
          })
          .catch((err) => {
            console.error("Error fetching group expenses:", err);
            setError("Failed to fetch expenses.");
          });
      } else if (type === "friend" && entity?.userID) {
        fetch(`https://fairshare-backend-8kqh.onrender.com/expense/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setExpenses(data);
            } else {
              setError("Expenses data is not in the expected format.");
            }
          })
          .catch((err) => {
            console.error("Error fetching friend's expenses:", err);
            setError("Failed to fetch expenses.");
          });
      }
    };

    fetchExpenses();
  }, [entity, type, token]);

  if (!entity) {
    return <p>No entity selected.</p>;
  }

  
  return (
    <div className="bg-slate-200 flex flex-col gap-4 p-6 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-black font-extrabold text-2xl">
          {type === "group" ? entity.groupName : `Friend: ${entity.name}`} Dashboard
        </h1>
        <div className="flex gap-4">
          <button
            className="block text-white bg-orange-500 rounded-lg p-3 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5"
            type="button"
            onClick={() => {
              const id = type === "group" ? entity.groupID : entity.userID;
              if (id) {
                router.push(`/add-expense/${id}`);
              } else {
                console.error("Invalid entity ID");
              }
            }}
          >
            Add an Expense
          </button>
          <button className="bg-blue-500 rounded-lg p-3 text-white">
            Settle Up
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold">{type === "group" ? "Group" : "Friend"} Expenses</h2>
        {error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : expenses.length > 0 ? (
          <ul className="space-y-4 mt-4">
            {expenses.map((expense) => (
              <li
              key={expense.expenseID}
              className="bg-white p-4 rounded-md shadow-md"
              >
                {editingExpense === expense.expenseID ? (
                  expense.paidBy === currentUserID && (
                    <div>
                      <label>Description</label>
                      <input
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="block border p-2 mb-2"
                        placeholder="Description"
                      />
                      <label>Category</label>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="block border p-2 mb-2"
                      >
                        {Object.keys(categories).map((categoryKey) =>
                          categories[categoryKey].map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="flex justify-end items-end">
                        <button
                          onClick={() => handleEditSubmit(expense.expenseID)}
                          className="bg-green-500 hover:bg-green-700 rounded-sm p-2 text-white mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingExpense(null)}
                          className="bg-gray-500 hover:bg-gray-700 rounded-sm p-2 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {expense.description || "Untitled Expense"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-700">
                          Category: {expense.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      {expense.paidBy === currentUserID && (
                        <>
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="bg-blue-500 hover:bg-blue-700 rounded-sm p-2 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(expense.expenseID)}
                            className="bg-red-500 hover:bg-red-700 rounded-sm p-2 text-white"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No expenses found for this {type === "group" ? "group" : "friend"}.</p>
        )}
      </div>
    </div>
  );
};

export default DetailsDashboard;
