import React from "react";
import { InventoryItem } from "../store/useStore";

interface BarItem {
  item: string;
  count: number;
}

interface BarCellProps {
  guestNumber: number;

  // For the dropdown
  barSelections: { [key: number]: string };
  setBarSelections: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;

  // The array of bar items user selected
  selectedBarItems: BarItem[];

  // The parent logic for add/remove
  handleAddBarItem: (guestNumber: number) => void;
  handleRemoveBarItem: (guestNumber: number) => void;

  // We need inventory for the <option> list
  inventory: InventoryItem[];
}

const BarCell: React.FC<BarCellProps> = ({
  guestNumber,
  barSelections,
  setBarSelections,
  selectedBarItems,

  handleAddBarItem,
  handleRemoveBarItem,

  inventory,
}) => {
  const currentItem = barSelections[guestNumber] || "";

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBarSelections((prev) => ({
      ...prev,
      [guestNumber]: e.target.value,
    }));
  };

  return (
    <div>
      <select
        value={currentItem}
        onChange={handleSelectionChange}
        className="border px-2 py-1"
      >
        <option value="" disabled>
          Select Item
        </option>
        {inventory.map((inv) => (
          <option key={inv.name} value={inv.name}>
            {inv.name} - {inv.price} L.E
          </option>
        ))}
      </select>

      <div className="mt-1">
        Selected:
        {selectedBarItems.length > 0
          ? selectedBarItems.map((bi) => `${bi.item}(${bi.count})`).join(", ")
          : " None"}
      </div>

      <button
        onClick={() => handleAddBarItem(guestNumber)}
        className="bg-green-500 text-white px-2 py-1 mt-2 rounded mr-2"
      >
        Add
      </button>
      <button
        onClick={() => handleRemoveBarItem(guestNumber)}
        className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
      >
        Remove
      </button>
    </div>
  );
};

export default BarCell;
