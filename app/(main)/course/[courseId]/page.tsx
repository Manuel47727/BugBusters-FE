"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import UcCard from "@/app/components/ucCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, SquarePlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UC {
  id: number;
  name: string;
  semestre: number;
  ano: number;
  tipo: string;
  mandatory: boolean;
  ucclosed: boolean;
}

export default function Page() {
  const [ucs, setUcs] = useState<UC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const courseId = params.courseId;

  const searchParams = useSearchParams();
  const courseName = searchParams.get("courseName");

  useEffect(() => {
    async function fetchUCs() {
      try {
        const response = await fetch(
          `http://localhost:8080/uc/current?courseId=${courseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch UC details");
        }

        let data = await response.json();
        data = data.sort((a: UC, b: UC) => a.ano - b.ano);
        setUcs(data); // Set multiple UCs if the endpoint returns a list

        setLoading(false);
      } catch (err) {
        setError("Error fetching UC details");
        setLoading(false);
        console.error(err);
      }
    }

    if (courseId) {
      fetchUCs();
    }
  }, [courseId]);

  // Check if all UCs are closed
  const allClosed = ucs.every((uc) => uc.ucclosed);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="font-medium">
        <span className="text-3xl font-bold">UCs</span>
        <br /> <span className="text-xl italic">&emsp;{courseName}</span>
      </h1>
      <div className="flex gap-4">
        <Link href={`/addUC/${courseId}`}>
          <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
            <SquarePlus /> Add a new UC
          </Button>
        </Link>

        {/* Conditionally render Link if all UCs are closed */}
        {allClosed ? (
          <Link href={`/`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
                      <Download /> Download {courseName} Map
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>All UCs must be closed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Download /> Download {courseName} Map
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>All UCs must be closed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {ucs.map((uc) => (
          <UcCard key={uc.id} uc={uc} />
        ))}
      </div>
    </div>
  );
}
