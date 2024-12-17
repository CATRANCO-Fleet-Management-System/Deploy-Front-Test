"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { FaBus, FaCog, FaUsers } from "react-icons/fa";
import { getAllVehicles } from "@/app/services/vehicleService";
import { getAllActiveMaintenanceScheduling } from "@/app/services/maintenanceService";
import { getAllProfiles } from "@/app/services/userProfile";
import { MapProvider } from "@/providers/MapProvider";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import MapComponent from "@/app/components/Map";

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
  driver: string;
  conductor: string;
  plateNumber: string;
  dispatchStatus: string; // 'idle', 'on alley', 'on road'
}

const DashboardHeader: React.FC = () => {
  const [busesInOperation, setBusesInOperation] = useState(0);
  const [busesInMaintenance, setBusesInMaintenance] = useState(0);
  const [currentEmployees, setCurrentEmployees] = useState(0);
  const [busData, setBusData] = useState<BusData[]>([]);
  const [selectedBusDetails, setSelectedBusDetails] = useState<BusData | null>(null);

  // Fetch Static Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicles = await getAllVehicles();
        setBusesInOperation(vehicles.length);

        const maintenance = await getAllActiveMaintenanceScheduling();
        setBusesInMaintenance(maintenance.data.length);

        const profiles = await getAllProfiles();
        setCurrentEmployees(profiles.length);

        // Set the first bus as the default selected bus
        if (vehicles.length > 0) {
          const firstBus = vehicles[0];
          setSelectedBusDetails({
            number: firstBus.vehicle_id,
            name: `Bus ${firstBus.vehicle_id}`,
            status: "Stationary",
            latitude: firstBus.latitude || 0,
            longitude: firstBus.longitude || 0,
            time: "",
            speed: 0,
            driver: firstBus.driver || "Khen Paler",
            conductor: firstBus.conductor || "Juan Murillo",
            plateNumber: firstBus.plateNumber || "NOV-1232-123-12",
            dispatchStatus: "idle",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Real-Time Data Integration
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
    console.log("Subscribed to flespi-data channel");
    channel.listen("FlespiDataReceived", (event: any) => {
      const { tracker_ident, location, dispatch_log } = event;

      setBusData((prevData) => {
        const existingBus = prevData.find((bus) => bus.number === tracker_ident);

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
              driver: "Unknown Driver",
              conductor: "Unknown Conductor",
              plateNumber: "Unknown Plate",
              dispatchStatus: dispatch_log?.status || "idle",
            },
          ];
        }
      });
    });

    return () => {
      echo.leaveChannel("flespi-data");
    };
  }, []);

  return (
    <Layout>
      <Header title="Dashboard" />
      <section className="flex flex-col lg:flex-row p-6 bg-slate-200">
  <div className="flex-1">
    {/* Responsive Card Layout */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
        <FaBus className="text-blue-500" size={40} />
        <div>
          <h1 className="text-2xl font-bold">{busesInOperation}</h1>
          <p>Buses in Operation</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
        <FaCog className="text-green-500" size={40} />
        <div>
          <h1 className="text-2xl font-bold">{busesInMaintenance}</h1>
          <p>Buses in Maintenance</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
        <FaUsers className="text-purple-500" size={40} />
        <div>
          <h1 className="text-2xl font-bold">{currentEmployees}</h1>
          <p>Current Employees</p>
        </div>
      </div>
    </div>
    {/* Map Component */}
    <MapProvider>
      <MapComponent
        busData={busData}
        pathData={[]}
        onBusClick={(busNumber) => {
          const busDetails = busData.find((bus) => bus.number === busNumber);
          setSelectedBusDetails(busDetails || null);
        }}
        selectedBus={selectedBusDetails?.number || null}
      />
    </MapProvider>
  </div>

  {/* Sidebar */}
  <div className="w-full lg:w-1/4 bg-white shadow-md rounded-lg p-4 mt-6 lg:mt-0 lg:ml-6">
    {selectedBusDetails ? (
      <div>
        <h1 className="text-red-600 text-2xl font-bold">
          Bus {selectedBusDetails.number}
        </h1>
        <ul className="list-disc list-inside space-y-4 text-base mt-4">
          <li>
            <strong>Driver:</strong> {selectedBusDetails.driver}
          </li>
          <li>
            <strong>Conductor:</strong> {selectedBusDetails.conductor}
          </li>
          <li>
            <strong>Plate Number:</strong>{" "}
            {selectedBusDetails.plateNumber}
          </li>
          <li>
            <strong>Status:</strong> {selectedBusDetails.status}
          </li>
        </ul>
      </div>
    ) : (
      <h1 className="text-red-600 text-2xl font-bold">Select a Bus</h1>
    )}
  </div>
</section>
    </Layout>
  );
};

export default DashboardHeader;
