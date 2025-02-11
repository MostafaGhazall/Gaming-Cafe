import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import GuestTable from '../components/GuestTable';
import ServicesIncome from '../components/ServicesIncome';

const Home: React.FC = () => {
  const { addGuest } = useStore();
  const [guestCounter, setGuestCounter] = useState(1);

  const handleAddGuest = () => {
    const newGuest = {
      guestNumber: guestCounter,
      room: 'N/A',
      billiardoTime: '00:00',
      billiardoCost: 0,
      barItems: ["None"],
      total: 0,
    };

    addGuest(newGuest);
    setGuestCounter(guestCounter + 1);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center">Welcome to Greyden</h1>

      {/* Add Guest Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={handleAddGuest}
        >
          Add Guest
        </button>
      </div>

      {/* Services Income Section */}
      <ServicesIncome />

      {/* Guest Table Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Guest List</h2>
        <GuestTable />
      </div>
    </div>
  );
};

export default Home;
