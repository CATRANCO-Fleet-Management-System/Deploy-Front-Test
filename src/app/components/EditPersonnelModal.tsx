"use client";
import React, { useState, useEffect } from "react";
import { getAllProfiles } from "@/app/services/userProfile";
import { updateVehicleAssignment, getVehicleAssignmentById } from "@/app/services/vehicleAssignService";

interface Profile {
  profile: {
    user_profile_id: string;
    first_name: string;
    last_name: string;
    position: string;
  };
}

interface EditPersonnelModalProps {
  assignmentId: string;
  vehicleId: string;
  initialDriver: string;
  initialPAO: string;
  onClose: () => void;
  onUpdate: (driverId: string, paoId: string) => void;
}

const EditPersonnelModal: React.FC<EditPersonnelModalProps> = ({
  assignmentId,
  vehicleId,
  initialDriver,
  initialPAO,
  onClose,
  onUpdate,
}) => {
  const [drivers, setDrivers] = useState<Profile[]>([]);
  const [paos, setPaos] = useState<Profile[]>([]);
  const [selectedDriver, setSelectedDriver] = useState(initialDriver);
  const [selectedPAO, setSelectedPAO] = useState(initialPAO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const profiles = await getAllProfiles();
        const driverProfiles = profiles.filter((profile) => profile.profile.position === "driver");
        const paoProfiles = profiles.filter((profile) => profile.profile.position === "passenger_assistant_officer");

        setDrivers(driverProfiles);
        setPaos(paoProfiles);

        // If assignmentId is passed, fetch the assignment details
        if (assignmentId) {
          const assignment = await getVehicleAssignmentById(assignmentId);
          if (assignment && assignment.user_profiles) {
            const currentDriver = assignment.user_profiles.find(
              (p) => p.position === "driver"
            )?.user_profile_id || "";
            const currentPAO = assignment.user_profiles.find(
              (p) => p.position === "passenger_assistant_officer"
            )?.user_profile_id || "";

            setSelectedDriver(currentDriver);
            setSelectedPAO(currentPAO);
          }
        }
      } catch (err) {
        setError("Failed to fetch profiles.");
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (!selectedDriver || !selectedPAO) {
      setError("Please select both a driver and a PAO.");
      return;
    }

    setLoading(true);

    try {
      // Log payload to verify the data
      console.log({
        user_profile_ids: [selectedDriver, selectedPAO],
        vehicle_id: vehicleId
      });

      // Update the vehicle assignment with selected driver and PAO
      const response = await updateVehicleAssignment(assignmentId, {
        user_profile_ids: [selectedDriver, selectedPAO],
        vehicle_id: vehicleId,
      });

      if (response.message === "Vehicle Assignment Updated Successfully") {
        onUpdate(selectedDriver, selectedPAO); // Trigger update on success
        onClose(); // Close modal after update
      } else {
        throw new Error("Update failed. Please check your inputs.");
      }
    } catch (err) {
      setError("Failed to update personnel. Please try again.");
      console.error("Error updating vehicle assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Personnel Assignment</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block text-sm">Select Driver</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
            disabled={loading}
          >
            <option value="">Select a Driver</option>
            {drivers.map((driver) => (
              <option key={driver.profile.user_profile_id} value={driver.profile.user_profile_id}>
                {`${driver.profile.first_name} ${driver.profile.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm">Select PAO</label>
          <select
            value={selectedPAO}
            onChange={(e) => setSelectedPAO(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
            disabled={loading}
          >
            <option value="">Select a PAO</option>
            {paos.map((pao) => (
              <option key={pao.profile.user_profile_id} value={pao.profile.user_profile_id}>
                {`${pao.profile.first_name} ${pao.profile.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? "cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPersonnelModal;
