import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

import Vehicle from "../../types/Vehicle";
import VehicleMarkerProps from "../../types/VehicleMarkerProps";

import VehiclePopup from "./VehiclePopup";

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

const VehicleMarker: React.FC<VehicleMarkerProps> = ({ vehicle }) => {
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

  const lat = vehicle.model?.ioT?.position?.latitude?.state;
  const lng = vehicle.model?.ioT?.position?.longitude?.state;

  if (!lat || !lng) {
    return null;
  }

  return (
    <Marker
      key={vehicle.id}
      position={[lat, lng]}
      icon={getVehicleIcon(vehicle)}
    >
      <Popup>
        <VehiclePopup vehicle={vehicle} />
      </Popup>
    </Marker>
  );
};

export default VehicleMarker;
