"use client";
import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const DeviceRecord = ({
  deviceId,
  deviceName,
  serialNumber,
  busNumber,  // Add busNumber prop to display bus number
  status,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center bg-white shadow-md rounded-md p-4 mb-4 w-full md:w-1/3">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {deviceName}
        </h3>
        <p className="text-gray-600 mb-1">
          <strong>Serial Number:</strong> {serialNumber}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Bus Number:</strong> {busNumber} {/* Display bus number here */}
        </p>
        <p className="text-gray-600">
          <strong>Status:</strong> {status}
        </p>
      </div>
      <div className="flex space-x-4 mt-4 md:mt-0">
        <button
          onClick={onEdit}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceRecord;
