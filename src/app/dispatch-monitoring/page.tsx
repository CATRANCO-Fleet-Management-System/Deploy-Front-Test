"use client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { FaBus } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import mqtt from "mqtt";

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

// Custom Marker Icon for buses
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png", // Ensure this path points to a valid icon file
  iconSize: [30, 40],
  iconAnchor: [15, 40], // Anchor for the icon position
  popupAnchor: [0, -40],
});

const DispatchMonitoring: React.FC = () => {
  const [busData, setBusData] = useState<BusData[]>([]); // Array of BusData
  const [pathData, setPathData] = useState<[number, number][]>([]); // Array of [latitude, longitude]
  const [loading, setLoading] = useState(true); // Loader state
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedBus, setSelectedBus] = useState<string | null>(null); // Selected bus ID

  useEffect(() => {
    // Connect to the MQTT broker
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
        // Parse the incoming message as JSON
        const parsedMessage = JSON.parse(message.toString());
  
        // Extract the required data from the parsed JSON
        const deviceId = parsedMessage["device.id"];
        const latitude = parsedMessage["position.latitude"];
        const longitude = parsedMessage["position.longitude"];
        const speed = parsedMessage["position.speed"];
        const time = new Date(parsedMessage["timestamp"] * 1000).toISOString(); // Convert timestamp to ISO string
  
        // Update path data for the selected bus only if it's moving (speed > 0)
        if (speed > 0) {
          if (selectedBus === deviceId.toString()) {
            setPathData((prevPath) => [
              ...prevPath,
              [latitude, longitude],
            ]);
          }
        }
  
        // Update bus data with the latest position and speed
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
  
          // Add new bus if it's not already in the list
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
  
    // Cleanup on component unmount
    return () => {
      client.end(); // Disconnect MQTT client
    };
  }, [selectedBus]);
  
  

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-200 pb-10">
        <Header title="Dispatch Monitoring" />
        <section className="p-4 flex flex-col items-center">
          <div className="w-5/6 flex flex-col h-full">
            <div className="bus-location">
              <div className="output flex flex-row space-x-2 mt-8">
                <div className="locations w-full bg-white h-auto rounded-lg border-2 border-violet-400">
                  {loading ? (
                    <div className="text-center mt-8">Loading map...</div>
                  ) : (
                    <MapContainer
                      center={[8.48325558794408, 124.5866112118501]} // Default center
                      zoom={13}
                      style={{ height: "450px", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                      />
                      {/* Add polyline for the path */}
                      {pathData.length > 0 && (
                        <Polyline positions={pathData} color="blue" weight={4} />
                      )}
                      {/* Show marker for the latest position */}
                      {busData.map((bus) => (
                        <Marker
                          key={bus.number}
                          position={[bus.latitude, bus.longitude]}
                          icon={busIcon}
                          eventHandlers={{
                            click: () => {
                              setSelectedBus(bus.number);
                            },
                          }}
                        >
                          <Popup>
                            <div>
                              <strong>Bus {bus.number}</strong>
                              <br />
                              Status: {bus.status}
                              <br />
                              Lat: {bus.latitude}, Lon: {bus.longitude}
                              <br />
                              Time: {bus.time}
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  )}
                </div>
              </div>
            </div>
            {error && <div className="text-center text-red-500 mt-8">{error}</div>}
            <div className="bus-info flex flex-row mt-12 space-x-4">
              <div className="col-bus space-y-4">
                {busData.map((bus) => {
                  const isSelected = selectedBus === bus.number;
                  return (
                    <button
                      key={bus.number}
                      onClick={() => setSelectedBus(bus.number)}
                      className={`container w-80 p-4 rounded-lg flex flex-row space-x-8 ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      } transition-all duration-200`}
                    >
                      <FaBus size={30} />
                      <h1 className="font-bold">
                        {bus.name} (ID: {bus.number})
                      </h1>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DispatchMonitoring;
