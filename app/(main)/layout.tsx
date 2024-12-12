"use client";

import Link from "next/link";
import Header from "@/app/components/header";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/@types/AuthContextTypes";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated } = useAuth() as AuthContextType;
  return (
    <div className="h-full flex flex-col">
      {isAuthenticated ? (
        <>
          <Header />
          <main className="flex-1">{children}</main>
        </>
      ) : (
        <div className="m-4">{(window.location.href = "/login")}</div>
      )}
    </div>
  );
}
