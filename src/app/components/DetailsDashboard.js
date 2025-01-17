import React from "react";
import { useRouter } from "next/navigation";

const DetailsDashboard = ({ entity, type }) => {
  
  const router = useRouter();

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
      <div>
        <p className="text-lg font-medium text-gray-700">
          {type === "group"
            ? `Group ID: ${entity.groupID}`
            : `Friend ID: ${entity.userID}`}
        </p>
      </div>
    </div>
  );
};

export default DetailsDashboard;
