"use client"
import { useState } from "react";

export default function Sidebar() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const menuItems = [
    { label: "Dashboard", path: "dashboard" },
    { label: "Recent Activities", path: "recent-activities" },
    { label: "All Expenses", path: "AllExpenses"},
    { label: "All Groups", path: "group" },
    { label: "Friends", path: "friends" },
  ];

  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <div>Dashboard Content</div>;
      case "recent-activities":
        return <div>Recent Activities Content</div>;
      case "group":
        return <div>Groups Content</div>;
      case "friends":
        return <div>Friends Content</div>;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => setActiveComponent(item.path)}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeComponent === item.path ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Content</h1>
        {renderContent()}
      </div>
    </div>
  );
}
