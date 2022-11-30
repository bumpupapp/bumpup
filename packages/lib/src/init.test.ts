import {assertEquals, describe, it} from "../../../dev_deps.ts";
import {init} from "./init.ts";

describe('module lib', () => {
    describe('function init()', () => {
        it('should generate a default config file', () => {
            const config = `export default {
    version: "2.1.0",
    options: {},
    plugins: [
        (options)=>(data)=>console.log(options, data),
    ]
}`
            assertEquals(init(), config)
        })
    })
});
