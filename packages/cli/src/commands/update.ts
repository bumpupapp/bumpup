import {Command, path} from "../../../../deps.ts";
export const update = new Command()
update
    .name('update')
    .description('initialize a config')
    .action(async (_: unknown, command: Command)=>{
        console.log('Downloading newest version')
        console.log(Deno.execPath())
    })
