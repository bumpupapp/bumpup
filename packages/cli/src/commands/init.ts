import {Command, path} from "../../../../deps.ts";
import {init as libInit} from "../../../lib/mod.ts";
export const init = new Command()
init
    .name('init')
    .description('initialize a config')
    .action(async (_: unknown, command: Command)=>{
        const {dry, file} = command.optsWithGlobals()
        const config = libInit()
        //TODO: check override
        if(dry){
            console.log(config)
        }else{
            await Deno.writeTextFile(path.join(Deno.cwd(), file),config)
        }
    })
