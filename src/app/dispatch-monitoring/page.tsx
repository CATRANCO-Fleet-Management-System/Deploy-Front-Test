"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import DispatchMap from "../components/DispatchMap";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { FaBus } from "react-icons/fa";
import { getAllVehicleAssignments } from "../services/vehicleAssignService";
import DispatchService from "../services/dispatchService"; // Import the dispatch service
import { MapProvider } from "@/providers/MapProvider";

interface BusData {
  number: string;
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
  time: string;
  dispatch_logs_id: string | null;
  name: string;
}

const DispatchMonitoring: React.FC = () => {
  const busDataRef = useRef<BusData[]>([]);
  const pathDataRef = useRef<{ lat: number; lng: number }[]>([]);
  const [busData, setBusData] = useState<BusData[]>([]);
  const [pathData, setPathData] = useState<{
    [busNumber: string]: { lat: number; lng: number }[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string>("all");

  // Function to fetch vehicle assignments and save them to localStorage
  const fetchVehicleAssignments = async () => {
    try {
      console.log("Fetching vehicle assignments...");

      // Fetch all vehicle assignments
      const vehicleAssignments = await getAllVehicleAssignments();

      // Map vehicle assignments with default status and placeholders
      const mappedVehicles = vehicleAssignments.map((vehicle: any) => ({
        number: vehicle.vehicle_id,
        status: "idle", // Default status if no dispatch data is provided
        route: "", // Default route
        dispatch_logs_id: null,
        name: vehicle.name || "Unnamed",
      }));

      // Save the mapped vehicle data to localStorage
      localStorage.setItem("busData", JSON.stringify(mappedVehicles));

      // Update refs and state
      busDataRef.current = mappedVehicles;
      setBusData(mappedVehicles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicle assignments:", error);
    }
  };

  // On initial load, check for offline data in localStorage
  useEffect(() => {
    const storedBusData = localStorage.getItem("busData");

    if (storedBusData) {
      const parsedData = JSON.parse(storedBusData);
      busDataRef.current = parsedData;
      setBusData(parsedData);
      setLoading(false); // Set loading to false since offline data is available
    } else {
      fetchVehicleAssignments(); // If no offline data, fetch it
    }
  }, [selectedBus]); // Make sure fetchVehicleAssignments is called again when selectedBus changes

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit", // Correct type
      minute: "2-digit", // Correct type
      hour12: true, // Remains as a boolean
    };

    return date.toLocaleString("en-US", options); // Returns time in format like '10:00 AM'
  };

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "pusher",
      client: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || undefined,
        wsPort: process.env.NEXT_PUBLIC_PUSHER_PORT
          ? parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT, 10)
          : undefined,
        wssPort: process.env.NEXT_PUBLIC_PUSHER_PORT
          ? parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT, 10)
          : 443,
        forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
        disableStats: true,
      }),
    });

    const channel = echo.channel("flespi-data");

    channel
      .subscribed(() => {
        console.log("Subscribed to flespi-data channel");
      })
      .listen("FlespiDataReceived", (event: any) => {
        const { vehicle_id, location, dispatch_log } = event;

        console.log("Real Time Data:", event);

        if (!dispatch_log) {
          setPathData((prev) => ({
            ...prev,
            [vehicle_id]: [],
          }));
        }

        if (selectedBus === vehicle_id) {
          const newPoint = { lat: location.latitude, lng: location.longitude };
          setPathData((prev) => ({
            ...prev,
            [vehicle_id]: [...(prev[vehicle_id] || []), newPoint],
          }));
        }

        const updatedBusData = busDataRef.current.map((bus) =>
          bus.number === vehicle_id
            ? {
                ...bus,
                latitude: location.latitude || null,
                longitude: location.longitude || null,
                speed: location.speed || 0,
                time: formatTime(event.timestamp),
                status: dispatch_log?.status || "idle",
                dispatch_logs_id: dispatch_log?.dispatch_logs_id || null,
              }
            : bus
        );

        if (!updatedBusData.find((bus) => bus.number === vehicle_id)) {
          updatedBusData.push({
            number: vehicle_id,
            latitude: location.latitude || null,
            longitude: location.longitude || null,
            speed: location.speed || 0,
            time: formatTime(event.timestamp),
            status: dispatch_log?.status || "idle",
            dispatch_logs_id: dispatch_log?.dispatch_logs_id || null,
            name: "Unnamed",
          });
        }

        localStorage.setItem("busData", JSON.stringify(updatedBusData));

        busDataRef.current = updatedBusData;
        setBusData([...busDataRef.current]);
      });

    return () => {
      echo.leaveChannel("flespi-data");
    };
  }, [selectedBus]);

  const getButtonColor = (status: string) => {
    switch (status) {
      case "on road":
        return "bg-green-500 text-white";
      case "on alley":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const filteredBusData =
    activeButton === "all"
      ? busData
      : busData.filter((bus) => bus.status === activeButton);

  return (
    <Layout>
      <Header title="Dispatch Monitoring" />
      <section className="p-4 flex flex-col items-center">
        <div className="w-full md:w-5/6 flex flex-col h-full">
          <MapProvider>
            {loading ? (
              <div className="text-center mt-8">Loading map...</div>
            ) : (
              <div className="w-full h-64 sm:h-96 lg:h-[500px]">
                <DispatchMap
                  busData={busData}
                  pathData={pathData} // Now pathData is an object with bus numbers as keys
                  onBusClick={(busNumber) => {
                    setSelectedBus(busNumber);
                    const clickedBus = busData.find(
                      (bus) => bus.number === busNumber
                    );
                    if (clickedBus) {
                      setPathData((prev) => ({
                        ...prev,
                        [busNumber]: [
                          {
                            lat: clickedBus.latitude,
                            lng: clickedBus.longitude,
                          },
                        ],
                      }));
                    }
                  }}
                  selectedBus={selectedBus}
                />
              </div>
            )}
          </MapProvider>

          <div className="flex space-x-4 mb-5 -mt-4">
            {["all", "idle", "on road", "on alley"].map((status) => (
              <button
                key={status}
                className={`px-6 py-2 rounded-md text-lg font-semibold transition-transform duration-300 ease-in-out shadow-md ${
                  activeButton === status
                    ? "transform scale-110 border-2 border-blue-700 shadow-lg"
                    : "hover:shadow-lg"
                } ${
                  status === "all"
                    ? "bg-blue-500 text-white"
                    : getButtonColor(status)
                }`}
                onClick={() => setActiveButton(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="bus-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusData
              .slice() // Create a shallow copy to avoid mutating the original array
              .sort((a, b) => {
                // Convert bus.number to a number for comparison
                const numberA = parseInt(a.number, 10);
                const numberB = parseInt(b.number, 10);
                return numberA - numberB;
              })
              .map((bus) => (
                <button
                  key={bus.number}
                  onClick={() => setSelectedBus(bus.number)}
                  className={`w-full p-4 rounded-lg flex items-center space-x-4 shadow-md ${getButtonColor(
                    bus.status
                  )}`}
                >
                  <FaBus size={24} />
                  <div className="flex flex-col text-sm sm:text-base">
                    <span className="font-bold">Vehicle ID: {bus.number}</span>
                    <span>Status: {bus.status}</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DispatchMonitoring;
