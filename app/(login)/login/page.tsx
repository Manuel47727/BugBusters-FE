import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function Login() {
  return (
    <div className="bg-[#e8ecfc]">
      <div className="flex justify-center items-center min-h-screen">
        {/* Container with border and padding */}
        <div className="flex justify-center items-center gap-[6rem] shadow-md border-t-2 border-b-2 border-sky-500 bg-white p-[4rem] w-full">
          <Image
            src="/Logoinstitucional-PT-HE-cor-positivo.png"
            alt="Logo"
            width={150}
            height={150}
            draggable={false}
            className="w-auto h-auto"
          />
          <form className="flex flex-col justify-center items-center gap-4">
            <label htmlFor="username">
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="border px-3 py-2 mt-1"
              />
            </label>
            <label htmlFor="password">
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="border px-3 py-2 mt-1"
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
