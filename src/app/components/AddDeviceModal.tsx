"use client";
import React, { useState } from "react";

const AddDeviceModal = ({ isOpen, onClose, onSave }) => {
  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [busNumber, setBusNumber] = useState(""); // New state for bus number
  const [status, setStatus] = useState("Active");

  const handleSave = () => {
    const newDevice = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      name: deviceName,
      serial_number: serialNumber,
      bus_number: busNumber,
      status,
    };
    onSave(newDevice);
    resetForm();
  };

  const resetForm = () => {
    setDeviceName("");
    setSerialNumber("");
    setBusNumber("");
    setStatus("Active");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add New Device</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Device Name
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter device name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Serial Number
          </label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter serial number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Bus Number
          </label>
          <select
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Bus Number
            </option>
            <option value="Bus001">Bus001</option>
            <option value="Bus002">Bus002</option>
            <option value="Bus003">Bus003</option>
            <option value="Bus004">Bus004</option>
            <option value="Bus005">Bus005</option>
            <option value="Bus006">Bus006</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
