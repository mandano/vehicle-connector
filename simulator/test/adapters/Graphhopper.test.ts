import { describe, it } from "node:test";
import assert from "node:assert/strict";

import dotenv from "dotenv";

import { Graphhopper } from "../../src/adapters/Graphhopper.ts";
import { Coordinate } from "../../src/vehicles/position/Coordinate.ts";

describe("Graphhopper", () => {
  dotenv.config({ path: "test/.env" });

  const apiKey = process.env.GRAPHHOPPER_API_KEY;
  if (apiKey === undefined) {
    throw new Error("API key not set");
  }

  const graphhopper = new Graphhopper(apiKey);

  it("should generate the correct query string for the route method", async () => {
    const points: Coordinate[] = [];
    points.push(new Coordinate(52.516, 13.3779));
    points.push(new Coordinate(48.8566, 2.3522));
    const profile = "car";

    const route = await graphhopper.route(profile, points);
    assert(route !== undefined, "Route should be defined");
    assert(
      route?.waypoints.length > 0,
      "Route should have at least one waypoint",
    );
    assert(route?.distance > 0, "Route distance should be greater than 0");
    assert(route?.duration > 0, "Route duration should be greater than 0");
    assert(
      Math.abs(route?.waypoints[0].latitude - 52.516) < 0.01,
      "First waypoint latitude should be close to 52.516",
    );
    assert(
      Math.abs(route?.waypoints[0].longitude - 13.3779) < 0.01,
      "First waypoint longitude should be close to 13.3779",
    );
    assert(
      Math.abs(
        route?.waypoints[route?.waypoints.length - 1].latitude - 48.8566,
      ) < 0.01,
      "Last waypoint latitude should be close to 48.8566",
    );
    assert(
      Math.abs(
        route?.waypoints[route?.waypoints.length - 1].longitude - 2.3522,
      ) < 0.01,
      "Last waypoint longitude should be close to 2.3522",
    );
  });
});
