import {walk} from "https://deno.land/std@0.165.0/fs/walk.ts";
import {globToRegExp} from "https://deno.land/std@0.158.0/path/glob.ts";
import toArray from "https://esm.sh/@async-generators/to-array@0.1.0"
import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
import './time.ts'

const copy = async ({files, outdir}) => {
    const common = path.common(files)
    const res = await Promise.allSettled(files
        .map(file=>([file, path.join(outdir,file.replace(common,''))]))
        .map(([from, to])=>Deno.mkdir(path.dirname(to), {recursive: true}).then(Deno.copyFile(from,to)).then(()=>[from, to]))
    )
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
const files = (await toArray(walk('.', {match: ['packages/*/**/*.*'].map(globToRegExp)}))).map(entry=>entry.path)

await copy({files, outdir})
