"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquarePlus, Trash2 } from "lucide-react";

import EvaluationCard from "@/app/components/EvaluationCard";

// Define the Evaluation interface
interface Evaluation {
  id?: number; // Optional since dynamic cards don't have an ID initially
  ucId?: number; // Optional for new cards
  name?: string;
  type?: string;
  weight?: number;
  date?: string;
  roomId?: number;
}

export default function Page() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const ucId = params.ucId as string;

  // Fetch existing evaluations from the server
  useEffect(() => {
    async function fetchEvaluations() {
      try {
        const response = await fetch(
          `http://localhost:8080/evaluation/get?ucId=${ucId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch evaluations");
        }

        const data = await response.json();
        console.log("Fetched evaluations:", data);
        setEvaluations(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching evaluations");
        setLoading(false);
        console.error(err);
      }
    }

    if (ucId) {
      fetchEvaluations();
    }
  }, [ucId]);

  // Handle adding new evaluation cards dynamically
  const handleAddEvaluation = () => {
    const newEvaluation: Evaluation = {
      id: Date.now(), // Use a unique identifier for dynamic cards
    };
    setEvaluations((prev) => [...prev, newEvaluation]);
  };

  // Handle removing evaluation cards
  const handleRemoveEvaluation = (id: number | undefined) => {
    if (id) {
      setEvaluations((prev) =>
        prev.filter((evaluation) => evaluation.id !== id)
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="text-2xl font-bold">UC Evaluations</h1>
      <Link href={`/close/${ucId}`}>
        <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
          <SquarePlus /> Close this UC
        </Button>
      </Link>
      <div className="h-full w-full bg-red-0 p-4">
        <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Render evaluations */}
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="">
              <EvaluationCard evaluation={evaluation} />
              {/* Remove button */}
              <div className="mt-4 px-2">
                <Button
                  onClick={() => handleRemoveEvaluation(evaluation.id)}
                  className="w-full bg-red-400 hover:bg-red-500 text-white rounded"
                >
                  Remove Evaluation
                </Button>
              </div>
            </div>
          ))}

          {/* Button to create another evaluation */}
          <div className="flex items-center justify-center col-span-full mt-[10rem]">
            <Button
              onClick={handleAddEvaluation}
              className="bg-blue-400 hover:bg-blue-500 h-12 px-6"
            >
              <SquarePlus /> Create another Evaluation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
