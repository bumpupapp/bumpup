import {Command, path} from '../../../../deps.ts'
import {bump as libBump} from "../../../lib/mod.ts";
import {BumpupConfig, BumpupOptions} from "../../../common/mod.ts";
import {UnknownConfigError} from "../errors/UnknownConfigError.ts";
import {importModule, ModuleBuildError} from "https://raw.githubusercontent.com/danielr1996/import/main/mod.ts";
import {ConfigFileNotFoundError} from "../errors/ConfigFileNotFoundError.ts";
import {PluginExecutionError} from "../../../lib/mod.ts";
import {Logger} from "../../../../Logger.ts";
import { lodash } from 'https://deno.land/x/deno_ts_lodash@0.0.1/mod.ts';

export const parseAdditionalOptions = (args: string[]) =>{
    return args.map(arg=>arg.split('=')).reduce((acc, [path,key])=>lodash.set(acc,path,key),{})
}

export const action = async (_1: unknown, _2: unknown, command: Command) => {
    const additionalOptions = parseAdditionalOptions(command.args)
    const options: BumpupOptions = {...command.optsWithGlobals(),...additionalOptions}
    const file = path.join(Deno.cwd(), options.file)
    const logger = new Logger(options.log)
    try {
        await verifyConfigExists(file)
        const config = await loadConfig(file)
        await libBump(config, options)
    } catch (e) {
        if (e instanceof ConfigFileNotFoundError) {
            logger.log('error', 'ConfigFileNotFoundError')
        } else if (e instanceof ModuleBuildError) {
            logger.log('error', 'ModuleBuildError')
            logger.log('debug', e.message)
        } else if (e instanceof PluginExecutionError) {
            logger.log('error', 'PluginExecutionError\n' + e.originalError)
        } else {
            throw new UnknownConfigError(e.message, e)
        }
    }
}

export const verifyConfigExists = async (config: string) => {
    try {
        await Deno.readTextFile(config)
    } catch {
        throw new ConfigFileNotFoundError()
    }
}

export const loadConfig = async (config: string): Promise<BumpupConfig> => {
    const module = await importModule(config)
    return module.default as BumpupConfig
}

export const bump = new Command()
    .name('bump')
    .description('bumps up the version')
    .argument('[options]','additional options')
    .action(action)
