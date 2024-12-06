"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function AddUCPage() {
  const [name, setName] = useState("");
  const [ano, setAno] = useState<number | null>(null);
  const [semestre, setSemestre] = useState<number | null>(null);
  const [tipo, setTipo] = useState("");
  const [message, setMessage] = useState("");

  const { courseId } = useParams(); // Get the courseId from the URL params

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

    try {
      const uc = {
        courseId: courseId,
        name,
        ano,
        semestre,
        tipo,
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
      } else {
        setMessage("Failed to add UC. Please try again.");
      }
    } catch (error) {
      console.error("Error adding UC:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow-lg">
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
            <option value="">Select Tipo</option>
            <option value="mixed">Mixed</option>
            <option value="continuous">Continuous</option>
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
