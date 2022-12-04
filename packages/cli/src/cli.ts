import {Command, Option} from '../../../deps.ts'
import versionFile from "../../../version.json" assert { type: "json" };
import {bump, init} from './commands/index.ts'

const program = new Command()
program
    .name('bumpup')
    .description('cli tool to version your software')
    .version(versionFile.version+"+"+versionFile.buildtime)
    .addOption(new Option('-l, --log <loglevel>').choices(["error", "success", "warning", "info", "debug"]).default('success'))
    .addOption(new Option('-d, --dry').default(false))
    .addOption(new Option('-f, --file <file>').default('bumpup.config.ts'))
    .addCommand(bump, {isDefault: true})
    .addCommand(init)
await program.parseAsync()
