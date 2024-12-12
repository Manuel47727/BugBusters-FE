"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";

// Define interfaces for our data types
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface Course {
  id: number;
  name: string;
  courseName?: string; // Sometimes APIs return courseName instead of name
  courseId?: number; // Sometimes APIs return courseId instead of id
}

interface UserPermissionCourse {
  userId: number;
  courseId: number;
}
interface Semester {
  id?: number;
  numSemester?: number;
  startDate: string;
  endDate: string;
}

export default function Settings() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add type annotations to state variables
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const [firstSemesterStartDate, setFirstSemesterStartDate] = useState("");
  const [firstSemesterEndDate, setFirstSemesterEndDate] = useState("");
  const [secondSemesterStartDate, setSecondSemesterStartDate] = useState("");
  const [secondSemesterEndDate, setSecondSemesterEndDate] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await fetch("http://localhost:8080/semester/getAll");
      if (response.ok) {
        const data: Semester[] = await response.json();
        console.log(data);
        // Correctly set dates for each semester
        setFirstSemesterStartDate(data[0].startDate);
        setFirstSemesterEndDate(data[0].endDate);
        setSecondSemesterStartDate(data[1].startDate);
        setSecondSemesterEndDate(data[1].endDate);
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setErrorMessage("Failed to fetch semesters.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/all");
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to fetch users.");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:8080/course/getAll");
      if (response.ok) {
        const data: Course[] = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setErrorMessage("Failed to fetch courses.");
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Clear any previous messages when selecting a user
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const handleAssignCourses = async () => {
    // Clear previous messages
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!selectedUser || selectedCourses.length === 0) {
      setErrorMessage("Please select a user and at least one course");
      return;
    }

    try {
      const promises = selectedCourses.map((courseId) => {
        const permission: UserPermissionCourse = {
          userId: selectedUser.id,
          courseId: courseId,
        };

        return fetch("http://localhost:8080/userPermissionCourse/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(permission),
        });
      });

      await Promise.all(promises);
      setSuccessMessage("Courses assigned successfully!");
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error assigning courses:", error);
      setErrorMessage("Error assigning courses.");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!username || !name || !email || !password || !role) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const user = { username, name, email, password, role };

    try {
      const response = await fetch("http://localhost:8080/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setSuccessMessage("User added successfully!");
        setUsername("");
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        // Refresh the users list
        fetchUsers();
      } else {
        setErrorMessage("Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage("Error adding user.");
    }
  };

  const handleSemesterUpdate = async (
    e: { preventDefault: () => void },
    semesterId: number
  ) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage(null);
    setErrorMessage(null);

    if (
      !firstSemesterStartDate ||
      !firstSemesterEndDate ||
      !secondSemesterStartDate ||
      !secondSemesterEndDate
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const semester = {
      id: semesterId,
      numSemester: semesterId,
      startDate:
        semesterId === 1 ? firstSemesterStartDate : secondSemesterStartDate,
      endDate: semesterId === 1 ? firstSemesterEndDate : secondSemesterEndDate,
    };

    try {
      const response = await fetch("http://localhost:8080/semester/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(semester),
      });

      if (response.ok) {
        setSuccessMessage("Semester updated successfully!");
        // Refresh the semesters
        fetchSemesters();
      } else {
        setErrorMessage("Failed to edit semester.");
      }
    } catch (error) {
      console.error("Error editing semester:", error);
      setErrorMessage("Error editing semester.");
    }
  };

  return (
    <div>
      <main className="m-10 flex flex-col gap-[6rem] row-start-2 items-center sm:items-start">
        <div className="flex gap-[2rem] w-full row-start-2 items-center sm:items-start ">
          {/* Keep existing user add form */}
          <div className="flex flex-col w-1/3">
            <h1 className="font-medium mb-4">
              <span className="text-3xl font-bold">Settings</span>
              <br /> <span className="text-xl italic">&emsp;Add User</span>
            </h1>

            {(successMessage || errorMessage) && (
              <p
                className={`ml-10 my-4 px-4 py-2 ${
                  successMessage
                    ? "text-green-500 bg-green-100"
                    : "text-red-500 bg-red-100"
                }`}
              >
                {successMessage || errorMessage}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="ml-10 flex flex-col p-4 gap-4 bg-gray-100"
            >
              <label htmlFor="username">
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border px-3 py-2 mt-1 w-full"
                />
              </label>
              <label htmlFor="name">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border px-3 py-2 mt-1 w-full"
                />
              </label>
              <label htmlFor="email">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-3 py-2 mt-1 w-full"
                />
              </label>
              <label htmlFor="password">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border px-3 py-2 mt-1 w-full"
                />
              </label>
              <label htmlFor="role">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border px-3 py-2 mt-1 w-full"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </label>
              <button
                type="submit"
                className="transition mt-4 bg-blue-400 text-white hover:bg-blue-500 font-medium py-2 px-4 rounded"
              >
                Add User
              </button>
            </form>
          </div>
          {/* Add Course Permissions Section */}
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-bold mb-4">Assign Courses to Users</h2>

            <div className="flex gap-8">
              {/* Users List */}
              <div className="flex-1">
                <h3 className="font-medium mb-2">Users</h3>
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`p-3 cursor-pointer hover:bg-gray-100 ${
                        selectedUser?.id === user.id ? "bg-blue-100" : ""
                      }`}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses List */}
              <div className="flex-1">
                <h3 className="font-medium mb-2">Courses</h3>
                <div className="border rounded-lg max-h-96 overflow-y-auto text-black">
                  {courses.map((course) => {
                    const courseId = course.id ?? course.courseId;
                    if (!courseId) return null; // or some other default value

                    return (
                      <div
                        key={courseId}
                        onClick={() => handleCourseToggle(courseId)}
                        className={`p-3 cursor-pointer hover:bg-gray-100 ${
                          selectedCourses.includes(courseId)
                            ? "bg-green-100"
                            : ""
                        }`}
                      >
                        {course.name || course.courseName}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              onClick={handleAssignCourses}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!selectedUser || selectedCourses.length === 0}
            >
              Assign Selected Courses
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="w-full text-xl font-medium italic mb-4">
            Edit Semester
          </h2>
          <div className="w-full flex gap-4">
            <div className="border flex-1 rounded-lg p-4 w-full">
              <h1 className="mb-4">Semester 1</h1>
              <div className="w-full flex justify-between items-center gap-4">
                <div className="w-full flex justify-between border border p-4">
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={firstSemesterStartDate}
                    onChange={(e) => setFirstSemesterStartDate(e.target.value)}
                  />
                </div>
                <div className="w-full flex justify-between border p-4">
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={firstSemesterEndDate}
                    onChange={(e) => setFirstSemesterEndDate(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={(e) => handleSemesterUpdate(e, 1)}
                className="w-full mt-4 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Save
              </Button>
            </div>
            <div className="border flex-1 rounded-lg p-4 w-full">
              <h1 className="mb-4">Semester 2</h1>
              <div className="w-full flex justify-between items-center gap-4">
                <div className="w-full flex justify-between border p-4">
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={secondSemesterStartDate}
                    onChange={(e) => setSecondSemesterStartDate(e.target.value)}
                  />
                </div>
                <div className="w-full flex justify-between border p-4">
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={secondSemesterEndDate}
                    onChange={(e) => setSecondSemesterEndDate(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={(e) => handleSemesterUpdate(e, 2)}
                className="w-full mt-4 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
