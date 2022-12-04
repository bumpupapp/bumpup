import {path} from '../../../package_deps.ts'
import {BumpupFunction, BumpupOptions} from "../../common/mod.ts"
import {FileNotFoundError} from "../../common/src/errors/BumpupError.ts";
import {FileNotParseableError} from "./errors/FileNotParseableError.ts";

export const read: BumpupFunction = (options: BumpupOptions) => async (_: unknown) => {
    const file = options.jsonFile || "package.json";
    const key = options.jsonKey || "version";
    const url = path.toFileUrl(path.resolve(file));
    let json
    try{
        json = await Deno.readTextFile(url);
    }catch{
        throw new FileNotFoundError()
    }
    let version
    try{
        version = JSON.parse(json)[key];

    }catch{
        throw new FileNotParseableError()
    }
    return {version};
};
