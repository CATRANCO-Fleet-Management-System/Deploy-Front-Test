"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import AddDriverModal from "../components/AddDriverModal";
import AddAssistantOfficerModal from "../components/AddAssistantOfficerModal";
import EditDriverModal from "../components/EditDriverModal";
import EditAssistantOfficerModal from "../components/EditAssistantOfficerModal"; // Import EditAssistantOfficerModal
import { FaSearch, FaPlus } from "react-icons/fa";
import PersonnelRecord from "@/app/components/PersonnelRecord";
import { getAllProfiles, deleteProfile } from "@/app/services/userProfile";

const ButtonGroup = ({ activeButton, onClick }) => (
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
        activeButton === "conductors"
          ? "border-blue-500 text-blue-500"
          : "border-transparent text-gray-700"
      }`}
      onClick={() => onClick("conductors")}
    >
      Passenger Assistant Officer
    </button>
  </div>
);

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  return new Date(ageDiff).getUTCFullYear() - 1970;
};

const Personnel = () => {
  const [activeButton, setActiveButton] = useState("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getAllProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on `activeButton` and `searchTerm`
  const filteredProfiles = profiles
    .filter(
      (item) =>
        item.profile &&
        (activeButton === "drivers"
          ? item.profile.position === "driver"
          : item.profile.position === "passenger_assistant_officer")
    )
    .filter((profile) =>
      `${profile.profile.first_name} ${profile.profile.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Delete profile
  const handleDelete = (recordId) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteProfile(deleteRecordId);
        setProfiles((prevProfiles) =>
          prevProfiles.filter(
            (profile) => profile.profile.user_profile_id !== deleteRecordId
          )
        );
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

  // Add new profile
  const handleAddNew = async (newProfile) => {
    try {
      const formattedProfile = {
        profile: newProfile,
      };
      setProfiles((prevProfiles) => [...prevProfiles, formattedProfile]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding new personnel:", error);
    }
  };

  // Open the edit modal
  const handleEdit = (profileId) => {
    setSelectedProfileId(profileId);
    setIsEditModalOpen(true);
  };

  // Save updated profile
  const handleSaveEdit = (updatedProfile) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.profile.user_profile_id === updatedProfile.user_profile_id
          ? { ...profile, profile: updatedProfile }
          : profile
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <Layout>
    <section className="flex flex-row h-screen bg-white">
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
            <button
              className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size={22} className="mr-2" />
              Add New
            </button>
          </div>
          <div className="records flex flex-col h-full">
            <div className="output flex flex-wrap mt-4 items-center ml-14">
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
                  onDelete={() =>
                    handleDelete(profile.profile.user_profile_id)
                  }
                  onEdit={() =>
                    handleEdit(profile.profile.user_profile_id)
                  }
                />
              ))}
            </div>
          </div>
          <div className="pagination flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {activeButton === "drivers" ? (
        <AddDriverModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddNew}
        />
      ) : (
        <AddAssistantOfficerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddNew}
        />
      )}
      {activeButton === "drivers" ? (
        <EditDriverModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userProfileId={selectedProfileId}
          onSave={handleSaveEdit}
        />
      ) : (
        <EditAssistantOfficerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userProfileId={selectedProfileId}
          onSave={handleSaveEdit}
        />
     
      )}
      <Confirmpopup
        isOpen={isDeletePopupOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Profile"
        message="Are you sure you want to delete this profile?"
      />
    </section>
    </Layout>
  );
};

export default Personnel;
