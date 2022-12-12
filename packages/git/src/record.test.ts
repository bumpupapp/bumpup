import { assert, beforeEach, describe, it } from "../../../dev_deps.ts";
import record from "./record.ts";
import { existsSync } from "https://deno.land/std@0.90.0/fs/exists.ts";

describe("record", () => {
  beforeEach(async () => {
    const testdir = await Deno.makeTempDir();
    Deno.chdir(testdir);
  });

  it("should do nothing if newVersion === version", async () => {
    await record({ dry: true, log: 'error',file:'' })({ version: "1.0.0", newVersion: "1.0.0" });
    assert(!existsSync(".git"));
  });

  it("should do nothing if options.dry", async () => {
    await record({ dry: true, log: 'error',file:'' })({ version: "1.0.0", newVersion: "1.0.0" });
    assert(!existsSync(".git"));
  });
});
