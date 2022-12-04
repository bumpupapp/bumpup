import { BumpupFunction } from "../../common/mod.ts";
import * as path from "https://deno.land/x/std@0.158.0/path/mod.ts";

export const write: BumpupFunction = (options) => async (data) => {
    //TODO: Error handling for file not found
    // @ts-ignore: remove
    const file = options.jsonFile || "package.json";
    const key = options.jsonKey || "version";

    //@ts-ignore: remove
    const url = path.toFileUrl(path.resolve(file));

    //@ts-ignore: remove
    const json = JSON.parse(await Deno.readTextFile(url));
    //@ts-ignore: remove
    json[key] = data.newVersion;
    //@ts-ignore: remove
    await Deno.writeTextFile(url, JSON.stringify(json, null, 4));
    return data;
};
