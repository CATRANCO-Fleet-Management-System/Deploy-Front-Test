"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"; // Import Layout component
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import BusRecord from "../components/BusRecord";
import { getAllVehicles, deleteVehicle } from "../services/vehicleService";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicleAssignments } from "@/app/services/vehicleAssignService";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const createPageButtons = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
            i === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <div className="pagination flex items-center justify-center space-x-2 mt-8">
      <button
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          currentPage === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {createPageButtons()}
      <button
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          currentPage === totalPages
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
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
  const [busRecords, setBusRecords] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [vehicleAssignments, setVehicleAssignments] = useState([]);

  useEffect(() => {
    const fetchBusRecords = async () => {
      try {
        const data = await getAllVehicles();
        setBusRecords(data);
      } catch (error) {
        console.error("Error fetching bus records:", error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const data = await getAllProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    const fetchVehicleAssignments = async () => {
      try {
        const data = await getAllVehicleAssignments();
        setVehicleAssignments(data);
      } catch (error) {
        console.error("Error fetching vehicle assignments:", error);
      }
    };

    fetchBusRecords();
    fetchProfiles();
    fetchVehicleAssignments();
  }, []);

  const handleDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteVehicle(deleteRecordId);
        setBusRecords((prevRecords) =>
          prevRecords.filter((record) => record.vehicle_id !== deleteRecordId)
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

  const filteredRecords = busRecords.filter((record) =>
    record.plate_number && record.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAssignedProfiles = (vehicleId) => {
    const assignments = vehicleAssignments.filter(
      (assignment) => assignment.vehicle_id === vehicleId
    );

    if (assignments.length === 0) {
      return { driver: "N/A", conductor: "N/A" };
    }

    const driverAssignment = assignments.find((assignment) =>
      assignment.user_profiles.some((profile) => profile.position === "driver")
    );
    const conductorAssignment = assignments.find((assignment) =>
      assignment.user_profiles.some(
        (profile) => profile.position === "passenger_assistant_officer"
      )
    );

    const driver = driverAssignment
      ? driverAssignment.user_profiles.find(
          (profile) => profile.position === "driver"
        )
      : null;

    const conductor = conductorAssignment
      ? conductorAssignment.user_profiles.find(
          (profile) => profile.position === "passenger_assistant_officer"
        )
      : null;

    return {
      driver: driver ? `${driver.first_name} ${driver.last_name}` : "N/A",
      conductor: conductor ? `${conductor.first_name} ${conductor.last_name}` : "N/A",
    };
  };

  return (
    <Layout>
      <div className="w-full flex flex-col bg-slate-200">
        <Header title="Bus" />
        <div className="content flex flex-col flex-1">
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
            <a
              href="bus-profiles/bus-add"
              className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <FaPlus size={22} className="mr-2" />
              Add New
            </a>
          </div>
          <div className="records flex flex-col h-full">
            <div className="output flex mt-2 items-center ml-8">
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
                    comprehensiveInsurance={null}
                    assignedDriver={driver}
                    assignedPAO={conductor}
                    route={null}
                    onDelete={() => handleDelete(record.vehicle_id)}
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
        </div>
      </div>
    </Layout>
  );
};

export default BusRecordDisplay;
