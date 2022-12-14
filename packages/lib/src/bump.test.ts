import {assertEquals, assertRejects, describe, it} from "../../../dev_deps.ts";
import {BumpupPlugin, BumpupOptions, BumpupConfig} from "../../common/mod.ts";
import {composePlugins, bump} from "./bump.ts";
import {PluginExecutionError} from "./errors/PluginExecutionError.ts";

// deno-lint-ignore no-explicit-any
const enhanceOptions = (options: Record<any,any>={}): BumpupOptions=>{
    return {dry: false, log: 'critical',file:'bumpup.config.ts', ...options}
}
describe('module lib', () => {
    const optionPlugin: BumpupPlugin = [(o) => () => ({
        option0: o.option0,
        option1: o.option1
    }), enhanceOptions({option1: "option1"})]
    const asyncPlugin: BumpupPlugin = () => () => Promise.resolve({asyncValue: "async"})
    const syncPlugin: BumpupPlugin = () => () => ({syncValue: "sync"})
    const throwSyncPlugin: BumpupPlugin = () => () => {
        throw new Error('Error thrown')
    }
    const throwAsyncPlugin: BumpupPlugin = () => () => Promise.reject('Error thrown')

    describe('function composePlugins()', () => {
        it('should chain async and sync plugins together and return the end result', async () => {
            const actual = await composePlugins([optionPlugin, asyncPlugin, syncPlugin], enhanceOptions({option0: 'option0'}))
            const expected = {option0: 'option0', 'option1': 'option1', asyncValue: "async", syncValue: "sync"}
            assertEquals(actual, expected)
        })
        it('should handle sync rejections in the chain', () => {
            assertRejects(() =>composePlugins([optionPlugin, throwSyncPlugin, syncPlugin],enhanceOptions() ),PluginExecutionError)
        })
        it('should handle async rejections in the chain', () => {
            assertRejects(() =>composePlugins([optionPlugin, throwAsyncPlugin, asyncPlugin],enhanceOptions()), PluginExecutionError)
        })
    })
    describe('function bump()', ()=>{
        it('should run the config', async ()=>{
            const config: BumpupConfig = {
                version: '2.1.0',
                options: {
                    option1: 'option1'
                },
                plugins: [optionPlugin]
            }
            const actual = await bump(config, enhanceOptions({option0: 'option0'}))
            const expected = {option0: 'option0', 'option1': 'option1'}
            assertEquals(actual, expected)
        })

    })
});
