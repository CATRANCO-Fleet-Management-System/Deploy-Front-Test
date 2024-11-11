import React from "react";
import { FaBus } from "react-icons/fa";

const FuelViewDetailsModal = ({ selectedBus, viewData, onClose }) => {
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
                className="w-full border border-gray-300 p-2 rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Date</label>
              <input
                type="text"
                value={viewData.date}
                disabled
                className="w-full border border-gray-300 p-2 rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Distance Traveled (KM)</label>
              <input
                type="text"
                value={viewData.distance}
                disabled
                className="w-full border border-gray-300 p-2 rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Liters Consumed</label>
              <input
                type="text"
                value={viewData.liters}
                disabled
                className="w-full border border-gray-300 p-2 rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Total Expense (PHP)</label>
              <input
                type="text"
                value={viewData.amount}
                disabled
                className="w-full border border-gray-300 p-2 rounded bg-gray-100"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Distance (Odometer) Proof</label>
              {viewData.odometerProof ? (
                <img
                  src={viewData.odometerProof}
                  alt="Odometer Proof"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              ) : (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  No Image Available
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Receipt Proof</label>
              {viewData.fuelReceiptProof ? (
                <img
                  src={viewData.fuelReceiptProof}
                  alt="Fuel Receipt Proof"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              ) : (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelViewDetailsModal;
