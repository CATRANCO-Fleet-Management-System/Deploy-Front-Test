"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { FaBus } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import mqtt from "mqtt";

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
}

// Custom Marker Icon for buses
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const DispatchMonitoring: React.FC = () => {
  const [busData, setBusData] = useState<BusData[]>([]);
  const [pathData, setPathData] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the Flespi MQTT broker
    const client = mqtt.connect("wss://mqtt.flespi.io", {
      username: process.env.NEXT_PUBLIC_FLESPI_TOKEN || "", // Ensure the token is set
    });

    client.on("connect", () => {
      console.log("Connected to Flespi MQTT broker");

      // Subscribe to all device messages
      client.subscribe("flespi/message/gw/devices/#", (err) => {
        if (err) {
          console.error("Failed to subscribe to MQTT topic", err);
        } else {
          console.log("Subscribed to Flespi MQTT topic");
          setLoading(false);
        }
      });
    });

    client.on("message", (topic, message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const deviceId = parsedMessage["device.id"];
        const latitude = parsedMessage["position.latitude"];
        const longitude = parsedMessage["position.longitude"];
        const speed = parsedMessage["position.speed"] || 0;
        const timestamp = parsedMessage["timestamp"];

        if (latitude === undefined || longitude === undefined) {
          console.warn("Invalid position data in message:", parsedMessage);
          return;
        }

        const time = new Date(timestamp * 1000).toISOString();

        if (speed > 0 && selectedBus === deviceId?.toString()) {
          setPathData((prevPath) => [...prevPath, [latitude, longitude]]);
        }

        setBusData((prevData) => {
          const existingBus = prevData.find((bus) => bus.number === deviceId?.toString());

          if (existingBus) {
            return prevData.map((bus) =>
              bus.number === deviceId?.toString()
                ? { ...bus, latitude, longitude, speed, status: `Speed: ${speed} km/h`, time }
                : bus
            );
          } else {
            return [
              ...prevData,
              {
                number: deviceId?.toString(),
                name: `Bus ${deviceId}`,
                status: `Speed: ${speed} km/h`,
                latitude,
                longitude,
                time,
                speed,
              },
            ];
          }
        });
      } catch (err) {
        console.error("Error processing MQTT message:", err);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      setError("Failed to connect to MQTT broker.");
    });

    return () => {
      client.end();
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
                      center={[8.48325558794408, 124.5866112118501]}
                      zoom={13}
                      style={{ height: "450px", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      {pathData.length > 0 && (
                        <Polyline positions={pathData} color="blue" weight={4} />
                      )}
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
              {busData.map((bus) => (
                <button
                  key={bus.number}
                  onClick={() => setSelectedBus(bus.number)}
                  className={`container w-80 p-4 rounded-lg flex flex-row space-x-8 ${
                    selectedBus === bus.number ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  } transition-all duration-200`}
                >
                  <FaBus size={30} />
                  <h1 className="font-bold">
                    {bus.name} (ID: {bus.number})
                  </h1>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DispatchMonitoring;
