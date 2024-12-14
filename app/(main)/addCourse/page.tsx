"use client";

import { useState } from "react";

/**
 * A page component that allows users to add a new course by entering
 * a course name. It includes a form with validation to ensure that the
 * course name is provided before submission. Upon successful submission,
 * the course is added to the backend, and the user is redirected to the
 * homepage. Feedback messages are displayed to indicate success or failure
 * of the operation.
 */

/**
 * AddCoursePage is a React component that renders a form for adding a new course.
 * It includes input validation to ensure the course name is provided before submission.
 * Successful submissions send a POST request to the backend to add the course.
 * Feedback messages indicate the success or failure of the operation, and the user
 * is redirected to the homepage upon successful addition.
 */

/**
 * A React component that renders a form for adding a new course.
 * It includes input validation to ensure the course name is provided before submission.
 * Successful submissions send a POST request to the backend to add the course.
 * Feedback messages indicate the success or failure of the operation, and the user
 * is redirected to the homepage upon successful addition.
 */

export default function AddCoursePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");



/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handles the form submission for adding a new course.
   * Prevents default form submission behavior, validates that
   * the course name is provided, and sends a POST request to
   * the backend to add the course. Displays a success message
   * and redirects to the homepage if the addition is successful;
   * otherwise, displays an error message. Logs and displays an
   * error message if a network or other error occurs during the
   * process.
   *
   * @param e - The form event triggered by the submission
   */

/******  b500b6d7-a7c1-4d43-896b-93813c2c9de9  *******/
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
        window.location.href = "/";
      } else {
        setMessage("Failed to add course. Please try again.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto mt-10 p-6 border rounded shadow-lg">
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
