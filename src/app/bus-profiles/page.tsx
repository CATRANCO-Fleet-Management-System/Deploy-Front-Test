"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import BusRecord from "../components/BusRecord";
import AddBusRecordModal from "../components/AddBusRecordModal";
import { getAllVehicles, deleteVehicle, createVehicle } from "../services/vehicleService";
import { getAllVehicleAssignments } from "../services/vehicleAssignService";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination flex items-center justify-center space-x-2 mt-8">
      <button
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          currentPage === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
            i + 1 === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          currentPage === totalPages
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
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
  const [busRecords, setBusRecords] = useState([]);
  const [vehicleAssignments, setVehicleAssignments] = useState([]);

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
  const handleDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteVehicle(deleteRecordId);
        fetchData(); // Refetch data after deletion
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
  const handleAddNewBus = async (newBus) => {
    try {
      await createVehicle(newBus); // Add new vehicle via service
      fetchData(); // Refetch data after adding a new bus
    } catch (error) {
      console.error("Error adding new bus:", error);
    }
  };

  // Filter bus records by search term
  const filteredRecords = busRecords.filter((record) =>
    record.plate_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the assigned profiles for a vehicle
  const getAssignedProfiles = (vehicleId: string) => {
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
        <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
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
                refreshData={fetchData} // Pass the refetch function
              />
            );
          })}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {isDeletePopupOpen && (
        <Confirmpopup
          message="Are you sure you want to delete this vehicle?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {isAddModalOpen && (
        <AddBusRecordModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddNewBus} // Pass the onSubmit function
        />
      )}
    </Layout>
  );
};

export default BusRecordDisplay;
