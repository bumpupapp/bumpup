import { default as git } from "https://esm.sh/v95/isomorphic-git@1.21.0/deno/isomorphic-git.js";
import { default as fs } from "https://deno.land/std@0.140.0/node/fs.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import slash from "https://deno.land/x/slash/mod.ts";

export const addFileToDir =
  (dir: string) =>
  async (filename: string, content: string, message: string, tag?: string) => {
    await Deno.writeTextFile(path.join(dir, filename), content);
    await git.add({ fs, dir, filepath: filename });
    // @ts-ignore: remove
    await git.commit({
      fs,
      dir,
      author: { name: "test", email: "test@example.com" },
      message: message,
    });
    if (tag) {
      // @ts-ignore: remove
      await git.annotatedTag({
        fs,
        dir,
        ref: tag,
        tagger: { name: "test", email: "test@example.com" },
      });
    }
  };

export const setupBumpup = async (dir: string) => {
    const bumpup = `
import {read, write} from "${
        slash(path.join(path.dirname(path.fromFileUrl(import.meta.url),),'..', "packages/json/mod.ts"))
    }";
import {type, record, commit} from "${
        slash(path.join(path.dirname(path.fromFileUrl(import.meta.url)),'..', "packages/git/mod.ts"))
    }";
import determine from "${
        slash(path.join(path.dirname(path.fromFileUrl(import.meta.url)),'..', "packages/semver/mod.ts"))
    }";
export default {
    version: "2.0.0",
    options: {
        log: 'debug'
    },
    plugins: [
        read,
        type,
        determine,
        write,
        commit,
        record,
        (o: any)=>(d: any)=>console.log(o,d)
    ]
};`;
  await Deno.writeTextFile(path.join(dir, "bumpup.config.ts"), bumpup);
};
