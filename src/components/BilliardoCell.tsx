import React from "react";

interface BilliardoCellProps {
  guestNumber: number;
  billiardoTimers: { [key: number]: number }; // seconds
  billiardoIntervals: { [key: number]: NodeJS.Timeout };
  billiardoStartTime?: string;
  costPerMinute?: number; // e.g., 1.2
  toggleBilliardoTimer: (guestNumber: number) => void;
}

const BilliardoCell: React.FC<BilliardoCellProps> = ({
  guestNumber,
  billiardoTimers,
  billiardoIntervals,
  billiardoStartTime,
  costPerMinute = 1.2,
  toggleBilliardoTimer,
}) => {
  const sec = billiardoTimers[guestNumber] || 0;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formattedTime = formatTime(sec);
  const cost = ((sec / 60) * costPerMinute).toFixed(2);
  const isRunning = Boolean(billiardoIntervals[guestNumber]);

  return (
    <div>
      <div>Start Time: {billiardoStartTime || "N/A"}</div>
      <div>Time: {formattedTime} mins</div>
      <div>Cost: {cost} L.E</div>

      <button
        onClick={() => toggleBilliardoTimer(guestNumber)}
        className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
      >
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
};

export default BilliardoCell;
