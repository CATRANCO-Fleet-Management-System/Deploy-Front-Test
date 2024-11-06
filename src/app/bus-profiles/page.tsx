"use client";
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import BusRecord from "../components/BusRecord";
<<<<<<< HEAD
import { getAllVehicles, deleteVehicle } from "../services/vehicleService";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicleAssignments } from "@/app/services/vehicleAssignService";

=======


// Pagination Component
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
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

<<<<<<< HEAD
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
=======
// BusRecord Display Component
const BusRecordDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Number of records per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [busRecords, setBusRecords] = useState([
    { id: "001", busNumber: "Bus 001", ORNumber: "OR 12345", CRNumber: "CR 12345", plateNumber: "ABC123", thirdLBI: "TLI001", comprehensiveInsurance: "CI001", assignedDriver: "John Doe", assignedPAO: "Michael Smith", route: "Canitoan to Cogon" },
    { id: "002", busNumber: "Bus 002", ORNumber: "OR 12346", CRNumber: "CR 12346", plateNumber: "ABC124", thirdLBI: "TLI002", comprehensiveInsurance: "CI002", assignedDriver: "Jane Smith", assignedPAO: "Emily Davis", route: "Silver Creek to Cogon" },
    { id: "003", busNumber: "Bus 003", ORNumber: "OR 12347", CRNumber: "CR 12347", plateNumber: "ABC125", thirdLBI: "TLI003", comprehensiveInsurance: "CI003", assignedDriver: "Alice Johnson", assignedPAO: "David Wilson", route: "Canitoan to Cogon" },
    { id: "004", busNumber: "Bus 004", ORNumber: "OR 12348", CRNumber: "CR 12348", plateNumber: "ABC126", thirdLBI: "TLI004", comprehensiveInsurance: "CI004", assignedDriver: "Bob Brown", assignedPAO: "Sarah Johnson", route: "Silver Creek to Cogon" },
    { id: "005", busNumber: "Bus 005", ORNumber: "OR 12349", CRNumber: "CR 12349", plateNumber: "ABC127", thirdLBI: "TLI005", comprehensiveInsurance: "CI005", assignedDriver: "Charlie Davis", assignedPAO: "James Taylor", route: "Canitoan to Cogon" },
    { id: "006", busNumber: "Bus 006", ORNumber: "OR 12350", CRNumber: "CR 12350", plateNumber: "ABC128", thirdLBI: "TLI006", comprehensiveInsurance: "CI006", assignedDriver: "Diana Evans", assignedPAO: "Laura Martin", route: "Silver Creek to Cogon" },
    { id: "007", busNumber: "Bus 007", ORNumber: "OR 12351", CRNumber: "CR 12351", plateNumber: "ABC129", thirdLBI: "TLI007", comprehensiveInsurance: "CI007", assignedDriver: "Edward Fox", assignedPAO: "William Lee", route: "Canitoan to Cogon" },
    { id: "008", busNumber: "Bus 008", ORNumber: "OR 12352", CRNumber: "CR 12352", plateNumber: "ABC130", thirdLBI: "TLI008", comprehensiveInsurance: "CI008", assignedDriver: "Fiona Green", assignedPAO: "Elizabeth Walker", route: "Silver Creek to Cogon" },
    { id: "009", busNumber: "Bus 009", ORNumber: "OR 12353", CRNumber: "CR 12353", plateNumber: "ABC131", thirdLBI: "TLI009", comprehensiveInsurance: "CI009", assignedDriver: "George Harris", assignedPAO: "Richard Hall", route: "Canitoan to Cogon" },
    { id: "010", busNumber: "Bus 010", ORNumber: "OR 12354", CRNumber: "CR 12354", plateNumber: "ABC132", thirdLBI: "TLI010", comprehensiveInsurance: "CI010", assignedDriver: "Hannah Johnson", assignedPAO: "Patricia Young", route: "Silver Creek to Cogon" },
    { id: "011", busNumber: "Bus 011", ORNumber: "OR 12355", CRNumber: "CR 12355", plateNumber: "ABC133", thirdLBI: "TLI011", comprehensiveInsurance: "CI011", assignedDriver: "Ivy Taylor", assignedPAO: "Christ King", route: "Canitoan to Cogon" },
    { id: "012", busNumber: "Bus 012", ORNumber: "OR 12355", CRNumber: "CR 12355", plateNumber: "ABC133", thirdLBI: "TLI011", comprehensiveInsurance: "CI011", assignedDriver: "Ivy Taylor", assignedPAO: "Christ King", route: "Canitoan to Cogon" },
  ]);
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f

  const handleDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
<<<<<<< HEAD
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
=======
      setBusRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== deleteRecordId)
      );
      setDeleteRecordId(null);
      setIsDeletePopupOpen(false);
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const filteredRecords = busRecords.filter((record) =>
<<<<<<< HEAD
    record.plate_number && record.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
=======
    record.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Get paginated records
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
<<<<<<< HEAD

  const getAssignedProfiles = (vehicleId) => {
    const assignments = vehicleAssignments.filter(
      (assignment) => assignment.vehicle_id === vehicleId
    );
  
    if (assignments.length === 0) {
      return { driver: "N/A", conductor: "N/A" };
    }
  
    // Since user_profiles is an array, directly map them
    const driverAssignment = assignments.find(assignment => assignment.user_profiles.some(profile => profile.position === "driver"));
    const conductorAssignment = assignments.find(assignment => assignment.user_profiles.some(profile => profile.position === "passenger_assistant_officer"));
  
    const driver = driverAssignment
      ? driverAssignment.user_profiles.find(profile => profile.position === "driver")
      : null;
  
    const conductor = conductorAssignment
      ? conductorAssignment.user_profiles.find(profile => profile.position === "passenger_assistant_officer")
      : null;
  
    return {
      driver: driver ? `${driver.first_name} ${driver.last_name}` : "N/A",
      conductor: conductor ? `${conductor.first_name} ${conductor.last_name}` : "N/A",
    };
  };
=======
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f

  return (
    <section className="flex flex-row h-screen bg-white">
      <Sidebar />
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
<<<<<<< HEAD
              {paginatedRecords.map((record) => {
                const { driver, conductor } = getAssignedProfiles(record.vehicle_id);

                return (
                  <BusRecord
                    key={record.vehicle_id}
                    vehicle_id={record.vehicle_id}
                    busNumber={record.vehicle_id} // Or use another field if needed
                    ORNumber={record.or_id}
                    CRNumber={record.cr_id}
                    plateNumber={record.plate_number}
                    thirdLBI={record.third_pli}
                    comprehensiveInsurance={null} // Or any other logic if applicable
                    assignedDriver={driver} // Use the driver from getAssignedProfiles
                    assignedPAO={conductor} // Use the conductor from getAssignedProfiles
                    route={null} // Or provide actual route if available
                    onDelete={() => handleDelete(record.vehicle_id)} // Your delete logic
                  />
                );
              })}
=======
              {paginatedRecords.map((record) => (
                <BusRecord
                  key={record.id}
                  busNumber={record.busNumber}
                  ORNumber={record.ORNumber}
                  CRNumber={record.CRNumber}
                  plateNumber={record.plateNumber}
                  engineNumber={record.engineNumber}
                  chasisNumber={record.chasisNumber}
                  thirdLBI={record.thirdLBI}
                  comprehensiveInsurance={record.comprehensiveInsurance}
                  assignedDriver={record.assignedDriver} // New field
                  assignedPAO={record.assignedPAO} // New field
                  route={record.route} // New field
                  onDelete={() => handleDelete(record.id)}
                />
              ))}
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
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
    </section>
  );
};

export default BusRecordDisplay;
