import React, { useState } from "react";
import { useStore } from "../store/useStore";

const Inventory: React.FC = () => {
  const { inventory, addInventoryItem, removeInventoryItem, updateInventoryQuantity } = useStore();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState<number | "">("");
  const [itemQuantity, setItemQuantity] = useState<number | "">("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && itemPrice && itemPrice > 0 && itemQuantity && itemQuantity > 0) {
      addInventoryItem({
        name: itemName.trim(),
        price: Number(itemPrice),
        quantity: Number(itemQuantity),
      });
      setItemName("");
      setItemPrice("");
      setItemQuantity("");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Bar Inventory</h1>

      <form onSubmit={handleAddItem} className="p-4 bg-gray-100 rounded shadow">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/4">
            <label htmlFor="itemName" className="block font-medium mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="w-full md:w-1/4">
            <label htmlFor="itemPrice" className="block font-medium mb-1">
              Price (L.E)
            </label>
            <input
              type="number"
              id="itemPrice"
              value={itemPrice}
              onChange={(e) =>
                setItemPrice(e.target.value ? parseFloat(e.target.value) : "")
              }
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="w-full md:w-1/4">
            <label htmlFor="itemQuantity" className="block font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="itemQuantity"
              value={itemQuantity}
              onChange={(e) =>
                setItemQuantity(e.target.value ? parseInt(e.target.value) : "")
              }
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              Add Item
            </button>
          </div>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Current Inventory</h2>

      {inventory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Item</th>
                <th className="border border-gray-300 px-4 py-2">Price (L.E)</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded mr-2"
                      onClick={() => removeInventoryItem(index)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                      onClick={() => updateInventoryQuantity(item.name, 1)} // Pass the name instead of index
                    >
                      +1
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded ml-2"
                      onClick={() => updateInventoryQuantity(item.name, -1)} // Pass the name instead of index
                      disabled={item.quantity <= 1}
                    >
                      -1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No items in inventory. Add new items to get started.
        </p>
      )}
    </div>
  );
};

export default Inventory;
