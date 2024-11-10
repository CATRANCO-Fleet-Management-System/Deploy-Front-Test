"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { FaBus, FaCalendar, FaEllipsisV } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ViewRecord = () => {
  const searchParams = useSearchParams();
  const busNumber = searchParams.get("bus") || "001";
  const busStatus = searchParams.get("status") || "On Operation";
  const [selectedBus, setSelectedBus] = useState(busNumber);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState("daily");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);

  const chartData = {
    daily: {
      labels: [
        "Jun",
        "5",
        "19",
        "Jul",
        "7",
        "21",
        "Aug",
        "12",
        "24",
        "Sept",
        "15",
        "22",
      ],
      distance: [10, 50, 30, 70, 20, 50, 60, 30, 40, 60, 20, 30],
      liters: [70, 40, 60, 10, 30, 60, 40, 20, 50, 70, 20, 50],
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

  const tableData = [
    { date: "01-01-24", distance: "160KM", liters: "70L", amount: "7896PHP" },
    { date: "05-15-24", distance: "180KM", liters: "59L", amount: "8896PHP" },
    { date: "03-27-24", distance: "115KM", liters: "56L", amount: "4896PHP" },
    { date: "01-01-24", distance: "160KM", liters: "70L", amount: "7896PHP" },
    { date: "05-15-24", distance: "180KM", liters: "59L", amount: "8896PHP" },
    { date: "03-27-24", distance: "115KM", liters: "56L", amount: "4896PHP" },
    { date: "01-01-24", distance: "160KM", liters: "70L", amount: "7896PHP" },
    { date: "05-15-24", distance: "180KM", liters: "59L", amount: "8896PHP" },
    { date: "03-27-24", distance: "115KM", liters: "56L", amount: "4896PHP" },
    { date: "01-01-24", distance: "160KM", liters: "70L", amount: "7896PHP" },
    { date: "05-15-24", distance: "180KM", liters: "59L", amount: "8896PHP" },
    { date: "03-27-24", distance: "115KM", liters: "56L", amount: "4896PHP" },
    { date: "01-01-24", distance: "160KM", liters: "70L", amount: "7896PHP" },
    { date: "05-15-24", distance: "180KM", liters: "59L", amount: "8896PHP" },
    { date: "03-27-24", distance: "115KM", liters: "56L", amount: "4896PHP" },
    // Add more records as needed
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleMenuToggle = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const handleEdit = (record) => {
    console.log("Edit record", record);
    setOpenMenu(null);
  };

  const handleRemove = (record) => {
    console.log("Remove record", record);
    setOpenMenu(null);
  };

  const displayedRecords = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-200">
        <Header title="Fuel Monitoring" />
        {/* Display the selected bus */}
        <section className="p-4 flex flex-col items-center">
          {/* Bus Info */}
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

          {/* Chart with Overlay */}
          <div className="relative chart-container w-5/6 h-[500px] bg-white p-4 rounded-lg shadow-lg">
            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <span className="text-6xl font-bold text-gray-500">
                {`Bus ${selectedBus}`}
              </span>
            </div>
            <Line data={data} options={options} />
          </div>

          {/* Chart Options */}
          <div className="chart-options w-5/6 flex justify-start space-x-3 mt-3">
            {["daily", "5days", "weekly", "monthly", "yearly"].map(
              (interval) => (
                <button
                  key={interval}
                  className={`px-2 py-1 rounded ${
                    timeInterval === interval
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                  onClick={() => setTimeInterval(interval)}
                >
                  {interval.charAt(0).toUpperCase()}
                </button>
              )
            )}
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

          {/* Data Table */}
          <div className="table-container w-5/6 mt-4 bg-white p-4 rounded-lg shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Distance</th>
                  <th className="py-2 px-4">Liters</th>
                  <th className="py-2 px-10">Total Amount (PHP)</th>
                  <th className="py-2 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((entry, index) => (
                  <tr key={index} className="border-t relative">
                    <td className="py-2 px-4">{entry.date}</td>
                    <td className="py-2 px-4">{entry.distance}</td>
                    <td className="py-2 px-4">{entry.liters}</td>
                    <td className="py-2 px-10">{entry.amount}</td>
                    <td className="py-2 text-right relative">
                      <FaEllipsisV
                        className="cursor-pointer"
                        title="Edit/Remove"
                        onClick={() => handleMenuToggle(index)}
                      />
                      {openMenu === index && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10"
                        >
                          <button
                            onClick={() => handleEdit(entry)}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemove(entry)}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Centered Pagination and Right-Aligned Add Button */}
          <div className="footer flex items-center w-5/6 mt-4 justify-between">
            {/* Pagination - Centered */}
            <div className="flex space-x-2 justify-center flex-grow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-gray-500 text-gray-700"
                }`}
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
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
                &gt;
              </button>
            </div>

            {/* Add Button - Right-Aligned */}
            <div>
              <button className="px-4 py-1 border border-blue-500 text-blue-500 rounded bg-transparent ml-4">
                Add
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewRecord;
