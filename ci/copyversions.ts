import toArray from "https://esm.sh/@async-generators/to-array@0.1.0"
import {copy as fscopy, expandGlob} from "https://deno.land/std@0.167.0/fs/mod.ts";

const copy = async ({files, version}) => {
    console.log(files,version)
    // const common = path.common(files)
    const res = await Promise.allSettled(files
        .map(async(file)=>{
            await fscopy(file,`${file}@${version}`)
            return [file,`${file}@${version}`]
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
const version = JSON.parse(await Deno.readTextFile('version.json')).version
console.log(version)
const files = (await toArray(expandGlob('build/*'))).map(entry=>entry.path)
await copy({files, version})
