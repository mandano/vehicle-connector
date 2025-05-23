import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Socket } from "node:net";

import request from "supertest";
import { faker } from "@faker-js/faker";

import { FakeLogger } from "../../../../../../connector/common/test/logger/FakeLogger.ts";
import { FakeTcpVehicle } from "../FakeTcpVehicle.ts";

describe("Lock v0_2", () => {
  const userApiPort = process.env.USER_API_PORT || "3103";
  const userApiUrl = `http://localhost:${userApiPort}`;
  const tcpPort = process.env.TCP_PORT ? parseInt(process.env.TCP_PORT) : 1240;

  it(
    "can look vehicle",
    {
      timeout: 10000,
    },
    async () => {
      const imei = faker.string.numeric(15);
      const protocolVersion = "0_2";
      const trackingId = faker.string.alphanumeric(10);

      const sampleData = {
        modelName: "LockableScooter",
        modelContent: {
          imei: imei,
          protocol: "THE_SIMPLE_PROTOCOL",
          protocolVersion: protocolVersion,
          coordinate: {
            latitude: 12.45,
            longitude: 54.3453,
          },
        },
      };

      const responses = [
        `T_S_P;${protocolVersion};${imei};LOCK;{YYYY-MM-DDTHH:mm:ss.sssZ};lock=locked,lockOriginatedAt={YYYY-MM-DDTHH:mm:ss.sssZ};${trackingId}`,
      ];

      const fakeTcpVehicle = new FakeTcpVehicle(
        new Socket(),
        new FakeLogger(),
        "localhost",
        tcpPort,
        responses,
      );
      await fakeTcpVehicle.connect();

      const responseCreate = await request(userApiUrl)
        .post("/api/v1/vehicle/create")
        .send(sampleData)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      assert.equal(responseCreate.status, 201);
      assert.equal(responseCreate.body.message, "Vehicle created");
      assert.ok(
        Number.isInteger(responseCreate.body.id),
        "ID should be an integer",
      );

      fakeTcpVehicle.sendMessage(
        `T_S_P;${protocolVersion};${imei};UPDATE_SIMPLE_SCOOTER;2025-05-08T12:20:36.158Z;lat=52.596992,latOriginatedAt=2025-05-08T12:20:36.158Z,lng=13.386409,lngOriginatedAt=2025-05-08T12:20:36.158Z,mileage=226.61387377588647,mileageOriginatedAt=2025-05-08T12:20:36.158Z,energy=99,energyOriginatedAt=2025-05-08T12:20:36.158Z,speed=0.0000037230379472939224,speedOriginatedAt=2025-05-08T11:59:06.647Z,trackingId=undefined`,
      );

      // Need to wait until vehicle is registered as "connected" in vehicles repository
      // TODO: replace by webhook consumption?
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const vehicleId = responseCreate.body.id;

      const responseLock = await request(userApiUrl)
        .post(`/api/v1/vehicle/${vehicleId}/lock`)
        .send({ trackingId: "1234AAAA56789" })
        .set("Accept", "application/json");

      fakeTcpVehicle.disconnect();
      assert.equal(responseLock.status, 200);
    },
  );

  it(
    "can unlock vehicle",
    {
      timeout: 10000,
    },
    async () => {
      const imei = faker.string.numeric(15);
      const protocolVersion = "0_2";
      const trackingId = faker.string.alphanumeric(10);

      const sampleData = {
        modelName: "LockableScooter",
        modelContent: {
          imei: imei,
          protocol: "THE_SIMPLE_PROTOCOL",
          protocolVersion: protocolVersion,
          coordinate: {
            latitude: 12.45,
            longitude: 54.3453,
          },
        },
      };

      const responses = [
        `T_S_P;${protocolVersion};${imei};LOCK;{YYYY-MM-DDTHH:mm:ss.sssZ};lock=unlocked,lockOriginatedAt={YYYY-MM-DDTHH:mm:ss.sssZ};${trackingId}`,
      ];

      const fakeTcpVehicle = new FakeTcpVehicle(
        new Socket(),
        new FakeLogger(),
        "localhost",
        tcpPort,
        responses,
      );
      await fakeTcpVehicle.connect();

      const responseCreate = await request(userApiUrl)
        .post("/api/v1/vehicle/create")
        .send(sampleData)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      assert.equal(responseCreate.status, 201);
      assert.equal(responseCreate.body.message, "Vehicle created");
      assert.ok(
        Number.isInteger(responseCreate.body.id),
        "ID should be an integer",
      );

      fakeTcpVehicle.sendMessage(
        `T_S_P;${protocolVersion};${imei};UPDATE_SIMPLE_SCOOTER;2025-05-08T12:20:36.158Z;lat=52.596992,latOriginatedAt=2025-05-08T12:20:36.158Z,lng=13.386409,lngOriginatedAt=2025-05-08T12:20:36.158Z,mileage=226.61387377588647,mileageOriginatedAt=2025-05-08T12:20:36.158Z,energy=99,energyOriginatedAt=2025-05-08T12:20:36.158Z,speed=0.0000037230379472939224,speedOriginatedAt=2025-05-08T11:59:06.647Z,trackingId=undefined`,
      );

      // Need to wait until vehicle is registered as "connected" in vehicles repository
      // TODO: replace by webhook consumption?
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const vehicleId = responseCreate.body.id;

      const responseLock = await request(userApiUrl)
        .post(`/api/v1/vehicle/${vehicleId}/unlock`)
        .send({ trackingId: "1234AAAA56789" })
        .set("Accept", "application/json");

      fakeTcpVehicle.disconnect();
      assert.equal(responseLock.status, 200);
    },
  );

  it("should handle protocol data with invalid IMEI", async () => {
    /*const invalidData =
      "T_S_P:0_1:INVALID:UPDATE_SIMPLE_SCOOTER:lat=12.4567,lng=12.4567";

    const response = await request(SERVICE_URL)
      .post("/api/vehicle/data")
      .send({ data: invalidData })
      .set("Accept", "application/json");

    assert.equal(response.status, 400);*/
  });
});
