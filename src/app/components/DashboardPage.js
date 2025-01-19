// "use client";

// import { useRouter } from "next/navigation";

// const DashboardPage = () => {
//   const router = useRouter();

//   return (
//     <div className="bg-slate-200 flex justify-between items-center p-4 rounded-md">
//       <h1 className="text-black font-extrabold text-2xl">Dashboard</h1>
//       <div className="flex gap-4">
//         <button
//           className="block text-white bg-orange-500 rounded-lg p-3 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5"
//           type="button"
//           onClick={() => router.push("/add-expense")}
//         >
//           Add an Expense
//         </button>
//         <button className="bg-blue-500 rounded-lg p-3 text-white">
//           Settle Up
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [owedToYou, setOwedToYou] = useState(0);
  const [youOwe, setYouOwe] = useState(0);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://fairshare-backend-reti.onrender.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.user);
          setExpenses(data.user.expenses);
          setBalances(data.user.balances);
          
          const totalOwedToYou = data.user.balances.reduce((acc, balance) => {
            if (balance.amountOwed > 0) acc += balance.amountOwed;
            return acc;
          }, 0);

          const totalYouOwe = data.user.balances.reduce((acc, balance) => {
            if (balance.amountOwed < 0) acc += Math.abs(balance.amountOwed);
            return acc;
          }, 0);

          setOwedToYou(totalOwedToYou);
          setYouOwe(totalYouOwe);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const chartData = {
    labels: ["You Owe", "Owed To You"],
    datasets: [
      {
        label: "Balance",
        data: [youOwe, owedToYou],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6">
        <div className="flex gap-4 flex justify-end items-center">
          <button
            className="block text-white bg-orange-500 rounded-lg p-3 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5"
            onClick={() => router.push("/add-expense")}
          >
            Add an Expense
          </button>
          <button className="bg-blue-500 rounded-lg p-3 text-white">
            Settle Up
          </button>
        </div>
        
        <div className="mt-6">
          <h2 className="font-semibold">Balance Overview</h2>
          <div className="flex justify-between items-center mt-4">
            <p>You owe:</p>
            <p className="text-red-600">${youOwe.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p>Owed to you:</p>
            <p className="text-green-600">${owedToYou.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">Balance Chart</h2>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
