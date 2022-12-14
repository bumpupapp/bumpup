import {walk} from "https://deno.land/std@0.165.0/fs/walk.ts";
import {globToRegExp} from "https://deno.land/std@0.158.0/path/glob.ts";
import toArray from "https://esm.sh/@async-generators/to-array@0.1.0"
import {readableStreamFromReader} from "https://deno.land/std@0.167.0/streams/readable_stream_from_reader.ts";
import {writableStreamFromWriter} from "https://deno.land/std@0.167.0/streams/writable_stream_from_writer.ts";
import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
import './time.ts'

const bundlePackages = async ({entrypoints, outdir, outname}) => {
    const common = path.common(entrypoints)
    const res = await Promise.allSettled(entrypoints
        .map((entrypoint) => bundlePackage({
            file: entrypoint,
            dest: path.join(outdir, entrypoint.replace(common, '').replace(path.basename(entrypoint), outname))
        }))
    )
    const status = res.map(({status, reason, value})=>{
        if(status === "fulfilled"){
            return `bundled ${value}`
        }else{
            const [file, error] = reason
            return `error bundling ${file}: ${error}`
        }
    })
    status.forEach(status=>console.log(status))
}

const bundlePackage = async ({file, dest}) => {
    await Deno.mkdir(path.dirname(dest), {recursive: true})
    const cmd = ['deno', 'bundle', file]
    const f = await Deno.open(dest, {read: true, write: true, create: true})
    const fileWriter = await writableStreamFromWriter(f)
    const p = await Deno.run({cmd, stdout: "piped", stderr: "piped"})
    await readableStreamFromReader(p.stdout).pipeTo(fileWriter)
    const status = await p.status()
    if(!status.success){
        return Promise.reject([dest,new TextDecoder().decode(await p.stderrOutput())])
    }
    return dest
}

const bundleExecutables = async ({outdir}) => {
    const archs = [
        {name: 'x86_64-unknown-linux-gnu', prefix: 'bumpup_linux_x68'},
        {name: 'x86_64-pc-windows-msvc', prefix: 'bumpup.exe'},
        {name: 'x86_64-apple-darwin', prefix: 'bumpup_darwin_x86'},
        {name: 'aarch64-apple-darwin', prefix: 'bumpup_darwin_aarch64'},
    ]

    await Promise.allSettled(archs.map(({name, prefix}) => {
        return Deno.run({cmd: ['deno', 'compile', '-A', '--target', name, '--output', `${outdir}/cli/${prefix}`, 'packages/cli/mod.ts']}).status()
    }))

}
const outdir = 'build'
const entrypoints = (await toArray(walk('.', {match: ['packages/*/mod.ts'].map(globToRegExp)}))).map(({path}) => path)
await bundlePackages({entrypoints, outdir, outname: 'bundle.ts'})
await bundleExecutables({outdir})
