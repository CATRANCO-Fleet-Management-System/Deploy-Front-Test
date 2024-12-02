import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getVehicleAssignmentById, createVehicleAssignment } from "@/app/services/vehicleAssignService";
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
}) => {
  // State management
  const [assignmentId, setAssignmentId] = useState<string | null>(initialAssignmentId);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditBusModalOpen, setIsEditBusModalOpen] = useState(false); 
  const [isEditPersonnelModalOpen, setIsEditPersonnelModalOpen] = useState(false); 
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null); 
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

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
      onDelete();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  // Open modal for editing bus record
  const handleEditBus = () => {
    setSelectedVehicleId(vehicle_id); 
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
    setSelectedVehicleId(null); 
  };

  // Handle update and refresh
  const handleUpdate = () => {
    setIsEditBusModalOpen(false);
    setIsEditPersonnelModalOpen(false);
    // Refresh or trigger necessary actions after update
  };

  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      {/* Bus Record Details */}
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr><td className="border p-2 font-bold">Bus Number:</td><td className="border p-2">{busNumber}</td></tr>
          <tr><td className="border p-2 font-bold">OR Number:</td><td className="border p-2">{ORNumber}</td></tr>
          <tr><td className="border p-2 font-bold">CR Number:</td><td className="border p-2">{CRNumber}</td></tr>
          <tr><td className="border p-2 font-bold">Plate Number:</td><td className="border p-2">{plateNumber}</td></tr>
          <tr><td className="border p-2 font-bold">Third LBI:</td><td className="border p-2">{thirdLBI}</td></tr>
          {comprehensiveInsurance && <tr><td className="border p-2 font-bold">Comprehensive Insurance:</td><td className="border p-2">{comprehensiveInsurance}</td></tr>}
          <tr><td className="border p-2 font-bold">Assigned Driver:</td><td className="border p-2">{assignedDriver}</td></tr>
          <tr><td className="border p-2 font-bold">Assigned PAO:</td><td className="border p-2">{assignedPAO}</td></tr>
          <tr><td className="border p-2 font-bold">Route:</td><td className="border p-2">{route || "Not Assigned"}</td></tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 mt-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full" onClick={handleDelete} aria-label={`Delete ${busNumber}`}>
          Remove
        </button>

        {/* Edit Dropdown */}
        <div className="relative w-full" ref={dropdownRef}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full" onClick={toggleDropdown} aria-haspopup="true" aria-expanded={dropdownOpen}>
            Edit
          </button>
          {dropdownOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-4/5 bg-white border border-gray-300 rounded shadow-lg z-10">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem" onClick={handleEditBus}>
                Edit Bus Record
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem" onClick={handleEditPersonnel}>
                Edit Personnel Assignment
              </button>
            </div>
          )}
        </div>

        {/* View Bus Full Record Link */}
        <a href={`/bus-profiles/bus-records/${busNumber}`} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-center" role="link" aria-label={`View full record for ${busNumber}`}>
          View Bus Full Record
        </a>
      </div>

      {/* Modals */}
      {isEditBusModalOpen && <EditBusRecordModal vehicle_id={selectedVehicleId!} onClose={handleModalClose} onUpdate={handleUpdate} />}
      {isEditPersonnelModalOpen && <EditPersonnelModal vehicle_id={selectedVehicleId!} onClose={handleModalClose} onUpdate={handleUpdate} />}
    </div>
  );
};

export default BusRecord;
