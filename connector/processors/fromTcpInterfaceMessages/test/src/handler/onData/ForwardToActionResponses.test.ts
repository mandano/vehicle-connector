import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { FakeExchange } from "../../../../../../common/test/adapters/queue/rabbitMq/FakeExchange.ts";
import { ForwardToActionResponses } from "../../../../src/handler/onData/ForwardToActionResponses.ts";
import { Lock } from "../../../../../../common/src/vehicle/components/lock/Lock.ts";

describe("ForwardToActionResponses", () => {
  it("should publish a lock action", async () => {
    const fakeExchange = new FakeExchange(true);
    const forwardToActionResponses = new ForwardToActionResponses(fakeExchange);

    const result = await forwardToActionResponses.run(Lock.LOCKED, 123);
    assert.strictEqual(result, true);
  });

  it("should publish an unlock action", async () => {
    const fakeExchange = new FakeExchange(true);
    const forwardToActionResponses = new ForwardToActionResponses(fakeExchange);

    const result = await forwardToActionResponses.run(Lock.UNLOCKED, 123);
    assert.strictEqual(result, true);
  });

  it("try to publish and fails", async () => {
    const fakeExchange = new FakeExchange(false);
    const forwardToActionResponses = new ForwardToActionResponses(fakeExchange);

    const result = await forwardToActionResponses.run(Lock.LOCKED, 123);
    assert.strictEqual(result, false);
  });
});
