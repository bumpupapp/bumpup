import {runConfig} from "./lib.ts";
import {path} from "../../../deps.ts"
runConfig(new URL(path.join('file://',Deno.cwd(), 'bumpup.config.ts')))
