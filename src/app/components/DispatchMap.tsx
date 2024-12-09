"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker Icon for buses
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png", // Ensure the bus icon is located in `public/`
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
}

interface DispatchMapProps {
  busData: BusData[];
  pathData: [number, number][];
  onBusClick: (busNumber: string) => void;
}

const DispatchMap: React.FC<DispatchMapProps> = ({ busData, pathData, onBusClick }) => {
  return (
    <MapContainer
      center={[8.48325558794408, 124.5866112118501]}
      zoom={13}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Render the bus trail */}
      {pathData.length > 0 && <Polyline positions={pathData} color="blue" weight={4} />}
      {/* Render buses */}
      {busData.map((bus) => (
        <Marker
          key={bus.number}
          position={[bus.latitude, bus.longitude]}
          icon={busIcon}
          eventHandlers={{
            click: () => onBusClick(bus.number),
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
  );
};

export default DispatchMap;
