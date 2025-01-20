import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DetailsDashboard = ({ entity, type }) => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (type === "group" && entity?.groupID) {
      const token = localStorage.getItem("token");

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
    }
  }, [entity, type]);

  if (!entity) {
    return <p>No entity selected.</p>;
  }

  return (
    <div className="bg-slate-200 flex flex-col gap-4 p-6 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-black font-extrabold text-2xl">
          {type === "group" ? entity.groupName : entity.name} Dashboard
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
        <h2 className="text-xl font-bold">Group Expenses</h2>
        {error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : expenses.length > 0 ? (
          <ul className="space-y-4 mt-4">
            {expenses.map((expense) => (
              <li
                key={expense.expenseID}
                className="bg-white p-4 rounded-md shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{expense.description || "Untitled Expense"}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      Category: {expense.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${expense.amount}
                    </p>
                    <p className="text-sm text-gray-600">Paid by : {expense.user.name}</p>
                  </div>
                </div>
                {expense.splits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Splits:</h4>
                    <ul className="mt-2 space-y-2">
                      {expense.splits.map((split) => (
                        <li
                          key={split.id}
                          className="text-sm text-gray-600 flex justify-between"
                        >
                          <span>Name: {split.user.name}</span>
                          <span>Amount: ${split.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No expenses found for this group.</p>
        )}
      </div>
    </div>
  );
};

export default DetailsDashboard;
