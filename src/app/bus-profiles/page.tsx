"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus, FaHistory } from "react-icons/fa";
import BusRecord from "../components/BusRecord";
import AddBusRecordModal from "../components/AddBusRecordModal";
import AssignBusPersonnelModal from "../components/AssignBusPersonnelModal";
import Pagination from "../components/Pagination";
import { getAllVehicles, deleteVehicle } from "../services/vehicleService";
import {
  getAllVehicleAssignments,
  deleteVehicleAssignment,
} from "../services/vehicleAssignService";
import HistoryModalForBus from "../components/HistoryModalForBus";

const BusRecordDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState<string | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignPersonnelModalOpen, setIsAssignPersonnelModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [vehicleAssignments, setVehicleAssignments] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [busHistory, setBusHistory] = useState([]);

  interface BusRecordType {
    vehicle_id: string;
    plate_number: string;
    engine_number: string;
    chasis_number: string;
    or_id: string;
    cr_id: string;
    third_pli_policy_no: string;
    third_pli: string;
    ci: string;
    supplier: string;
    route: string | null;
    date_purchased: Date | string;
  }

  const [busRecords, setBusRecords] = useState<BusRecordType[]>([]);

  const fetchData = async () => {
    try {
      const vehicles = await getAllVehicles();
      const assignments = await getAllVehicleAssignments();
      setBusRecords(vehicles);
      setVehicleAssignments(assignments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openHistoryModal = () => {
    const history = busRecords.map((record) => {
      const { driver, conductor } = getAssignedProfiles(record.vehicle_id);
      return {
        busNumber: record.vehicle_id,
        plateNumber: record.plate_number,
        OR: record.or_id,
        CR: record.cr_id,
        driverAssigned: driver,
        paoAssigned: conductor,
        datePurchased: record.date_purchased || "N/A",
      };
    });
    setBusHistory(history);
    setIsHistoryModalOpen(true);
  };

  const handleDelete = (recordId, assignmentId) => {
    setDeleteRecordId(recordId);
    setDeleteAssignmentId(assignmentId); // Store the assignmentId
    setIsDeletePopupOpen(true); // Open the confirmation popup
  };

  const confirmDelete = async () => {
    if (deleteRecordId && deleteAssignmentId) {
      try {
        // Optimistically remove the record from the UI
        setBusRecords((prev) =>
          prev.filter((record) => record.vehicle_id !== deleteRecordId)
        );

        // Call the delete APIs for both vehicle and assignment
        const [vehicleResponse, assignmentResponse] = await Promise.all([
          deleteVehicle(deleteRecordId),
          deleteVehicleAssignment(deleteAssignmentId),
        ]);

        // Log both responses to inspect them
        console.log("Vehicle Response:", vehicleResponse);
        console.log("Assignment Response:", assignmentResponse);

        // Check the message content for success
        if (
          vehicleResponse?.message === "Vehicle Deleted Successfully" &&
          assignmentResponse?.message ===
            "Vehicle Assignment Deleted Successfully"
        ) {
          console.log("Vehicle and assignment deleted successfully.");
        } else {
          console.log(
            "Vehicle or assignment deletion failed.",
            vehicleResponse,
            assignmentResponse
          );
          alert("An error occurred while deleting the vehicle or assignment.");
          await fetchData(); // Re-fetch data if necessary
        }
      } catch (error) {
        // Log the error details
        console.error("Error deleting vehicle and/or assignment:", error);

        if (error.response) {
          console.log("Error response data:", error.response.data);
        }

        alert("An error occurred while deleting the vehicle or assignment.");
        await fetchData();
      } finally {
        // Close the confirmation popup
        setDeleteRecordId(null);
        setDeleteAssignmentId(null);
        setIsDeletePopupOpen(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false); // This closes the popup
  };

  // Handle adding a new bus record
  const handleAddNewBus = (newBus: any) => {
    setBusRecords((prevRecords) => [...prevRecords, newBus]);
    setSelectedVehicleId(newBus.vehicle_id);
    setIsAssignPersonnelModalOpen(true);
    fetchData();
  };

  const handleEditBus = (updatedBus) => {
    setBusRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.vehicle_id === updatedBus.vehicle_id ? updatedBus : record
      )
    );
    setIsEditModalOpen(false);
    fetchData();
  };

  // Callback for updating vehicle assignments
  const handleAddVehicleAssignment = (newAssignment) => {
    // Log the new assignment being added
    console.log("New Assignment:", newAssignment);

    // Update the state with the new assignment
    setVehicleAssignments((prevAssignments) => {
      const updatedAssignments = [...prevAssignments, newAssignment];

      // Log the updated list after adding the new assignment
      console.log("Updated Assignments:", updatedAssignments);

      return updatedAssignments;
    });
  };

  // Filter bus records by search term
  const filteredRecords = busRecords.filter((record) =>
    record.plate_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the assigned profiles for a vehicle
  const getAssignedProfiles = (vehicleId) => {
    const assignment = vehicleAssignments.find(
      (assignment) => assignment.vehicle_id === vehicleId
    );

    if (!assignment) {
      return { driver: "N/A", conductor: "N/A" };
    }

    const driver = assignment.user_profiles.find(
      (profile) => profile.position === "driver"
    );
    const conductor = assignment.user_profiles.find(
      (profile) => profile.position === "passenger_assistant_officer"
    );

    return {
      driver: driver ? `${driver.first_name} ${driver.last_name}` : "N/A",
      conductor: conductor
        ? `${conductor.first_name} ${conductor.last_name}`
        : "N/A",
    };
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Layout>
      <Header title="Bus Profiles" />
      <div className="options flex flex-col md:flex-row items-center p-4 w-full md:w-9/12 ml-1 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Find bus"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:mr-4 w-full md:w-auto"
        />

        <div className="flex flex-col md:flex-row w-full md:w-auto md:space-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50 w-full md:w-auto mb-4 md:mb-0"
          >
            <FaPlus size={22} className="mr-2" />
            Add New
          </button>

          <button
            onClick={openHistoryModal}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full md:w-auto"
          >
            <FaHistory size={22} className="mr-2" />
            View History
          </button>
        </div>
      </div>

      <div className="records flex flex-col h-full">
        <div className="output grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 ml-5">
          {paginatedRecords.map((record) => {
            const { driver, conductor } = getAssignedProfiles(
              record.vehicle_id
            );
            const assignment = vehicleAssignments.find(
              (assignment) => assignment.vehicle_id === record.vehicle_id
            );
            const assignmentId = assignment
              ? assignment.vehicle_assignment_id
              : "";

            return (
              <BusRecord
                key={record.vehicle_id}
                vehicle_id={record.vehicle_id}
                busNumber={record.vehicle_id}
                ORNumber={record.or_id}
                CRNumber={record.cr_id}
                plateNumber={record.plate_number}
                thirdLBI={record.third_pli}
                ci={record.ci}
                assignedDriver={driver}
                assignedPAO={conductor}
                route={record.route || "Not Assigned"}
                assignmentId={assignmentId} // Add this line
                onDelete={() => handleDelete(record.vehicle_id, assignmentId)} // Update this line
                onUpdate={handleEditBus}
              />
            );
          })}
        </div>
        <div className="pagination-container mb-[46%]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {isDeletePopupOpen && (
        <Confirmpopup
          isOpen={isDeletePopupOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Profile" // Pass title here
          message="Are you sure you want to delete this profile?"
        />
      )}
      {isAddModalOpen && (
        <AddBusRecordModal
          onClose={() => setIsAddModalOpen(false)}
          refreshData={fetchData}
          onSubmit={(newBus) => {
            handleAddNewBus(newBus);
          }}
        />
      )}
      {isAssignPersonnelModalOpen && (
        <AssignBusPersonnelModal
          onClose={() => setIsAssignPersonnelModalOpen(false)}
          refreshData={fetchData}
          onAssign={handleAddVehicleAssignment}
          vehicleId={selectedVehicleId}
          preSelectedVehicle={selectedVehicleId}
        />
      )}

      {isHistoryModalOpen && (
        <HistoryModalForBus
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          history={busHistory}
        />
      )}
    </Layout>
  );
};

export default BusRecordDisplay;
