"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import AddDeviceModal from "../components/AddDeviceModal";
import Pagination from "../components/Pagination";
import { FaPlus } from "react-icons/fa";
import DeviceRecord from "../components/DeviceRecord";
import { getAllDevices, deleteDevice } from "../services/deviceService";
import EditDeviceModal from "../components/EditDeviceModal";

const DeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Fetch devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getAllDevices();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (recordId) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteDevice(deleteRecordId);
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deleteRecordId)
        );
        setDeleteRecordId(null);
        setIsDeletePopupOpen(false);
      } catch (error) {
        console.error("Error deleting device:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const handleAddNew = async (newDevice) => {
    try {
      setDevices((prevDevices) => [...prevDevices, newDevice]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding new device:", error);
    }
  };

  const handleEdit = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedDevice) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <Layout>
      <section className="flex flex-row h-screen bg-white">
        <div className="w-full flex flex-col bg-slate-200">
          <Header title="Device Management" />
          <div className="content flex flex-col flex-1">
            <div className="options flex items-center space-x-10 p-4 w-9/12 ml-10">
              <input
                type="text"
                placeholder="Find Trackers"
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
                {paginatedDevices.map((device) => (
                  <DeviceRecord
                    deviceId={device.id}
                    deviceName={device.name}
                    serialNumber={device.serial_number}
                    busNumber={device.bus_number} // Pass bus number from device object
                    status={device.status}
                    onDelete={() => handleDelete(device.id)}
                    onEdit={() => handleEdit(device.id)}
                  />
                ))}
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <AddDeviceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddNew}
        />
        <EditDeviceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          deviceId={selectedDeviceId}
          onSave={handleSaveEdit}
        />
        <Confirmpopup
          isOpen={isDeletePopupOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Delete Device"
          message="Are you sure you want to delete this device?"
        />
      </section>
    </Layout>
  );
};

export default DeviceManagement;
