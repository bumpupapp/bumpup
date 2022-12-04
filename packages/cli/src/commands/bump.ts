import {Command, path} from '../../../../deps.ts'
import {bump as libBump} from "../../../lib/mod.ts";
import {BumpupConfig} from "../../../common/mod.ts";
import {UnknownConfigError} from "../errors/UnknownConfigError.ts";
import {importModule, ModuleBuildError} from "./import.ts";
import {ConfigFileNotFoundError} from "../errors/ConfigFileNotFoundError.ts";
import {PluginExecutionError} from "../../../lib/mod.ts";
import {Logger} from "../../../../Logger.ts";
export const bump = new Command()
bump
    .name('bump')
    .description('bumps up the version')
    .action(async (_: unknown, command: Command) => {
        const options = command.optsWithGlobals()
        const file = path.join(Deno.cwd(), options.file)
        const logger = new Logger(options.log)
        try{
            await verifyConfigExists(file)
            const config = await loadConfig(file)
            await libBump(config, options)
        }catch(e){
            if(e instanceof ConfigFileNotFoundError){
                logger.log('error', 'ConfigFileNotFoundError')
            }else if(e instanceof ModuleBuildError){
                logger.log('error', 'ModuleBuildError')
            }else if(e instanceof PluginExecutionError){
                logger.log('error', 'PluginExecutionError\n'+e.originalError)
            }else{
                throw new UnknownConfigError(e.message,e)
            }
        }
    })

export const verifyConfigExists = async (config: string)=>{
    try {
        await Deno.readTextFile(config)
    } catch {
        throw new ConfigFileNotFoundError()
    }
}

export const loadConfig = async(config: string): Promise<BumpupConfig>=>{
        const module = await importModule(config)
        return module.default as BumpupConfig
}
