import { exec } from "https://deno.land/x/exec/mod.ts";
import {walk} from "https://deno.land/std@0.165.0/fs/walk.ts";
import {globToRegExp} from "https://deno.land/std@0.158.0/path/glob.ts";
import { dirname, basename } from "https://deno.land/std@0.166.0/path/posix.ts";

const globs = [
    'packages/*/mod.ts',
]
const cwd = '.'
const buildDir = "build"
await Deno.mkdir(buildDir, {recursive: true})
for await (const entry of walk(cwd,{match: globs.map(globToRegExp)})) {
    const fullPath = entry.path.replaceAll('\\','/')
    const pkg = basename(dirname(fullPath))
    await exec(`bash -c "deno bundle ${fullPath} > build/${pkg}.bundle.ts"`)
}
