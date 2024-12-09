"use client";
import React, { useState, useEffect } from "react";
import { FaBus, FaCalendar } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Layout from "../components/Layout";
import Header from "../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchAllFuelLogs } from "@/app/services/fuellogsService"; // Fuel Logs service
import { getAllVehicles } from "@/app/services/vehicleService"; // Vehicles service
import { getAllMaintenanceScheduling } from "@/app/services/maintenanceService"; // Maintenance service
import Pagination from "../components/Pagination"; // Import the Pagination component
import { useRouter } from "next/navigation";

const FuelMonitoring = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState("daily");
  const [selectedBus, setSelectedBus] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);
  const [error, setError] = useState(null);

  const itemsPerPage = 3; // Number of buses to display per page

  // Fetch data: vehicles, fuel logs, and maintenance schedules
  const loadData = async () => {
    try {
      const [logs, vehicleData, maintenanceData] = await Promise.all([
        fetchAllFuelLogs(),
        getAllVehicles(),
        getAllMaintenanceScheduling(),
      ]);
      setFuelLogs(logs);
      setVehicles(vehicleData);
      setMaintenanceSchedules(maintenanceData);
      if (vehicleData.length > 0) {
        setSelectedBus(vehicleData[0].vehicle_id); // Default to the first vehicle
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load data. Please try again.");
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  const chartData = {
    daily: {
      labels: fuelLogs
        .filter((log) => log.vehicle_id === selectedBus)
        .map((log) => log.purchase_date),
      distance: fuelLogs
        .filter((log) => log.vehicle_id === selectedBus)
        .map((log) => log.distance_traveled),
      liters: fuelLogs
        .filter((log) => log.vehicle_id === selectedBus)
        .map((log) => log.fuel_liters_quantity),
    },
  };

  const currentData = chartData[timeInterval] || chartData.daily;

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const totalPages = Math.ceil(vehicles.length / itemsPerPage);

  const displayedBuses = vehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBusClick = (busNumber) => {
    setSelectedBus(busNumber);
  };

  const navigateToViewRecord = () => {
    const bus = vehicles.find((vehicle) => vehicle.vehicle_id === selectedBus);
    const maintenance = maintenanceSchedules.find(
      (schedule) =>
        schedule.vehicle_id === selectedBus &&
        schedule.maintenance_status === "active"
    );
    const status = maintenance ? "Maintenance" : "On Operation";
    router.push(
      `/fuel-monitoring/view-record?bus=${selectedBus}&status=${encodeURIComponent(
        status
      )}`
    );
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout>
      <Header title="Fuel Monitoring" />
      <section className="p-4">
        <div className="relative chart-container w-5/6 h-[500px] bg-white p-4 rounded-lg shadow-lg mx-auto">
          <div className="absolute inset-0 flex justify-center items-center opacity-10">
            <span className="text-6xl font-bold text-gray-500">
              {selectedBus ? `Bus ${selectedBus}` : "Loading..."}
            </span>
          </div>
          <Line data={data} options={options} />
        </div>

        <div className="chart-options w-5/6 mx-auto flex justify-left space-x-3 mt-3">
          {["daily", "5days", "weekly", "monthly", "yearly"].map((interval) => (
            <button
              key={interval}
              className={`px-2 py-1 rounded ${
                timeInterval === interval
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => setTimeInterval(interval)}
            >
              {interval.charAt(0).toUpperCase() + interval.slice(1)}
            </button>
          ))}
          <FaCalendar
            className="text-gray-500 cursor-pointer mt-1"
            size={24}
            onClick={handleCalendarToggle}
          />
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 w-40">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                className="bg-white border border-gray-300 rounded-md shadow-lg"
              />
            </div>
            
          )}
          <button
            onClick={navigateToViewRecord}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedBus}
          >
            View Record
          </button>
        </div>

        <div className="buses mt-4 grid grid-cols-3 gap-4 w-5/6 mx-auto">
          {displayedBuses.map((bus) => {
            const maintenance = maintenanceSchedules.find(
              (schedule) =>
                schedule.vehicle_id === bus.vehicle_id &&
                schedule.maintenance_status === "active"
            );

            const bgColor = maintenance ? "bg-yellow-400" : "bg-green-400";
            const textColor = maintenance ? "text-black" : "text-white";

            return (
              <div
                key={bus.vehicle_id}
                className={`flex flex-col p-4 rounded-lg shadow cursor-pointer ${bgColor} ${
                  selectedBus === bus.vehicle_id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleBusClick(bus.vehicle_id)}
              >
                <FaBus size={24} className="mb-2" />
                <span className={`font-bold ${textColor}`}>
                  Bus {bus.vehicle_id} - {bus.plate_number}
                </span>
                <span className={`${textColor}`}>
                  {maintenance
                    ? `${maintenance.maintenance_type} Scheduled`
                    : "On Operation"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </Layout>
  );
};

export default FuelMonitoring;
