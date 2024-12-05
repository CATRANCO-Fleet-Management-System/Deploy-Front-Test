import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getVehicleAssignmentById,
  createVehicleAssignment,
} from "@/app/services/vehicleAssignService";
import { deleteVehicle } from "@/app/services/vehicleService";
import EditBusRecordModal from "@/app/components/EditBusRecordModal";
import EditPersonnelModal from "@/app/components/EditPersonnelModal";

interface BusBoxProps {
  vehicle_id: string;
  busNumber: string;
  ORNumber: string;
  CRNumber: string;
  plateNumber: string;
  thirdLBI: string;
  comprehensiveInsurance?: string;
  assignedDriver: string;
  assignedPAO: string;
  assignmentId: string | null;
  route?: string;
  onDelete: () => void;
  onUpdate: (updatedBus: any) => void; // Ensure onUpdate is passed from the parent
}

const BusRecord: React.FC<BusBoxProps> = ({
  vehicle_id,
  busNumber,
  ORNumber,
  CRNumber,
  plateNumber,
  thirdLBI,
  comprehensiveInsurance,
  assignedDriver,
  assignedPAO,
  assignmentId: initialAssignmentId,
  route,
  onDelete,
  onUpdate,
}) => {
  const [assignmentId, setAssignmentId] = useState<string | null>(initialAssignmentId);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditBusModalOpen, setIsEditBusModalOpen] = useState(false);
  const [isEditPersonnelModalOpen, setIsEditPersonnelModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const toggleDropdown = useCallback(() => setDropdownOpen((prev) => !prev), []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch or create vehicle assignment
  useEffect(() => {
    const fetchOrCreateAssignment = async () => {
      if (!assignmentId) {
        setLoading(true);
        try {
          const response = await getVehicleAssignmentById(vehicle_id);
          if (response?.vehicle_assignment_id) {
            setAssignmentId(response.vehicle_assignment_id);
          } else {
            const newAssignment = await createVehicleAssignment({
              vehicle_id,
              user_profile_ids: [assignedDriver, assignedPAO].filter(Boolean),
            });
            setAssignmentId(newAssignment.vehicle_assignment_id);
          }
        } catch (error) {
          console.error("Error fetching or creating assignment ID:", error);
          setAssignmentId(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrCreateAssignment();
  }, [assignmentId, vehicle_id, assignedDriver, assignedPAO]);

  // Delete vehicle handler
  const handleDelete = async () => {
    try {
      await deleteVehicle(vehicle_id);
      onDelete(); // Update parent state after deletion
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete the vehicle. Please try again.");
    }
  };

  // Open modal for editing bus record
  const handleEditBus = () => {
    setIsEditBusModalOpen(true);
    setDropdownOpen(false);
  };

  // Open modal for editing personnel assignment
  const handleEditPersonnel = () => {
    setIsEditPersonnelModalOpen(true);
    setDropdownOpen(false);
  };

  // Close modals
  const handleModalClose = () => {
    setIsEditBusModalOpen(false);
    setIsEditPersonnelModalOpen(false);
  };

  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      {/* Bus Record Details */}
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Bus Number:</td>
            <td className="border p-2">{busNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">OR Number:</td>
            <td className="border p-2">{ORNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">CR Number:</td>
            <td className="border p-2">{CRNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Plate Number:</td>
            <td className="border p-2">{plateNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Third LBI:</td>
            <td className="border p-2">{thirdLBI}</td>
          </tr>
          {comprehensiveInsurance && (
            <tr>
              <td className="border p-2 font-bold">Comprehensive Insurance:</td>
              <td className="border p-2">{comprehensiveInsurance}</td>
            </tr>
          )}
          <tr>
            <td className="border p-2 font-bold">Assigned Driver:</td>
            <td className="border p-2">{assignedDriver}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Assigned PAO:</td>
            <td className="border p-2">{assignedPAO}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Route:</td>
            <td className="border p-2">{route || "Not Assigned"}</td>
          </tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
          onClick={handleDelete}
        >
          Remove
        </button>

        {/* Edit Dropdown */}
        <div className="relative w-full" ref={dropdownRef}>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            onClick={toggleDropdown}
          >
            Edit
          </button>
          {dropdownOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-4/5 bg-white border border-gray-300 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleEditBus}
              >
                Edit Bus Record
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleEditPersonnel}
              >
                Edit Personnel Assignment
              </button>
            </div>
          )}
        </div>
        <a
          href={`/bus-profiles/bus-records/${busNumber}`}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-center"
          aria-label={`View full record for ${busNumber}`}
        >
          View Bus Full Record
        </a>
      </div>

      {/* Modals */}
      {isEditBusModalOpen && (
        <EditBusRecordModal
          vehicle_id={vehicle_id}
          onClose={handleModalClose}
          onSubmit={(updatedBus) => onUpdate(updatedBus)}
        />
      )}
      {isEditPersonnelModalOpen && (
        <EditPersonnelModal
          vehicle_id={vehicle_id}
          onClose={handleModalClose}
          onSubmit={(updatedPersonnel) => onUpdate(updatedPersonnel)}
        />
      )}
    </div>
  );
};

export default BusRecord;
