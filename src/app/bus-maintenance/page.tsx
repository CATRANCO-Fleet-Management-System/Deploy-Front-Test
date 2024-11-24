"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaBus, FaSearch, FaPlus, FaEllipsisV } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  getAllMaintenanceScheduling,
  deleteMaintenanceScheduling,
} from "@/app/services/maintenanceService"; // Import the maintenance services

const RecordBox = ({ busId, maintenanceStatus, description, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState(maintenanceStatus);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent the parent click event
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDescription = () => setIsDescriptionVisible(!isDescriptionVisible);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMaintenanceStatus = () => {
    setStatus((prevStatus) => (prevStatus === "Active" ? "Inactive" : "Active"));
  };

  return (
    <div
      className="record-box-container w-auto h-auto bg-white border-gray-200 rounded-lg border-2 flex flex-col items-start p-4 relative cursor-pointer"
      onClick={toggleDescription}
    >
      <div className="flex items-center w-full">
        <div className="logo flex-shrink-0">
          <FaBus size={42} className="rounded-full border border-gray-400 p-2" />
        </div>
        <div className="title flex flex-1 space-x-96 ml-8">
          <h1 className="type-notif black font-normal">{busId}</h1>
          <h1 className="type-notif text-gray-500 font-normal">
            Maintenance #: {busId}
          </h1>
          <h1 className={`${status === "Active" ? "text-green-500" : "text-red-400"}`}>
            {status}
          </h1>
        </div>
        <div className="menu flex-shrink-0 relative">
          <FaEllipsisV size={35} className="p-2 cursor-pointer" onClick={toggleMenu} />
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50"
              onClick={(e) => e.stopPropagation()} // Prevent click propagation here as well
            >
              <button
                className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggle of the description
                  onEdit(busId); // Pass busId to onEdit for navigation
                }}
              >
                Edit
              </button>
              <button
                className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggle of the description
                  onDelete();
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      {isDescriptionVisible && (
        <div className="description mt-4 text-gray-700">
          <p>
            <strong>Description:</strong> {description}
          </p>
          <button
            onClick={toggleMaintenanceStatus}
            className="mt-2 px-4 py-2 border-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-200"
          >
            {status === "Active" ? "Set Inactive" : "Set Active"}
          </button>
        </div>
      )}
    </div>
  );
};




// Records Component with search functionality
const Records = ({ busRecords, onDelete, onEdit }) => {
  if (busRecords.length === 0) {
    return <p>No bus records found.</p>;
  }

  return (
    <div className="record-box w-5/6 h-96 space-y-2">
      {busRecords.map((record) => (
        <RecordBox
          key={record.maintenance_scheduling_id} // Corrected property name
          busId={record.maintenance_scheduling_id} // Corrected property name
          maintenanceStatus={record.maintenance_status === "active" ? "Active" : "Inactive"} // Adjust according to your logic
          description={`Cost: ${record.maintenance_cost}, Description: ${record.maintenance_type}, Date: ${record.maintenance_date}`} // Concatenate to show more info
          onDelete={() => onDelete(record.maintenance_scheduling_id)}
          onEdit={() => onEdit(record.maintenance_scheduling_id)}// Implement edit logic here
        />
      ))}
    </div>
  );
};


// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const createPageButtons = () => {
    const pageButtons = Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => (
      <button
        key={p}
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          p === currentPage
            ? "bg-blue-500 text-white border-blue-500"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => handlePageChange(p)}
      >
        {p}
      </button>
    ));

    return pageButtons;
  };

  return (
    <div className="pagination flex items-center justify-center space-x-2 mt-20">
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

// Main DashboardHeader Component
const DashboardHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [updateRecordId, setUpdateRecordId] = useState<string | null>(null);
  const [busRecords, setBusRecords] = useState([]); 
  const router = useRouter();

  // Fetch maintenance records when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const maintenanceRecords = await getAllMaintenanceScheduling();
        setBusRecords(maintenanceRecords);
        setTotalPages(Math.ceil(maintenanceRecords.length / 4)); 
      } catch (error) {
        console.error("Error fetching maintenance records:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteMaintenanceScheduling(deleteRecordId);
        setBusRecords(busRecords.filter((record) => record.maintenance_scheduling_id !== deleteRecordId)); // Ensure to match the right property
        setDeleteRecordId(null);
        setIsDeletePopupOpen(false);
      } catch (error) {
        console.error("Error deleting maintenance record:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  // Update filtering logic to match property names correctly
  const filteredBusRecords = busRecords.filter((record) =>
    record.maintenance_scheduling_id && record.maintenance_scheduling_id.toString().includes(searchTerm)
  );

  const handleAddNewClick = () => {
    router.push("bus-maintenance/add-record");
  };

  const handleEdit = (recordId) => {
    const recordExists = busRecords.some(record => record.maintenance_scheduling_id === recordId);
    
    if (recordExists) {
      router.push(`/bus-maintenance/edit-record?id=${recordId}`);
    } else {
      router.push(`/bus-maintenance/not-found`); // Redirect to not found page
    }
  };;
  
  // ...
  
  <Records busRecords={filteredBusRecords} onDelete={handleDelete} onEdit={handleEdit} />

  return (
    <section className="flex flex-row h-screen bg-white">
      <Sidebar />
      <div className="w-full flex flex-col bg-slate-200">
        <Header title="Bus Maintenance Management" />
        <div className="content flex flex-col flex-1">
          <div className="options flex items-center space-x-10 p-4 w-9/12 m-5 ml-10">
            <input
              type="text"
              placeholder="Find bus"
              className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
              <FaSearch size={22} className="mr-2" />
              Search
            </button>

            {/* Add New Button */}
            <button
              className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
              onClick={handleAddNewClick} // Navigate to the add page
            >
              <FaPlus size={22} className="mr-2" />
              Add New
            </button>
          </div>
          <Records busRecords={filteredBusRecords} onDelete={handleDelete} onEdit={handleEdit} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <Confirmpopup
            isOpen={isDeletePopupOpen}
            onConfirm={confirmDelete}
            onClose={cancelDelete}
            title="Confirm Delete"
            message="Are you sure you want to delete this record?"
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;
