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
  const currentMins = (currentSeconds / 60).toFixed(2);
  const cost = (parseFloat(currentMins) * costPerMinute).toFixed(2);
  const isRunning = Boolean(roomIntervals[guestNumber]);

  // We'll store your possible room names in an array to map over:
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
          // Decide if we should disable this room
          // It's disabled if it's in allUsedRooms (taken by *another* guest) AND it's not the
          // room currently selected by this guest (so we can still see user's own current selection).
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
      <div>Time: {currentMins} mins</div>
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
