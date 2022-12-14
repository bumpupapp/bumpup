import toArray from "https://esm.sh/@async-generators/to-array@0.1.0"
import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
import { ensureFile, expandGlob } from "https://deno.land/std@0.167.0/fs/mod.ts";

const copy = async ({files, outdir}) => {
    const common = path.common(files)
    const res = await Promise.allSettled(files
        .map(file=>([file, path.join(Deno.cwd(),outdir,file.replace(common,''))]))
        .map(async([from, to])=>{
            await ensureFile(to)
            await Deno.copyFile(from,to)
            return [from, to]
        }))

    const status = res.map(({status, reason, value})=>{
        if(status === "fulfilled"){
            const [from, to] = value
            return `copied ${from} => ${to}`
        }else{
            return `error copying: ${reason}`
        }
    })
    status.forEach(status=>console.log(status))

}
const outdir = 'build'
const files = (await toArray(expandGlob('packages/*/**/*.*'))).map(entry=>entry.path)
await copy({files, outdir})
