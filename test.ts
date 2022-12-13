import * as path from "https://deno.land/std/path/mod.ts";
import slash from "https://deno.land/x/slash/mod.ts";

export const setupBumpup = async () => {
    const bumpup = `
import {read, write} from "${
        slash(path.join(path.dirname(path.fromFileUrl(import.meta.url)), "packages/json/mod.ts"))
    }";
import {type, record, commit} from "${
        slash(path.join(path.dirname(path.fromFileUrl(import.meta.url)), "packages/git/mod.ts"))
    }";
import determine from "${
        slash(path.join(path.dirname(path.fromFileUrl(import.meta.url)), "packages/semver/mod.ts"))
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
    console.log(bumpup);
};
await setupBumpup()
