"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllVehicles } from "@/app/services/vehicleService";

const MaintenanceAddModal = ({ isOpen, onClose, onSave }) => {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceNumber, setMaintenanceNumber] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState(new Date());
  const [maintenanceAddress, setMaintenanceAddress] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [attendingMechanic, setAttendingMechanic] = useState("");

  // Maintenance types list
  const maintenanceTypes = [
    "oil_change",
    "tire_rotation",
    "brake_inspection",
    "engine_check",
    "transmission_service",
  ];

  // Fetch available vehicles when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchVehicles = async () => {
        try {
          const vehicleData = await getAllVehicles();
          setVehicles(vehicleData);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      };

      fetchVehicles();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!maintenanceType || !maintenanceCost || !maintenanceAddress) {
      alert("Please fill in all required fields.");
      return;
    }

    const formattedDate = `${maintenanceDate.toLocaleDateString("en-CA")} ${maintenanceDate.toLocaleTimeString(
      "en-GB",
      { hour12: false }
    )}`;
    const newRecord = {
      maintenance_number: maintenanceNumber || "N/A",
      vehicle_id: vehicleId || "N/A",
      maintenance_cost: maintenanceCost || "0",
      maintenance_date: formattedDate,
      maintenance_address: maintenanceAddress || "N/A",
      maintenance_type: maintenanceType || "unspecified",
      attending_mechanic: attendingMechanic || "N/A",
      maintenance_status: "active",
    };
    await onSave(null, newRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
        <h2 className="text-lg font-bold mb-4">Add New Maintenance Record</h2>
        <div className="form grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="maintenanceNumber" className="block text-sm font-medium text-gray-700">
              Maintenance #
            </label>
            <input
              id="maintenanceNumber"
              placeholder="Maintenance #"
              value={maintenanceNumber}
              onChange={(e) => setMaintenanceNumber(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="attendingMechanic" className="block text-sm font-medium text-gray-700">
              Attending Mechanic
            </label>
            <input
              id="attendingMechanic"
              placeholder="Attending Mechanic"
              value={attendingMechanic}
              onChange={(e) => setAttendingMechanic(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="maintenanceType" className="block text-sm font-medium text-gray-700">
              Maintenance Type
            </label>
            <select
              id="maintenanceType"
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
              value={maintenanceType}
              onChange={(e) => setMaintenanceType(e.target.value)}
            >
              <option value="">Select a maintenance type</option>
              {maintenanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Vehicle
            </label>
            <select
              id="vehicleId"
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.plate_number} - {vehicle.vehicle_id}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label htmlFor="maintenanceCost" className="block text-sm font-medium text-gray-700">
              Maintenance Cost
            </label>
            <input
              id="maintenanceCost"
              placeholder="PHP"
              value={maintenanceCost}
              onChange={(e) => setMaintenanceCost(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="maintenanceDate" className="block text-sm font-medium text-gray-700">
              Maintenance Date
            </label>
            <DatePicker
              id="maintenanceDate"
              selected={maintenanceDate}
              onChange={(date) => setMaintenanceDate(date)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="maintenanceAddress" className="block text-sm font-medium text-gray-700">
              Maintenance Address
            </label>
            <input
              id="maintenanceAddress"
              placeholder="Maintenance Address"
              value={maintenanceAddress}
              onChange={(e) => setMaintenanceAddress(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-6 py-3 border border-gray-500 text-gray-500 rounded-md bg-transparent"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-3 ${
              maintenanceType && maintenanceCost && maintenanceAddress
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
            } rounded-md`}
            onClick={handleSubmit}
            disabled={!maintenanceType || !maintenanceCost || !maintenanceAddress}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceAddModal;
