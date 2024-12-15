import React from "react";
import Image from "next/image";
import { BookMarked, House, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/@types/AuthContextTypes";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth() as AuthContextType;

  return (
    <header className="px-10 py-3 bg-[#e8ecfc] flex w-full border-b-2 border-sky-500 text-gray-500">
      <nav className="flex items-center justify-between w-full text-sm">
        {/* Container for logo and navigation links on the left */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div className="w-[150px]">
            <a href="/">
              <Image
                src="/Logoinstitucional-PT-HE-cor-positivo.png"
                alt="Logo"
                width={150}
                height={150}
                className="w-auto h-auto"
              />
            </a>
          </div>

          {/* Navigation links */}
          <ul className="flex gap-10 items-center">
            <li className="hover:text-blue-400">
              <a href="/" className="flex items-center gap-2">
                <BookMarked className="size-4" />
                My Courses
              </a>
            </li>
            {user?.role === "admin" && (
              <li className="hover:text-blue-400">
                <a href="/settings" className="flex items-center gap-2">
                  <Settings className="size-4" />
                  Settings
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Login button on the right */}
        <div className="mx-[-40px] my-[-12px] bg-sky-500 border-l-[2px] text-white border-sky-500 hover:bg-transparent flex justify-center items-center hover:text-gray-500 transition duration-100 ease-in-out">
          <button onClick={() => logout()} className="px-[3rem] py-[25px]">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
