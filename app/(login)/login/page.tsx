"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AuthContext {
  login: (username: string, password: string) => Promise<boolean>;
}

/**
 * This component renders a login form with a logo, input fields for username
 * and password, a submit button, and displays an error message if the login
 * attempt fails. If the login attempt succeeds, it redirects the user to the
 * home page.
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth() as AuthContext;

/**
 * Handles the form submission for the login process.
 * 
 * @param e - The event object from the form submission, used to prevent the default action.
 * 
 * This function attempts to log in the user using the provided username and password. 
 * If the login is successful, the user is redirected to the home page. 
 * If the login fails, an error message is displayed.
 */

/**
 * Handles the form submission for the login process.
 * 
 * @param e - The event object from the form submission, used to prevent the default action.
 * 
 * This function attempts to log in the user using the provided username and password. 
 * If the login is successful, the user is redirected to the home page. 
 * If the login fails, an error message is displayed.
 */

  /**
   * Handles the form submission for the login process.
   * 
   * @param e - The event object from the form submission, used to prevent the default action.
   * 
   * This function attempts to log in the user using the provided username and password. 
   * If the login is successful, the user is redirected to the home page. 
   * If the login fails, an error message is displayed.
   */
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    const success = await login(username, password);
    if (success) {
      window.location.href = "/";
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="bg-[#e8ecfc]">
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex justify-center items-center gap-[6rem] shadow-md border-t-2 border-b-2 border-sky-500 bg-white p-[4rem] w-full">
          <Image
            src="/Logoinstitucional-PT-HE-cor-positivo.png"
            alt="Logo"
            width={150}
            height={150}
            draggable={false}
            className="w-auto h-auto"
          />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-4"
          >
            {error && <div className="text-red-500">{error}</div>}
            <label htmlFor="username">
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="border px-3 py-2 mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label htmlFor="password">
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="border px-3 py-2 mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <Button
              type="submit"
              className="w-full transition mt-4 bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
