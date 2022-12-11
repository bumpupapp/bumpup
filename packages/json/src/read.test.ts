import {
    assertEquals, assertRejects,
    describe,
    it,
    path
} from "../../../dev_deps.ts"
import {read} from './read.ts'
import {FileNotFoundError} from "../../common/src/errors/BumpupError.ts";
import {FileNotParseableError} from "./errors/FileNotParseableError.ts";
import {KeyNotFoundError} from "./errors/KeyNotFoundError.ts";

describe('@bumpup/json',()=>{
    describe('read', ()=>{
        it('should read a json file',async()=>{
            const dir = await Deno.makeTempDir();
            const file = path.join(dir, 'package.json')
            await Deno.writeTextFile(file,`{"version":"1.0.0"}`)
            Deno.chdir(dir);
            const expected = {version:"1.0.0"}
            const actual = await read({dry:false,log:'debug',file:''})({})
            assertEquals(actual, expected)
        })
        it('should throw if the file cannot be found',async()=>{
            const dir = await Deno.makeTempDir();
            Deno.chdir(dir);
            await assertRejects(async()=>await read({dry:false,log:'debug',file:''})({}),FileNotFoundError)
        })
        it('should throw if the json file cannot be parsed',async()=>{
            const dir = await Deno.makeTempDir();
            const file = path.join(dir, 'package.json')
            await Deno.writeTextFile(file,`bogusjson`)
            Deno.chdir(dir);
            await assertRejects(async()=>await read({dry:false,log:'debug',file:''})({}),FileNotParseableError)
        })
        it('should throw if the key cannot be parsed',async()=>{
            const dir = await Deno.makeTempDir();
            const file = path.join(dir, 'package.json')
            await Deno.writeTextFile(file,`{"boguskey":"1.0.0"}`)
            Deno.chdir(dir);
            await assertRejects(async()=>await read({dry:false,log:'debug',file:''})({}),KeyNotFoundError)
        })
    })
})
