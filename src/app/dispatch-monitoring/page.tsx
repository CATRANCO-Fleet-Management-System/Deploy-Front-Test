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

  // Fetch initial bus data
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // Set up real-time data updates via Pusher
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
                    status: `Speed: ${location.speed} km/h`,
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
                status: `Speed: ${location.speed} km/h`,
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

  // Button color based on dispatch status
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

  return (
    <Layout>
      <Header title="Dispatch Monitoring" />
      <section className="p-4 flex flex-col items-center">
        <div className="w-5/6 flex flex-col h-full space-y-6">
          {/* Map Display */}
          <MapProvider>
            {loading ? (
              <div className="text-center mt-8">Loading map...</div>
            ) : (
              <DispatchMap
  busData={busData}
  pathData={pathData}
  onBusClick={(busNumber) => setSelectedBus(busNumber)}
  selectedBus={selectedBus}
/>
            )}
          </MapProvider>

          {/* Vehicle Buttons */}
          <div className="bus-info flex flex-wrap gap-4 justify-center">
            {busData.map((bus) => (
              <button
                key={bus.number}
                onClick={() => setSelectedBus(bus.number)}
                className={`w-64 p-4 rounded-lg flex items-center space-x-4 shadow-md ${getButtonColor(
                  bus.dispatchStatus
                )}`}
              >
                <FaBus size={30} />
                <div className="flex flex-col">
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
