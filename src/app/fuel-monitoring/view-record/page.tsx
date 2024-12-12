"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaBus, FaCalendar, FaTrash } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FuelAddModal from "@/app/components/FuelAddModal";
import FuelViewDetailsModal from "@/app/components/FuelViewDetailsModal";
import {
  fetchAllFuelLogs,
  deleteFuelLog,
} from "@/app/services/fuellogsService";

const ViewRecord = () => {
  const searchParams = useSearchParams();
  const busNumber = searchParams.get("bus") || "001";
  const busStatus = searchParams.get("status") || "On Operation";

  const [selectedBus, setSelectedBus] = useState(busNumber);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState("daily");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);

  // Fetch fuel logs for the selected bus
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await fetchAllFuelLogs();
        const filteredLogs = logs.filter(
          (log) => log.vehicle_id === selectedBus
        );
        setFuelLogs(filteredLogs);
      } catch (error) {
        console.error("Failed to fetch fuel logs:", error);
      }
    };
    fetchLogs();
  }, [selectedBus]);

  // Handle deletion of a fuel log
  const handleDeleteFuelLog = async (fuelLogId) => {
    try {
      await deleteFuelLog(fuelLogId); // API call to delete fuel log
      setFuelLogs((prevLogs) =>
        prevLogs.filter((log) => log.fuel_logs_id !== fuelLogId)
      );
      alert("Fuel log deleted successfully");
    } catch (error) {
      console.error(`Error deleting fuel log with ID ${fuelLogId}:`, error);
      alert("Failed to delete fuel log. Please try again.");
    }
  };

  // Handle edit of a fuel log
  const handleEdit = (record) => {
    setEditData(record); // Populate editData with the selected record
    setIsModalOpen(true); // Open the modal for editing
  };

  // Handle new record addition or update
  const handleAddOrUpdateRecord = (updatedRecord) => {
    setFuelLogs((prevLogs) => {
      const index = prevLogs.findIndex(
        (log) => log.fuel_logs_id === updatedRecord.fuel_logs_id
      );
      if (index !== -1) {
        // Update existing record
        const updatedLogs = [...prevLogs];
        updatedLogs[index] = updatedRecord;
        return updatedLogs;
      }
      // Add new record
      return [...prevLogs, updatedRecord];
    });
    setSelectedBus(updatedRecord.vehicle_id); // Ensures correct data is fetched on next render
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const closeViewDetailsModal = () => {
    setIsViewDetailsOpen(false);
    setViewData(null);
  };

  const handleViewDetails = (record) => {
    setViewData(record);
    setIsViewDetailsOpen(true);
  };

  // Chart data
  const chartData = {
    daily: {
      labels: fuelLogs.map((log) => log.purchase_date),
      distance: fuelLogs.map(
        (log) => log.distance_travelled || log.distance_traveled || 0
      ), // Fixing to check both fields
      liters: fuelLogs.map((log) => log.fuel_liters_quantity || 0),
    },
  };

  const currentData = chartData[timeInterval];
  const data = {
    labels: currentData.labels,
    datasets: [
      {
        label: "Distance (KM)",
        data: currentData.distance,
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Liters Used (L)",
        data: currentData.liters,
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(fuelLogs.length / itemsPerPage);

  const displayedRecords = fuelLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-200 pb-10">
        <Header title="Fuel Monitoring" />
        <section className="p-4 flex flex-col items-center">
          <div className="flex items-center w-5/6 mb-4">
            <FaBus size={24} className="mr-2" />
            <span className="text-lg font-bold">BUS {selectedBus}</span>
            <span
              className={`ml-2 ${
                busStatus === "Maintenance" ? "text-red-500" : "text-green-500"
              }`}
            >
              {busStatus}
            </span>
          </div>
          <div className="relative chart-container w-5/6 h-[500px] bg-white p-4 rounded-lg shadow-lg">
            <Line data={data} options={options} />
          </div>
          <div className="table-container w-5/6 mt-4 bg-white p-4 rounded-lg shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Distance</th>
                  <th className="py-2 px-4">Fuel Type</th>
                  <th className="py-2 px-4">Fuel Price</th>
                  <th className="py-2 px-4">Fuel Quantity</th>
                  <th className="py-2 px-4">Total Amount (PHP)</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((entry) => (
                  <tr key={entry.fuel_logs_id} className="border-t">
                    <td className="py-2 px-4">{entry.purchase_date}</td>
                    <td className="py-2 px-4">{entry.odometer_km} KM</td>
                    <td className="py-2 px-4">{entry.fuel_type}</td>
                    <td className="py-2 px-4">{entry.fuel_price}</td>
                    <td className="py-2 px-4">
                      {entry.fuel_liters_quantity} L
                    </td>
                    <td className="py-2 px-4">{entry.total_expense} PHP</td>
                    <td className="py-2 text-right flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(entry)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(entry)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFuelLog(entry.fuel_logs_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between w-5/6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-300 text-gray-500 rounded disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-300 text-gray-500 rounded disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add New Record
            </button>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <FuelAddModal
          selectedBus={selectedBus}
          onClose={closeModal}
          onAdd={handleAddOrUpdateRecord}
          editData={editData}
        />
      )}

      {isViewDetailsOpen && (
        <FuelViewDetailsModal
          selectedBus={selectedBus}
          viewData={viewData}
          onClose={closeViewDetailsModal}
        />
      )}
    </div>
  );
};

export default ViewRecord;