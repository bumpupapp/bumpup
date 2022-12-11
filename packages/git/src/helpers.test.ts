import { assertEquals, describe, it } from "../../../dev_deps.ts";
import { createTag } from "./helpers.ts";

describe("createTag", () => {
  it("creates tag with tagPrefix", () => {
    const tag = createTag("main", "1.0.0");
    assertEquals(tag, "main-1.0.0");
  });

  it("creates tag without tagPrefix", () => {
    const tag = createTag(undefined, "1.0.0");
    assertEquals(tag, "1.0.0");
  });
});
