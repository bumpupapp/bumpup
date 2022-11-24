import {walk} from "https://deno.land/std@0.165.0/fs/walk.ts";
import {globToRegExp} from "https://deno.land/std@0.158.0/path/glob.ts";
import * as path from "https://deno.land/x/std@0.158.0/path/mod.ts";
import { Sha1 } from "https://deno.land/std@0.160.0/hash/sha1.ts"

class BackBlazeClient {
    constructor(private accessKey: string, private secretKey: string, private bucketId: string) {
    }

    private async getToken(){
        const raw = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account',{headers:{
                'Authorization': 'Basic ' + btoa(`${this.accessKey}:${this.secretKey}`)
            }})
        return raw.json()
    }

    private async getUploadUrl(){
        const {authorizationToken, apiUrl} = await this.getToken()
        const raw = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
            method: 'POST',
            headers: {'Authorization': authorizationToken},
            body: JSON.stringify({bucketId: this.bucketId})
        })
        return raw.json()
    }

    public async uploadString(filename: string,content: string){
        const {authorizationToken, uploadUrl} = await this.getUploadUrl()
        const sha1 = new Sha1().update(content).toString()

        const raw = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization':authorizationToken,
                'X-Bz-File-Name':filename,
                'Content-Type':'text/plain',
                'X-Bz-Content-Sha1':sha1,
                'X-Bz-Server-Side-Encryption':'AES256'
            },
            body: content
        })
        return raw.json()
    }
}

let backblazeConfig = {}
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

const client = new BackBlazeClient(accessKey, secretKey, bucketId)


for await (const entry of walk('.',{match: [globToRegExp('packages/**/*.{json,ts}')]})) {
    const fileName = `legacy/bumpup/${entry.path.replaceAll('\\','/').replaceAll('packages/','')}`
    const file = await Deno.readTextFile(path.join('.',entry.path))
    await client.uploadString(fileName,file)
}
