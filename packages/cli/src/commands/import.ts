import * as esbuild from 'https://deno.land/x/esbuild@v0.15.16/mod.js'
import httpFetch from 'https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js'
import {path} from '../../../../deps.ts'

const AsyncFunction = async function () {
}.constructor

export const build = async (options: any) => {
    await esbuild.initialize({})
    const output = await esbuild.build({
        bundle: true,
        write: false,
        plugins: [httpFetch],
        minify: true,
        format: 'esm',
        ...options
    })
    esbuild.stop()
    return output.outputFiles?.[0].text
}

// export const parseNamedModule = (module: string): string => {
//     // const [before, after = '}'] = module.split('export{')
//     // return `${before}return {${after}`
//     return module.replace('export','return')
// }
//
// export const parseDefaultModule = (module: string): string => {
//     return module.replace(/\{(\w+_default) as default}/, `{'default':$1}`)
// }

export const parseBuildOutput = (module: string): string => {
    return module
        .replace(/\{(\w+) as (\w+)}/, `{'$2':$1}`)
        .replace('export','return')
}

export const importModule = async (module: string) => {
    const text = await build({
        entryPoints: [module]
    })
    return AsyncFunction(parseBuildOutput(text))()
}

// const dir = await Deno.makeTempDir();
// const file = path.join(dir, 'module.ts')
// await Deno.writeTextFile(file,`export default {key:"value"}`)
// await importModule(file)
