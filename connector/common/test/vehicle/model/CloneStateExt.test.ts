import assert from "assert";
import { describe, it } from "node:test";

import CloneStateExt from "../../../src/vehicle/model/CloneStateExt.ts";
import State from "../../../src/vehicle/State.ts";

describe("CloneStateExt", () => {
  describe("run", () => {
    it("clones a State preserving values but creating a new instance (no updatedAt)", () => {
      const originatedAt = new Date(2024, 0, 1, 10, 0, 0);
      const createdAt = new Date(2024, 0, 1, 9, 0, 0);
      const original = new State<string>("alpha", originatedAt, undefined, createdAt);

      const cloned = new CloneStateExt().run<string>(original);

      // values are the same
      assert.deepStrictEqual(
        {
          state: cloned.state,
          originatedAt: cloned.originatedAt,
          updatedAt: cloned.updatedAt,
          createdAt: cloned.createdAt,
        },
        {
          state: original.state,
          originatedAt: original.originatedAt,
          updatedAt: original.updatedAt,
          createdAt: original.createdAt,
        },
      );

      // but instance is different
      assert.notStrictEqual(cloned, original);

      // cloning must not mutate the original
      assert.strictEqual(original.state, "alpha");
      assert.strictEqual(original.originatedAt, originatedAt);
      assert.strictEqual(original.updatedAt, undefined);
      assert.strictEqual(original.createdAt, createdAt);
    });

    it("clones a State preserving updatedAt when present", () => {
      const originatedAt = new Date(2024, 5, 15, 8, 30, 0);
      const updatedAt = new Date(2024, 5, 15, 9, 0, 0);
      const createdAt = new Date(2024, 5, 15, 8, 0, 0);
      const original = new State<number>(42, originatedAt, updatedAt, createdAt);

      const cloned = new CloneStateExt().run<number>(original);

      assert.strictEqual(cloned.state, 42);
      assert.strictEqual(cloned.originatedAt, originatedAt);
      assert.strictEqual(cloned.updatedAt, updatedAt);
      assert.strictEqual(cloned.createdAt, createdAt);
      assert.notStrictEqual(cloned, original);
    });

    it("clones a State even when originatedAt is undefined", () => {
      const updatedAt = new Date(2023, 11, 24, 17, 0, 0);
      const createdAt = new Date(2023, 11, 24, 16, 0, 0);
      const original = new State<boolean>(true, undefined, updatedAt, createdAt);

      const cloned = new CloneStateExt().run<boolean>(original);

      assert.strictEqual(cloned.state, true);
      assert.strictEqual(cloned.originatedAt, undefined);
      assert.strictEqual(cloned.updatedAt, updatedAt);
      assert.strictEqual(cloned.createdAt, createdAt);
      assert.notStrictEqual(cloned, original);
    });
  });
});
