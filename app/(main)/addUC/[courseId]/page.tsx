"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

/**
 * Page for adding a new UC.
 *
 * @remarks
 * This page is responsible for allowing the user to add a new UC to a course.
 * It renders a form with the required inputs and handles the submission of the form.
 * If the submission is successful, it redirects to the course page.
 * If the submission fails, it displays an error message.
 */
export default function AddUCPage() {
  const [name, setName] = useState("");
  const [ano, setAno] = useState<number | null>(null);
  const [semestre, setSemestre] = useState<number | null>(null);
  const [tipo, setTipo] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [message, setMessage] = useState("");

  const { courseId } = useParams(); // Get the courseId from the URL params

  /**
   * Handles the submission of the UC form.
   *
   * @remarks
   * Validates the inputs and sends a POST request to the server to add the UC.
   * If the request is successful, clears the form and redirects to the course page.
   * If the request fails, displays an error message.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name.trim()) {
      setMessage("UC name is required.");
      return;
    }
    if (ano === null) {
      setMessage("Year (ano) is required.");
      return;
    }
    if (semestre === null) {
      setMessage("Semester (semestre) is required.");
      return;
    }
    if (!tipo) {
      setMessage("Tipo (type) is required.");
      return;
    }
    if (!mandatory) {
      setMessage("Mandatory is required.");
      return;
    }

    try {
      const uc = {
        courseId: courseId,
        name,
        ano,
        semestre,
        tipo,
        mandatory,
      };

      const response = await fetch("http://localhost:8080/uc/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uc),
      });

      if (response.ok) {
        setMessage("UC added successfully!");
        setName(""); // Clear the form
        setAno(null);
        setSemestre(null);
        setTipo("");
        setMandatory(false);
        window.location.href = `/course/${courseId}`;
      } else {
        setMessage("Failed to add UC. Please try again.");
      }
    } catch (error) {
      console.error("Error adding UC:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto mt-10 p-6 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Add a New UC</h1>

      {message && (
        <div
          className={`p-3 mb-4 text-sm rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* UC Name */}
        <div>
          <label htmlFor="ucName" className="block text-sm font-medium">
            UC Name
          </label>
          <input
            id="ucName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter UC name"
            className="mt-1 w-full p-2 border rounded"
          />
        </div>

        {/* Year (ano) */}
        <div>
          <label className="block text-sm font-medium">Ano (Year)</label>
          <div className="flex gap-4">
            {[1, 2, 3].map((year) => (
              <label key={year} className="inline-flex items-center">
                <input
                  type="radio"
                  name="ano"
                  value={year}
                  checked={ano === year}
                  onChange={() => setAno(year)}
                  className="mr-2"
                />
                {year}
              </label>
            ))}
          </div>
        </div>

        {/* Semester (semestre) */}
        <div>
          <label className="block text-sm font-medium">
            Semestre (Semester)
          </label>
          <div className="flex gap-4">
            {[1, 2].map((sem) => (
              <label key={sem} className="inline-flex items-center">
                <input
                  type="radio"
                  name="semestre"
                  value={sem}
                  checked={semestre === sem}
                  onChange={() => setSemestre(sem)}
                  className="mr-2"
                />
                {sem}
              </label>
            ))}
          </div>
        </div>

        {/* Tipo (Type) */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium">
            Tipo (Type)
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select Tipo
            </option>
            <option value="mixed">Mixed</option>
            <option value="continuous">Continuous</option>
          </select>
        </div>

        {/* Tipo (Type) */}
        <div>
          <label htmlFor="mandatory" className="block text-sm font-medium">
            Mandatory
          </label>
          <select
            id="mandatory"
            value={mandatory ? "true" : "false"}
            onChange={(e) => setMandatory(e.target.value === "true")}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-500"
        >
          Add UC
        </button>
      </form>
    </div>
  );
}
