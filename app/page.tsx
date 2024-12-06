"use client";

import { useEffect, useState } from "react";
import Header from "./components/header";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import CourseCard from "./components/courseCard";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the courses from the API
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/course/getAll");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <main className="m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-xl font-bold">All Courses</h2>
        <Link href="/addCourse">
          <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
            <SquarePlus /> Add a new Course
          </Button>
        </Link>

        {/* Error and Loading States */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}
