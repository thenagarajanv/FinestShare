"use client";

import InternalNavbar from '@/app/_components/(NavigationBar)/InternalNavbar/page';
import React, { useState } from 'react';

const ExpenseComponent = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [isHidden, setIsHidden] = useState(true);
  const [isMultiple, setIsMultiple] = useState(true);
  const [isEqual, setIsEqual] = useState(true); 
  const [selectedSplit, setSelectedSplit] = useState('');

  const handleToggle = (type) => {
    if (type === "multiple") {
      setIsMultiple(!isMultiple);
      setIsEqual(true); 
    } else if (type === "equal") {
      setIsEqual(!isEqual);
      setIsMultiple(true);
    }
  };

  const handleAddGroup = () => {
    if (groupName.trim() !== '') {
      setGroupList([...groupList, groupName]);
      setGroupName('');
    }
  };

  const handleDeleteGroup = (index) => {
    const updatedList = groupList.filter((_, i) => i !== index);
    setGroupList(updatedList);
  };

  const handleSplitExpenseOpen = () => {
    setIsHidden(!isHidden);
  };

  const handleSplitOptionClick = (splitType) => {
    setSelectedSplit(prevSplit => prevSplit === splitType ? '' : splitType);
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
                <div className="flex items-center gap-2 w-full sm:w-auto max-w-md">
                  <input
                    id="groupInput"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter Email Address"
                  />
                  <button
                    onClick={handleAddGroup}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add
                  </button>
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
                  multiple people
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
                  Choose Player
                </h2>
              </div>
            </div>
            <div className="container-2" style={{ display: isEqual ? 'none' : 'block' }}>
              <div className="container-outer-top-range">
                <h2 className="text-xl font-bold bg-cyan-400 p-2 text-white rounded-md">
                  Choose split options
                </h2>
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
                <div className='all-btn' style={{ display: isHidden ? "none" : "block" }}>
                  <div className='types-of-expense-component flex justify-center items-center'>
                    <button onClick={() => handleSplitOptionClick('Equally')}>Split Equally</button>
                    <button onClick={() => handleSplitOptionClick('Exact Amount')}>Split by Exact Amount</button>
                    <button onClick={() => handleSplitOptionClick('Percentage')}>Split by Percentage</button>
                    <button onClick={() => handleSplitOptionClick('Shares')}>Split by Shares</button>
                    <button onClick={() => handleSplitOptionClick('Adjustment')}>Split by Adjustment</button>
                    <button onClick={() => handleSplitOptionClick('Reimbursement')}>Reimbursement</button>  
                  </div>
                </div>
                <div className='container-btn-changes'>
                  {selectedSplit && (
                    <div>
                      <h3>{selectedSplit}</h3>
                      <p>Content for {selectedSplit} split option goes here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseComponent;
