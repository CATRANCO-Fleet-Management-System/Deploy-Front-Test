"use client";
import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { FaBus, FaCog, FaUsers, FaAngleDoubleRight } from "react-icons/fa";
import { getAllVehicles } from "@/app/services/vehicleService"; // Import vehicle service
import { getAllActiveMaintenanceScheduling } from "@/app/services/maintenanceService"; // Import maintenance scheduling service
import { getAllProfiles } from "@/app/services/userProfile"; // Import profile service
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import mqtt from "mqtt";

// Custom Marker Icon for buses
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png", // Ensure this path points to a valid icon file
  iconSize: [30, 40],
  iconAnchor: [15, 40], // Anchor for the icon position
  popupAnchor: [0, -40],
});

// Define types for state variables
interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string; // Added time property to store the timestamp
  speed: number; // Added speed property
}

const DashboardHeader = () => {
  const [busesInOperation, setBusesInOperation] = useState(0);
  const [busesInMaintenance, setBusesInMaintenance] = useState(0);
  const [currentEmployees, setCurrentEmployees] = useState(0);
  const [loading, setLoading] = useState(true); // Loader state for map data
  const [error, setError] = useState<string | null>(null); // Error state for MQTT connection
  const [busData, setBusData] = useState<BusData[]>([]); // Array of BusData for live updates
  const [pathData, setPathData] = useState<[number, number][]>([]); // Array of [latitude, longitude]
  const [selectedBus, setSelectedBus] = useState<string | null>(null); // Selected bus ID
  const dropdownRef = useRef(null);

  // Fetch vehicles and related data (buses, maintenance, and profiles)
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await getAllVehicles();
        const inOperation = vehicles.filter(
          (vehicle) => vehicle.vehicle_id
        ).length;
        setBusesInOperation(inOperation);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    const fetchMaintenance = async () => {
      try {
        const response = await getAllActiveMaintenanceScheduling();
        const maintenanceCount = response.data ? response.data.length : 0; // Get count
        setBusesInMaintenance(maintenanceCount);
      } catch (error) {
        console.error("Error fetching active maintenance schedules:", error);
        setBusesInMaintenance(0); // Fallback to 0
      }
    };

    // Fetch current employees
    const fetchEmployees = async () => {
      try {
        const profiles = await getAllProfiles();
        setCurrentEmployees(profiles.length);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchVehicles();
    fetchMaintenance();
    fetchEmployees();
  }, []);

  // Connect to the MQTT broker to get live bus data
  useEffect(() => {
    const client = mqtt.connect("wss://mqtt.flespi.io", {
      username: process.env.NEXT_PUBLIC_FLESPI_TOKEN || "", // Use your Flespi token as the username
    });

    client.on("connect", () => {
      console.log("Connected to Flespi MQTT broker");

      // Subscribe to all device messages
      client.subscribe("flespi/message/gw/devices/#", (err) => {
        if (err) {
          console.error("Failed to subscribe to MQTT topic", err);
        } else {
          console.log("Subscribed to Flespi MQTT topic");
          setLoading(false); // Set loading to false after successful subscription
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log("Received MQTT message:", topic, message.toString());
      try {
        const parsedMessage = JSON.parse(message.toString());

        const deviceId = parsedMessage["device.id"];
        const latitude = parsedMessage["position.latitude"];
        const longitude = parsedMessage["position.longitude"];
        const speed = parsedMessage["position.speed"];
        const time = new Date(parsedMessage["timestamp"] * 1000).toISOString(); // Convert timestamp to ISO string

        // Update pathData for the selected bus
        if (selectedBus === deviceId.toString()) {
          setPathData((prevPath) => [
            ...prevPath,
            [latitude, longitude], // Add position even if speed is 0
          ]);
        }

        // Update bus data with live info
        setBusData((prevData) => {
          const updatedData = prevData.map((bus) =>
            bus.number === deviceId.toString()
              ? {
                  ...bus,
                  status: `Speed: ${speed} km/h`,
                  latitude,
                  longitude,
                  time,
                  speed,
                }
              : bus
          );

          if (!updatedData.some((bus) => bus.number === deviceId.toString())) {
            updatedData.push({
              number: deviceId.toString(),
              name: `Bus ${deviceId}`,
              status: `Speed: ${speed} km/h`,
              latitude,
              longitude,
              time,
              speed,
            });
          }

          return updatedData;
        });
      } catch (error) {
        console.error("Error processing MQTT message", error);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error", err);
      setError("Failed to connect to MQTT broker.");
    });

    return () => {
      client.end(); // Disconnect MQTT client
    };
  }, [selectedBus]);

  return (
    <Layout>
      <div className="w-full bg-slate-200">
        <Header title="Dashboard" />
        <section className="right w-full overflow-y-hidden">
          <div className="content flex flex-col h-full">
            <div className="statuses flex flex-row space-x-5 m-12">
              {/* Buses in Operation */}
              <div
                className="status-container bg-white h-40 rounded-lg border-2 border-violet-400"
                style={{ width: "290px" }}
              >
                <div className="inside-box flex flex-row justify-center items-center space-x-3 mt-8 ml-4 ">
                  <div className="text text-violet-700 space-y-2">
                    <h1 className="bus-op text-5xl font-bold">
                      {busesInOperation}
                    </h1>
                    <p className="text-lg mt-12">Buses in Operation</p>
                  </div>
                  <div>
                    <FaBus
                      size={60}
                      className="ml-2 cursor-pointer text-violet-400 mr-2"
                    />
                  </div>
                </div>
              </div>

              {/* Buses in Maintenance */}
              <div
                className="status-container w-1/4 bg-white h-40 rounded-lg border-2 border-violet-400"
                style={{ width: "300px" }}
              >
                <div className="inside-box flex flex-row justify-center items-center space-x-2 mt-8 ml-4">
                  <div className="text text-violet-700 space-y-2">
                    <h1 className="bus-op text-5xl font-bold">
                      {busesInMaintenance}
                    </h1>
                    <p className="text-lg">Buses in Maintenance</p>
                  </div>
                  <div>
                    <FaCog
                      size={60}
                      className="ml-2 cursor-pointer fill-none stroke-violet-400 stroke-20 mr-4 mb-6"
                    />
                  </div>
                </div>
              </div>

              {/* Current Employees */}
              <div
                className="status-container w-1/4 bg-white h-40 rounded-lg border-2 border-violet-400"
                style={{ width: "290px" }}
              >
                <div className="inside-box flex flex-row justify-center items-center space-x-2 mt-8 ml-4">
                  <div className="text text-violet-700 space-y-2">
                    <h1 className="bus-op text-5xl font-bold">
                      {currentEmployees}
                    </h1>
                    <p className="text-lg">Current Employees</p>
                  </div>
                  <div>
                    <FaUsers
                      size={70}
                      className="ml-2 cursor-pointer text-violet-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Location Section */}
            <div className="bus-location ml-12">
              <h1 className="text-violet-700 text-xl">Live Bus Locations</h1>
              <div className="output flex flex-row space-x-2 mt-8">
                <div className="locations w-2/4 bg-white h-120 rounded-lg border-2 border-violet-400">
                  {loading ? (
                    <p>Loading map...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <MapContainer
                      center={[8.48325558794408, 124.5866112118501]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {busData.map((bus) => (
                        <Marker
                          key={bus.number}
                          position={[bus.latitude, bus.longitude]}
                          icon={busIcon}
                          eventHandlers={{
                            click: () => setSelectedBus(bus.number),
                          }}
                        >
                          <Popup>
                            <div>
                              <h3>{bus.name}</h3>
                              <p>Status: {bus.status}</p>
                              <p>Time: {bus.time}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      {selectedBus && pathData.length > 0 && (
                        <Polyline positions={pathData} color="blue" />
                      )}
                    </MapContainer>
                  )}
                </div>

                <div className="arrow">
                  <FaAngleDoubleRight
                    size={20}
                    className="ml-2 cursor-pointer text-violet-800"
                  />
                </div>

                {/* Example Bus Information */}
                <div className="bus-information w-1/4 bg-white h-96 rounded-lg border-2 border-violet-400">
                  <div className="infos flex flex-col ml-5">
                    <div className="header-info flex flex-row mt-10 space-x-5">
                      <FaBus
                        size={60}
                        className="ml-2 cursor-pointer text-violet-600"
                      />
                      <h1 className="text-red-600 text-2xl font-bold">
                        {selectedBus ? `BUS ${selectedBus}` : "Select a Bus"}
                      </h1>
                    </div>
                    <div className="info-text mt-10">
                      <ul className="list-disc list-inside space-y-4 text-base">
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
                          <strong>Status:</strong>{" "}
                          {selectedBus ? "In Operation" : "Not Selected"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DashboardHeader;
