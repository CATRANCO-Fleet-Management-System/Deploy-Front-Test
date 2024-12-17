"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import DispatchMap from "../components/DispatchMap";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { FaBus } from "react-icons/fa";
import { getAllVehicles } from "../services/vehicleService";
import { MapProvider } from "@/providers/MapProvider";

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
  dispatchStatus: string; // Either 'idle', 'on alley', or 'on road'
}

const DispatchMonitoring: React.FC = () => {
  const [busData, setBusData] = useState<BusData[]>([]);
  const [pathData, setPathData] = useState<{ lat: number; lng: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string>("all"); // Track active button

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await getAllVehicles();
        const mappedVehicles = vehicles.map((vehicle: any) => ({
          number: vehicle.vehicle_id,
          name: `Vehicle ${vehicle.vehicle_id}`,
          status: "Stationary",
          latitude: vehicle.latitude || 8.4663228,
          longitude: vehicle.longitude || 124.585,
          time: "",
          speed: 0,
          dispatchStatus: "idle", // Default status
        }));
        setBusData(mappedVehicles);

        if (mappedVehicles.length > 0 && !selectedBus) {
          const firstVehicle = mappedVehicles[0];
          setPathData([
            { lat: firstVehicle.latitude, lng: firstVehicle.longitude },
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [selectedBus]);

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
        console.log("Real-time Data Received:", event);

        const { tracker_ident, location, dispatch_log } = event;

        if (selectedBus === tracker_ident) {
          setPathData((prevPath) => [
            ...prevPath,
            { lat: location.latitude, lng: location.longitude },
          ]);
        }

        setBusData((prevData) => {
          const existingBus = prevData.find(
            (bus) => bus.number === tracker_ident
          );

          if (existingBus) {
            return prevData.map((bus) =>
              bus.number === tracker_ident
                ? {
                    ...bus,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    speed: location.speed || 0,
                    status: `Speed: ${location.speed || 0} km/h`,
                    time: new Date(event.timestamp * 1000).toISOString(),
                    dispatchStatus: dispatch_log?.status || "idle",
                  }
                : bus
            );
          } else {
            return [
              ...prevData,
              {
                number: tracker_ident,
                name: `Bus ${tracker_ident}`,
                latitude: location.latitude,
                longitude: location.longitude,
                speed: location.speed || 0,
                status: `Speed: ${location.speed || 0} km/h`,
                time: new Date(event.timestamp * 1000).toISOString(),
                dispatchStatus: dispatch_log?.status || "idle",
              },
            ];
          }
        });
      });

    return () => {
      echo.leaveChannel("flespi-data");
    };
  }, [selectedBus]);

  const getButtonColor = (dispatchStatus: string) => {
    switch (dispatchStatus) {
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
      : busData.filter((bus) => bus.dispatchStatus === activeButton);

  return (
    <Layout>
      <Header title="Dispatch Monitoring" />
      <section className="p-4 flex flex-col items-center">
        <div className="w-full md:w-5/6 flex flex-col h-full">
          {/* Map Display */}
          <MapProvider>
            {loading ? (
              <div className="text-center mt-8">Loading map...</div>
            ) : (
              <div className="w-full h-64 sm:h-96 lg:h-[500px]">
                <DispatchMap
                  busData={busData}
                  pathData={pathData}
                  onBusClick={(busNumber) => {
                    setSelectedBus(busNumber);
                    const clickedBus = busData.find(
                      (bus) => bus.number === busNumber
                    );
                    if (clickedBus) {
                      setPathData([
                        { lat: clickedBus.latitude, lng: clickedBus.longitude },
                      ]);
                    }
                  }}
                  selectedBus={selectedBus}
                />
              </div>
            )}
          </MapProvider>

          {/* Segregation Buttons */}
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

          {/* Vehicle Buttons */}
          <div className="bus-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusData.map((bus) => (
              <button
                key={bus.number}
                onClick={() => setSelectedBus(bus.number)}
                className={`w-full p-4 rounded-lg flex items-center space-x-4 shadow-md ${getButtonColor(
                  bus.dispatchStatus
                )}`}
              >
                <FaBus size={24} />
                <div className="flex flex-col text-sm sm:text-base">
                  <span className="font-bold">Vehicle ID: {bus.number}</span>
                  <span>Status: {bus.dispatchStatus}</span>
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
