"use client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import React, { useState, useRef, useEffect } from "react";
import { FaBus, FaCog, FaUsers, FaAngleDoubleRight } from "react-icons/fa";

const DispatchMonitoring = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Sample bus data simulating a backend response
  const busData = [
    { number: "001", status: "Maintenance" },
    { number: "002", status: "On Road" },
    { number: "003", status: "Maintenance" },
    { number: "004", status: "On Road" },
    { number: "005", status: "On Road" },
    { number: "006", status: "On Alley" },
  ];

  // Close dropdown if clicking outside of it
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
    <section className="h-screen flex flex-row bg-white ">
      <Sidebar />
      <div className="w-full bg-slate-200">
        <Header title="Dispatch Monitoring" />
        <section className="right w-full  overflow-y-hidden">
          <div className="content flex flex-col h-full ml-20">
            <div className="bus-location ">
              <div className="output flex flex-row space-x-2 mt-8">
                <div className="locations w-auto bg-white h-auto rounded-lg border-2 border-violet-400">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15784.663154977601!2d124.5866112118501!3d8.48325558794408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ff8ca6efa76217%3A0x8a2c13aa584988a4!2sCanito-an%2C%20Misamis%20Oriental!5e0!3m2!1sen!2sph!4v1729050669858!5m2!1sen!2sph"
                    width="1260"
                    height="450"
                    style={{ border: 1 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="bus-info flex flex-row mt-12 space-x-8">
              <div className="col-bus space-y-4">
                {/* Loop through the first set of bus numbers */}
                {busData.slice(0, 3).map((bus) => {
                  // Assign background color based on the status
                  const bgColor =
                    bus.status === "Maintenance"
                      ? "bg-slate-400"
                      : bus.status === "On Road"
                      ? "bg-yellow-400"
                      : "bg-blue-400";

                  // Assign text color for the status (red if Maintenance)
                  const textColor =
                    bus.status === "Maintenance"
                      ? "text-red-500"
                      : "text-black";

                  return (
                    <div
                      key={bus.number}
                      className={`container w-96 p-4 rounded-lg flex flex-row space-x-14 ${bgColor}`}
                    >
                      {/* Icon */}
                      <FaBus
                        size={30}
                        className="ml-2 cursor-pointer text-black"
                      />

                      {/* Bus number */}
                      <h1>
                        Bus{" "}
                        <span id={`bus-number-${bus.number}`}>
                          {bus.number}
                        </span>
                      </h1>

                      {/* Bus status with dynamic text color */}
                      <h1 id={`status-${bus.number}`} className={textColor}>
                        {bus.status}
                      </h1>
                    </div>
                  );
                })}
              </div>

              <div className="col-bus space-y-4">
                {/* Loop through the second set of bus numbers */}
                {busData.slice(3).map((bus) => {
                  // Assign background color based on the status
                  const bgColor =
                    bus.status === "Maintenance"
                      ? "bg-slate-400"
                      : bus.status === "On Road"
                      ? "bg-yellow-400"
                      : "bg-blue-400";

                  // Assign text color for the status (red if Maintenance)
                  const textColor =
                    bus.status === "Maintenance"
                      ? "text-red-500"
                      : "text-black";

                  return (
                    <div
                      key={bus.number}
                      className={`container w-96 p-4 rounded-lg flex flex-row space-x-14 ${bgColor}`}
                    >
                      {/* Icon */}
                      <FaBus
                        size={30}
                        className="ml-2 cursor-pointer text-black"
                      />

                      {/* Bus number */}
                      <h1>
                        Bus{" "}
                        <span id={`bus-number-${bus.number}`}>
                          {bus.number}
                        </span>
                      </h1>

                      {/* Bus status with dynamic text color */}
                      <h1 id={`status-${bus.number}`} className={textColor}>
                        {bus.status}
                      </h1>
                    </div>
                  );
                })}
              </div>
              <div className="arrow">
                <FaAngleDoubleRight
                  size={20}
                  className="cursor-pointer text-violet-800"
                />
              </div>
              <div className="bus-information w-1/4 bg-white h-auto rounded-lg border-2 border-violet-400 ">
                <div className="infos flex flex-col ml-5">
                  <div className="header-info flex flex-row mt-4  space-x-5">
                    <FaBus
                      size={40}
                      className="ml-2 cursor-pointer text-violet-600"
                    />
                    <h1 className="text-red-600 text-xl font-bold">BUS 03</h1>
                  </div>
                  <div className="info-text mt-10">
                    <ul className="list-disc list-inside space-y-2 mb-4 text-lg">
                      <li>
                        <strong>Driver:</strong> James Harden
                      </li>
                      <li>
                        <strong>Conductor:</strong> Stephen Curry
                      </li>
                      <li>
                        <strong>Plate number:</strong> KVJ-232-2313
                      </li>
                      <li>
                        <strong>Trips:</strong> 5
                      </li>
                      <li>
                        <strong>Status:</strong> In Operation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default DispatchMonitoring;
