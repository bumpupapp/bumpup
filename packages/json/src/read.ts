import {path} from '../../../package_deps.ts'
import {BumpupFunction, BumpupOptions} from "../../common/mod.ts"
import {FileNotFoundError} from "../../common/src/errors/BumpupError.ts";
import {FileNotParseableError} from "./errors/FileNotParseableError.ts";
import {KeyNotFoundError} from "./errors/KeyNotFoundError.ts";

export const read: BumpupFunction = (options: BumpupOptions) => async (_: unknown) => {
    const file = options.jsonFile || "package.json";
    const key = options.jsonKey || "version";
    const url = path.toFileUrl(path.resolve(file));
    let content
    try{
        content = await Deno.readTextFile(url);
    }catch{
        throw new FileNotFoundError('FileNotFoundError')
    }
    let json
    try{
        json = JSON.parse(content);
    }catch{
        throw new FileNotParseableError()
    }
    const version = json[key]
    if(!version){
        throw new KeyNotFoundError()
    }
    return {version};
};
