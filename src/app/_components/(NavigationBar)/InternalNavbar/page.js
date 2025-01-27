"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const InternalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  
  const router = useRouter();

  const getPath = usePathname().split("/").pop(0);
  console.log(getPath);

  useEffect(() =>{
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const test = async () => await fetch("https://finestshare-backend.onrender.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserName(data.user.name);
          setProfileImage(data.user.image);
          setUserRole(data.user.role); 
        })
        .catch((error) => console.error("Error fetching user data:", error));
        test();
    } else {
      setIsLoggedIn(false);
    }
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
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <div
          className=" lg:hidden">
        </div>
        <div
          className="flex-shrink-0"
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)} 
        >
          <div  onClick={() => router.push("/")} className="flex align-middle items-center leading-0   text-center uppercase justify-center text-white  text-xl font-extrabold">
              Finest
            <Image
            width={200}
            height={200}
            id="logo"
            src="/img/pnglogo.png"
            className={` h-12 w-12  cursor-pointer`}
            onClick={() => router.push("/")}
            alt="Logo"
            />
           

            SHARE
           
            </div>
        </div>

          <div className="hidden md:flex flex-col md:flex-row gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-md"
                >
                  <Image
                    src={profileImage || "/img/heart.png"} 
                    width={200}
                    height={200}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  
                  {userName} ▼
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                    {userRole.toLowerCase() === "admin" && (
                      <a
                        href="/admin"
                        className={"block px-4 py-2 text-gray-700 hover:bg-gray-100 ${}"} 
                      >
                        Admin Dashboard
                      </a>
                    )}
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/account/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md text-left"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/auth/signup"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md"
                >
                  Sign Up
                </a>
                <a
                  href="/auth/login"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md"
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
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <div className="space-y-1">
                <a
                  href="/account/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Your Account
                </a>
                {userRole.toLowerCase() === "admin" && (
                  <a 
                    href="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md text-left"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/auth/signup"
                  className="block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md"
                >
                  Sign Up
                </a>
                <a
                  href="/auth/login"
                  className="block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md"
                >
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

export default InternalNavbar;
