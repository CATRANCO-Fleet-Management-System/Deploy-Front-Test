"use client";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import PersonnelRecord from "@/app/components/PersonnelRecord";
import { deleteProfile, updateProfile } from "@/app/services/userProfile";

const ButtonGroup = ({ activeButton, onClick }) => (
  <div className="button-type-employee-container flex flex-row space-x-10 m-12">
    <button
      className={`px-4 py-2 border-2 rounded transition-colors duration-300 ease-in-out ${
        activeButton === "drivers" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700"
      }`}
      onClick={() => onClick("drivers")}
    >
      Drivers
    </button>
    <button
      className={`px-4 py-2 border-2 rounded transition-colors duration-300 ease-in-out ${
        activeButton === "Passenger Assistant Officer" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700"
      }`}
      onClick={() => onClick("conductors")}
    >
      Passenger Assistant Officer
    </button>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination flex items-center justify-center space-x-2 mt-12">
      <button
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          currentPage === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
            i + 1 === currentPage ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
          currentPage === totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  return new Date(ageDiff).getUTCFullYear() - 1970;
};

const Personnel = () => {
  const [activeButton, setActiveButton] = useState("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [addNewUrl, setAddNewUrl] = useState("/personnel/driver");
  const [profiles, setProfiles] = useState([
    {
      profile: {
        user_profile_id: 1,
        first_name: "John",
        last_name: "Doe",
        position: "driver",
        date_of_birth: "1990-05-15",
        license_number: "LIC-1234",
        address: "123 Main Street, Cityville",
        contact_number: "+639123456789",
        contact_person: "Jane Doe",
      },
    },
    {
      profile: {
        user_profile_id: 2,
        first_name: "Alice",
        last_name: "Smith",
        position: "passenger_assistant_officer",
        date_of_birth: "1985-10-20",
        license_number: "LIC-5678",
        address: "456 Elm Street, Townsville",
        contact_number: "+639987654321",
        contact_person: "Bob Smith",
      },
    },
    {
      profile: {
        user_profile_id: 3,
        first_name: "Robert",
        last_name: "Brown",
        position: "driver",
        date_of_birth: "1995-03-10",
        license_number: "LIC-9101",
        address: "789 Oak Avenue, Villageton",
        contact_number: "+639112233445",
        contact_person: "Emily Brown",
      },
    },
    {
      profile: {
        user_profile_id: 4,
        first_name: "Linda",
        last_name: "Taylor",
        position: "passenger_assistant_officer",
        date_of_birth: "1992-07-25",
        license_number: "LIC-3141",
        address: "101 Pine Lane, Metrocity",
        contact_number: "+639556677889",
        contact_person: "Michael Taylor",
      },
    },
  ]);

  const dropdownRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    setAddNewUrl(activeButton === "drivers" ? "/personnel/driver" : "/personnel/conductor");
  }, [activeButton]);

  const handleDelete = (recordId) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.profile.user_profile_id !== deleteRecordId));
        setDeleteRecordId(null);
        setIsDeletePopupOpen(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const handleEdit = (recordId) => {
    const profileToEdit = profiles.find((profile) => profile.profile.user_profile_id === recordId);
    if (profileToEdit) {
      setEditFormData(profileToEdit);
      setEditRecordId(recordId);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      if (editRecordId) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.profile.user_profile_id === editRecordId ? { ...profile, ...editFormData } : profile
          )
        );
        setEditRecordId(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const cancelEdit = () => {
    setEditRecordId(null);
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setCurrentPage(1);
  };

  const filteredProfiles = profiles.filter((profile) =>
    activeButton === "drivers"
      ? profile.profile.position === "driver"
      : activeButton === "conductors"
      ? profile.profile.position === "passenger_assistant_officer"
      : profile.profile.position === "Passenger Assistant Officer"
  );

  const finalFilteredProfiles = filteredProfiles.filter((profile) =>
    `${profile.profile.first_name} ${profile.profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(finalFilteredProfiles.length / itemsPerPage);

  const paginatedProfiles = finalFilteredProfiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Layout>
      <div className="w-full flex flex-col bg-slate-200">
        <Header title="Bus Personnel Management" />
        <div className="content flex flex-col flex-1">
          <ButtonGroup activeButton={activeButton} onClick={setActiveButton} />
          <div className="options flex items-center space-x-10 p-4 w-9/12 ml-10">
            <input
              type="text"
              placeholder={`Find ${activeButton}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
              <FaSearch size={22} className="mr-2" />
              Search
            </button>
            <a
              href={addNewUrl}
              className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <FaPlus size={22} className="mr-2" />
              Add New
            </a>
          </div>
          <div className="records flex flex-col h-full">
            <div className="output flex mt-4 items-center ml-14">
              {paginatedProfiles.map((profile) => (
                <PersonnelRecord
                  key={profile.profile.user_profile_id}
                  driverId={profile.profile.user_profile_id}
                  driverName={`${profile.profile.first_name} ${profile.profile.last_name}`}
                  birthday={profile.profile.date_of_birth}
                  age={calculateAge(profile.profile.date_of_birth)}
                  licenseNumber={profile.profile.license_number}
                  address={profile.profile.address}
                  contactNumber={profile.profile.contact_number}
                  contactPerson={profile.profile.contact_person}
                  onDelete={() => handleDelete(profile.profile.user_profile_id)}
                  onEdit={() => handleEdit(profile.profile.user_profile_id)}
                  onView={() => console.log(`View bio for ${profile.profile.user_profile_id}`)}
                />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
      <Confirmpopup isOpen={isDeletePopupOpen} onClose={cancelDelete} onConfirm={confirmDelete} />
    </Layout>
  );
};

export default Personnel;
