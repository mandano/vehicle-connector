type VehicleStorageObject = {
  id: string | number;
  model: {
    modelName: string;
    [key: string]: unknown;
  };
  createdAt: Date | string;
}

export default VehicleStorageObject;
