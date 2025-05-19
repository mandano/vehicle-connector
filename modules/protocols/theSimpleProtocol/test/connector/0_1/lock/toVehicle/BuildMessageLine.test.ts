import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  THE_SIMPLE_PROTOCOL,
  THE_SIMPLE_PROTOCOL_ABBREVIATION,
} from "../../../../../src/Protocol.ts";
import { ID_0_1 } from "../../../../../src/versions.ts";
import { CreateMessageLine } from "../../../../../src/connector/0_1/pakets/lock/toVehicle/CreateMessageLine.ts";
import { CreateLockState } from "../../../../../../../../connector/common/test/vehicle/components/lock/CreateLockState.ts";
import { TransferLock } from "../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

describe("BuildMessageLine", () => {
  let buildMessageLine: CreateMessageLine;

  beforeEach(() => {
    buildMessageLine = new CreateMessageLine();
  });

  it("should build a message line with state", () => {
    const imei = "123456789";
    const lockState = new CreateLockState().run();
    const trackingId = "tracking-123";

    const lock = new TransferLock(
      lockState,
      trackingId,
      THE_SIMPLE_PROTOCOL,
      ID_0_1,
      imei,
    );

    const result = buildMessageLine.run(lock);

    assert.ok(result);
    assert.match(
      result,
      new RegExp(
        `${THE_SIMPLE_PROTOCOL_ABBREVIATION};${ID_0_1};${imei};LOCK;\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z;lock=${lockState.state.state},lockOriginatedAt=${lockState.state.originatedAt?.toISOString()};${lock.trackingId}`,
      ),
    );
  });
});
