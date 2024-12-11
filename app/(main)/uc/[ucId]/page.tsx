"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";

import EvaluationCard from "@/app/components/EvaluationCard";

interface Evaluation {
  id?: number;
  ucId: number;
  type?: string;
  weight?: number;
  date?: string;
  roomId?: number;
  studentNum?: number;
  needComputer?: boolean;
}

export default function Page() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null); // Form error state

  const params = useParams();
  const ucId = parseInt(params.ucId as string, 10);

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

  const handleAddEvaluation = () => {
    const newEvaluation: Evaluation = {
      id: Date.now(),
      ucId,
    };
    setEvaluations((prev) => [...prev, newEvaluation]);
  };

  const handleRemoveEvaluation = (id: number | undefined) => {
    if (id) {
      setEvaluations((prev) =>
        prev.filter((evaluation) => evaluation.id !== id)
      );
    }
  };

  const handleUpdateEvaluation = (
    id: number | undefined,
    updatedEvaluation: Partial<Evaluation>
  ) => {
    setEvaluations((prev) =>
      prev.map((evaluation) =>
        evaluation.id === id
          ? { ...evaluation, ...updatedEvaluation }
          : evaluation
      )
    );
  };

  const prepareEvaluationsForSubmission = (evaluations: Evaluation[]) => {
    return evaluations.map(({ id, ...evaluation }) => ({
      date: evaluation.date,
      needComputer: evaluation.needComputer,
      roomId: evaluation.roomId,
      studentNum: evaluation.studentNum,
      type: evaluation.type,
      ucId: evaluation.ucId,
      weight: evaluation.weight,
    }));
  };

  // Check if all required fields are filled
  const validateForm = () => {
    for (const evaluation of evaluations) {
      if (
        !evaluation.type ||
        !evaluation.date ||
        !evaluation.roomId ||
        !evaluation.studentNum ||
        evaluation.needComputer === undefined ||
        evaluation.weight === undefined
      ) {
        setFormError("All fields are required for each evaluation.");
        return false;
      }
    }
    setFormError(null); // Clear form error if all fields are filled
    return true;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="text-2xl font-bold">UC Evaluations</h1>
      <div className="flex gap-4">
        <Link href={`/close/${ucId}`}>
          <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
            <SquarePlus /> Close this UC
          </Button>
        </Link>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!validateForm()) return; // Only submit if form is valid

            try {
              console.log("We are POSTING");
              const cleanedEvaluations =
                prepareEvaluationsForSubmission(evaluations);
              console.log(JSON.stringify(cleanedEvaluations));

              const response = await fetch(
                `http://localhost:8080/evaluation/save?ucId=${ucId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(cleanedEvaluations),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to save UC evaluations");
              }

              const data = await response.json();
              console.log("UC evaluations saved successfully:", data);

              alert("UC evaluations saved successfully!");
            } catch (err) {
              console.error("Error saving UC evaluations:", err);
              alert("Failed to save UC evaluations. Please try again.");
            }
          }}
        >
          {/* Display form error */}
          <Button
            type="submit"
            className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2"
          >
            <SquarePlus /> Save this UC
          </Button>
        </form>
        {formError && (
          <p className="text-red-500 content-center bg-red-100 px-4">
            {formError}
          </p>
        )}{" "}
      </div>
      <div className="h-full w-full bg-red-0 p-4">
        <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="">
              <EvaluationCard
                evaluation={evaluation}
                onUpdate={(updatedEvaluation) =>
                  handleUpdateEvaluation(evaluation.id, updatedEvaluation)
                }
              />
              <div className="mt-4 px-2">
                <Button
                  onClick={() => handleRemoveEvaluation(evaluation.id)}
                  className="w-full mb-10 bg-red-400 hover:bg-red-500 text-white rounded"
                >
                  Remove Evaluation
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center col-span-full mt-[2rem]">
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
