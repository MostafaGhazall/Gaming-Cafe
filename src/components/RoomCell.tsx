import React from "react";

interface RoomCellProps {
  guestNumber: number;
  selectedRoom?: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  roomTimers: { [key: number]: number };
  roomIntervals: { [key: number]: NodeJS.Timeout };
  roomStartTime?: string;
  costPerMinute?: number;
  toggleRoomTimer: (guestNumber: number) => void;

  // New: array of used rooms so we can disable them
  allUsedRooms: string[];
}

const RoomCell: React.FC<RoomCellProps> = ({
  guestNumber,
  selectedRoom,
  setSelectedRoom,
  roomTimers,
  roomIntervals,
  roomStartTime,
  costPerMinute = 1.7,
  toggleRoomTimer,
  allUsedRooms,
}) => {
  const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoom((prev) => ({
      ...prev,
      [guestNumber]: e.target.value,
    }));
  };

  const currentSeconds = roomTimers[guestNumber] || 0;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formattedTime = formatTime(currentSeconds);
  const cost = ((currentSeconds / 60) * costPerMinute).toFixed(2);
  const isRunning = Boolean(roomIntervals[guestNumber]);

  // Store possible room names in an array to map over:
  const roomOptions = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6"];

  return (
    <div>
      <select
        value={selectedRoom || ""}
        onChange={handleRoomSelect}
        className="border px-2 py-1"
      >
        <option value="" disabled>
          Select Room
        </option>
        {roomOptions.map((roomName) => {
          // Disable room if it's in allUsedRooms AND it's not the room selected by this guest
          const disabled =
            allUsedRooms.includes(roomName) && selectedRoom !== roomName;

          return (
            <option key={roomName} value={roomName} disabled={disabled}>
              {roomName}
            </option>
          );
        })}
      </select>

      <div>Start Time: {roomStartTime || "N/A"}</div>
      <div>Time: {formattedTime} mins</div>
      <div>Cost: {cost} L.E</div>

      <button
        onClick={() => toggleRoomTimer(guestNumber)}
        className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
      >
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
};

export default RoomCell;
