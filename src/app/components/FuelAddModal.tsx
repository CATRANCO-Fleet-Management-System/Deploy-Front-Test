import React, { useState } from "react";
import { FaBus } from "react-icons/fa";

const FuelAddModal = ({ selectedBus, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: "",
    distanceTraveled: "",
    litersConsumed: "",
    totalExpense: "",
    odometerProof: null,
    fuelReceiptProof: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSubmit = () => {
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-4xl">
        <div className="flex items-center mb-6">
          <FaBus size={32} className="mr-3" />
          <span className="text-xl font-bold">BUS {selectedBus}</span>
        </div>
        <div className="flex space-x-6">
          {/* Left Section */}
          <div className="w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Bus Number</label>
              <input
                type="text"
                value={selectedBus}
                disabled
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Distance Traveled (KM)</label>
              <input
                type="number"
                name="distanceTraveled"
                value={formData.distanceTraveled}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Liters Consumed</label>
              <input
                type="number"
                name="litersConsumed"
                value={formData.litersConsumed}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Total Expense (PHP)</label>
              <input
                type="number"
                name="totalExpense"
                value={formData.totalExpense}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Distance (Odometer) Proof</label>
              <input
                type="file"
                name="odometerProof"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Receipt Proof</label>
              <input
                type="file"
                name="fuelReceiptProof"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 mr-3 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelAddModal;