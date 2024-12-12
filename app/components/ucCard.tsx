import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Link from "next/link";

interface UC {
  id: number;
  name: string;
  semestre: number;
  ano: number;
  tipo: string;
  mandatory: boolean;
  ucclosed: boolean;
}

export default function UcCard({ uc }: { uc: UC }) {
  function abbreviateName(name: string): string {
    return name
      .split(" ") // Split the name into words
      .filter((word) => word.length >= 3) // Ignore words with less than 3 letters
      .map((word) => word[0].toUpperCase()) // Take the first letter of each word
      .join(""); // Join them together
  }

  return (
    <Link href={`/uc/${uc.id}?courseName=${uc.name}&ucType=${uc.tipo}`}>
      <div className="border border-sky-500 rounded shadow-md hover:bg-sky-100 transition">
        <div className="relative w-full bg-sky-500 text-white flex items-center">
          <div className="absolute bg-blue-500 h-full w-16 flex items-center justify-center">
            <h1 className="text-lg font-bold">{abbreviateName(uc.name)}</h1>
          </div>
          <div className="w-full mr-6 flex items-center justify-between">
            <h1 className="ml-16 p-4">{uc.name}</h1>

            <p
              className={`${
                uc.ucclosed
                  ? "bg-red-100 text-red-400"
                  : "bg-green-100 text-green-400"
              } px-6 py-1 rounded-full`}
            >
              {uc.ucclosed ? "Closed" : "Open"}
            </p>
          </div>
        </div>
        <div className="px-4 py-1 flex gap-4 justify-between text-sm">
          <p>
            Year: <span className="font-bold">{uc.ano}</span>
          </p>
          <p>
            Semester: <span className="font-bold">{uc.semestre}</span>
          </p>
          <p>
            Type: <span className="font-bold">{uc.tipo}</span>
          </p>
          <p>
            Mandatory:{" "}
            <span className="font-bold">{uc.mandatory ? "Yes" : "No"}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
