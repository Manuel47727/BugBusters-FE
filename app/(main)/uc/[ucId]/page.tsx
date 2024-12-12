"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LockOpen, SquarePlus, Lock, Pencil, Trash, Save } from "lucide-react";
import EvaluationCard from "@/app/components/EvaluationCard";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [isUCClosed, setIsUCClosed] = useState<boolean | null>(null);

  const params = useParams();
  const ucId = parseInt(params.ucId as string, 10);

  const searchParams = useSearchParams(); // Use useSearchParams to access the query string
  const ucName = searchParams.get("courseName"); // Get the courseName from the query params
  const ucType = searchParams.get("ucType");

  useEffect(() => {
    async function fetchUCClosedStatus() {
      try {
        const response = await fetch(
          `http://localhost:8080/uc/isUCClosed?ucId=${ucId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch UC status");
        }
        const data = await response.json();
        setIsUCClosed(data);
      } catch (err) {
        setError("Error fetching UC status");
        console.error(err);
      }
    }
    if (ucId) {
      fetchUCClosedStatus();
    }
  }, [ucId]);

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

  const handleToggleUCStatus = async (shouldClose: boolean) => {
    if (ucType === "continuous" && evaluations.length < 3) {
      setFormError(
        "UCs of type 'continuous' must have at least three evaluations."
      );
      return;
    } else if (ucType === "mixed" && evaluations.length != 2) {
      setFormError("UCs of type 'mixed' must have exactly two evaluations.");
      return;
    }
    try {
      const endpoint = shouldClose
        ? `http://localhost:8080/uc/close?ucId=${ucId}`
        : `http://localhost:8080/uc/open?ucId=${ucId}`;
      const response = await fetch(endpoint, { method: "POST" });

      if (!response.ok) {
        // If the response status is not 200, throw an error with the message from the backend
        const errorMessage = await response.text();
        setSuccessMessage(null);
        setFormError(errorMessage);
        return;
      }

      setIsUCClosed(shouldClose);
      setSuccessMessage(
        `UC successfully ${shouldClose ? "closed" : "opened"}!`
      );
      setError(""); // Clear any previous error messages
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Failed to ${shouldClose ? "close" : "open"} the UC.`);
      }
      console.error(err);
    }
  };

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

  const validateForm = () => {
    for (const evaluation of evaluations) {
      if (
        !evaluation.type ||
        !evaluation.date ||
        !evaluation.studentNum ||
        evaluation.needComputer === undefined ||
        evaluation.weight === undefined
      ) {
        setFormError("All fields are required for each evaluation.");
        return false;
      }
    }
    setFormError(null);
    return true;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="font-medium">
        <span className="text-3xl font-bold">Evaluations</span>
        <br /> <span className="text-xl italic">&emsp;{ucName}</span>
      </h1>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            if (isUCClosed !== null) {
              handleToggleUCStatus(!isUCClosed);
            } else {
              console.error("isUCClosed is null");
            }
          }}
          className={`bg-blue-400 hover:bg-blue-500 flex items-center gap-2 ${
            isUCClosed
              ? "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-400 hover:text-white hover:border-transparent"
              : ""
          }`}
        >
          {isUCClosed ? (
            <>
              <LockOpen className="h-6 w-6" />
              Open UC
            </>
          ) : (
            <>
              <Lock className="h-6 w-6" />
              Close UC
            </>
          )}
        </Button>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // Reset success message on validation failure
            if (!validateForm()) {
              setSuccessMessage(null);
              return;
            }

            if (evaluations.length === 0) {
              setFormError("At least one evaluation is required to save.");
              return;
            }

            const evaluationsWithNoRoom = evaluations.filter(
              (evaluation) => evaluation.roomId === undefined
            );
            if (evaluationsWithNoRoom.length > 0) {
              setEvaluations(
                evaluations.map((evaluation) =>
                  evaluationsWithNoRoom.includes(evaluation)
                    ? { ...evaluation, roomId: -1 }
                    : evaluation
                )
              );
            }

            try {
              const cleanedEvaluations =
                prepareEvaluationsForSubmission(evaluations);

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
                throw new Error("Failed to save evaluations");
              }

              // Reset form error on successful submission
              setFormError(null);
              setSuccessMessage("Evaluations saved successfully!");
            } catch (err) {
              console.error("Error saving evaluations:", err);
              setSuccessMessage(null); // Reset success message on error
              setError("Failed to save evaluations.");
            }
          }}
        >
          <Button
            type="submit"
            className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2"
          >
            <Save /> Save this UC
          </Button>
        </form>
        <Link href={`/uc/edit/${ucId}`}>
          <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
            <Pencil /> Edit UC Details
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2">
              <Trash /> Delete UC
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                UC and remove the data from our servers.
              </DialogDescription>
            </DialogHeader>
            <span className="mt-4 flex items-center gap-[1.5rem]">
              <Button
                className="bg-red-400 hover:bg-red-500 hover:bg-red-600 flex items-center gap-2"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:8080/uc/delete?ucId=${ucId}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to delete UC");
                    }

                    window.history.back();
                  } catch (err) {
                    console.error("Error deleting UC:", err);
                    setError("Failed to delete UC.");
                  }
                }}
              >
                Confirm
              </Button>
              <DialogClose className="hover:bg-gray-100 px-6 py-2 rounded-lg">
                Cancel
              </DialogClose>
            </span>
          </DialogContent>
        </Dialog>

        {(successMessage || formError) && (
          <p
            className={`px-4 content-center ${
              successMessage
                ? "text-green-500 bg-green-100"
                : "text-red-500 bg-red-100"
            }`}
          >
            {successMessage || formError}
          </p>
        )}
      </div>

      <div className="h-full w-full bg-red-0 p-4">
        <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="relative">
              {isUCClosed && (
                <div className="absolute inset-0   cursor-not-allowed flex items-center justify-center z-10"></div>
              )}
              <div className={`${isUCClosed ? "opacity-50" : "opacity-100"}`}>
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
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center col-span-full mt-4">
          <Button
            onClick={handleAddEvaluation}
            disabled={isUCClosed ?? false}
            className={`bg-blue-400 hover:bg-blue-500 h-12 px-6 ${
              isUCClosed ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <SquarePlus /> Create another Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
}
