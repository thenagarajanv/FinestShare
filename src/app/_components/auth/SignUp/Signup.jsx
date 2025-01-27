'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const BasicAuthSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleTermsAndConditions = () =>{
    router.push("/auth/TermsAndConditions");
  }

  const handleMoveLogin = () => {
    router.push("/auth/login");
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://finestshare-backend.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful! Redirecting to login page...');
        router.push('/auth/login'); 
      } else {
        alert(data.message || 'Signup failed');
        console.error(data);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div suppressHydrationWarning>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="dummy@gmail.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mr-2"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-900 dark:text-white"
            >
              I accept the{" "}
              <a onClick={handleTermsAndConditions} className="text-blue-500 hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>
          <button
            disabled={!acceptedTerms}
            type="submit"
            className={`${
              acceptedTerms
                ? "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}
          >
            Sign Up
          </button>
        </form>
        <div className='pt-4'>
          <label>Already have an account? </label>
          <a className='text-blue-600 cursor-pointer' onClick={() => handleMoveLogin()}>Login</a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BasicAuthSignup;