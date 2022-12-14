import {
    assertEquals, assertRejects,
    describe,
    it,
    path
} from "../../../dev_deps.ts"
import {FileNotFoundError} from "../../common/src/errors/BumpupError.ts";
import {FileNotParseableError} from "./errors/FileNotParseableError.ts";
import {write} from "./write.ts";

describe('@bumpup/json',()=>{
    describe('write', ()=>{
        it('should write a json file',async()=>{
            const dir = await Deno.makeTempDir();
            const file = path.join(dir, 'package.json')
            await Deno.writeTextFile(file,`{"version":"1.0.0", "extrakey":"extravalue"}`)
            Deno.chdir(dir);
            await write({dry:false,log:'debug',file:''})({newVersion:"2.0.0"})
            const actual = JSON.parse(await Deno.readTextFile('package.json'))
            const expected = {version: '2.0.0',extrakey:"extravalue"}
            assertEquals(actual, expected)
        })
        it('should throw if the json file cannot be parsed',async()=>{
            const dir = await Deno.makeTempDir();
            const file = path.join(dir, 'package.json')
            await Deno.writeTextFile(file,`bogusjson`)
            Deno.chdir(dir);
            await assertRejects(async()=>await write({dry:false,log:'debug',file:''})({newVersion:'1'}),FileNotParseableError)
        })
        it('should throw if the file cannot be read',async()=>{
            const dir = await Deno.makeTempDir();
            Deno.chdir(dir);
            await assertRejects(async()=>await write({dry:false,log:'debug',file:''})({newVersion:'1'}),FileNotFoundError)
        })
        it('should not write to the a file when the newVersion property doesnt exist',async()=>{
            const dir = await Deno.makeTempDir();
            const file = path.join(dir, 'package.json')
            await Deno.writeTextFile(file,`{"version":"1.0.0", "extrakey":"extravalue"}`)
            Deno.chdir(dir);
            await write({dry:false,log:'debug',file:''})({})
            const actual = JSON.parse(await Deno.readTextFile('package.json'))
            const expected = {version: '1.0.0',extrakey:"extravalue"}
            assertEquals(actual, expected)
        })
    })
})
