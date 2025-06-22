import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import Vehicle from "../types/Vehicle";
import { fetchVehicles } from "../api/userApi";
import VehicleUtils from "../VehicleUtils";
import Waypoints from "../types/Waypoints";

import VehicleMarker from "./vehicle/VehicleMarker";

const defaultIcon = L.icon({
  iconUrl: "images/marker-icon.png",
  shadowUrl: "images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const VehicleMap: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [vehicleRoutes, setVehicleRoutes] = useState<Record<string, Waypoints>>(
    {},
  );

  const loadVehicles = async () => {
    try {
      const data = await fetchVehicles();
      setVehicles(data);

      setVehicleRoutes((prevRoutes) => {
        return VehicleUtils.setRoutes(data, prevRoutes);
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading vehicle data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();

    const interval = setInterval(() => {
      loadVehicles();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Load vehicle data...</div>;
  }

  const getMapCenter = () => {
    if (vehicles.length === 0) return [52.520008, 13.404954]; // Berlin als Standard

    const lats = vehicles.map((v) => v.model.ioT.position.latitude.state);
    const lngs = vehicles.map((v) => v.model.ioT.position.longitude.state);

    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ];
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={getMapCenter() as [number, number]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map((vehicle) => (
          <VehicleMarker key={vehicle.id} vehicle={vehicle} />
        ))}
        {Object.entries(vehicleRoutes).map(([vehicleId, route]) => (
          <Polyline
            key={`route-${vehicleId}`}
            positions={route}
            color="#888888"
            weight={3}
            opacity={0.7}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default VehicleMap;
