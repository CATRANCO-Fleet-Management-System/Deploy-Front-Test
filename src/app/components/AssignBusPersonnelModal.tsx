"use client";
import React, { useState, useEffect } from "react";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicles } from "@/app/services/vehicleService";
import { createVehicleAssignment } from "@/app/services/vehicleAssignService";

const AssignBusPersonnelModal = ({ onClose }) => {
  const [drivers, setDrivers] = useState([]);
  const [paos, setPaos] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedPAO, setSelectedPAO] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfilesAndVehicles = async () => {
      setLoading(true);
      try {
        const profiles = await getAllProfiles();
        const driverProfiles = profiles.filter(profile => profile.profile.position === 'driver');
        const paoProfiles = profiles.filter(profile => profile.profile.position === 'passenger_assistant_officer');
        const vehicleData = await getAllVehicles();

        setDrivers(driverProfiles);
        setPaos(paoProfiles);
        setVehicles(vehicleData);
      } catch (error) {
        setError("Error fetching profiles or vehicles.");
        console.error("Error fetching profiles or vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilesAndVehicles();
  }, []);

  const handleCancelClick = () => {
    onClose(); // Close the modal when cancel is clicked
  };

  const handleDoneClick = async () => {
    if (!selectedDriver || !selectedPAO || !selectedVehicle) {
      setError("Please select a driver, PAO, and vehicle.");
      return;
    }

    setLoading(true);
    try {
      const assignmentData = {
        vehicle_id: selectedVehicle,
        user_profile_ids: [selectedDriver, selectedPAO],
      };

      await createVehicleAssignment(assignmentData);
      console.log("Vehicle assignment created:", assignmentData);
      onClose(); // Close the modal on success
    } catch (error) {
      setError("Error creating vehicle assignment.");
      console.error("Error creating vehicle assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold">Assign Bus Personnel</h2>
          <button
            onClick={handleCancelClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <form className="grid grid-cols-2 gap-4 mt-4">
          {/* Left Column */}
          <div>
            <h1 className="text-xl mt-4">Driver Assignment</h1>
            {loading ? (
              <p>Loading drivers...</p>
            ) : (
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.profile.user_profile_id} value={driver.profile.user_profile_id}>
                    {`${driver.profile.first_name} ${driver.profile.last_name}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Right Column */}
          <div>
            <h1 className="text-xl mt-4">Passenger Assistant Officer Assignment</h1>
            {loading ? (
              <p>Loading PAOs...</p>
            ) : (
              <select
                value={selectedPAO}
                onChange={(e) => setSelectedPAO(e.target.value)}
                className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a PAO</option>
                {paos.map((pao) => (
                  <option key={pao.profile.user_profile_id} value={pao.profile.user_profile_id}>
                    {`${pao.profile.first_name} ${pao.profile.last_name}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Vehicle Selection */}
          <div>
            <h1 className="text-xl mt-4">Select Vehicle</h1>
            {loading ? (
              <p>Loading vehicles...</p>
            ) : (
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                    {`${vehicle.vehicle_id}`} {/* Adjust according to your vehicle object structure */}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleDoneClick}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Done
            </button>

            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignBusPersonnelModal;
