"use client";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";

const InnerNavbar = () => {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  return (
  <div className="p-2 overflow-y-scroll h-screen">
      <nav className="bg-gray-800 shadow-md  top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16" onClick={() => router.push("/")}>
        <div
          className="flex-shrink-0"
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)} 
        >
          <div className="flex align-middle items-center text-center uppercase justify-center text-white font-mono text-xl font-extrabold">
              Finest
            <img
            id="logo"
            src="/img/pnglogo.png"
            className={` h-[50px] cursor-pointer`}
            onClick={() => router.push("/")}
            alt="Logo"
            />
            coder
            </div>
        </div>
        </div>
      </div>
    </nav>
  </div>
  );
};

export default InnerNavbar;
