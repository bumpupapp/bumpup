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
const archs = [
    {name: 'x86_64-unknown-linux-gnu', prefix:'bumpup_linux_x68'},
    {name: 'x86_64-pc-windows-msvc', prefix:'bumpup.exe'},
    {name: 'x86_64-apple-darwin', prefix:'bumpup_darwin_x86'},
    {name: 'aarch64-apple-darwin', prefix:'bumpup_darwin_aarch64'},
]

await Promise.allSettled(archs.map(({name, prefix})=>{
    return exec(`bash -c "deno compile -A --target ${name} --output build/${prefix} packages/cli/mod.ts"`)
}))
