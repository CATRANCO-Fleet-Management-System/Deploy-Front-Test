"use client";
import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout"; // Import Layout component
import Header from "../components/Header";
import { FaBus, FaAngleDoubleRight } from "react-icons/fa";

const DispatchMonitoring = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const busData = [
    { number: "001", status: "Maintenance" },
    { number: "002", status: "On Road" },
    { number: "003", status: "Maintenance" },
    { number: "004", status: "On Road" },
    { number: "005", status: "On Road" },
    { number: "006", status: "On Alley" },
    { number: "007", status: "On Road" },
    { number: "008", status: "Maintenance" },
    { number: "009", status: "On Alley" },
    { number: "010", status: "Maintenance" },
    { number: "011", status: "On Road" },
    { number: "012", status: "On Road" },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(busData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const displayedBuses = busData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Layout>
      <Header title="Dispatch Monitoring" />
      <section className="p-4 flex flex-col items-center">
        <div className="w-5/6 flex flex-col h-full">
          <div className="bus-location">
            <div className="output flex flex-row space-x-2 mt-8">
              <div className="locations w-full bg-white h-auto rounded-lg border-2 border-violet-400">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15784.663154977601!2d124.5866112118501!3d8.48325558794408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ff8ca6efa76217%3A0x8a2c13aa584988a4!2sCanito-an%2C%20Misamis%20Oriental!5e0!3m2!1sen!2sph!4v1729050669858!5m2!1sen!2sph"
                  width="100%"
                  height="450"
                  style={{ border: 1 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="bus-info flex flex-row mt-12 space-x-4">
            <div className="col-bus space-y-4">
              {displayedBuses.slice(0, 3).map((bus) => {
                const bgColor =
                  bus.status === "Maintenance"
                    ? "bg-slate-400"
                    : bus.status === "On Road"
                    ? "bg-green-400"
                    : "bg-blue-400";

                const textColor =
                  bus.status === "Maintenance"
                    ? "text-red-900"
                    : "text-black";
                const isSelected = selectedBus === bus.number;

                return (
                  <button
                    key={bus.number}
                    onClick={() => setSelectedBus(bus.number)}
                    className={`container w-80 p-4 rounded-lg flex flex-row space-x-8 ${bgColor} ${
                      isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
                    } transition-all duration-200`}
                  >
                    <FaBus
                      size={30}
                      className={`ml-2 cursor-pointer ${
                        isSelected ? "text-blue-700" : "text-black"
                      }`}
                    />
                    <h1
                      className={`${
                        isSelected ? "font-bold text-blue-700 " : ""
                      }`}
                    >
                      Bus <span>{bus.number}</span>
                    </h1>
                    <h1 className={textColor}>{bus.status}</h1>
                  </button>
                );
              })}
            </div>
            <div className="col-bus space-y-4">
              {displayedBuses.slice(3).map((bus) => {
                const bgColor =
                  bus.status === "Maintenance"
                    ? "bg-slate-400"
                    : bus.status === "On Road"
                    ? "bg-green-400"
                    : "bg-blue-400";

                const textColor =
                  bus.status === "Maintenance"
                    ? "text-red-900"
                    : "text-black";
                const isSelected = selectedBus === bus.number;

                return (
                  <button
                    key={bus.number}
                    onClick={() => setSelectedBus(bus.number)}
                    className={`container w-80 p-4 rounded-lg flex flex-row space-x-8 ${bgColor} ${
                      isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
                    } transition-all duration-200`}
                  >
                    <FaBus
                      size={30}
                      className={`ml-2 cursor-pointer ${
                        isSelected ? "text-blue-700" : "text-black"
                      }`}
                    />
                    <h1
                      className={`${
                        isSelected ? "font-bold text-blue-700" : ""
                      }`}
                    >
                      Bus <span>{bus.number}</span>
                    </h1>
                    <h1 className={textColor}>{bus.status}</h1>
                  </button>
                );
              })}
              <div className="pagination mt-4 flex space-x-2 items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
                    currentPage === 1
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[1, 2].map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-3 py-1 border-2 rounded transition-colors duration-300 ${
                    currentPage === totalPages
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
            <div className="arrow">
              <FaAngleDoubleRight
                size={15}
                className="cursor-pointer text-violet-800"
              />
            </div>
            <div className="bus-information w-2/6 bg-white h-auto rounded-lg border-2 border-violet-400 p-4">
              <div className="infos flex flex-col ml-5">
                <div className="header-info flex flex-row mt-4 space-x-5">
                  <FaBus size={40} className="cursor-pointer text-black" />
                  <h1 className="text-2xl font-bold">
                    {selectedBus ? `Bus ${selectedBus}` : "Bus"}
                  </h1>
                </div>
                <hr className="border-gray-300 mt-3" />
                <div className="details mt-4">
                  <p>Bus Number: {selectedBus}</p>
                  {selectedBus && (
                    <p>
                      Status:{" "}
                      {
                        busData.find((bus) => bus.number === selectedBus)
                          ?.status
                      }
                    </p>
                  )}
                  <p className="mt-2">Driver: James Harden</p>
                  <p>Conductor: Stephen Curry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DispatchMonitoring;
