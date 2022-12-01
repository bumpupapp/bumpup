import {Command, path} from '../../../../deps.ts'
import {bump as libBump} from "../../../lib/mod.ts";
import {BumpupConfig} from "../../../common/mod.ts";
import {UnknownConfigError} from "../errors/UnknownConfigError.ts";
import {importModule} from "./import.ts";

export const bump = new Command()
bump
    .name('bump')
    .description('bumps up the version')
    .action(async (_: unknown, command: Command)=>{
        const options = command.optsWithGlobals()
        let config: BumpupConfig;
        try {
            //TODO: read from absolute path
            //TODO: importString and seperate loading config file and parsing / building it
            //TODO: Better report Plugin Excetiuon errors
            config = (await importModule(options.file)).default
            } catch (e) {
            // TODO: better distinguish between errors
            throw new UnknownConfigError(e.message,e)
        }
        try{
            await libBump(config, options)
        }catch (e){
            console.log(e.originalError)
        }
    })
