import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import RoomCell from "./RoomCell";
import BilliardoCell from "./BilliardoCell";
import BarCell from "./BarCell";

const GuestTable: React.FC = () => {
  const {
    guests,
    removeGuest,
    inventory,
    updateInventoryQuantity,
    addToHistory,
    updateIncome,
  } = useStore();

  // Timers (in seconds), plus intervals for each
  const [roomTimers, setRoomTimers] = useState<{
    [guestNumber: number]: number;
  }>({});
  const [billiardoTimers, setBilliardoTimers] = useState<{
    [guestNumber: number]: number;
  }>({});
  const [roomIntervals, setRoomIntervals] = useState<{
    [guestNumber: number]: NodeJS.Timeout;
  }>({});
  const [billiardoIntervals, setBilliardoIntervals] = useState<{
    [guestNumber: number]: NodeJS.Timeout;
  }>({});

  // Room/Billiardo Selections & Times
  const [selectedRoom, setSelectedRoom] = useState<{
    [guestNumber: number]: string;
  }>({});
  const [roomStartTime, setRoomStartTime] = useState<{
    [guestNumber: number]: string;
  }>({});
  const [roomEndTime, setRoomEndTime] = useState<{
    [guestNumber: number]: string;
  }>({});
  const [billiardoStartTime, setBilliardoStartTime] = useState<{
    [guestNumber: number]: string;
  }>({});
  const [billiardoEndTime, setBilliardoEndTime] = useState<{
    [guestNumber: number]: string;
  }>({});

  // Bar Items
  const [selectedBarItems, setSelectedBarItems] = useState<{
    [guestNumber: number]: { item: string; count: number }[];
  }>({});
  const [barSelections, setBarSelections] = useState<{
    [guestNumber: number]: string;
  }>({});

  // Track total cost for each guest
  const [guestTotal, setGuestTotal] = useState<{
    [guestNumber: number]: number;
  }>({});

  // ─────────────────────────────────────────────────────────────
  // ROOM Timer Toggle (captures End Time on stop)
  // ─────────────────────────────────────────────────────────────
  const toggleRoomTimer = (guestNumber: number) => {
    if (!selectedRoom[guestNumber]) {
      alert("Please select a room before starting the timer.");
      return;
    }

    // If not running yet, start
    if (!roomIntervals[guestNumber]) {
      const now = new Date();
      setRoomStartTime((prev) => ({
        ...prev,
        [guestNumber]:
          prev[guestNumber] ||
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));

      const interval = setInterval(() => {
        setRoomTimers((prev) => ({
          ...prev,
          [guestNumber]: (prev[guestNumber] || 0) + 1,
        }));
      }, 1000);

      setRoomIntervals((prev) => ({ ...prev, [guestNumber]: interval }));
    } else {
      // If running, STOP and record end time
      const now = new Date();
      setRoomEndTime((prev) => ({
        ...prev,
        [guestNumber]: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      clearInterval(roomIntervals[guestNumber]);
      setRoomIntervals((prev) => {
        const updated = { ...prev };
        delete updated[guestNumber];
        return updated;
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // BILLIARDO Timer Toggle (captures End Time on stop)
  // ─────────────────────────────────────────────────────────────
  const toggleBilliardoTimer = (guestNumber: number) => {
    const isBilliardoInUse = Object.keys(billiardoIntervals).length > 0;
    if (!billiardoIntervals[guestNumber] && isBilliardoInUse) {
      alert("Billiardo table is already in use by another guest.");
      return;
    }

    if (!billiardoIntervals[guestNumber]) {
      const now = new Date();
      setBilliardoStartTime((prev) => ({
        ...prev,
        [guestNumber]:
          prev[guestNumber] ||
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));

      const interval = setInterval(() => {
        setBilliardoTimers((prev) => ({
          ...prev,
          [guestNumber]: (prev[guestNumber] || 0) + 1,
        }));
      }, 1000);

      setBilliardoIntervals((prev) => ({ ...prev, [guestNumber]: interval }));
    } else {
      // Stop and record end time
      const now = new Date();
      setBilliardoEndTime((prev) => ({
        ...prev,
        [guestNumber]: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      clearInterval(billiardoIntervals[guestNumber]);
      setBilliardoIntervals((prev) => {
        const updated = { ...prev };
        delete updated[guestNumber];
        return updated;
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Add/Remove Bar Items
  // ─────────────────────────────────────────────────────────────
  const handleAddBarItem = (guestNumber: number) => {
    const item = barSelections[guestNumber];
    if (!item) return;

    const invItem = inventory.find((inv) => inv.name === item);
    if (!invItem || invItem.quantity <= 0) {
      alert("Item is out of stock!");
      return;
    }

    setSelectedBarItems((prev) => {
      const guestItems = prev[guestNumber] || [];
      const idx = guestItems.findIndex((g) => g.item === item);

      let updated;
      if (idx !== -1) {
        updated = [
          ...guestItems.slice(0, idx),
          { ...guestItems[idx], count: guestItems[idx].count + 1 },
          ...guestItems.slice(idx + 1),
        ];
      } else {
        updated = [...guestItems, { item, count: 1 }];
      }

      return { ...prev, [guestNumber]: updated };
    });

    updateInventoryQuantity(item, -1);
  };

  const handleRemoveBarItem = (guestNumber: number) => {
    setSelectedBarItems((prev) => {
      const guestItems = prev[guestNumber] || [];
      if (guestItems.length === 0) return prev;

      const lastItem = guestItems[guestItems.length - 1];
      let updatedItems;

      if (lastItem.count > 1) {
        updatedItems = [...guestItems];
        updatedItems[guestItems.length - 1] = {
          ...lastItem,
          count: lastItem.count - 1,
        };
      } else {
        updatedItems = guestItems.slice(0, -1);
      }
      return { ...prev, [guestNumber]: updatedItems };
    });

    const guestItems = selectedBarItems[guestNumber] || [];
    if (guestItems.length > 0) {
      const lastItem = guestItems[guestItems.length - 1];
      updateInventoryQuantity(lastItem.item, 1);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Calculate Totals whenever timers or bar items change
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    guests.forEach((g) => {
      const gNum = g.guestNumber;
      const rSec = roomTimers[gNum] || 0;
      const bSec = billiardoTimers[gNum] || 0;
      const barItems = selectedBarItems[gNum] || [];

      const roomCost = (rSec / 60) * 1.7;
      const billiardoCost = (bSec / 60) * 1.2;
      const barCost = barItems.reduce((sum, b) => {
        const price = inventory.find((inv) => inv.name === b.item)?.price || 0;
        return sum + b.count * price;
      }, 0);

      const total = roomCost + billiardoCost + barCost;
      setGuestTotal((prev) => ({ ...prev, [gNum]: total }));
    });
  }, [guests, roomTimers, billiardoTimers, selectedBarItems, inventory]);

  // ─────────────────────────────────────────────────────────────
  // Print Receipt
  // ─────────────────────────────────────────────────────────────
  const handlePrintReceipt = (guestNumber: number) => {
    const guest = guests.find((g) => g.guestNumber === guestNumber);
    if (!guest) return;

    const secRoom = roomTimers[guestNumber] || 0;
    const secBilliardo = billiardoTimers[guestNumber] || 0;
    const costRoom = ((secRoom / 60) * 1.7).toFixed(2);
    const costBilliardo = ((secBilliardo / 60) * 1.2).toFixed(2);
    const barItems = selectedBarItems[guestNumber] || [];
    const costBar = barItems.reduce((sum, bi) => {
      const p = inventory.find((inv) => inv.name === bi.item)?.price || 0;
      return sum + bi.count * p;
    }, 0);

    const total = (
      parseFloat(costRoom) +
      parseFloat(costBilliardo) +
      costBar
    ).toFixed(2);

    const printWindow = window.open("", "_blank", "width=600,height=400");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; }
              p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>Receipt</h1>
            <p><strong>Guest #:</strong> ${guestNumber}</p>
            <p><strong>Room Selected:</strong> ${
              selectedRoom[guestNumber] || "N/A"
            }</p>
            <p><strong>Room Start Time:</strong> ${
              roomStartTime[guestNumber] || "N/A"
            }</p>
            <p><strong>Room Cost:</strong> ${costRoom} L.E</p>
            <p><strong>Billiardo Start Time:</strong> ${
              billiardoStartTime[guestNumber] || "N/A"
            }</p>
            <p><strong>Billiardo Cost:</strong> ${costBilliardo} L.E</p>
            <p><strong>Bar Items:</strong> ${
              barItems.map((bi) => `${bi.item}(${bi.count})`).join(", ") ||
              "None"
            }</p>
            <p><strong>Bar Cost:</strong> ${costBar.toFixed(2)} L.E</p>
            <p><strong>Total:</strong> ${total} L.E</p>
            <button onclick="window.print()">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Done => finalize guest
  // ─────────────────────────────────────────────────────────────
  const handleDone = (guestNumber: number) => {
    // 1) Find the guest
    const g = guests.find((guest) => guest.guestNumber === guestNumber);
    if (!g) return;

    // 2) Gather times/costs
    const rTime = roomTimers[guestNumber] || 0;
    const bTime = billiardoTimers[guestNumber] || 0;
    const barItems = selectedBarItems[guestNumber] || [];

    const roomCost = (rTime / 60) * 1.7;
    const billiardoCost = (bTime / 60) * 1.2;
    const barCost = barItems.reduce((sum, obj) => {
      const price = inventory.find((inv) => inv.name === obj.item)?.price || 0;
      return sum + obj.count * price;
    }, 0);

    // 3) Add to history (includes End Times)
    addToHistory({
      guestNumber,
      room: `${selectedRoom[guestNumber] || "N/A"}<br>Start: ${
        roomStartTime[guestNumber] || "N/A"
      }<br>End: ${roomEndTime[guestNumber] || "N/A"}`,
      roomCost,

      billiardo: `Start: ${billiardoStartTime[guestNumber] || "N/A"}<br>End: ${
        billiardoEndTime[guestNumber] || "N/A"
      }`,
      billiardoCost,

      barItems: barItems.map((bi) => `${bi.item}(${bi.count})`).join(", "),
      total: roomCost + billiardoCost + barCost,
    });

    // 4) Update Income
    updateIncome({
      psIncome: roomCost,
      billiardoIncome: billiardoCost,
      barIncome: barCost,
    });

    // 5) Remove guest from store
    removeGuest(guestNumber);
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Home (Guest List)</h2>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th>Guest #</th>
            <th>Room</th>
            <th>Billiardo</th>
            <th>Bar</th>
            <th>Total (L.E)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => {
            const gNum = guest.guestNumber;

            // Gather all rooms being used by other guests:
            const allUsedRooms = Object.entries(selectedRoom)
              .filter(([otherGuestNum]) => Number(otherGuestNum) !== gNum) // exclude current guest
              .map(([, roomName]) => roomName);

            return (
              <tr key={gNum} className="text-center">
                {/* Guest # */}
                <td className="border px-4 py-2">{gNum}</td>

                {/* ROOM CELL */}
                <td className="border px-4 py-2">
                  <RoomCell
                    guestNumber={gNum}
                    selectedRoom={selectedRoom[gNum]}
                    setSelectedRoom={setSelectedRoom}
                    roomTimers={roomTimers}
                    roomIntervals={roomIntervals}
                    roomStartTime={roomStartTime[gNum]}
                    toggleRoomTimer={toggleRoomTimer}
                    allUsedRooms={allUsedRooms}
                  />
                </td>

                {/* BILLIARDO CELL */}
                <td className="border px-4 py-2">
                  <BilliardoCell
                    guestNumber={gNum}
                    billiardoTimers={billiardoTimers}
                    billiardoIntervals={billiardoIntervals}
                    billiardoStartTime={billiardoStartTime[gNum]}
                    toggleBilliardoTimer={toggleBilliardoTimer}
                  />
                </td>

                {/* BAR CELL */}
                <td className="border px-4 py-2">
                  <BarCell
                    guestNumber={gNum}
                    barSelections={barSelections}
                    setBarSelections={setBarSelections}
                    selectedBarItems={selectedBarItems[gNum] || []}
                    handleAddBarItem={handleAddBarItem}
                    handleRemoveBarItem={handleRemoveBarItem}
                    inventory={inventory}
                  />
                </td>

                {/* TOTAL */}
                <td className="border px-4 py-2">
                  {guestTotal[gNum]?.toFixed(2) || "0.00"}
                </td>

                {/* ACTIONS */}
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handlePrintReceipt(gNum)}
                  >
                    Print
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleDone(gNum)}
                  >
                    Done
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => removeGuest(gNum)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GuestTable;
