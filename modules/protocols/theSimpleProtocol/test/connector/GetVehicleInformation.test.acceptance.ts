import { describe, it } from "node:test";
import assert from "node:assert/strict";

import request from "supertest";
import { faker } from "@faker-js/faker";

describe("GetVehicleInformation", () => {
  const userApiPort = process.env.USER_API_PORT || "3103";
  const userApiUrl = `http://localhost:${userApiPort}`;

  it("should create vehicle", { timeout: 10000}, async () => {
    const sampleData = {
      modelName: "LockableScooter",
      modelContent: {
        imei: faker.string.numeric(15),
        protocol: "THE_SIMPLE_PROTOCOL",
        protocolVersion: "0_2",
        coordinate: {
          latitude: 12.45,
          longitude: 54.3453,
        },
      },
    };

    const response = await request(userApiUrl)
      .post("/api/v1/vehicle/create")
      .send(sampleData)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.message, "Vehicle created");
    assert.ok(Number.isInteger(response.body.id), "ID should be an integer");
  });

  it("should retrieve vehicle information by vehicle id", async () => {
    const sampleData = {
      modelName: "LockableScooter",
      modelContent: {
        imei: faker.string.numeric(15),
        protocol: "THE_SIMPLE_PROTOCOL",
        protocolVersion: "0_2",
        coordinate: {
          latitude: 12.45,
          longitude: 54.3453,
        },
      },
    };

    const responseCreate = await request(userApiUrl)
      .post("/api/v1/vehicle/create")
      .send(sampleData)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    assert.strictEqual(responseCreate.status, 201);
    assert.strictEqual(responseCreate.body.message, "Vehicle created");
    assert.ok(Number.isInteger(responseCreate.body.id), "ID should be an integer");

    const vehicleId = responseCreate.body.id;

    const responseGet = await request(userApiUrl)
      .get(`/api/v1/vehicle/${vehicleId}`)
      .set("Accept", "application/json");

    assert.strictEqual(responseGet.status, 200);
    assert.ok(responseGet.body.id, "Body should have ID property");
    assert.ok(responseGet.body.model, "Body should have model property");
    assert.strictEqual(responseGet.body.model.modelName, "LockableScooter");
    assert.ok(responseGet.body.model.ioT, "Model should have ioT property");
    assert.ok(
      responseGet.body.model.ioT.network,
      "IoT should have network property",
    );
    assert.ok(
      responseGet.body.model.ioT.network.connectionModules,
      "Network should have connectionModules",
    );

    const connectionModule =
      responseGet.body.model.ioT.network.connectionModules[0];
    assert.strictEqual(connectionModule.imei, sampleData.modelContent.imei);
    assert.ok(
      connectionModule.setProtocolVersion,
      "Should have setProtocolVersion property",
    );
    assert.ok(
      connectionModule.setProtocolVersion.state,
      "setProtocolVersion should have state",
    );
    assert.strictEqual(
      connectionModule.setProtocolVersion.state,
      sampleData.modelContent.protocolVersion,
    );
    assert.ok(connectionModule.setProtocol, "Should have setProtocol property");
    assert.ok(
      connectionModule.setProtocol.state,
      "setProtocol should have state",
    );
    assert.strictEqual(
      connectionModule.setProtocol.state,
      sampleData.modelContent.protocol,
    );

    assert.ok(
      responseGet.body.model.ioT.position,
      "IoT should have position property",
    );
    assert.ok(
      responseGet.body.model.ioT.position.latitude,
      "Position should have latitude property",
    );
    assert.ok(
      responseGet.body.model.ioT.position.longitude,
      "Position should have longitude property",
    );
    assert.ok(
      responseGet.body.model.ioT.position.latitude.state,
      "Latitude should have state property",
    );
    assert.ok(
      responseGet.body.model.ioT.position.longitude.state,
      "Longitude should have state property",
    );
    assert.strictEqual(
      responseGet.body.model.ioT.position.latitude.state,
      sampleData.modelContent.coordinate.latitude,
    );
    assert.strictEqual(
      responseGet.body.model.ioT.position.longitude.state,
      sampleData.modelContent.coordinate.longitude,
    );
  });

  it("should handle protocol data with invalid IMEI", async () => {
    /*const invalidData =
      "T_S_P:0_1:INVALID:UPDATE_SIMPLE_SCOOTER:lat=12.4567,lng=12.4567";

    const response = await request(SERVICE_URL)
      .post("/api/vehicle/data")
      .send({ data: invalidData })
      .set("Accept", "application/json");

    assert.strictEqual(response.status, 400);*/
  });

  it("can read updated vehicle data", async () => {
    /* T_S_P;0_2;356789012345678;UPDATE_SIMPLE_SCOOTER;2025-05-08T11:56:34.280Z;lat=52.4915171,latOriginatedAt=2025-05-08T11:56:34.280Z,lng=13.4796515,lngOriginatedAt=2025-05-08T11:56:34.280Z,mileage=0,mileageOriginatedAt=2025-05-08T11:56:34.280Z,energy=100,energyOriginatedAt=2025-05-08T11:56:34.280Z,speed=0,speedOriginatedAt=2025-05-08T11:56:30.176Z,trackingId=undefined
     */
  });
});
