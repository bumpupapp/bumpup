import { BumpupFunction } from "../../common/mod.ts";
import {path} from '../../../package_deps.ts';
import {FileNotFoundError} from "../../common/src/errors/BumpupError.ts";
import {FileNotParseableError} from "./errors/FileNotParseableError.ts";
import {KeyNotFoundError} from "./errors/KeyNotFoundError.ts";
import {FileNotWriteableError} from "./errors/FileNotWriteableError.ts";
import {Logger} from "../../../Logger.ts";

export const write: BumpupFunction = (options) => async (data) => {
    const logger = new Logger(options.log)
    console.log(data)
    if(!data.newVersion){
        logger.log('info',`key 'newVersion' not found in data`)
        return data;
    }
    const file = options.jsonFile || "package.json";
    const key = options.jsonKey || "version";
    const url = path.toFileUrl(path.resolve(file));
    let content
    try{
        content = await Deno.readTextFile(url);
    }catch{
        throw new FileNotFoundError()
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

    json[key] = data.newVersion;
    try{
        await Deno.writeTextFile(url, JSON.stringify(json, null, 4));
    }catch{
        throw new FileNotWriteableError()
    }
    return data;
};
