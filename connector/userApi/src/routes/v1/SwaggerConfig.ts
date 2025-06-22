export class SwaggerConfig {
  private readonly _port: number;
  private _apis = [
    "./src/routes/v1/vehicle/Get.ts",
    "./src/routes/v1/vehicle/GetByImei.ts",
    "./src/routes/v1/vehicle/Lock.ts",
    "./src/routes/v1/vehicle/Unlock.ts",
    "./src/routes/v1/vehicle/UpdateModelName.ts",
    "./src/routes/v1/vehicles/map/Get.ts",
    "./src/routes/v1/health/Queue.ts",
    "./src/routes/v1/models/create/Get.ts",
    "./src/routes/v1/vehicle/Create.ts",
    "./src/routes/v1/vehicle/IsConnected.ts",
  ];

  constructor(port: number) {
    this._port = port;
  }

  private definition(): object {
    return {
      openapi: "3.0.0",
      info: {
        title: "Vehicle Connector",
        version: "0.1.0",
        description: "",
      },
      servers: [
        {
          url: `http://localhost:${this._port}`,
          description: "Local server",
        },
      ],
      tags: [
        {
          name: "Vehicle",
          description: "Vehicle operations",
        },
      ]
    };
  }

  public options(): object {
    return { definition: this.definition(), apis: this._apis };
  }
}
