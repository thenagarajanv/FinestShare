"use client";

import InternalNavbar from '@/app/_components/(NavigationBar)/InternalNavbar/page';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, memo } from 'react';

const ExpenseComponent = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [isHidden, setIsHidden] = useState(true);
  const [isMultiple, setIsMultiple] = useState(true);
  const [isEqual, setIsEqual] = useState(true); 
  const [groupMembers, setGroupMembers] = useState([]);
  const [isGroupMembersArray, setGroupMembersArray]  = useState([]);
  const [selectedPayers, setSelectedPayers] = useState([]); 
  const [selectedSplitters, setSelectedSplitters] = useState([]);
  const [splitAmounts, setSplitAmounts] = useState({});
  const [activeContainer, setActiveContainer] = useState(null); 
  const [totalAmount, setTotalAmount] = useState(0);

  const handleSplit = (containerName) => {
    if (activeContainer === containerName) {
      setActiveContainer(null); 
    } else {
      setActiveContainer(containerName);
    }
  };

  const groupID = usePathname("").split("/").at(2);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (groupID) {
      fetch(`https://fairshare-backend-reti.onrender.com/group/${groupID}/details`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched Group Details:', data);
  
          if (data.group) {
            const members = data.group.members || [];
            setGroupMembers(data.group); 
            setGroupMembersArray(members);
            setSelectedPayers(data.group.createdBy);
          }
        })
        .catch((error) => {
          console.error('Error fetching group details:', error);
        });
    }
  }, [groupID]);

  const handleSelectSplitter = (member) => {
    const isAlreadySelected = selectedSplitters.some(splitter => splitter[0] === member.userID);
    if (isAlreadySelected) {setSelectedSplitters(prevState => prevState.filter(splitter => splitter[0] !== member.userID));
    } else {setSelectedSplitters(prevState => [...prevState, [member.userID, member.name]]);
    }
  };


  console.log(selectedSplitters);

  const handleCheckboxChange = (e, userID) => {
    if (e.target.checked) {
      setSplitAmounts((prev) => ({
        ...prev,
        [userID]: 0.00, 
      }));
    } else {
      setSplitAmounts((prev) => {
        const updated = { ...prev };
        delete updated[userID];
        return updated;
      });
    }
  };
  
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
                <label htmlFor="groupInput" className="font-medium text-gray-700 mb-2 sm:mb-0">
                  With you and:
                </label>
              </div>
              
              <div className="checkbox-user-details">
                <div className="people-container mt-3">
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      className={`flex items-center justify-center p-2 rounded-md shadow-md ${
                        selectedSplitters.some(splitter => splitter[0] === groupMembers.createdBy) ? 'bg-green-400 text-white' : 'bg-gray-200'
                      }`}
                      onClick={() => handleSelectSplitter({ userID: groupMembers.createdBy, name: 'You' })}
                    >
                      <span className="flex-1 text-center">You</span>
                    </button>

                    {isGroupMembersArray.length > 0 ? (
                      isGroupMembersArray.map((member, idx) => (
                        <button
                          key={idx}
                          className={`flex items-center justify-center p-2 rounded-md shadow-md ${
                            selectedSplitters.some(splitter => splitter[0] === member.userID) ? 'bg-green-400 text-white' : 'bg-gray-200'
                          }`}
                          onClick={() => handleSelectSplitter(member)}
                        >
                          <span className="flex-1 text-center">{member.name}</span>
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
            <div className="mt-3 p-3 rounded-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a Description"
                  />
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <p>
                Paid by{' '}
                <span
                  className="cursor-pointer text-green-600"
                  onClick={() => handleToggle("multiple")}
                >
                  Choose Payer
                </span>{' '}
                and split{' '}
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
            <div className="container-1" style={{ display: isMultiple ? 'none' : 'block' }}>
              <div className="container-outer-top-range">
                <h2 className="text-xl font-bold bg-cyan-400 p-2 text-white rounded-md">
                  Choose Payer
                </h2>
                <div className="people-container mt-3">
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      className={`p-2 rounded-md shadow-md ${selectedPayers === groupMembers.createdBy ? 'bg-green-400 text-white' : 'bg-gray-200'}`}
                      onClick={() => handleSelectPayer({ userID: groupMembers.createdBy, name: 'You' })}
                    >
                      You
                    </button>

                    {isGroupMembersArray.length > 0 ? (
                      isGroupMembersArray.map((member, idx) => (
                        <button
                          key={idx}
                          className={`p-2 rounded-md shadow-md ${selectedPayers === member.userID ? 'bg-green-400 text-white' : 'bg-gray-200'}`}
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
            <div className="container-2" style={{ display: isEqual ? 'none' : 'block' }}>
              <div className="container-outer-top-range">
                <div>
                  <h2 className="text-xl font-bold bg-cyan-400 p-2 text-white rounded-md">
                    Choose split options
                  </h2>
                </div>
                <div className='btn-container m-2 p-2 border border-b-slate-300'>
                  <div className='text-md flex justify-center m-3 items-center'>
                    <button
                      className="btn p-2 rounded rounded-md border min-w-[500px] border-black hover:bg-cyan-400 hover:text-white"
                      onClick={handleSplitExpenseOpen}
                    >
                      Split the expense
                    </button>
                  </div>
                  <div className='text-md flex justify-center m-3 items-center'>
                    <button className="btn text-black p-2 rounded rounded-md border min-w-[500px] border-black hover:bg-cyan-400 hover:text-white">
                      You owe the full amount
                    </button>
                  </div>
                  <div className='text-md flex m-3 justify-center items-center'>
                    <button className="btn text-black p-2 rounded rounded-md border min-w-[500px] border-black hover:bg-cyan-400 hover:text-white">
                      They owe the full amount
                    </button>
                  </div> 
                </div>
                <div className='all-btn btn-w-sm' style={{ display: isHidden ? "none" : "block" }}>
                <div className='types-of-expense-component flex justify-center items-center gap-4'>
                  <button
                    className='relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300'
                    onClick={() => handleSplit("splitEqually")}
                    title="Split Equally"
                  >
                    =
                    <span className="sr-only">Split Equally</span>
                  </button>

                  <button
                    className='relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300'
                    onClick={() => handleSplit("splitExactAmount")}
                    title="Split Exact Amount"
                  >
                  1.23
                    <span className="sr-only">Split Exact Amount</span>
                  </button>

                  <button
                    className='relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300'
                    onClick={() => handleSplit("splitPercentage")}
                    title="Split by Percentage"
                  >
                    %
                    <span className="sr-only">Split by Percentage</span>
                  </button>

                  <button
                    className='relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300'
                    onClick={() => handleSplit("splitShares")}
                    title="Split by Shares"
                  >
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-6 h-6 mx-auto"
                    >
                      <path d="M19 4H5c-1.1 0-1.99.9-1.99 2L3 18c0 1.1.89 2 1.99 2H19c1.1 0 1.99-.9 1.99-2L21 6c0-1.1-.89-2-1.99-2zM11 14h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2z" />
                    </svg>
                    <span className="sr-only">Split by Shares</span>
                  </button>

                  <button
                    className='relative px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-cyan-400 hover:text-white transition duration-300'
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
              <div classame="container3">
              <div className="Split-Equally"  style={{ display: activeContainer === "splitEqually" ? "block" : "none" }}>
                <h1>Split Equally</h1>
                {selectedSplitters.map((member) => {
                  const [userID, name] = member; 
                  return (
                    <div
                      key={userID}
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                    >
                      <input
                        type="checkbox"
                        id={userID}
                        name={userID}
                        className="mr-2"
                        onChange={(e) => handleCheckboxChange(e, userID)}
                      />
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <label className="text-right">
                        ${splitAmounts[userID] || "0.00"}
                      </label>
                    </div>
                  );
                })}
                </div>
              <div className="Split-Exact-Amount" style={{ display: activeContainer === "splitExactAmount" ? "block" : "none" }}>
                <h1>Split the Exact Amount</h1>
                {selectedSplitters.map((member, index) => {
                  const [userID, name] = member;
                  return (
                    <div
                      key={`${userID}-${index}`} // Combine userID and index for uniqueness
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                    >
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <label className="text-right">
                        <input type="text" className="input-exact-amount" />
                      </label>
                    </div>
                  );
                })}
                </div>  
              <div className="Split-Percentage" style={{ display: activeContainer === "splitPercentage" ? "block" : "none" }}>
              <h1>Split By Percentage</h1>
              {selectedSplitters.map((member, index) => {
                  const [userID, name] = member;
                  return (
                    <div
                      key={`${userID}-${index}`} // Combine userID and index for uniqueness
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                    >
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <label className="text-right">
                        <input type="text" className="input-exact-amount" />
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="Split-Shares" style={{ display: activeContainer === "splitShares" ? "block" : "none" }}>
                <h1>Split By Shares</h1>
                {selectedSplitters.map((member, index) => {
                  const [userID, name] = member;
                  return (
                    <div
                      key={`${userID}-${index}`} // Combine userID and index for uniqueness
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                    >
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <label className="text-right">
                        <input type="text" className="input-exact-amount" />
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="Split-By-Adjustment" style={{ display: activeContainer === "splitAdjustment" ? "block" : "none" }}>
                <h1>Split By Adjustment</h1>
                {selectedSplitters.map((member, index) => {
                  const [userID, name] = member;
                  return (
                    <div
                      key={`${userID}-${index}`} // Combine userID and index for uniqueness
                      className="split-equally-btn flex items-center justify-between border p-2 rounded-md mb-2"
                    >
                      <label htmlFor={userID} className="flex-1 text-center">
                        {name}
                      </label>
                      <label className="text-right">
                        <input type="text" className="input-exact-amount" />
                      </label>
                    </div>
                  );
                })}
              </div>
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 text-left">
                  <label>Total Amount</label>
                </div>
                <div className="text-right">
                  {totalAmount}.00
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-2">
          <button className="px-4 py-2 bg-green-700 border border-gray-300 rounded-md hover:bg-gray-200">Submit</button>
          <button className="px-4 py-2 bg-red-600 border border-gray-300 rounded-md hover:bg-gray-200" >Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseComponent;

