import React from "react";

interface BilliardoCellProps {
  guestNumber: number;
  billiardoTimers: { [key: number]: number };   // seconds
  billiardoIntervals: { [key: number]: NodeJS.Timeout };
  billiardoStartTime?: string;
  // Omit billiardoEndTime from the home page
  costPerMinute?: number;  // e.g., 1.2
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
  const mins = (sec / 60).toFixed(2);
  const cost = (parseFloat(mins) * costPerMinute).toFixed(2);
  const isRunning = Boolean(billiardoIntervals[guestNumber]);

  return (
    <div>
      <div>Start Time: {billiardoStartTime || "N/A"}</div>
      <div>Time: {mins} mins</div>
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
