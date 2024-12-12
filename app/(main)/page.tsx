"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import CourseCard from "../components/courseCard";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/@types/AuthContextTypes";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth() as AuthContextType;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let response;

        if (user.role === "admin") {
          response = await fetch("http://localhost:8080/course/getAll");
        } else {
          response = await fetch(
            `http://localhost:8080/userPermissionCourse/getCourses/${user.id}`
          );
        }

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
  }, [user]);

  return (
    <div>
      <main className="m-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="font-medium">
          <span className="text-3xl font-bold">UPT</span>
          <br /> <span className="text-xl italic">&emsp;Your Courses</span>
        </h1>

        {user.role === "admin" && (
          <Link href="/addCourse">
            <Button className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2">
              <SquarePlus /> Add a new Course
            </Button>
          </Link>
        )}

        {/* Error and Loading States */}
        {loading && (
          <Image
            src="/loading.svg"
            alt="Loading"
            width={75}
            height={75}
            className="w-auto h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
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
