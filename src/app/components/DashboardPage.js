"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [owedToYou, setOwedToYou] = useState(0);
  const [youOwe, setYouOwe] = useState(0);
  const [showSettlePopup, setShowSettlePopup] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [settleAmount, setSettleAmount] = useState("");
  const [balanceSummary, setBalanceSummary] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://finestshare-backend.onrender.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.user);
          const sortedExpenses = data.user.expenses.sort((a, b) => {
            const dateA = new Date(a.date).setHours(0, 0, 0, 0); 
            const dateB = new Date(b.date).setHours(0, 0, 0, 0);
            return dateB - dateA;
          });
          // setExpenses(data.user.expenses);
          setExpenses(sortedExpenses);
          const totalOwedToYou = data.user.balances.reduce((acc, balance) => {
            if (balance.amountOwed > 0) acc += balance.amountOwed;
            return acc;
          }, 0);

          const totalYouOwe = data.user.balances.reduce((acc, balance) => {
            if (balance.amountOwed < 0) acc += Math.abs(balance.amountOwed);
            return acc;
          }, 0);

          setBalances(data.user.balances);
          setOwedToYou(totalOwedToYou);
          setYouOwe(totalYouOwe);
        })
        .catch((error) => console.error("Error fetching user data:", error));

      fetch("https://finestshare-backend.onrender.com/expense/balances-summary/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setBalanceSummary(data);
        })
        .catch((error) => console.error("Error fetching balance summary:", error));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const groupExpenseData = expenses.reduce((acc, expense) => {
    const groupName = expense.groupName || "Ungrouped";
    acc[groupName] = (acc[groupName] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const groupLabels = Object.keys(groupExpenseData);
  const groupAmounts = Object.values(groupExpenseData);

  const barChartData = {
    labels: groupLabels,
    datasets: [
      {
        label: "Expenses by Group",
        data: groupAmounts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleSettleUp = () => {
    setShowSettlePopup(true);
  };

  const handleSettleSubmit = async () => {
    if (!settleAmount || settleAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const payload = {
      paymentMode,
      amount: parseFloat(settleAmount),
    };

    try {
      const response = await fetch("https://finestshare-backend.onrender.com/settle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Settlement successful!");
        setShowSettlePopup(false);
        setSettleAmount("");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Something went wrong!"}`);
      }
    } catch (error) {
      console.error("Error settling up:", error);
      alert("Failed to settle up. Please try again.");
    }
  };

  return (
    <div className="p-2 h-screen overflow-y-scroll" suppressHydrationWarning>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6">
        {/* <div className="flex gap-4 flex justify-end items-center">
          <button
            className="bg-blue-500 rounded-lg p-3 text-white"
            onClick={handleSettleUp}
          >
            Settle Up All Payemet
          </button>
        </div> */}
        <div className="mt-6">
          <h2 className="font-semibold">Expenses by Group</h2>
          <Bar data={barChartData} />
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">Trips & Groups</h2>
          {userData?.groups.map((group) => (
            <div key={group.groupID} className="flex items-center gap-4 mt-4">
              <img src={group.groupImage} alt={group.groupName} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium">{group.groupName}</p>
                <p className="text-sm text-gray-600">{group.groupType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settle Up Popup */}
      {showSettlePopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Settle Up</h3>
            <div className="mb-4">
              <button
                className="w-full bg-orange-500 text-white py-2 rounded-lg mb-4 hover:bg-orange-600"
                onClick={() => setPaymentMode("cash")}
              >
                Record Cash Pay
              </button>
              <button
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                onClick={() => setPaymentMode("razorpay")}
              >
                Razorpay
              </button>
            </div>
            {paymentMode && (
              <div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                />
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  onClick={handleSettleSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {balanceSummary && (
        <div className="mt-6">
          <h2 className="font-semibold">Balance Summary</h2>
          <div className="mt-4">
            <p>Total Owed To You: ₹{balanceSummary.totalOwes}</p>
            <p>Total You Owe: ₹{balanceSummary.totalOwedTo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
