"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import PersonnelRecord from "../components/PersonnelRecord"; // Import the RecordBox component

// ButtonGroup Component
const ButtonGroup = ({ activeButton, onClick }) => {
  return (
    <div className="button-type-employee-container flex flex-row space-x-10 m-12">
      <button
        className={`px-4 py-2 border-2 rounded transition-colors duration-300 ease-in-out ${
          activeButton === "drivers"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-gray-700"
        }`}
        onClick={() => onClick("drivers")}
      >
        Drivers
      </button>
      <button
        className={`px-4 py-2 border-2 rounded transition-colors duration-300 ease-in-out ${
          activeButton === "Passenger Assistant Officer"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-gray-700"
        }`}
        onClick={() => onClick("Passenger Assistant Officer")}
      >
        Passenger Assistant Officer
      </button>
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
    <div className="pagination flex items-center justify-center space-x-2 mt-12">
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

// Personnel Component
const Personnel = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Number of records per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [addNewUrl, setAddNewUrl] = useState("/personnel/driver"); // State for the Add New button URL
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Update the URL based on the active button
    setAddNewUrl(
      activeButton === "drivers"
        ? "/personnel/driver"
        : "/personnel/conductor"
    );
  }, [activeButton]);

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
    setCurrentPage(1); // Reset to first page when changing types
  };

  const handleDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (deleteRecordId) {
      console.log(`Confirmed delete for record ID: ${deleteRecordId}`);
      setDeleteRecordId(null);
      setIsDeletePopupOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const driverRecords = [
    { id: "001", name: "Name 1", birthday: "1985-05-15", age: 39, licenseNumber: "DL1234567", address: "123 Main St, Anytown", contactNumber: "555-1234", contactPerson: "John Doe", contactPersonNumber: "090009213123" },
    { id: "002", name: "Name 2", birthday: "1986-06-16", age: 38, licenseNumber: "DL2345678", address: "234 Oak St, Anytown", contactNumber: "555-2345", contactPerson: "Alice Smith", contactPersonNumber: "090009213124" },
    { id: "003", name: "Name 3", birthday: "1987-07-17", age: 37, licenseNumber: "DL3456789", address: "345 Pine St, Anytown", contactNumber: "555-3456", contactPerson: "Bob Johnson", contactPersonNumber: "090009213125" },
    { id: "004", name: "Name 4", birthday: "1988-08-18", age: 36, licenseNumber: "DL4567890", address: "456 Maple St, Anytown", contactNumber: "555-4567", contactPerson: "Carol Williams", contactPersonNumber: "090009213126" },
    { id: "005", name: "Name 5", birthday: "1989-09-19", age: 35, licenseNumber: "DL5678901", address: "567 Birch St, Anytown", contactNumber: "555-5678", contactPerson: "David Brown", contactPersonNumber: "090009213127" },
    { id: "006", name: "Name 6", birthday: "1990-10-20", age: 34, licenseNumber: "DL6789012", address: "678 Maple St, Anytown", contactNumber: "555-6789", contactPerson: "Emily Davis", contactPersonNumber: "090009213128" },
    { id: "007", name: "Name 7", birthday: "1991-11-21", age: 33, licenseNumber: "DL7890123", address: "789 Oak St, Anytown", contactNumber: "555-7890", contactPerson: "Frank Miller", contactPersonNumber: "090009213129" },
    { id: "008", name: "Name 8", birthday: "1992-12-22", age: 32, licenseNumber: "DL8901234", address: "890 Pine St, Anytown", contactNumber: "555-8901", contactPerson: "Grace Wilson", contactPersonNumber: "090009213130" },
    { id: "009", name: "Name 9", birthday: "1993-01-23", age: 31, licenseNumber: "DL9012345", address: "901 Elm St, Anytown", contactNumber: "555-9012", contactPerson: "Henry Moore", contactPersonNumber: "090009213131" },
    { id: "010", name: "Name 10", birthday: "1994-02-24", age: 30, licenseNumber: "DL0123456", address: "012 Fir St, Anytown", contactNumber: "555-0123", contactPerson: "Ivy Taylor", contactPersonNumber: "090009213132" }
  ];
  
  
  const PAORecords = [
    { id: "011", name: "PAO 1", birthday: "1990-10-22", age: 34, gender: "Male", address: "456 Elm St, Anytown", contactNumber: "555-5678", contactPerson: "Jane Doe", contactPersonNumber: "090009213133" },
    { id: "012", name: "PAO 2", birthday: "1991-11-23", age: 33, gender: "Female", address: "567 Cedar St, Anytown", contactNumber: "555-6789", contactPerson: "Tom White", contactPersonNumber: "090009213134" },
    { id: "013", name: "PAO 3", birthday: "1992-12-24", age: 32, gender: "Male", address: "678 Fir St, Anytown", contactNumber: "555-7890", contactPerson: "Mary Green", contactPersonNumber: "090009213135" },
    { id: "014", name: "PAO 4", birthday: "1993-01-25", age: 31, gender: "Female", address: "789 Pine St, Anytown", contactNumber: "555-8901", contactPerson: "Peter Black", contactPersonNumber: "090009213136" },
    { id: "015", name: "PAO 5", birthday: "1994-02-26", age: 30, gender: "Male", address: "890 Oak St, Anytown", contactNumber: "555-9012", contactPerson: "Nina Adams", contactPersonNumber: "090009213137" },
    { id: "016", name: "PAO 6", birthday: "1995-03-27", age: 29, gender: "Female", address: "901 Birch St, Anytown", contactNumber: "555-0123", contactPerson: "Oscar Clark", contactPersonNumber: "090009213138" },
    { id: "017", name: "PAO 7", birthday: "1996-04-28", age: 28, gender: "Male", address: "012 Cedar St, Anytown", contactNumber: "555-1234", contactPerson: "Paul Harris", contactPersonNumber: "090009213139" },
    { id: "018", name: "PAO 8", birthday: "1997-05-29", age: 27, gender: "Female", address: "123 Fir St, Anytown", contactNumber: "555-2345", contactPerson: "Quinn Lewis", contactPersonNumber: "090009213140" },
    { id: "019", name: "PAO 9", birthday: "1998-06-30", age: 26, gender: "Male", address: "234 Elm St, Anytown", contactNumber: "555-3456", contactPerson: "Rachel Martinez", contactPersonNumber: "090009213141" },
    { id: "020", name: "PAO 10", birthday: "1999-07-31", age: 25, gender: "Female", address: "345 Pine St, Anytown", contactNumber: "555-4567", contactPerson: "Steve Robinson", contactPersonNumber: "090009213142" }
  ];

  const records = activeButton === "drivers" ? driverRecords : PAORecords;
  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Get paginated records
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="flex flex-row h-screen bg-white">
      <Sidebar />
      <div className="w-full flex flex-col bg-slate-200">
        <Header title="Bus Personnel Management" />
        <div className="content flex flex-col flex-1">
          <ButtonGroup
            activeButton={activeButton}
            onClick={handleButtonClick}
          />
          <div className="options flex items-center space-x-10 p-4 w-9/12  ml-10">
            <input
              type="text"
              placeholder="Find driver"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
              <FaSearch size={22} className="mr-2" />
              Search
            </button>
            <a
              href={addNewUrl} // Use the dynamic URL here
              className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <FaPlus size={22} className="mr-2" />
              Add New
            </a>
          </div>
          <div className="records flex flex-col h-full">
            <div className="output flex mt-4 items-center ml-14">
              {paginatedRecords.map((record) => (
                <PersonnelRecord
                  key={record.id}
                  driverId={record.id}
                  driverName={record.name}
                  birthday={record.birthday}
                  age={record.age}
                  licenseNumber={record.licenseNumber}
                  address={record.address}
                  contactNumber={record.contactNumber}
                  contactPerson={record.contactPerson}
                  onDelete={() => handleDelete(record.id)}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <Confirmpopup
        isOpen={isDeletePopupOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default Personnel;
