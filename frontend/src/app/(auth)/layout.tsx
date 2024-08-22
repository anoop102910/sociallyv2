"use client";
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
  if (isAuthenticated) router.push("/");
  return children;
}
