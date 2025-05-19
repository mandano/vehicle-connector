// src/components/Map.tsx
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Vehicle } from "../types/Vehicle";
import { fetchVehicles } from "../api/userApi";

const lockedIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='40' viewBox='0 0 30 40'%3E%3Cpath fill='%23e74c3c' d='M15 2C8.925 2 4 6.925 4 13c0 5.488 9.75 19.25 11 22.125 1.25-2.875 11-16.637 11-22.125C26 6.925 21.075 2 15 2zm0 6c1.1 0 2 0.9 2 2v2h1v6h-6v-6h1v-2c0-1.1 0.9-2 2-2zm0 1c-0.55 0-1 0.45-1 1v2h2v-2c0-0.55-0.45-1-1-1z'/%3E%3C/svg%3E";

const unlockedIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='40' viewBox='0 0 30 40'%3E%3Cpath fill='%232ecc71' d='M15 2C8.925 2 4 6.925 4 13c0 5.488 9.75 19.25 11 22.125 1.25-2.875 11-16.637 11-22.125C26 6.925 21.075 2 15 2zm0 6c1.1 0 2 0.9 2 2v2h1v6h-6v-6h1v-3c0-0.55 0.45-1 1-1s1 0.45 1 1v0.5h1V11c0-1.1-0.9-2-2-2-1.1 0-2 0.9-2 2v1h1v-1z'/%3E%3C/svg%3E";

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
  const [vehicleRoutes, setVehicleRoutes] = useState<
    Record<string, Array<[number, number]>>
  >({});

  const loadVehicles = async () => {
    try {
      const data = await fetchVehicles();
      setVehicles(data);

      setVehicleRoutes((prevRoutes) => {
        const newRoutes = { ...prevRoutes };

        data.forEach((vehicle) => {
          const isLocked = vehicle.model?.lock?.state?.state === "locked";
          const vehicleId = vehicle.id;

          if (isLocked && newRoutes[vehicleId]) {
            delete newRoutes[vehicleId];
            return;
          }

          const lat = vehicle.model?.ioT?.position?.latitude?.state;
          const lng = vehicle.model?.ioT?.position?.longitude?.state;

          if (!lat || !lng) return;

          if (
            prevRoutes[vehicleId] &&
            prevRoutes[vehicleId].length > 0 &&
            lat ===
              prevRoutes[vehicleId][prevRoutes[vehicleId].length - 1][0] &&
            lng === prevRoutes[vehicleId][prevRoutes[vehicleId].length - 1][1]
          ) {
            return;
          }

          const currentRoute = prevRoutes[vehicleId] || [];
          const newRoute = [...currentRoute, [lat, lng]];
          newRoutes[vehicleId] = newRoute.slice(-100) as [number, number][];
        });

        return newRoutes;
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

  const getVehicleIcon = (vehicle: Vehicle) => {
    if (!vehicle.model?.lock?.state?.state) {
      return defaultIcon;
    }

    const isLocked = vehicle.model?.lock?.state?.state === "locked";

    return L.icon({
      iconUrl: isLocked ? lockedIcon : unlockedIcon,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -35],
    });
  };

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
          <Marker
            key={vehicle.id}
            position={[
              vehicle.model?.ioT?.position?.latitude?.state,
              vehicle.model?.ioT?.position?.longitude?.state,
            ]}
            icon={getVehicleIcon(vehicle)}
          >
            <Popup>
              <div>
                <h3>Vehicle: {vehicle.id}</h3>
                <p>Model: {vehicle.model?.modelName}</p>
                {vehicle.model?.lock?.state && (
                  <p>
                    <span
                      style={{
                        color:
                          vehicle.model?.lock?.state?.originatedAt &&
                          new Date().getTime() -
                            new Date(
                              vehicle.model?.lock?.state?.originatedAt,
                            ).getTime() >
                            60 * 24 * 2 * 60 * 1000
                            ? "#999"
                            : "inherit",
                      }}
                      title={
                        vehicle.model?.lock?.state?.originatedAt
                          ? new Date(
                              vehicle.model?.lock?.state?.originatedAt,
                            ).toUTCString()
                          : "originatedAt not set"
                      }
                    >
                      Lock: {vehicle.model?.lock?.state?.state}
                    </span>
                  </p>
                )}
                {vehicle.model?.ioT?.network?.connectionModules?.length > 0 && (
                  <p>
                    <span
                      style={{
                        color:
                          vehicle.model?.ioT?.network?.connectionModules[0]
                            ?.state.originatedAt &&
                          new Date().getTime() -
                            new Date(
                              vehicle.model?.ioT?.network?.connectionModules[0]?.state.originatedAt,
                            ).getTime() >
                            60 * 24 * 2 * 60 * 1000
                            ? "#999"
                            : "inherit",
                      }}
                      title={
                        vehicle.model?.ioT?.network?.connectionModules[0]?.state
                          .originatedAt
                          ? new Date(
                              vehicle.model?.ioT?.network?.connectionModules[0]?.state.originatedAt,
                            ).toUTCString()
                          : "originatedAt not set"
                      }
                    >
                      Connection:{" "}
                      {vehicle.model?.ioT?.network?.connectionModules[0]?.state
                        ?.state || "unknown"}
                    </span>
                  </p>
                )}
                {vehicle.model?.energy?.batteries[0]?.level && (
                  <p>
                    <span
                      style={{
                        color:
                          vehicle.model?.energy?.batteries[0]?.level
                            ?.originatedAt &&
                          new Date().getTime() -
                            new Date(
                              vehicle.model?.energy?.batteries[0]?.level?.originatedAt,
                            ).getTime() >
                            10 * 60 * 1000
                            ? "#999"
                            : "inherit",
                      }}
                      title={
                        vehicle.model?.energy?.batteries[0]?.level?.originatedAt
                          ? new Date(
                              vehicle.model?.energy?.batteries[0]?.level?.originatedAt,
                            ).toUTCString()
                          : "originatedAt not set"
                      }
                    >
                      Battery:{" "}
                      {vehicle.model?.energy?.batteries[0]?.level?.state}%
                    </span>
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
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
