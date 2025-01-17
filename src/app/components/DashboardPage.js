"use client";

import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div className="bg-slate-200 flex justify-between items-center p-4 rounded-md">
      <h1 className="text-black font-extrabold text-2xl">Dashboard</h1>
      <div className="flex gap-4">
        <button
          className="block text-white bg-orange-500 rounded-lg p-3 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5"
          type="button"
          onClick={() => router.push("/add-expense")}
        >
          Add an Expense
        </button>
        <button className="bg-blue-500 rounded-lg p-3 text-white">
          Settle Up
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
