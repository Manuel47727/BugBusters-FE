"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface EvaluationCardProps {
  evaluation: {
    id?: number;
    ucId?: number;
    type?: string;
    weight?: number;
    date?: string;
    roomId?: number;
    studentNum?: number;
    needComputer?: boolean;
  };
  onUpdate: (updatedEvaluation: any) => void;
}

interface Room {
  id: number;
  designation: string;
  type: string;
  capacity: number;
  location: string;
  roomNumName: string;
}

/**
 * A card to display and edit an evaluation.
 * 
 * @param evaluation - The evaluation data to display and edit.
 * @param onUpdate - A callback function to call when the local state changes.
 * @returns A JSX element representing the evaluation card.
 * 
 * The evaluation card displays the evaluation type, weight, date, number of students, whether it requires a computer, and the room assigned to it.
 * The user can edit the evaluation type, weight, date, number of students, and whether it requires a computer.
 * The user can also select a room from a list of available rooms.
 * If the user selects a room, the room name is displayed in the card, and the room ID is sent to the parent component through the `onUpdate` callback.
 * If the user does not select a room, the card displays "Evaluation done during class".
 * The card also displays a button to view the available rooms.
 * When the user clicks the button, the card displays a fullscreen room dashboard with a list of available rooms.
 * The user can select a room from the list, and the room name is displayed in the card, and the room ID is sent to the parent component through the `onUpdate` callback.
 * The user can close the room dashboard by clicking a button.
 */
export default function EvaluationCard({
  evaluation,
  onUpdate,
}: EvaluationCardProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(
    evaluation.roomId || null
  );
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [showRoomDashboard, setShowRoomDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentNum, setStudentNum] = useState<number | null>(
    evaluation.studentNum || null
  );
  const [needComputer, setNeedComputer] = useState<boolean>(
    evaluation.needComputer || false
  );
  const [examTime, setExamTime] = useState<string>(evaluation.date || "");
  const [evaluationType, setEvaluationType] = useState<string>(
    evaluation.type || ""
  );
  const [weight, setWeight] = useState<number | undefined>(evaluation.weight);

  // Update parent component when local state changes
  useEffect(() => {
    onUpdate({
      type: evaluationType,
      weight: weight,
      date: examTime,
      roomId: selectedRoom,
      studentNum: studentNum,
      needComputer: needComputer,
    });
  }, [
    evaluationType,
    weight,
    examTime,
    selectedRoom,
    studentNum,
    needComputer,
  ]);

  // Fetch filtered rooms from the API
  const fetchRooms = async () => {
    if (!examTime || studentNum === null || studentNum <= 0) {
      setError("Please enter valid inputs for all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/room/getAvailableRooms?examTime=${encodeURIComponent(
          examTime
        )}&studentNum=${studentNum}&needComputer=${needComputer}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data: Room[] = await response.json();
      setRooms(data);

      // If selected room exists in fetched data, update the name
      if (selectedRoom) {
        const foundRoom = data.find((room) => room.id === selectedRoom);
        if (foundRoom) setSelectedRoomName(foundRoom.roomNumName);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Could not fetch rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

/**
 * Fetches details of a room by its ID and updates the selected room name.
 *
 * @param roomId - The ID of the room to fetch details for.
 *
 * The function makes an API request to fetch the room details using the provided room ID.
 * If the request is successful, it updates the selected room name with the room's number name.
 * In case of an error, it logs the error to the console and sets the selected room name to "Unknown Room".
 */

  const fetchRoomById = async (roomId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/room/get?id=${roomId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch room details");
      }

      const room: Room = await response.json();
      setSelectedRoomName(room.roomNumName);
    } catch (err) {
      console.error("Error fetching room:", err);
      setSelectedRoomName("Unknown Room");
    }
  };

  /**
   * Fetches available rooms based on user inputs and shows the room dashboard.
   *
   * This function fetches available rooms based on the user's input for exam time, student number, and computer requirement.
   * If the request is successful, it shows the room dashboard with the fetched rooms.
   */
  const handleViewRooms = async () => {
    await fetchRooms();

    setShowRoomDashboard(true);
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoom(roomId);
/**
 * Handles the selection of a room and updates the state accordingly.
 *
 * @param roomId - The ID of the room that has been selected.
 *
 * The function updates the selected room ID and attempts to find the room details
 * in the current list of rooms. If the room is found, it updates the selected room name.
 * If not found, it fetches the room details by ID. Finally, it updates the parent component
 * with the new room ID and closes the room dashboard.
 */

    const room = rooms.find((room) => room.id === roomId);

    if (room) {
      setSelectedRoomName(room.roomNumName);
    } else {
      // Fetch room details if not already in `rooms`
      fetchRoomById(roomId);
    }

    onUpdate({ roomId });
    setShowRoomDashboard(false);
  };

  // Fetch the room name if `evaluation.roomId` is set but not in `rooms`
  useEffect(() => {
    if (selectedRoom && !selectedRoomName) {
      fetchRoomById(selectedRoom);
    }
  }, [selectedRoom]);

  return (
    <div className="relative border border-sky-500 p-4 rounded shadow-md flex flex-col gap-2">
      <h1 className="text-lg font-medium">Evaluation</h1>

      <label htmlFor="evaluationType">Type:</label>
      <select
        name="evaluationType"
        className="border p-2 rounded w-full"
        value={evaluationType}
        onChange={(e) => setEvaluationType(e.target.value)}
      >
        <option value="">Select Evaluation Type</option>
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
          value={weight ?? ""}
          onChange={(e) =>
            setWeight(e.target.value ? parseInt(e.target.value, 10) : undefined)
          }
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
          value={studentNum ?? ""}
          onChange={(e) =>
            setStudentNum(e.target.value ? parseInt(e.target.value, 10) : null)
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
          className="ml-2"
          checked={needComputer}
          onChange={(e) => setNeedComputer(e.target.checked)}
        />
      </label>

      <label>
        Room:
        <div className="flex items-center gap-2">
          <span>
            {selectedRoom
              ? `Selected Room: ${selectedRoomName || "Loading..."}`
              : "Evaluation done during class"}
          </span>
          <Button
            onClick={handleViewRooms}
            className="bg-blue-400"
            disabled={studentNum === null || studentNum <= 0 || !examTime}
          >
            <Eye />
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
