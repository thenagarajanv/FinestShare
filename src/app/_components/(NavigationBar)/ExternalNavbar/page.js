"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ExternalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <div
          className="flex-shrink-0"
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)} 
        >
            <div className="flex font-basement align-middle items-center text-center uppercase justify-center text-white  text-xl font-extrabold">
              Finest
            <img
            id="logo"
            src="/img/pnglogo.png"
            className={` h-[50px] cursor-pointer`}
            onClick={() => router.push("/")}
            alt="Logo"
            />
            SHARE
            </div>
          
        </div>
          <div className="hidden md:flex flex-col md:flex-row gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md"
              >
                Log Out
              </button>
            ) : (
              <>
                <a
                  href="/auth/signup"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-md"
                >
                  Sign Up
                </a>
                <a
                  href="/auth/login"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-md"
                >
                  Log In
                </a>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-600 hover:text-purple-600 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* <a href="#features" className="block text-gray-600 hover:text-purple-600 font-medium">
              Features
            </a>
            <a href="#about" className="block text-gray-600 hover:text-purple-600 font-medium">
              About
            </a>
            <a href="#contact" className="block text-gray-600 hover:text-purple-600 font-medium">
              Contact
            </a> */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md text-left"
              >
                Log Out
              </button>
            ) : (
              <>
                <a href="/auth/signup" className="block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md">
                  Sign Up
                </a>
                <a href="/auth/login" className="block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md">
                  Log In
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default ExternalNavbar;
