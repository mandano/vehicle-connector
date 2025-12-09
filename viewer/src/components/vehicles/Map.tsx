import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import Vehicle from "../../types/vehicles/Vehicle";
import VehicleRoutes from "../../types/vehicles/VehicleRoutes";
import VehicleMarker from "../vehicle/VehicleMarker";
import GeoSpatial from "../../GeoSpatial";
import SimulatorApi from "../../api/simulator/SimulatorApi";
import FetchResource from "../../api/FetchResource";
import UserApi from "../../api/userApi/UserApi";

import MapHelper from "./MapHelper";

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
  const [routes, setRoutes] = useState<VehicleRoutes>({});

  const fetchResource = new FetchResource();
  const map = new MapHelper(
    new GeoSpatial(),
    new SimulatorApi("/simulator/v1", fetchResource),
    new UserApi("/userapi/v1", fetchResource),
  );

  const loadVehicles = async () => {
    const vehicles = await map.loadVehicles();
    setVehicles(vehicles);

    setLoading(false);
    return vehicles;
  };

  const loadRoutes = async (vehicles: Vehicle[]) => {
    const routes = await map.loadRoutes(vehicles);

    setRoutes(() => {
      return routes;
    });
  };

  useEffect(() => {
    loadVehicles();

    const interval = setInterval(async () => {
      const vehicles = await loadVehicles();
      loadRoutes(vehicles);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Load vehicle data...</div>;
  }

  const traveledRouteOptions = {
    color: "#555555",
    weight: 4,
    opacity: 0.7,
  };

  const remainingRouteOptions = {
    color: "#3388ff",
    weight: 4,
    opacity: 0.7,
    dashArray: "10, 10",
    lineCap: "round" as const,
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={map.getMapCenter(vehicles) as [number, number]}
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

        {Object.entries(routes).map(([vehicleId, route]) => (
          <Polyline
            key={`route-traveled-${vehicleId}`}
            positions={route.traveled}
            pathOptions={traveledRouteOptions}
          />
        ))}
        {Object.entries(routes).map(([vehicleId, route]) => (
          <Polyline
            key={`route-remaining-${vehicleId}`}
            positions={route.remaining}
            pathOptions={remainingRouteOptions}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default VehicleMap;
