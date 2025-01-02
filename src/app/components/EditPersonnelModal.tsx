import React, { useState, useEffect } from "react";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicles } from "@/app/services/vehicleService";
import { updateVehicleAssignment } from "@/app/services/vehicleAssignService";

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
  vehicleId: string; // Vehicle ID is passed here
  initialDriver: string;
  initialPAO: string;
  onClose: () => void;
  onUpdate: (updatedDriver: string, updatedPAO: string) => void;
}

const EditPersonnel: React.FC<EditPersonnelModalProps> = ({
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
  const [vehicles, setVehicles] = useState<any[]>([]); // Define the type of vehicle data
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(
    vehicleId
  );

  useEffect(() => {
    const fetchProfilesAndVehicles = async () => {
      setLoading(true);
      try {
        const profiles = await getAllProfiles();
        const driverProfiles = profiles.filter(
          (profile) => profile.profile.position === "driver"
        );
        const paoProfiles = profiles.filter(
          (profile) =>
            profile.profile.position === "passenger_assistant_officer"
        );
        const vehicleData = await getAllVehicles();

        setDrivers(driverProfiles);
        setPaos(paoProfiles);
        setVehicles(vehicleData);

        // Ensure the selected vehicle exists
        if (vehicleData && vehicleData.length > 0) {
          const currentVehicle = vehicleData.find(
            (vehicle) => vehicle.vehicle_id === vehicleId
          );
          if (currentVehicle) {
            setSelectedVehicle(vehicleId); // Update the selected vehicle if it exists
          }
        }
      } catch (fetchError) {
        console.error("Error fetching profiles or vehicles:", fetchError);
        setError("Error fetching profiles or vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfilesAndVehicles();
  }, [vehicleId]); // Ensure this fetches the correct data based on the vehicleId passed

  const handleSubmit = async () => {
    if (!selectedDriver) {
      setError("Please select a driver.");
      return;
    }

    if (!selectedPAO) {
      setError("Please select a PAO.");
      return;
    }

    if (!selectedVehicle) {
      setError("Please select a vehicle.");
      return;
    }

    if (!assignmentId) {
      setError("Assignment ID is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateVehicleAssignment(assignmentId, {
        user_profile_ids: [selectedDriver, selectedPAO],
        vehicle_id: selectedVehicle,
      });

      if (response?.message === "Vehicle Assignment Updated Successfully") {
        onUpdate(selectedDriver, selectedPAO); // Pass updated values back to parent
        onClose(); // Close modal
      } else {
        throw new Error(response?.message || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating personnel assignment:", err);
      setError("Failed to update personnel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-[95vh] max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Personnel Assignment</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium">Driver</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">Select a Driver</option>
            {drivers.map((driver) => (
              <option
                key={driver.profile.user_profile_id}
                value={driver.profile.user_profile_id}
              >
                {`${driver.profile.first_name} ${driver.profile.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">PAO</label>
          <select
            value={selectedPAO}
            onChange={(e) => setSelectedPAO(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">Select a PAO</option>
            {paos.map((pao) => (
              <option
                key={pao.profile.user_profile_id}
                value={pao.profile.user_profile_id}
              >
                {`${pao.profile.first_name} ${pao.profile.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Vehicle</label>
          <div className="w-full p-2 border rounded bg-gray-100">
            {selectedVehicle}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPersonnel;
