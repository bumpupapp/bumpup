import {walk} from "https://deno.land/std@0.165.0/fs/walk.ts";
import {globToRegExp} from "https://deno.land/std@0.158.0/path/glob.ts";
import { sep } from "https://deno.land/std@0.167.0/path/win32.ts";
import {BackBlazeClient} from "./BackblazeClient.ts";
import toArray from "https://esm.sh/v85/@async-generators/to-array@0.1.0/deno/to-array.js";

const configureBackBlazeClient = async ()=>{
    let backblazeConfig = {accessKey: '',secretKey: '',bucketId: ''}
    try{
        backblazeConfig = JSON.parse(await Deno.readTextFile('env.json'))
    }catch{
        if(Deno.env.get("B2_ACCESS_KEY")){
            backblazeConfig.accessKey = Deno.env.get("B2_ACCESS_KEY")
        }
        if(Deno.env.get("B2_SECRET_KEY")){
            backblazeConfig.secretKey = Deno.env.get("B2_SECRET_KEY")
        }
        if(Deno.env.get("B2_BUCKET_ID")){
            backblazeConfig.bucketId = Deno.env.get("B2_BUCKET_ID")
        }
    }
    const {accessKey, secretKey, bucketId} = backblazeConfig

    return new BackBlazeClient(accessKey, secretKey, bucketId)
}

const client = await configureBackBlazeClient()
const root = 'build'
const baseDir = '@bumpup'
const files = (await toArray(walk(root, {match: ['**/*.*','build/cli/bumpup*'].map(globToRegExp)}))).map(({path}) => path)
await Promise.allSettled(files.map(async file=>{
    const content = await Deno.readFile(file)
    return client.uploadString(`${baseDir}${file.replaceAll(root,'').replaceAll(sep,'/')}`,content)
}))
