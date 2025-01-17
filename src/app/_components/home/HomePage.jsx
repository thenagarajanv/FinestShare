"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/_components/(NavigationBar)/ExternalNavbar/page.js"

const HomePage = () => {
  const [state, setState] = useState({
    selectedItem: {
      itemsName: "on Trip",
      itemsImage: "/img/trip.png",
      textColor: "8656CD",
    },
    items: [
      {
        itemsName: "on Trips",
        itemsImage: "/img/trip.png",
        textColor: "1CC29F",
      },
      {
        itemsName: "with Housemates",
        itemsImage: "/img/home.png",
        textColor: "8656CD",
      },
      {
        itemsName: "with your Partner",
        itemsImage: "/img/heart.png",
        textColor: "A6002F",
      },
      {
        itemsName: "with anyone",
        itemsImage: "/img/family.png",
        textColor: "FF5733",
      },
    ],
  });

  const handleItemClick = (item) => {
    setState((prevState) => ({
      ...prevState,
      selectedItem: item,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main
        className="flex flex-col-reverse lg:flex-row items-center lg:justify-center flex-grow max-w-7xl w-full px-6 mx-auto"
        style={{
          backgroundImage: "url('/iceimage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80vh",
        }}
      >
        <div className="text-center lg:text-left lg:w-1/2 mt-8 lg:mt-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Less stress when<br />sharing expenses
          </h1>
          <h1
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: `#${state.selectedItem.textColor}` }}
          >
            <span style={{ color: `#${state.selectedItem.textColor}` }}>
              {state.selectedItem.itemsName}.
            </span>
          </h1>
          <div className="flex justify-center lg:justify-start mt-4 mb-4 space-x-4 flex-wrap">
            {state.items.map((item, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-full shadow-md border-2 border-gray-200 hover:border-purple-600 focus:outline-none"
                onClick={() => handleItemClick(item)}
                style={{
                  borderColor:
                    state.selectedItem.itemsName === item.itemsName
                      ? `#${item.textColor}`
                      : "",
                }}
              >
                <Image
                  src={item.itemsImage}
                  alt={item.itemsName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span
                  className="text-sm mt-2 font-medium text-center"
                  style={{ color: `#${item.textColor}` }}
                >
                </span>
              </button>
            ))}
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Keep track of your shared expenses and balances with housemates,
            trips, groups, friends, and family.
          </p>
          <a
            href="/auth/signup"
            className="px-6 py-3 text-lg text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md"
          >
            Sign up
          </a>
          <div className="mt-4 text-gray-600 text-sm">
            Free for <span className="font-medium">iPhone</span>,{" "}
            <span className="font-medium">Android</span>, and{" "}
            <span className="font-medium">web</span>.
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0 z-50">
          <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96">
            <Image
              src={state.selectedItem.itemsImage}
              alt={state.selectedItem.itemsName}
              className="w-full h-full object-contain"
              width={600}
              height={600}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

