"use client";

import { useState } from "react";

export default function AddCoursePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Course name is required.");
      return;
    }

    try {
      const course = { courseName: name }; // Backend expects `courseName`
      const response = await fetch("http://localhost:8080/course/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        setMessage("Course added successfully!");
        setName(""); // Clear the form
      } else {
        setMessage("Failed to add course. Please try again.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Add a New Course</h1>

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
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium">
            Course Name
          </label>
          <input
            id="courseName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name"
            className="mt-1 w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-500"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}
