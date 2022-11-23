import {read, write} from "https://f004.backblazeb2.com/file/danielr1996-registry/packages/bumpup/json/mod.ts ";
import determine from "https://f004.backblazeb2.com/file/danielr1996-registry/packages/bumpup/semver/mod.ts ";
import {type, commit, record} from "https://f004.backblazeb2.com/file/danielr1996-registry/packages/bumpup/git/mod.ts ";
import {BumpupConfig} from "https://f004.backblazeb2.com/file/danielr1996-registry/packages/bumpup/common/mod.ts ";
import {publish} from "https://f004.backblazeb2.com/file/danielr1996-registry/packages/bumpup/publish/mod.ts ";
import {log} from "https://f004.backblazeb2.com/file/danielr1996-registry/packages/bumpup/log/mod.ts ";

const config: BumpupConfig = {
    version: "2.0.0",
    plugins: [
        [read, {jsonFile: 'version.json'}],
        type,
        determine,
        [write, {jsonFile: 'version.json'}],
        [commit,{author: {name: 'Github Actions', email: '41898282+github-actions[bot]@users.noreply.github.com'}}],
        [record,{author: {name: 'Github Actions', email: '41898282+github-actions[bot]@users.noreply.github.com'}}],
        log,
        [publish, {
            files: '**/*.{ts,json}',
            basename: 'packages/bumpup/',
            backblaze: {
                bucketId: '628a547caef0ae1c8e480c10',
                accessKey: '0042a4ce0ece8c00000000006',
                secretKey: 'K004g91S3wJwdqTnLLMbAS0aJ3ywfTo',
            }
        }]
    ]
};
export default config;
