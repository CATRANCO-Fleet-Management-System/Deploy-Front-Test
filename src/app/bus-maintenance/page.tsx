"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import MaintenanceAddModal from "../components/MaintenanceAddModal";
import MaintenanceEditModal from "../components/MaintenanceEditModal";
import { FaSearch, FaPlus } from "react-icons/fa";
import {
  getAllMaintenanceScheduling,
  createMaintenanceScheduling,
  updateMaintenanceScheduling,
  deleteMaintenanceScheduling,
  toggleMaintenanceSchedulingStatus,
} from "@/app/services/maintenanceService";

const MaintenanceManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAllMaintenanceScheduling();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

  // Filter records based on the search term
  const filteredRecords = records.filter((record) =>
    Object.values(record)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddNew = () => setIsAddModalOpen(true);

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setIsEditModalOpen(true);
  };

  const handleRemove = async (id) => {
    try {
      await deleteMaintenanceScheduling(id);
      setRecords((prev) => prev.filter((record) => record.maintenance_scheduling_id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleSave = async (id, data) => {
    try {
      if (id) {
        // Update existing record
        await updateMaintenanceScheduling(id, data);
        setRecords((prev) =>
          prev.map((record) =>
            record.maintenance_scheduling_id === id ? { ...record, ...data } : record
          )
        );
      } else {
        // Create new record
        const newRecord = await createMaintenanceScheduling(data);
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const updatedRecord = await toggleMaintenanceSchedulingStatus(id);
      setRecords((prev) =>
        prev.map((record) =>
          record.maintenance_scheduling_id === id
            ? { ...record, maintenance_status: updatedRecord.schedule.maintenance_status }
            : record
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <Layout>
      <Header title="Bus Maintenance Management" />
      <div className="options flex items-center space-x-10 p-4 w-9/12 ml-8">
        <input
          type="text"
          placeholder="Find maintenance records"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
          <FaSearch size={20} className="mr-2" />
          Search
        </button>
        <button
          className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
          onClick={handleAddNew}
        >
          <FaPlus size={20} className="mr-2" />
          Add New
        </button>
      </div>
      <div className="records flex flex-wrap gap-4 px-8 mt-4">
        {currentRecords.map((record) => (
          <div
            key={record.maintenance_scheduling_id}
            className="record-card bg-white p-4 rounded shadow w-full md:w-1/2 lg:w-1/3"
          >
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-2 font-bold">Maintenance ID:</td>
                  <td className="border p-2">{record.maintenance_scheduling_id}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Status:</td>
                  <td className="border p-2">
                    <button
                      className={`px-2 py-1 rounded text-white ${
                        record.maintenance_status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                      onClick={() => handleToggleStatus(record.maintenance_scheduling_id)}
                    >
                      {record.maintenance_status
                        ? record.maintenance_status.charAt(0).toUpperCase() +
                          record.maintenance_status.slice(1)
                        : "Unknown"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Type:</td>
                  <td className="border p-2">
                    {record.maintenance_type
                      ? record.maintenance_type
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Cost:</td>
                  <td className="border p-2">PHP {parseFloat(record.maintenance_cost).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Date:</td>
                  <td className="border p-2">{record.maintenance_date}</td>
                </tr>
                <tr>
                <td className="border p-2 font-bold">Company:</td>
  <td className="border p-2">{record.mechanic_company || "N/A"}</td>
</tr>
<tr>
  <td className="border p-2 font-bold">Address:</td>
  <td className="border p-2">{record.mechanic_company_address || "N/A"}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex space-x-2 mt-3">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleEdit(record)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemove(record.maintenance_scheduling_id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination flex justify-center items-center space-x-2 mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 border rounded-md ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <MaintenanceAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
      />
      <MaintenanceEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        record={currentRecord}
        onSave={handleSave}
      />
    </Layout>
  );
};

export default MaintenanceManagement;
