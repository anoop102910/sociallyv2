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
  const { isAuthenticated, isLoading } = useAuthContext();
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
