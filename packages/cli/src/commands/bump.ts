import {Command, path} from '../../../../deps.ts'
import {bump as libBump} from "../../../lib/mod.ts";
import {BumpupConfig} from "../../../common/mod.ts";
import {UnknownConfigError} from "../errors/UnknownConfigError.ts";

export const bump = new Command()
bump
    .name('bump')
    .description('bumps up the version')
    .action(async (_: unknown, command: Command)=>{
        const options = command.optsWithGlobals()
        try {
            const config: BumpupConfig = (await import(new URL(path.join('file://',Deno.cwd(),options.file)).href)).default
            await libBump(config, options)
        } catch (e) {
            // TODO: better distinguish between errors
            throw new UnknownConfigError(e.message,e)
        }
    })
