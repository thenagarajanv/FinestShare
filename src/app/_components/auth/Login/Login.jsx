"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

async function auth(router) {
  try {
    window.location.href = "https://finestshare-backend.onrender.com/auth/google";
  } catch (error) {
    console.error("Error during authentication:", error);
    alert("An error occurred during Google authentication.");
  }
}

const BasicAuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://finestshare-backend.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        document.cookie = `token=${data.token}; path=/; secure; HttpOnly; max-age=86400`; 

        const roleResponse = await fetch("https://finestshare-backend.onrender.com/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          const role = roleData.user.role.toLowerCase();

          if (role === "admin") {
            alert("Logged in as Admin");
            router.push("/admin");
          } else {
            alert("Logged in successfully");
            router.push("/dashboard");
          }
        } else {
          console.error("Failed to fetch user role:", roleResponse.statusText);
          alert("Error determining user role.");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleLogin}>
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
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Log in
          </button>
          <div className="signinbtn flex justify-center p-2 mt-2 cursor-pointer">
            <img
              onClick={() => auth(router)}
              className="btn-auth"
              src="/img/btn_google_signin_dark_pressed_web.png"
              alt="Google Sign-In Button"
            />
          </div>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/auth/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default BasicAuthLogin;
