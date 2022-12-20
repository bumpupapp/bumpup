import {read, write} from './packages/json/mod.ts'
import {determineIncrement} from './packages/semver/mod.ts'
import {record, commit} from './packages/git/mod.ts'
const jsonOptions = {jsonFile: 'version.json'}
const gitOptions = {author: {name: 'Github Actions',email: '41898282+github-actions[bot]@users.noreply.github.com'}}
export default {
    version: '2.1.0',
    plugins: [
        [read, jsonOptions],
        determineIncrement,
        [write, jsonOptions],
        [commit, gitOptions],
        [record, gitOptions],
        (options)=>(data)=>console.log(options, data),
    ]
}
