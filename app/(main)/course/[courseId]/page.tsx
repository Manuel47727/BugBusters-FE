"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import UcCard from "@/app/components/ucCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";

interface UC {
  id: number;
  name: string;
  semestre: number;
  ano: number;
  tipo: string;
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

        const data = await response.json();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="text-2xl font-bold">{courseName}</h1>
      <Link href={`/addUC/${courseId}`}>
        <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
          <SquarePlus /> Add a new UC
        </Button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {ucs.map((uc) => (
          <UcCard key={uc.id} uc={uc} />
        ))}
      </div>
    </div>
  );
}
