"use client";

import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow } from "@react-google-maps/api";

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

interface DispatchMapProps {
  busData: BusData[];
  pathData: { lat: number; lng: number }[];
  onBusClick: (busNumber: string) => void;
  selectedBus?: string | null; // Added to track the selected bus for InfoWindow
}

const staticLocations = [
  {
    id: 1,
    title: "Canitoan",
    coordinate: { lat: 8.4663228, lng: 124.5853069 },
  },
  {
    id: 2,
    title: "Silver Creek",
    coordinate: { lat: 8.475946, lng: 124.6120194 },
  },
  {
    id: 3,
    title: "Cogon",
    coordinate: { lat: 8.4759094, lng: 124.6514315 },
  },
];

// Styling for the map container
const mapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
};

// Default center coordinates
const defaultMapCenter = {
  lat: 8.48325558794408,
  lng: 124.5866112118501,
};

// Map options
const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

// Icon URLs based on dispatch status
const getIconUrl = (status: string) => {
  switch (status) {
    case "on alley":
      return "/bus_on_alley.png";
    case "on road":
      return "/bus_on_road.png";
    default:
      return "/bus_idle.png";
  }
};

const DispatchMap: React.FC<DispatchMapProps> = ({
  busData,
  pathData,
  onBusClick,
  selectedBus,
}) => {
  const [zoomLevel, setZoomLevel] = useState(13); // Default zoom level
  const mapRef = useRef<google.maps.Map | null>(null); // Store map instance

  // Capture the map instance when the map is loaded
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    // Listen to zoom level changes
    map.addListener("zoom_changed", () => {
      const currentZoom = map.getZoom() || 13;
      setZoomLevel(currentZoom);
    });
  };

  // Calculate marker size dynamically based on zoom level
  const calculateMarkerSize = (zoom: number) => {
    const baseSize = 50; // Minimum size
    const scaleFactor = 4; // Scaling factor for size increase
    const size = Math.max(baseSize, zoom * scaleFactor);
    return new window.google.maps.Size(size, size * 1.5); // Maintain aspect ratio
  };

  return (
    <div className="relative w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultMapCenter}
        zoom={zoomLevel}
        options={mapOptions}
        onLoad={handleMapLoad} // Capture the map instance
      >
        {/* Render the bus trail (polyline) */}
        {pathData.length > 0 && (
          <Polyline
            path={pathData}
            options={{
              strokeColor: "blue",
              strokeWeight: 4,
            }}
          />
        )}

        {/* Render dynamic bus markers */}
        {busData.map((bus) => (
          <Marker
            key={bus.number}
            position={{ lat: bus.latitude, lng: bus.longitude }}
            icon={{
              url: getIconUrl(bus.dispatchStatus),
              scaledSize: calculateMarkerSize(zoomLevel), // Dynamic size
            }}
            onClick={() => onBusClick(bus.number)}
          >
            {selectedBus === bus.number && (
              <InfoWindow position={{ lat: bus.latitude, lng: bus.longitude }}>
                <div>
                  <strong>Bus {bus.number}</strong>
                  <br />
                  Status: {bus.status}
                  <br />
                  Latitude: {bus.latitude.toFixed(6)}, Longitude:{" "}
                  {bus.longitude.toFixed(6)}
                  <br />
                  Time: {bus.time}
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}

        {/* Render static location markers */}
        {staticLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinate}
            icon={{
              url: `/${location.title.toLowerCase().replace(" ", "_")}.png`,
              scaledSize: calculateMarkerSize(zoomLevel), // Dynamic size
            }}
            title={location.title}
          >
            <InfoWindow position={location.coordinate}>
              <div>{location.title}</div>
            </InfoWindow>
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
};

export default DispatchMap;
