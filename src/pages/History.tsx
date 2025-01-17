import React from "react";
import { useStore } from "../store/useStore";

const History: React.FC = () => {
  const { history, removeFromHistory, clearHistory } = useStore();

  return (
    <div className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Guest History</h1>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Guest Number</th>
              <th className="border border-gray-300 px-4 py-2">Room</th>
              <th className="border border-gray-300 px-4 py-2">Billiardo</th>
              <th className="border border-gray-300 px-4 py-2">Bar Items</th>
              <th className="border border-gray-300 px-4 py-2">Total (L.E)</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.guestNumber}
                  </td>

                  {/* ROOM Column */}
                  <td className="border border-gray-300 px-4 py-2">
                    {/* 'item.room' may contain something like: "Room 3<br>Start: 04:50 PM<br>End: 05:00 PM" */}
                    {item.room.split("<br>").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    <div>
                      <strong>Cost:</strong>{" "}
                      {item.roomCost?.toFixed(2) || "0.00"} L.E
                    </div>
                  </td>

                  {/* BILLIARDO Column */}
                  <td className="border border-gray-300 px-4 py-2">
                    {item.billiardo.split("<br>").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    <div>
                      <strong>Cost:</strong>{" "}
                      {item.billiardoCost?.toFixed(2) || "0.00"} L.E
                    </div>
                  </td>

                  {/* BAR Items */}
                  <td className="border border-gray-300 px-4 py-2">
                    {item.barItems || "None"}
                  </td>

                  {/* TOTAL */}
                  <td className="border border-gray-300 px-4 py-2">
                    {item.total.toFixed(2)}
                  </td>

                  {/* ACTION: DELETE */}
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => removeFromHistory(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No history data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Clear History Button */}
      {history.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
            onClick={clearHistory}
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
