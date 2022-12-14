import {Sha1} from "https://deno.land/std@0.160.0/hash/sha1.ts";

export class BackBlazeClient {
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
