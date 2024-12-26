"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaBus, FaHistory } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "react-datepicker/dist/react-datepicker.css";
import FuelAddModal from "@/app/components/FuelAddModal";
import FuelEditModal from "@/app/components/FuelEditModal";
import FuelViewDetailsModal from "@/app/components/FuelViewDetailsModal";
import {
  fetchAllFuelLogs,
  deleteFuelLog,
} from "@/app/services/fuellogsService";
import { groupByTimeInterval } from "@/app/helper/fuel-helper";
import FuelHistoryModal from "@/app/components/FuelHistoryModal";
import Confirmpopup from "@/app/components/Confirmpopup";

const ViewRecord = () => {
  const searchParams = useSearchParams();
  const busNumber = searchParams.get("bus") || "001";
  const busStatus = searchParams.get("status") || "On Operation";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFuelLog, setSelectedFuelLog] = useState(null);
  const [selectedBus, setSelectedBus] = useState(busNumber);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState("daily");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false); // Confirmation modal state
  const [logToDelete, setLogToDelete] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await fetchAllFuelLogs();
        console.log("Fetched Fuel Logs:", logs); // Log to show fetched logs

        const filteredLogs = logs.filter(
          (log) => log.vehicle_id === selectedBus
        );
        console.log(`Filtered Fuel Logs for Bus ${selectedBus}:`, filteredLogs); // Log to show filtered logs for selected bus
        setFuelLogs(filteredLogs);
      } catch (error) {
        console.error("Failed to fetch fuel logs:", error);
      }
    };
    fetchLogs();
  }, [selectedBus]);

  const chartData = {
    daily: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "daily"
    ),
    weekly: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "weekly"
    ),
    monthly: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "monthly"
    ),
    yearly: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "yearly"
    ),
  };
  const currentData = chartData[timeInterval] || chartData.daily;

  const data = {
    labels: currentData.map((entry) => entry.label),
    datasets: [
      {
        label: "Distance (KM)",
        data: currentData.map((entry) => entry.distance),
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Liters Used (L)",
        data: currentData.map((entry) => entry.liters),
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: true,
        callbacks: {
          title: (tooltipItem) => tooltipItem[0].label,
          label: (tooltipItem) => {
            const datasetIndex = tooltipItem.datasetIndex;
            const data = tooltipItem.raw;
            const distance =
              tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex];
            const liters =
              tooltipItem.chart.data.datasets[1].data[tooltipItem.dataIndex];

            let tooltipText = "";
            if (datasetIndex === 0) {
              tooltipText = `Distance: ${distance} KM`;
            }
            if (datasetIndex === 1) {
              tooltipText = `Liters: ${liters} L`;
            }

            if (
              datasetIndex === 0 &&
              tooltipItem.chart.data.datasets[1].data[tooltipItem.dataIndex] !==
                undefined
            ) {
              tooltipText = `Distance: ${distance} KM\nLiters: ${liters} L`;
            }
            return tooltipText;
          },
        },
      },
    },
  };

  const handleDeleteFuelLog = async (fuelLogId) => {
    try {
      await deleteFuelLog(fuelLogId); // API call to delete fuel log
      setFuelLogs((prevLogs) =>
        prevLogs.filter((log) => log.fuel_logs_id !== fuelLogId)
      );
    } catch (error) {
      console.error("Failed to delete fuel log", error);
    }
  };

  const handleEdit = (record) => {
    console.log("Edit record:", record); // Log the entire record
    console.log("Fuel Log ID on Edit:", record.fuel_logs_id); // Log the fuel_logs_id
    setSelectedFuelLog(record);
    setEditData(record);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (record) => {
    console.log("Viewing details for record:", record); // Log the entire record
    console.log("Fuel Log ID on View Details:", record.fuel_logs_id); // Log the fuel_logs_id
    setViewData(record);
    setIsViewDetailsOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleAdd = (updatedRecord) => {
    setFuelLogs((prevLogs) => {
      const newLogs = [...prevLogs, updatedRecord];
      return newLogs;
    });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeViewDetailsModal = () => {
    setIsViewDetailsOpen(false);
    setViewData(null);
  };

  const handleOpenHistoryModal = () => {
    const filteredHistory = fuelLogs.filter(
      (log) => log.vehicle_id === selectedBus
    );
    setHistoryData(filteredHistory);
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

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

  const handlePrint = async () => {
    const chartElement = document.querySelector(".chart-container");
    if (!chartElement) return;
    try {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`view-record-bus-${selectedBus}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteFuelLog(logToDelete); // API call to delete
      setFuelLogs((prevLogs) =>
        prevLogs.filter((log) => log.fuel_logs_id !== logToDelete)
      );
      setLogToDelete(null);
    } catch (error) {
      console.error("Failed to delete fuel log", error);
    } finally {
      setIsConfirmPopupOpen(false); // Close popup
    }
  };

  const cancelDelete = () => {
    setIsConfirmPopupOpen(false); // Close popup without deleting
    setLogToDelete(null);
  };
  return (
    <div className="max-h-screen flex flex-col md:flex-row bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-200 pb-10 overflow-y-auto">
        <Header title="Fuel Monitoring" />
        <section className="p-4 flex flex-col items-center">
          <div className="flex items-center w-full md:w-5/6 mb-4 ">
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
          <div className="top-btns flex flex-col md:flex-row items-center justify-between w-full md:w-5/6 ">
            <div className="time-intervals flex space-x-3 mb-4 md:mb-0">
              {["daily", "weekly", "monthly", "yearly"].map((interval) => (
                <button
                  key={interval}
                  className={`px-4 py-2 rounded ${
                    timeInterval === interval
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                  onClick={() => setTimeInterval(interval)}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4 md:mt-0"
            >
              Print Chart as PDF
            </button>
          </div>

          <div className="relative chart-container w-full md:w-5/6 h-[500px] bg-white p-4 rounded-lg shadow-lg mt-4 ">
            <div className="absolute inset-0 flex justify-center items-center opacity-10 z-0">
              <span className="text-6xl font-bold text-gray-500">
                {selectedBus ? `Bus ${selectedBus}` : "Loading..."}
              </span>
            </div>
            <Line data={data} options={options} className="relative z-10" />
          </div>

          <div className="table-container w-full md:w-5/6 mt-4 bg-white p-4 rounded-lg shadow-lg ">
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
                {displayedRecords
                  .sort(
                    (a, b) =>
                      new Date(a.purchase_date) - new Date(b.purchase_date)
                  ) // Sort by date ascending
                  .map((entry) => {
                    console.log("Rendering Fuel Log Entry: PARENT", entry); // Log the whole entry
                    console.log("Fuel Log ID: PARENT SIDE", entry.fuel_logs_id); // Log the fuel_logs_id
                    return (
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
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setLogToDelete(entry.fuel_logs_id);
                              setIsConfirmPopupOpen(true);
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between w-full md:w-5/6">
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
              className="px-3 py-2 bg-gray-300 text-gray-500 rounded disabled:cursor-not-allowed ml-40"
            >
              Next
            </button>
            <div className="right-btn flex flex-row space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                onClick={handleOpenHistoryModal}
              >
                <FaHistory className="mr-2" />
                View History
              </button>
              {isHistoryModalOpen && (
                <FuelHistoryModal
                  isOpen={isHistoryModalOpen}
                  onClose={handleCloseHistoryModal}
                  history={historyData}
                />
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add New Record
              </button>
            </div>
          </div>
        </section>
      </div>

      {isHistoryModalOpen && (
        <FuelHistoryModal
          onClose={handleCloseHistoryModal}
          historyData={fuelLogs}
          selectedBus={selectedBus}
        />
      )}
      {isAddModalOpen && (
        <FuelAddModal
          selectedBus={selectedBus}
          onClose={closeAddModal}
          onAdd={handleAdd}
        />
      )}

      {isEditModalOpen && selectedFuelLog && (
        <FuelEditModal
          selectedBus={selectedBus}
          selectedFuelLog={selectedFuelLog}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleEdit}
        />
      )}

      {isViewDetailsOpen && (
        <FuelViewDetailsModal
          selectedBus={selectedBus}
          viewData={viewData}
          onClose={closeViewDetailsModal}
        />
      )}
      <Confirmpopup
        isOpen={isConfirmPopupOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      >
        <p>Are you sure you want to delete this record?</p>
      </Confirmpopup>
    </div>
  );
};

export default ViewRecord;
