"use client";
import React, { useState, useEffect } from "react";

const InnerNavbar = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <div
          className="flex-shrink-0"
          onMouseEnter={() => setIsHovering(true)} 
          onMouseLeave={() => setIsHovering(false)} 
        >
          {isHovering ? (
            <img
            src="/img/logoimg.png"
            className="h-[50px] cursor-pointer"
            onClick={() => router.push("/")}
            alt="Logo"
          />
          ) : (
            <video
              src="/video/logovideo.mp4" 
              className="h-[50px] cursor-pointer"
              autoPlay
              loop
              muted
              onClick={() => router.push("/")}
            ></video>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
};

export default InnerNavbar;
