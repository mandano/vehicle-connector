import fs from "fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import PathResolver from "../../../src/adapters/fileSystem/PathResolver.ts";

/**
 * Use node's built-in test runner as using esm "import.meta.url" tested code
 */
describe('PathResolver', () => {
  it("should return the same path if the input is an absolute path", () => {
    const pathResolver = new PathResolver();

    const absolutePath = "/absolute/path/to/file.txt";
    const result = pathResolver.run(absolutePath);

    assert.strictEqual(result, absolutePath);
  });

  it("should resolve a relative path to an absolute path", () => {
    const pathResolver = new PathResolver();

    fs.writeFileSync("/tmp/testfile.txt", "Dies ist ein Testinhalt.", "utf8");

    const relativeFilePath = "../../../tmp/testfile.txt";
    const calculatedFilePath = pathResolver.run(relativeFilePath);

    const found = fs.existsSync(calculatedFilePath);
    fs.rmSync(calculatedFilePath);

    if (found === false) {
      assert.fail("File not found")
    }
    assert.ok(true);
  });
});
