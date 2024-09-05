"use client";
import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) router.push("/auth/login");
  
  return (
    <>
      <div>
        <Navbar />
        <div className="flex gap-8 pt-4 relative">
          <Sidebar />
          <div className=" flex-[5]"> {children}</div>
        </div>
      </div>
    </>
  );
}
