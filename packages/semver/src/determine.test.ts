import { assertEquals, describe, it } from "../../../dev_deps.ts";
import determine from "./determine.ts";

describe("@bumpup/semver", () => {
  it("returns data if version is missing", () => {
    assertEquals(determine({ dry: true, file:'', log: "info" })({ type: "patch" }), {
      type: "patch",
    });
  });
  it("returns data if type is missing", () => {
    assertEquals(determine({ dry: true, file:'', log: "info" })({ version: "1.5.10" }), {
      version: "1.5.10",
    });
  });
  it("determines patch versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info" })({ type: "patch", version: "1.5.10" }),
      {newVersion: "1.5.11" },
    );
  });
  it("determines prepatch versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info",pre: true})({
        type: "patch",
        version: "1.5.10",
      }),
      { newVersion: "1.5.11-0" },
    );
  });
  it("determines minor versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info" })({ type: "minor", version: "1.5.10" }),
      { newVersion: "1.6.0" },
    );
  });
  it("determines preminor versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info",pre: true })({
        type: "minor",
        version: "1.5.10",
      }),
      {newVersion: "1.6.0-0" },
    );
  });
  it("determines major versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info" })({ type: "major", version: "1.5.10" }),
      {newVersion: "2.0.0" },
    );
  });
  it("determines premajor versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info", pre: true })({
        type: "major",
        version: "1.5.10",
      }),
      {newVersion: "2.0.0-0" },
    );
  });
  it("determines none versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info" })({ type: "none", version: "1.5.10" }),
      {newVersion: "1.5.10" },
    );
  });
  it("determines prenone versions correctly", () => {
    assertEquals(
      determine({ dry: true, file:'', log: "info",pre: true })({
        type: "none",
        version: "1.5.10",
      }),
      {newVersion: "1.5.10" },
    );
  });
});
