"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface UC {
  id: number;
  name: string;
  semestre: number;
  ano: number;
  tipo: string;
  mandatory: boolean;
  ucclosed: boolean;
}

/**
 * Page for editing a UC.
 *
 * This page is protected by authentication, so only authenticated users can
 * access it. When the page is loaded, it fetches the UC with the given ID from
 * the backend and pre-fills the input fields with its data. If the fetch fails,
 * it displays an error message.
 *
 * The page contains a form with input fields for the UC's name, year, semester,
 * type, and mandatory status. It also contains a submit button. When the form
 * is submitted, it sends a PUT request to the backend with the updated UC data.
 * If the request is successful, it displays a success message and navigates
 * back to the previous page. If the request fails, it displays an error message.
 */
export default function EditUCPage() {
  const [uc, setUc] = useState<UC | null>(null);
  const [name, setName] = useState("");
  const [ano, setAno] = useState<number | null>(null);
  const [semestre, setSemestre] = useState<number | null>(null);
  const [tipo, setTipo] = useState("");
  const [mandatory, setMandatory] = useState("");
  const [message, setMessage] = useState("");

  const params = useParams();
  const ucId = parseInt(params.ucId as string, 10);

  useEffect(() => {
    if (!ucId) return;

    const fetchUC = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/uc/getUC?ucId=${ucId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch UC details.");
        }
        const data: UC = await response.json();
        setUc(data);

        // Pre-fill inputs with existing UC data
        setName(data.name);
        setAno(data.ano);
        setSemestre(data.semestre);
        setTipo(data.tipo);
        setMandatory(data.mandatory ? "true" : "false");
      } catch (error) {
        console.error("Error fetching UC:", error);
        setMessage("Failed to load UC details. Please try again later.");
      }
    };

    fetchUC();
  }, [ucId]);

  /**
   * Handles the submission of the edit UC form.
   *
   * This function is called when the user submits the form. It first validates
   * the input fields. If any of the fields are invalid, it displays an error
   * message and returns. If all fields are valid, it sends a PUT request to the
   * backend with the updated UC data. If the request is successful, it displays
   * a success message and navigates back to the previous page. If the request
   * fails, it displays an error message.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setMessage("Mandatory selection is required.");
      return;
    }

    try {
      const updatedUC = {
        name,
        ano,
        semestre,
        tipo,
        mandatory: mandatory === "true",
      };

      const response = await fetch(
        `http://localhost:8080/uc/edit?ucId=${ucId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUC),
        }
      );

      if (response.ok) {
        setMessage("UC updated successfully!");
        window.history.back();
      } else {
        setMessage("Failed to update UC. Please try again.");
      }
    } catch (error) {
      console.error("Error updating UC:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!uc) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {message ? <p>{message}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto mt-10 p-6 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Edit UC</h1>

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
            Name
          </label>
          <input
            id="ucName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>

        {/* Year (ano) */}
        <div>
          <label className="block text-sm font-medium">Year</label>
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
          <label className="block text-sm font-medium">Semester</label>
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
            Type
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

        {/* Mandatory */}
        <div>
          <label htmlFor="mandatory" className="block text-sm font-medium">
            Mandatory
          </label>
          <select
            id="mandatory"
            value={mandatory}
            onChange={(e) => setMandatory(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select Mandatory
            </option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-500"
        >
          Update UC
        </button>
      </form>
    </div>
  );
}
