"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import DispatchMap from "../components/DispatchMap";
import mqtt from "mqtt";
import { FaBus } from "react-icons/fa";
import { getAllVehicles } from "../services/vehicleService"; // Import the API service

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
}

const DispatchMonitoring: React.FC = () => {
  const [busData, setBusData] = useState<BusData[]>([]);
  const [pathData, setPathData] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  // Fetch vehicles from the backend
  const fetchVehicles = async () => {
    try {
      const vehicles = await getAllVehicles(); // Fetch vehicles from API
      const mappedVehicles = vehicles.map((vehicle: any) => ({
        number: vehicle.vehicle_id, // Use `vehicle_id` for the vehicle number
        name: `Vehicle ${vehicle.vehicle_id}`, // Default name
        status: "Stationary", // Default status
        latitude: vehicle.latitude || 0, // Default latitude
        longitude: vehicle.longitude || 0, // Default longitude
        time: "", // Default time
        speed: 0, // Default speed
      }));
      setBusData(mappedVehicles);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles.");
    }
  };

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles on component mount
  }, []);

  useEffect(() => {
    const client = mqtt.connect("wss://mqtt.flespi.io", {
      username: process.env.NEXT_PUBLIC_FLESPI_TOKEN || "",
    });

    client.on("connect", () => {
      console.log("Connected to Flespi MQTT broker");
      client.subscribe("flespi/message/gw/devices/#", (err) => {
        if (err) {
          console.error("Failed to subscribe to MQTT topic", err);
        } else {
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

        if (latitude === undefined || longitude === undefined) return;

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
    <Layout>
      <Header title="Dispatch Monitoring" />
      <section className="p-4 flex flex-col items-center">
        <div className="w-5/6 flex flex-col h-full">
          {loading ? (
            <div className="text-center mt-8">Loading map...</div>
          ) : (
            <DispatchMap
              busData={busData}
              pathData={pathData}
              onBusClick={(busNumber) => setSelectedBus(busNumber)}
            />
          )}
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
                  Vehicle {bus.number} (ID: {bus.number})
                </h1>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DispatchMonitoring;
