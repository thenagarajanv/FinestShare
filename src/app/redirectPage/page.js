"use client"

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Suspense } from 'react';

const RedirectPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token set in localStorage:", token);

      const fetchUserRole = async () => {
        try {
          const response = await fetch("https://finestshare-backend.onrender.com/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Response data:", data);

            const role = data.user.role;
            console.log("Fetched role:", role);

            if (role.toLowerCase() === "admin") {
              console.log("Redirecting to /admin");
              router.push("/admin");
            } else {
              console.log("Redirecting to /dashboard");
              router.push("/dashboard");
            }
          } else {
            console.error("Failed to fetch user data:", response.statusText);
            router.push("/error");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.push("/error");
        }
      };

      fetchUserRole();
    } else {
      console.error("No token provided");
      router.push("/login");
    }
  }, [searchParams, router]);

  return <div suppressHydrationWarning>Loading...</div>;
};

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}> <RedirectPage suppressHydrationWarning /> </Suspense>;
}
