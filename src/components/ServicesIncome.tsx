import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

const ServicesIncome: React.FC = () => {
  const { income } = useStore(); // Removed 'updateIncome' since it's unused
  const [totalIncome, setTotalIncome] = useState(
    income.psIncome + income.billiardoIncome + income.barIncome
  );

  useEffect(() => {
    // Recalculate total income whenever the income state changes
    setTotalIncome(
      income.psIncome + income.billiardoIncome + income.barIncome
    );
  }, [income]);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">Services Income</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span className="font-medium">PS:</span>
          <span>{income.psIncome.toFixed(2)} EGP</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Billiardo:</span>
          <span>{income.billiardoIncome.toFixed(2)} EGP</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Bar:</span>
          <span>{income.barIncome.toFixed(2)} EGP</span>
        </li>
        <li className="flex justify-between border-t pt-2 mt-2">
          <span className="font-semibold">Total:</span>
          <span>{totalIncome.toFixed(2)} EGP</span>
        </li>
      </ul>
    </div>
  );
};

export default ServicesIncome;
