import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow } from "@react-google-maps/api";

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
  pathData: { [busNumber: string]: { lat: number; lng: number }[] }; // Modify pathData to be a map of bus numbers to path data
  onBusClick: (busNumber: string) => void;
  selectedBus?: string | null;
}

const staticLocations = [
  { id: 1, title: "Canitoan", coordinate: { lat: 8.4663228, lng: 124.5853069 } },
  { id: 2, title: "Silver Creek", coordinate: { lat: 8.475946, lng: 124.6120194 } },
  { id: 3, title: "Cogon", coordinate: { lat: 8.4759094, lng: 124.6514315 } },
];

const mapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
};

const defaultMapCenter = {
  lat: 8.48325558794408,
  lng: 124.5866112118501,
};

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

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
  const [zoomLevel, setZoomLevel] = useState(13);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.addListener("zoom_changed", () => {
      const currentZoom = map.getZoom() || 13;
      setZoomLevel(currentZoom);
    });
  };

  const fitMapBounds = () => {
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      staticLocations.forEach((location) => {
        bounds.extend(location.coordinate);
      });
      mapRef.current.fitBounds(bounds);
    }
  };

  useEffect(() => {
    fitMapBounds();
  }, [mapRef.current]);

  return (
    <div className="relative w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultMapCenter}
        zoom={zoomLevel}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* Render dynamic bus markers and corresponding polyline */}
        {busData.map((bus) => {
          const busPath = pathData[bus.number] || []; // Get the path for this specific bus

          return (
            <React.Fragment key={bus.number}>
              {/* Marker for the bus */}
              <Marker
                position={{ lat: bus.latitude, lng: bus.longitude }}
                icon={{
                  url: getIconUrl(bus.status),
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => onBusClick(bus.number)}
              >
                {selectedBus === bus.number && (
                  <InfoWindow position={{ lat: bus.latitude, lng: bus.longitude }}>
                    <div>
                      <strong>Bus {bus.number}</strong>
                      <br />
                      Speed: {bus.speed} km/h
                      <br />
                      Status: {bus.status}
                      <br />
                      Latitude: {bus.latitude?.toFixed(6) || "N/A"}, Longitude: {bus.longitude?.toFixed(6) || "N/A"}
                      <br />
                      Time: {bus.time}
                    </div>
                  </InfoWindow>
                )}
              </Marker>

              {/* Polyline for the bus */}
              {busPath.length > 0 && (
                <Polyline
                  path={busPath} // Use the path specific to this bus
                  options={{
                    strokeColor: bus.status === "on road" ? "green" : "blue",
                    strokeWeight: 4,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Render static location markers */}
        {staticLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinate}
            icon={{
              url: `/${location.title.toLowerCase().replace(" ", "_")}.png`,
              scaledSize: new window.google.maps.Size(50, 50),
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
