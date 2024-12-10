"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EvaluationCardProps {
  evaluation: {
    id?: number;
    ucId?: number;
    name?: string;
    type?: string;
    weight?: number;
    date?: string;
    roomId?: number;
  };
}

interface Room {
  id: number;
  designation: string;
  type: string;
  capacity: number;
  location: string;
  roomNumName: string;
}

export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showRoomDashboard, setShowRoomDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfStudents, setNumberOfStudents] = useState<number | null>(null);
  const [needComputer, setNeedComputer] = useState<boolean>(false);
  const [examTime, setExamTime] = useState<string>("");

  // Fetch filtered rooms from the API
  const fetchRooms = async () => {
    if (!examTime || numberOfStudents === null || numberOfStudents <= 0) {
      setError("Please enter valid inputs for all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/room/getAvailableRooms?examTime=${encodeURIComponent(
          examTime
        )}&studentNum=${numberOfStudents}&needComputer=${needComputer}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data: Room[] = await response.json();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Could not fetch rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRooms = async () => {
    await fetchRooms();
    setShowRoomDashboard(true);
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoom(roomId);
    setShowRoomDashboard(false);
  };

  return (
    <div className="relative border border-sky-500 p-4 rounded shadow-md flex flex-col gap-2">
      <h1 className="text-lg font-medium">Evaluation</h1>

      <label htmlFor="evaluationType">Type:</label>
      <select name="evaluationType" className="border p-2 rounded w-full">
        <option value="Test">Test</option>
        <option value="Final Test in Exam Season">
          Final Test in Exam Season
        </option>
        <option value="Work developed throughout Semester">
          Work developed throughout Semester
        </option>
        <option value="Delivery of Work">Delivery of Work</option>
        <option value="Delivery of Group Work">Delivery of Group Work</option>
        <option value="Presentation of Work">Presentation of Work</option>
        <option value="Presentation of Group Work">
          Presentation of Group Work
        </option>
        <option value="Monography">Monography</option>
        <option value="Individual Practical Exercise">
          Individual Practical Exercise
        </option>
        <option value="Pitch">Pitch</option>
        <option value="Final Exam">Final Exam</option>
        <option value="Oral Exam">Oral Exam</option>
      </select>

      <label>
        Weight:
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          className="border p-2 rounded w-full"
        />
      </label>

      <label>
        Date and Time:
        <input
          type="datetime-local"
          className="border p-2 rounded w-full"
          value={examTime}
          onChange={(e) => setExamTime(e.target.value)}
        />
      </label>

      <label>
        Number of Students:
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={numberOfStudents ?? ""}
          onChange={(e) =>
            setNumberOfStudents(
              e.target.value ? parseInt(e.target.value, 10) : null
            )
          }
          placeholder="Enter the number of students"
        />
      </label>

      <label>
        Computer?
        <input
          type="checkbox"
          name="computer"
          id="computer"
          className="ml-2 b "
          checked={needComputer}
          onChange={(e) => setNeedComputer(e.target.checked)}
        />
      </label>

      <label>
        Room:
        <div className="flex items-center gap-2">
          <span>
            {selectedRoom
              ? `Selected Room: ${
                  rooms.find((room) => room.id === selectedRoom)?.roomNumName
                }`
              : "No room selected"}
          </span>
          <Button
            onClick={handleViewRooms}
            className="bg-blue-400"
            disabled={
              numberOfStudents === null || numberOfStudents <= 0 || !examTime
            }
          >
            View Rooms
          </Button>
        </div>
      </label>

      {/* Fullscreen Room Dashboard */}
      {showRoomDashboard && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50">
          <div className="h-full w-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-4 text-center">
              Select a Room
            </h2>
            {loading ? (
              <p className="text-blue-400 text-center">Loading rooms...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleSelectRoom(room.id)}
                    className={`p-4 border rounded shadow ${
                      selectedRoom === room.id
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <h3 className="text-md font-medium">{room.roomNumName}</h3>
                    <p className="text-sm">
                      {room.designation}, {room.capacity} seats
                    </p>
                  </button>
                ))}
              </div>
            )}
            <Button
              onClick={() => setShowRoomDashboard(false)}
              className="mt-6 bg-red-500 hover:bg-red-600 w-full text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
