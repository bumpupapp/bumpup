import {
  beforeAll,
  describe,
  it,
} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { default as git } from "https://esm.sh/v95/isomorphic-git@1.21.0/deno/isomorphic-git.js";
import { default as fs } from "https://deno.land/std@0.140.0/node/fs.ts";
import { addFileToDir, setupBumpup } from "./testutils.ts";
import { assertEquals } from "https://deno.land/std@0.157.0/testing/asserts.ts";

const dir = await Deno.makeTempDir();
const addFile = addFileToDir(dir);

describe({
  name: "bumpup bump",
  sanitizeResources: false,
  fn: () => {
    beforeAll(async () => {
      await setupBumpup(dir);
      Deno.chdir(dir);
    });

    describe("given no existing repo", () => {
    });
    describe("given an existing repo", () => {
      beforeAll(async () => {
        await git.init({ fs, dir });
        await git.setConfig({ fs, dir, path: "user.name", value: "John Doe" });
        await git.setConfig({
          fs,
          dir,
          path: "user.email",
          value: "johndoe@example.com",
        });
      });
      describe("with commits", () => {
        beforeAll(async () => {
          await addFile("index.ts", "", "Initial commit");
          await addFile("update.ts", "", "feat: add update.ts");
          await addFile("update.ts", "", "fix: fix update.ts", "1.0.0");
          await Deno.writeTextFile(
            "package.json",
            JSON.stringify({ version: "1.0.0" }),
          );
        });
        it("determines a patch", async () => {
          await addFile("fix.ts", "", "fix: add fix.ts");
          await import("../packages/cli/mod.ts");
          const packageJson = JSON.parse(
            await Deno.readTextFile("package.json"),
          );
          assertEquals(packageJson.version, "1.0.1");
          //@ts-ignore: remove
          const commits = await git.log({ fs, dir });
          assertEquals(
            //@ts-ignore: remove
            commits[0].commit.message,
            "chore: release version 1.0.1\n",
          );
          //@ts-ignore: remove
          const tags = await git.listTags({ fs, dir });
          assertEquals(tags, ["1.0.0", "1.0.1"]);
        });
      });
    });
  },
});
