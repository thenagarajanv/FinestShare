"use client";

import InternalNavbar from "@/app/_components/(NavigationBar)/InternalNavbar/page";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, memo } from "react";

const ExpenseComponent = () => {
  const groupID = usePathname("").split("/").at(2);
  const token = localStorage.getItem("token");

  const [description, setDescription] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [isHidden, setIsHidden] = useState(true);
  const [isMultiple, setIsMultiple] = useState(true);
  const [isEqual, setIsEqual] = useState(true);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isGroupMembersArray, setGroupMembersArray] = useState([]);
  const [selectedPayers, setSelectedPayers] = useState([]);
  const [selectedSplitters, setSelectedSplitters] = useState([]);
  const [splitAmounts, setSplitAmounts] = useState({});
  const [activeContainer, setActiveContainer] = useState(null);
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [userAmounts, setUserAmounts] = useState({});
  const [percentageAmounts, setPercentageAmounts] = useState({});
  const [adjustmentAmounts, setAdjustmentAmounts] = useState({});
  const [warning, setWarning] = useState(false);
  const [totalExactAmount, setTotalExactAmount] = useState(0);
  const [tempInput, setTempInput] = useState({});
  const [total, setTotal] = useState(0);
  const [totalAdjustment, setTotalAdjustment] = useState(0);
  const [userID, setUserID] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState(''); 
 
  const handleCancel = () => {
    window.location.href = '/dashboard';
  };

  const categories = {
    'Entertainment': ['Games', 'Movies', 'Music', 'Other'],
    'Food and drink': ['Dining out', 'Groceries', 'Liquor', 'Other'],
    'Home': ['Electronics', 'Furniture', 'Household supplies', 'Maintenance', 'Mortgage', 'Other', 'Pets', 'Rent', 'Services'],
    'Life': ['Transportation'],
    'Uncategorized': [],
    'General': [],
    'Utilities': []
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory(''); 
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://finestshare-backend.onrender.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserID(data.user.userID);  
        setIsLoading(false);  
      } catch (error) {
        console.error(error);
        setIsLoading(false);  
      }
    };

    fetchUserData();
  }, []);

//   const submitExpense = async () => {
//     if (!userID) {
//       console.error('User ID is not available yet.');
//       return; 
//     }
  
//     const expenseData = {
//       amount: parseFloat(amount),
//       description: description.trim(), 
//       paidBy: parseInt(userID), 
//       groupID: parseInt(groupID),
//       type: "group", 
//       category: category.trim(), 
//       image: "dinner.jpg", 
//       splits: Object.keys(splitAmounts).map((userID) => ({
//         userID: parseInt(userID), 
//         amount: parseFloat(splitAmounts[userID]), 
//       })),
//     };
    
//   try {
//     const response = await fetch('https://finestshare-backend.onrender.com/expense/add', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(expenseData),
//     });

//     console.log('Request payload:', expenseData);

//     const data = await response.json();

//     if (response.ok) {
//       console.log('Expense created successfully:', data);
//       alert('Expense submitted successfully!');
//     } else {
//       console.error('Failed to create expense.', {
//         status: response.status,
//         responseData: data,
//       });
//       alert(`Failed to submit expense. Error: ${data.message || response.statusText}`);
//     }
//   } catch (error) {
//     console.error('Error submitting expense:', error);
//     alert('An unexpected error occurred while submitting the expense. Please try again.');
//   }
// };

const validateForm = () => {
  if (!amount || parseFloat(amount) <= 0) {
    alert("Please enter a valid amount.");
    return false;
  }
  if (!description.trim()) {
    alert("Please provide a description.");
    return false;
  }
  if (!category) {
    alert("Please select a category.");
    return false;
  }
  if (!selectedPayers) {
    alert("Please select a payer.");
    return false;
  }
  if (activeContainer === "splitEqually" && selectedSplitters.length === 0) {
    alert("Please select at least one person to split equally.");
    return false;
  }
  if (activeContainer === "splitExactAmount" && totalExactAmount !== parseFloat(amount)) {
    alert(
      `The total split (${totalExactAmount}) does not match the expense amount (${amount}).`
    );
    return false;
  }
  if (activeContainer === "splitPercentage" && warning) {
    alert("Ensure the split percentages add up to 100%.");
    return false;
  }
  if (activeContainer === "splitAdjustment" && warning) {
    alert(
      `The adjustment split total (${totalAdjustment}) does not match the expense amount (${amount}).`
    );
    return false;
  }
  return true;
};

const submitExpense = async () => {
  if (!validateForm()) return;

  const expenseData = {
    amount: parseFloat(amount),
    description: description.trim(),
    paidBy: parseInt(userID),
    groupID: parseInt(groupID),
    type: "group",
    category: category.trim(),
    image: "dinner.jpg",
    splits: Object.keys(splitAmounts).map((userID) => ({
      userID: parseInt(userID),
      amount: parseFloat(splitAmounts[userID]),
    })),
  };

  try {
    const response = await fetch(
      "https://finestshare-backend.onrender.com/expense/add",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Expense submitted successfully!");
    } else {
      alert(`Failed to submit expense. Error: ${data.message || response.statusText}`);
    }
  } catch (error) {
    alert("An unexpected error occurred while submitting the expense. Please try again.");
  }
};

  useEffect(() => {
    if (activeContainer === "splitAdjustment") {
      const initialAdjustment = {};
      selectedSplitters.forEach(([userID]) => {
        initialAdjustment[userID] = 0;  
      });
  
      setAdjustmentAmounts(initialAdjustment);
    }
  }, [activeContainer, selectedSplitters.length]);
  
  const handleAdjustmentChange = (e, userID) => {
    const newAmount = parseFloat(e.target.value) || 0;
  
    setAdjustmentAmounts((prev) => ({
      ...prev,
      [userID]: newAmount,
    }));
  };
  
  useEffect(() => {
    const totalAdjustment = Object.values(adjustmentAmounts).reduce((acc, val) => acc + val, 0);
  
    setTotalAdjustment(totalAdjustment);
    setTotal(totalAdjustment);
  
    if (Math.abs(totalAdjustment - amount) <= 0.01) {
      setWarning(false); 
    } else {
      setWarning(true);
    }
  }, [adjustmentAmounts, amount]);

  const handleCheckClick = () => {
    const totalCalculatedAmount = Object.entries(percentageAmounts).reduce((acc, [userID, percentage]) => {
      const userAmount = (parseFloat(amount) * percentage) / 100 || 0;
      acc += userAmount;
      return acc;
    }, 0);
  
    if (Math.abs(totalCalculatedAmount - parseFloat(totalAmount)) < 0.01) {
      const updatedAmounts = Object.entries(percentageAmounts).reduce((acc, [userID, percentage]) => {
        const userAmount = (parseFloat(amount) * percentage) / 100 || 0;
        acc[userID] = userAmount.toFixed(2); 
        return acc;
      }, {});
      setUserAmounts(updatedAmounts);
      setWarning(true); 
    } else {
      setWarning(false);
    }
  };
  
  const formattedAmount = parseFloat(amount).toFixed(2);

  useEffect(() => {
    const totalPercentage = Object.values(percentageAmounts).reduce(
      (acc, value) => acc + value,
      0
    );
  
  if (totalPercentage === 100) {
    const updatedAmounts = Object.entries(percentageAmounts).reduce(
      (acc, [userID, percentage]) => {
        const userAmount = (parseFloat(amount) * percentage) / 100 || 0;
        acc[userID] = userAmount.toFixed(2); 
        return acc;
      },
      {}
    );
    setUserAmounts(updatedAmounts);

      const formattedAmount = parseFloat(amount).toFixed(2);
      if (amount === formattedAmount) {
        setWarning(false); 
      } else {
        setWarning(true);
      }
    } else {
      setWarning(true);
    }
  }, [percentageAmounts, amount]); 
  

  const handleInputChange = (e, userID) => {
    const value = e.target.value;
    setTempInput((prev) => ({
      ...prev,
      [userID]: value, 
    }));
  };

  const handleInputBlur = (userID) => {
    const value = parseFloat(tempInput[userID]) || 0;

    handlePercentageChange({ target: { value } }, userID);

    setTempInput((prev) => {
      const updated = { ...prev };
      delete updated[userID];
      return updated;
    });
  };

  const handlePercentageChange = (e, userID) => {
    const newPercentage = parseFloat(e.target.value) || 0;

    setPercentageAmounts((prev) => {
      const updated = { ...prev, [userID]: newPercentage };

      const totalPercentage = Object.values(updated).reduce(
        (acc, val) => acc + val,
        0
      );

      if (totalPercentage > 100) {
        const difference = totalPercentage - 100;
        const remainingUsers = Object.keys(updated).filter(
          (id) => id !== userID
        );

        remainingUsers.forEach((otherUserID) => {
          updated[otherUserID] = Math.max(
            0,
            updated[otherUserID] - difference / remainingUsers.length
          );
        });
      }

      return updated;
    });
  };

  useEffect(() => {
    if (activeContainer === "splitExactAmount") {
      const initialSplit = {};
      selectedSplitters.forEach(([userID]) => {
        initialSplit[userID] = amount / selectedSplitters.length;
      });
  
      setUserAmounts(initialSplit);
    }
  }, [amount, activeContainer, selectedSplitters.length]); 
  
  
  const handleExactAmountChange = (e, userID) => {
    const newAmount = parseFloat(e.target.value) || 0;
  
    setUserAmounts((prev) => ({
      ...prev,
      [userID]: newAmount,
    }));
  };

  useEffect(() => {
    const total = Object.values(userAmounts).reduce((acc, val) => acc + val, 0);
  
    setTotalExactAmount(total);

    setTotal(total);
    if (Math.abs(total - amount) <= 0.01) {
      setWarning(false); 
    } else {
      setWarning(true);
    }
  }, [userAmounts, amount]);
  
  

  useEffect(() => {
    if (activeContainer === "splitEqually") {
      const initialSplit = {};
      selectedSplitters.forEach(([userID]) => {
        initialSplit[userID] = amount / selectedSplitters.length;
      });
      setSplitAmounts(initialSplit);
    }
  }, [activeContainer, selectedSplitters, amount]);

  const handleCheckboxChange = (e, userID) => {
    if (e.target.checked) {
      setSplitAmounts((prev) => {
        const updated = { ...prev, [userID]: 0 };
        const splitValue = amount / Object.keys(updated).length;
        return Object.fromEntries(
          Object.keys(updated).map((id) => [id, splitValue])
        );
      });
    } else {
      setSplitAmounts((prev) => {
        const updated = { ...prev };
        delete updated[userID];
        const splitValue = amount / Object.keys(updated).length || 0;
        return Object.fromEntries(
          Object.keys(updated).map((id) => [id, splitValue])
        );
      });
    }
  };

  useEffect(() => {
    let currentTotal = 0;
    if (activeContainer === "splitEqually") {
      currentTotal = Object.values(splitAmounts).reduce(
        (acc, value) => acc + value,
        0
      );
    } else if (activeContainer === "splitExactAmount") {
      currentTotal = Object.values(userAmounts).reduce(
        (acc, value) => acc + value,
        0
      );
    } else if (activeContainer === "splitPercentage") {
      currentTotal = Object.values(percentageAmounts).reduce(
        (acc, value) => acc + value,
        0
      );
    } else if (activeContainer === "splitAdjustment") {
      currentTotal = Object.values(adjustmentAmounts).reduce(
        (acc, value) => acc + value,
        0
      );
    }
    setTotalAmount(currentTotal);
    if (currentTotal !== parseFloat(amount)) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  }, [
    splitAmounts,
    userAmounts,
    percentageAmounts,
    adjustmentAmounts,
    amount,
    activeContainer,
  ]);

  useEffect(() => {
    const total = Object.values(splitAmounts).reduce(
      (acc, value) => acc + value,
      0
    );
    setTotalAmount(total);
  }, [splitAmounts]);

  const handleSplit = (containerName) => {
    if (activeContainer === containerName) {
      setActiveContainer(null);
    } else {
      setActiveContainer(containerName);
    }
  };

  useEffect(() => {
    if (groupID) {
      fetch(
        `https://finestshare-backend.onrender.com/group/${groupID}/details`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.group) {
            const members = data.group.members || [];
            setGroupMembers(data.group);
            setGroupMembersArray(members);
            setSelectedPayers(data.group.createdBy);
          }
        })
        .catch((error) => {
          console.error("Error fetching group details:", error);
        });
    }
  }, [groupID]);

  const handleSelectSplitter = (member) => {
    const isAlreadySelected = selectedSplitters.some(
      (splitter) => splitter[0] === member.userID
    );

    if (isAlreadySelected) {
      setSelectedSplitters((prevState) => {
        const updatedSplitters = prevState.filter(
          (splitter) => splitter[0] !== member.userID
        );
        return updatedSplitters.map((splitter) => {
          splitter[2].expense =
            parseFloat(amount) / updatedSplitters.length || 0;
          return splitter;
        });
      });
    } else {
      setSelectedSplitters((prevState) => {
        const updatedSplitters = [
          ...prevState,
          [member.userID, member.name, { expense: 0 }],
        ];
        return updatedSplitters.map((splitter) => {
          splitter[2].expense =
            parseFloat(amount) / updatedSplitters.length || 0;
          return splitter;
        });
      });
    }
  };

  useEffect(() => {
    setSplitAmounts((prev) => {
      const splitValue = amount / Object.keys(prev).length || 0;
      return Object.fromEntries(
        Object.keys(prev).map((id) => [id, splitValue])
      );
    });
  }, [amount]);

  const handleToggle = (type) => {
    if (type === "multiple") {
      setIsMultiple(!isMultiple);
      setIsEqual(true);
    } else if (type === "equal") {
      setIsEqual(!isEqual);
      setIsMultiple(true);
    }
  };

  const handleSelectPayer = (member) => {
    if (selectedPayers === member.userID) {
      setSelectedPayers(null);
    } else {
      setSelectedPayers(member.userID);
    }
  };

  const handleDeleteGroup = (index) => {
    const updatedList = groupList.filter((_, i) => i !== index);
    setGroupList(updatedList);
  };

  const handleSplitExpenseOpen = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div>
      <InternalNavbar />
      <div className="bg-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="container1">
            <div className="bg-blue-500 p-4 text-white rounded-md">
              <h2 className="text-xl font-bold">Add an Expense</h2>
            </div>
            <div className="mt-3 p-3 rounded-md">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between">
                <label
                  htmlFor="groupInput"
                  className="font-medium text-gray-700 mb-2 sm:mb-0"
                >
                  With you and:
                </label>
              </div>

              <div className="checkbox-user-details">
                <div className="people-container mt-3">
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      className={`flex items-center justify-center p-2 rounded-md shadow-md ${
                        selectedSplitters.some(
                          (splitter) => splitter[0] === groupMembers.createdBy
                        )
                          ? "bg-green-400 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() =>
                        handleSelectSplitter({
                          userID: groupMembers.createdBy,
                          name: "You",
                        })
                      }
                    >
                      <span className="flex-1 text-center">You</span>
                    </button>

                    {isGroupMembersArray.length > 0 ? (
                      isGroupMembersArray.map((member, idx) => (
                        <button
                          key={idx}
                          className={`flex items-center justify-center p-2 rounded-md shadow-md ${
                            selectedSplitters.some(
                              (splitter) => splitter[0] === member.userID
                            )
                              ? "bg-green-400 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleSelectSplitter(member)}
                        >
                          <span className="flex-1 text-center">
                            {member.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p>No members found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3">
              <ul className="space-y-2">
                {groupList.map((group, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border rounded-md bg-white shadow-sm"
                  >
                    <span>{group}</span>
                    <button
                      onClick={() => handleDeleteGroup(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 p-3 rounded-md flex justify-center">
              <div className="w-full max-w-4xl bg-white p-4 rounded-md shadow-md">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="flex flex-col gap-2 w-full sm:w-1/3">
                    <label className="text-sm font-semibold">Choose a Category</label>
                    <select
                      value={category}
                      onChange={handleCategoryChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Category</option>
                      {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {category && (
                      <>
                        <label className="text-sm font-semibold mt-2">Choose a Subcategory</label>
                        <select
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select Subcategory</option>
                          {categories[category].map((subCat) => (
                            <option key={subCat} value={subCat}>
                              {subCat}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 w-full sm:w-2/3">
                    <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold">Amount</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                      <label className="text-sm font-semibold">Description</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a Description"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <p>
                Paid by{" "}
                <span
                  className="cursor-pointer text-green-600"
                  onClick={() => handleToggle("multiple")}
                >
                  Choose Payer
                </span>{" "}
                and split{" "}
                <span
                  className="cursor-pointer text-green-600"
                  onClick={() => handleToggle("equal")}
                >
                  equally​.
                </span>
              </p>
            </div>
          </div>

          <div className="Global-Right-View-Container">
            <div
              className="container-1"
              style={{ display: isMultiple ? "none" : "block" }}
            >
              <div className="container-outer-top-range">
                <h2 className="text-xl font-bold bg-cyan-400 p-2 text-white rounded-md">
                  Choose Payer
                </h2>
                <div className="people-container mt-3">
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      className={`p-2 rounded-md shadow-md ${
                        selectedPayers === groupMembers.createdBy
                          ? "bg-green-400 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() =>
                        handleSelectPayer({
                          userID: groupMembers.createdBy,
                          name: "You",
                        })
                      }
                    >
                      You
                    </button>

                    {isGroupMembersArray.length > 0 ? (
                      isGroupMembersArray.map((member, idx) => (
                        <button
                          key={idx}
                          className={`p-2 rounded-md shadow-md ${
                            selectedPayers === member.userID
                              ? "bg-green-400 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleSelectPayer(member)}
                        >
                          {member.name}
                        </button>
                      ))
                    ) : (
                      <p>No members found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="container-2"
              style={{ display: isEqual ? "none" : "block" }}
            >
              <div className="container-outer-top-range">
                <div>
                  <h2 className="text-xl font-bold bg-cyan-400 p-2 text-white rounded-md">
                    Choose split options
                  </h2>
                </div>
                <div className="btn-container m-2 p-2 border border-b-slate-300">
                  <div className="text-md flex justify-center m-3 items-center">
                    <button
                      className="btn p-2 rounded rounded-md border min-w-[500px] border-black hover:bg-cyan-400 hover:text-white"
                      onClick={handleSplitExpenseOpen}
                    >
                      Split the expense
                    </button>
                  </div>
                </div>
                <div
                  className="all-btn btn-w-sm"
                  style={{ display: isHidden ? "none" : "block" }}
                >
                  <div className="types-of-expense-component flex justify-center items-center gap-4">
                    <button
                      className="relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300"
                      onClick={() => handleSplit("splitEqually")}
                      title="Split Equally"
                    >
                      =<span className="sr-only">Split Equally</span>
                    </button>

                    <button
                      className="relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300"
                      onClick={() => handleSplit("splitExactAmount")}
                      title="Split Exact Amount"
                    >
                      1.23
                      <span className="sr-only">Split Exact Amount</span>
                    </button>

                    <button
                      className="relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300"
                      onClick={() => handleSplit("splitPercentage")}
                      title="Split by Percentage"
                    >
                      %<span className="sr-only">Split by Percentage</span>
                    </button>

                    <button
                      className="relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300"
                      onClick={() => handleSplit("splitAdjustment")}
                      title="Split by Adjustment"
                    >
                      +/-
                      <span className="sr-only">Split by Adjustment</span>
                    </button>
                  </div>
                  <hr className="my-4 border-t-2 border-gray-300" />
                </div>
              </div>
              <div className="container3">
                <div className="Split-Equally" style={{ display: activeContainer === "splitEqually" ? "block" : "none", }}>
                  <h1>Split Equally</h1>
                  {selectedSplitters.map(([userID, name]) => (
                    <div
                      key={userID}
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                      >
                      <input
                        type="checkbox"
                        id={userID}
                        name={userID}
                        className="mr-2"
                        checked={!!splitAmounts[userID]} 
                        onChange={(e) => handleCheckboxChange(e, userID)}
                      />
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <label className="text-right">
                        ${splitAmounts[userID]?.toFixed(2) || "0.00"}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Split Exact Amount */}
                <div
                  className="Split-Exact-Amount"
                  style={{
                    display: activeContainer === "splitExactAmount" ? "block" : "none",
                  }}
                >
                  <h1>Split the Exact Amount</h1>
                  {selectedSplitters.map(([userID, name]) => (
                    <div
                      key={userID}
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                    >
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <input
                        type="text"
                        className="input-exact-amount"
                        value={typeof userAmounts[userID] === "number" ? userAmounts[userID].toFixed(2) : ""}
                        onChange={(e) => handleExactAmountChange(e, userID)}
                      />
                    </div>
                  ))}
                  {!(
                    Math.abs(totalExactAmount - amount) <= 0.01 ||
                    totalAmount - totalExactAmount > 0.10 ||
                    totalExactAmount < totalAmount - 0.10
                  ) && (
                    <p className="text-red-500 mt-2">
                      The total entered does not match the expected amount (${Number(totalAmount).toFixed(2)}). Please adjust the values.
                    </p>
                  )}
                </div>

                <div className="Split-Percentage" style={{ display: activeContainer === "splitPercentage" ? "block" : "none" }}>
                  <h1>Split By Percentage</h1>
                  {selectedSplitters.map(([userID, name]) => (
                    <div key={userID} className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2">
                      <label htmlFor={userID} className="flex-1 text-center">{name}</label>
                      <input
                        type="number"
                        className="input-percentage-amount"
                        value={tempInput[userID] !== undefined ? tempInput[userID] : percentageAmounts[userID] || ""}
                        onChange={(e) => handleInputChange(e, userID)} 
                        onBlur={() => handleInputBlur(userID)}
                      />
                      <p className="ml-4">${userAmounts[userID] || "0.00"}</p>
                    </div>
                  ))}
                  <div>
                    <button onClick={handleCheckClick} className="check-button">Check</button>
                  </div>
                  {warning && (
                    <div className="warning-text text-red-500 mt-2 text-center">
                      The total entered does not match the expected amount. Please check the values.
                    </div>
                  )}
                </div>
                <div
                  className="Split-By-Adjustment"
                  style={{
                    display: activeContainer === "splitAdjustment" ? "block" : "none",
                  }}
                >
                  <h1>Split By Adjustment</h1>
                  {selectedSplitters.map(([userID, name]) => (
                    <div key={userID} className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2">
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <input
                        type="text"
                        className="input-adjustment-amount"
                        value={adjustmentAmounts[userID] || ""}
                        onChange={(e) => handleAdjustmentChange(e, userID)}
                      />
                      <label className="text-right">
                        ${adjustmentAmounts[userID] || "0.00"}
                      </label>
                    </div>
                  ))}
                  
                  {warning && (
                    <p className="text-red-500 mt-2">
                      The total entered does not match the expected amount (${Number(totalAmount).toFixed(2)}). Please adjust the values.
                    </p>
                  )}
                </div>
                
                {activeContainer !== "splitPercentage" && (
                  <div>Total: ${!isNaN(totalAmount) ? totalAmount.toFixed(2) : "0.00"}</div>
                )}
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 text-left">
                  <label>Total Amount</label>
                </div>
                <div className="text-right">
                  {activeContainer === "splitPercentage"
                    ? parseFloat(formattedAmount).toFixed(2) 
                    : totalAmount 
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-2">
          <button
            className="px-4 py-2 bg-green-700 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={submitExpense}
          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-red-600 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseComponent;
