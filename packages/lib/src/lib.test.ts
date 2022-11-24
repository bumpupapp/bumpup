import {assertEquals, assertRejects, assertThrows, beforeEach, describe, it} from "../../../dev_deps.ts";
import {BumpupPlugin} from "../../common/src/BumpupPlugin.ts";
import {composePlugins, runConfig} from "./lib.ts";
import {PluginExecutionError} from "./PluginExecutionError.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import {ConfigNotFoundError} from "./ConfigNotFoundError.ts";
import {InvalidConfigError} from "./InvalidConfigError.ts";
import {UnknownConfigError} from "./UnknownConfigError.ts";

describe('module lib', () => {
    describe('function composePlugins()', () => {
        const optionPlugin: BumpupPlugin = [(o) => () => ({
            option0: o.option0,
            option1: o.option1
        }), {option1: "option1"}]
        const asyncPlugin: BumpupPlugin = () => () => Promise.resolve({asyncValue: "async"})
        const syncPlugin: BumpupPlugin = () => () => ({syncValue: "sync"})
        const throwSyncPlugin: BumpupPlugin = () => () => {
            throw new Error('Error thrown')
        }
        const throwAsync: BumpupPlugin = () => () => Promise.reject('Error thrown')

        it('should chain async and sync plugins together and return the end result', async () => {
            const actual = await composePlugins([optionPlugin, asyncPlugin, syncPlugin], {option0: 'option0'})
            const expected = {option0: 'option0', 'option1': 'option1', asyncValue: "async", syncValue: "sync"}
            assertEquals(actual, expected)
        })
        it('should handle sync rejections in the chain', () => {
            assertRejects(() =>composePlugins([optionPlugin, throwSyncPlugin, syncPlugin]),PluginExecutionError)
        })
        it('should handle async rejections in the chain', () => {
            assertRejects(() =>composePlugins([optionPlugin, throwAsync, asyncPlugin]), PluginExecutionError)
        })
    })
    describe('function runConfig()', async ()=>{
        let dir: string, url: URL;
        beforeEach(async ()=>{
            dir = await Deno.makeTempDir();
            url = new URL(path.join('file://',dir, "bumpup.config.ts"))
        })

        it('should run the config', async ()=>{
            const bumpup = `export default {version: "2.1.0",plugins: [()=>()=>({key: 'value'})]};`;
            await Deno.writeTextFile(url, bumpup);
            const expected = {key: 'value'}
            const actual = await runConfig(url)
            assertEquals(actual, expected)
        })
        it('should catch an invalid config', async ()=>{
            const bumpup = `<{}>bogus.+-`;
            await Deno.writeTextFile(url, bumpup);
            await assertRejects(()=>runConfig(url),UnknownConfigError)
        })
        it('should catch a wrong location', ()=>{
            assertRejects(()=>runConfig(new URL('file://bogusurl')),UnknownConfigError)
        })
    })
});
