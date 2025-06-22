import React from "react";

import VehiclePopupProps from "../../types/VehiclePopupProps";

const VehiclePopup: React.FC<VehiclePopupProps> = ({ vehicle }) => {
  const getTimeBasedStyle = (
    originatedAt?: string,
    thresholdMinutes = 2880,
  ) => {
    if (!originatedAt) return { color: "inherit" };

    const timeDiff = new Date().getTime() - new Date(originatedAt).getTime();
    const isOld = timeDiff > thresholdMinutes * 60 * 1000;

    return {
      color: isOld ? "#999" : "inherit",
    };
  };

  const formatDate = (dateString?: string) => {
    return dateString
      ? new Date(dateString).toUTCString()
      : "originatedAt not set";
  };

  const model = vehicle.model;

  if (!model) {
    return null;
  }

  const lockState = model.lock?.state;
  const network = model.ioT?.network;
  const batteries = model.batteries;

  return (
    <div>
      <h3>Vehicle: {vehicle.id}</h3>
      <p>Model: {model.modelName}</p>
      <p>IMEI: {network?.connectionModules[0]?.imei}</p>

      {lockState?.state && (
        <p>
          <span
            style={getTimeBasedStyle(lockState?.originatedAt)}
            title={formatDate(lockState?.originatedAt)}
          >
            Lock: {lockState?.state}
          </span>
        </p>
      )}

      {network?.connectionModules?.length > 0 && (
        <p>
          <span
            style={getTimeBasedStyle(
              network?.connectionModules[0]?.state.state.originatedAt,
            )}
            title={formatDate(
              network?.connectionModules[0]?.state.state.originatedAt,
            )}
          >
            Connection:{" "}
            {network?.connectionModules[0]?.state?.state.state || "unknown"}
          </span>
        </p>
      )}

      {batteries?.batteries[0]?.level && (
        <p>
          <span
            style={getTimeBasedStyle(
              batteries?.batteries[0]?.level?.originatedAt,
              10, // 10 Minuten für Batterie
            )}
            title={formatDate(batteries?.batteries[0]?.level?.originatedAt)}
          >
            Battery: {batteries?.batteries[0]?.level?.state}%
          </span>
        </p>
      )}
    </div>
  );
};

export default VehiclePopup;
