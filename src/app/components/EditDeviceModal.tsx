"use client";
import React, { useState, useEffect } from "react";

const EditDeviceModal = ({ isOpen, onClose, deviceId, onSave }) => {
  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState("");
  const [busNumber, setBusNumber] = useState(""); // New state for bus number
  const busOptions = [
    "Bus001",
    "Bus002",
    "Bus003",
    "Bus004",
    "Bus005",
    "Bus006",
  ]; // Hardcoded bus numbers, replace with API if needed

  // Fetch the device details when the modal is opened
  useEffect(() => {
    if (isOpen && deviceId) {
      // Simulated fetch, replace with actual service call if needed
      const fetchDeviceDetails = async () => {
        try {
          // Replace with actual API call to fetch device details
          const deviceData = await Promise.resolve({
            name: "Sample Device",
            serial_number: "SN123456",
            status: "Active",
            bus_number: "Bus003", // Simulated bus number
          });
          setDeviceName(deviceData.name);
          setSerialNumber(deviceData.serial_number);
          setStatus(deviceData.status);
          setBusNumber(deviceData.bus_number); // Set bus number from fetched data
        } catch (error) {
          console.error("Error fetching device details:", error);
        }
      };
      fetchDeviceDetails();
    }
  }, [isOpen, deviceId]);

  const handleSave = () => {
    const updatedDevice = {
      id: deviceId,
      name: deviceName,
      serial_number: serialNumber,
      bus_number: busNumber, // Include bus number in the saved data
      status,
    };
    onSave(updatedDevice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Device</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Device Name</label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Serial Number</label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bus Number</label>
          <select
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              Select Bus Number
            </option>
            {busOptions.map((bus, index) => (
              <option key={index} value={bus}>
                {bus}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
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

export default EditDeviceModal;
