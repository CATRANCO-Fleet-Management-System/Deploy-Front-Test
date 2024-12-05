"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import BusRecord from "../components/BusRecord";
import AddBusRecordModal from "../components/AddBusRecordModal";
import AssignBusPersonnelModal from "../components/AssignBusPersonnelModal";
import EditBusRecordModal from "../components/EditBusRecordModal";
import { getAllVehicles, deleteVehicle } from "../services/vehicleService";
import { getAllVehicleAssignments } from "../services/vehicleAssignService";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination flex items-center justify-center space-x-2 mt-8">
      <button
        className={`px-3 py-1 border-2 rounded ${
          currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 border-2 rounded ${
            i + 1 === currentPage ? "bg-blue-500 text-white" : "text-gray-700"
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`px-3 py-1 border-2 rounded ${
          currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

const BusRecordDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignPersonnelModalOpen, setIsAssignPersonnelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [busRecords, setBusRecords] = useState([]);
  const [vehicleAssignments, setVehicleAssignments] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Fetch data from the backend
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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle deleting a vehicle
  const handleDelete = (recordId) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteVehicle(deleteRecordId);
        setBusRecords((prev) => prev.filter((record) => record.vehicle_id !== deleteRecordId));
        setVehicleAssignments((prev) =>
          prev.filter((assignment) => assignment.vehicle_id !== deleteRecordId)
        );
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      } finally {
        setDeleteRecordId(null);
        setIsDeletePopupOpen(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  // Handle adding a new bus record
  const handleAddNewBus = (newBus) => {
    setBusRecords((prevRecords) => [...prevRecords, newBus]);
    setSelectedVehicleId(newBus.vehicle_id);
    setIsAssignPersonnelModalOpen(true);
  };

  // Handle editing a bus record
  const handleEditBus = (updatedBus) => {
    setBusRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.vehicle_id === updatedBus.vehicle_id ? updatedBus : record
      )
    );
    setIsEditModalOpen(false); // Close the modal
  };

  // Callback for updating vehicle assignments
  const handleAddVehicleAssignment = (newAssignment) => {
    setVehicleAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
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

    const driver = assignment.user_profiles.find((profile) => profile.position === "driver");
    const conductor = assignment.user_profiles.find(
      (profile) => profile.position === "passenger_assistant_officer"
    );

    return {
      driver: driver ? `${driver.first_name} ${driver.last_name}` : "N/A",
      conductor: conductor ? `${conductor.first_name} ${conductor.last_name}` : "N/A",
    };
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <Header title="Bus Profiles" />
      <div className="options flex items-center space-x-10 p-4 w-9/12 ml-8">
        <input
          type="text"
          placeholder="Find bus"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center px-4 py-2 border-2 rounded-md text-blue-500">
          <FaSearch size={22} className="mr-2" />
          Search
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
        >
          <FaPlus size={22} className="mr-2" />
          Add New
        </button>
      </div>
      <div className="records flex flex-col h-full">
        <div className="output flex mt-2 items-center ml-8 flex-wrap gap-4">
          {paginatedRecords.map((record) => {
            const { driver, conductor } = getAssignedProfiles(record.vehicle_id);

            return (
              <BusRecord
                key={record.vehicle_id}
                vehicle_id={record.vehicle_id}
                busNumber={record.vehicle_id}
                ORNumber={record.or_id}
                CRNumber={record.cr_id}
                plateNumber={record.plate_number}
                thirdLBI={record.third_pli}
                comprehensiveInsurance={record.comprehensive_insurance || "N/A"}
                assignedDriver={driver}
                assignedPAO={conductor}
                route={record.route || "Not Assigned"}
                onDelete={() => handleDelete(record.vehicle_id)}
                onEdit={() => {
                  setSelectedVehicleId(record.vehicle_id);
                  setIsEditModalOpen(true);
                }}
              />
            );
          })}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {isDeletePopupOpen && (
        <Confirmpopup
          isOpen={isDeletePopupOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Delete Profile"
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
          preSelectedVehicle={selectedVehicleId}
        />
      )}
      {isEditModalOpen && (
        <EditBusRecordModal
          vehicle_id={selectedVehicleId}
          onClose={() => setIsEditModalOpen(false)}
          refreshData={fetchData}
          onSubmit={handleEditBus}
        />
      )}
    </Layout>
  );
};

export default BusRecordDisplay;
