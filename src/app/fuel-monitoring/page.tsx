"use client";
import React, { useState } from "react";
import { FaBus, FaCalendar, FaSearch } from "react-icons/fa"; // Import the calendar and search icons
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FuelMonitoring = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState("daily");
  const [selectedBus, setSelectedBus] = useState("001");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample data for the chart based on time intervals
  const chartData = {
    daily: {
      labels: ["1", "2", "3", "4", "5", "6", "7"],
      distance: [10, 20, 30, 40, 50, 60, 70],
      liters: [5, 10, 15, 20, 25, 30, 35],
    },
    "5days": {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
      distance: [100, 120, 110, 130, 140],
      liters: [50, 60, 55, 65, 70],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      distance: [200, 220, 210, 230],
      liters: [100, 110, 105, 120],
    },
    monthly: {
      labels: ["January", "February", "March", "April"],
      distance: [400, 450, 430, 470],
      liters: [200, 220, 215, 240],
    },
    yearly: {
      labels: ["2021", "2022", "2023", "2024"],
      distance: [5000, 5500, 5300, 5700],
      liters: [2500, 2700, 2600, 2800],
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const buses = [
    { number: "001", status: "Maintenance" },
    { number: "002", status: "On Operation" },
    { number: "003", status: "On Operation" },
    { number: "004", status: "On Operation" },
    { number: "005", status: "Maintenance" },
    { number: "006", status: "On Operation" },
    { number: "007", status: "On Operation" },
    { number: "008", status: "On Operation" },
    { number: "009", status: "On Operation" },
    { number: "010", status: "On Operation" },
    { number: "011", status: "On Operation" },
    { number: "012", status: "On Operation" },
  ];

  const itemsPerPage = 9;
  const totalPages = Math.ceil(buses.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const displayedBuses = buses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBusClick = (busNumber: string) => {
    setSelectedBus(busNumber);
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar />
      <div className="w-full bg-slate-200">
        <Header title="Fuel Monitoring" />
        <section className="p-4">
          <div className="flex justify-between mb-3"></div>

          <div className="relative chart-container w-5/6 h-[500px] bg-white p-4 rounded-lg shadow-lg mx-auto">
            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <span className="text-6xl font-bold text-gray-500">{`Bus ${selectedBus}`}</span>
            </div>
            <Line data={data} options={options} />
          </div>

          <div className="chart-options w-5/6 mx-auto flex justify-left space-x-3 mt-3">
            <button
              className={`px-2 py-1 rounded ${
                timeInterval === "daily"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => setTimeInterval("daily")}
            >
              D
            </button>
            <button
              className={`px-2 py-1 rounded ${
                timeInterval === "5days"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => setTimeInterval("5days")}
            >
              5D
            </button>
            <button
              className={`px-2 py-1 rounded ${
                timeInterval === "weekly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => setTimeInterval("weekly")}
            >
              W
            </button>
            <button
              className={`px-2 py-1 rounded ${
                timeInterval === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => setTimeInterval("monthly")}
            >
              M
            </button>
            <button
              className={`px-2 py-1 rounded ${
                timeInterval === "yearly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => setTimeInterval("yearly")}
            >
              Y
            </button>
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
          </div>

          <div className="buses mt-4 grid grid-cols-3 gap-4 w-5/6 mx-auto">
            {displayedBuses.map((bus) => (
              <div
                key={bus.number}
                className={`flex items-center p-4 rounded-lg shadow cursor-pointer ${
                  bus.status === "Maintenance" ? "bg-gray-400" : "bg-green-400"
                } ${selectedBus === bus.number ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleBusClick(bus.number)}
              >
                <FaBus size={24} className="mr-2" />
                <span className="mr-auto">Bus {bus.number}</span>
                <span>{bus.status}</span>
              </div>
            ))}
          </div>

          <div className="w-5/6 mx-auto mt-4 relative">
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-gray-500 text-gray-700"
                }`}
              >
                &lt; {/* Changed Previous to "<" */}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white border-gray-500 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-gray-500 text-gray-700"
                }`}
              >
                &gt; {/* Changed Next to ">" */}
              </button>
            </div>
            <div className="absolute right-0 bottom-0">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
                <FaSearch className="mr-2" />
                View Details
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FuelMonitoring;
