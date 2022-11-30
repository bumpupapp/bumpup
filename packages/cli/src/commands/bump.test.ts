// import {assertEquals, assertRejects, beforeEach, describe, it} from "../../../dev_deps.ts";
// import {BumpupOptions} from "../../common/mod.ts";
// import {bump} from "./bump.ts";
// import * as path from "https://deno.land/std/path/mod.ts";
// import {UnknownConfigError} from "./errors/UnknownConfigError.ts";

// const enhanceOptions = (options: Record<any,any>={}): BumpupOptions=>{
//     return {dry: false, log: 'critical',file:'bumpup.config.ts', ...options}
// }
// describe('module lib', () => {
//     describe('function bump()', ()=>{
//         let dir: string, url: URL;
//         beforeEach(async ()=>{
//             dir = await Deno.makeTempDir();
//             url = new URL(path.join('file://',dir, "bumpup.config.ts"))
//         })
//
//         it('should run the config', async ()=>{
//             const bumpup = `export default {version: "2.1.0",plugins: [()=>()=>({key: 'value'})]};`;
//             await Deno.writeTextFile(url, bumpup);
//             const expected = {key: 'value'}
//             const actual = await bump(url, enhanceOptions())
//             assertEquals(actual, expected)
//         })
//         it('should catch an invalid config', async ()=>{
//             const bumpup = `<{}>bogus.+-`;
//             await Deno.writeTextFile(url, bumpup);
//             await assertRejects(()=>bump(url, enhanceOptions()),UnknownConfigError)
//         })
//         it('should catch a wrong location', ()=>{
//             assertRejects(()=>bump(new URL('file://bogusurl'), enhanceOptions()),UnknownConfigError)
//         })
//     })
// });
