import {
    BumpupConfig,
    BumpupData,
    BumpupFunction,
    BumpupOptions,
    BumpupPlugin,
    isFunctionWithOptions
} from "../../common/mod.ts";
import {PluginExecutionError} from "./errors/PluginExecutionError.ts";

/**
 * Loads the config from a given {url} and runs the steps defined in the config
 * @param config
 * @param options
 */
// deno-lint-ignore no-explicit-any
export const bump = (config: BumpupConfig, options: Record<any,any>=  {}): Promise<BumpupData> => {
    const o: BumpupOptions = {
        dry: false,
        file: 'bumpup.config.ts',
        log: 'critical',
        ...(config.options || {}),
        ...options
    }

    return composePlugins(config.plugins, o)
}

/**
 * Applies global options and config to a plugin function and executes the plugins in order, returning the end results
 * @param plugins
 * @param options
 */
export const composePlugins = async (plugins: BumpupPlugin[], options: BumpupOptions): Promise<BumpupData> => {
    let value = {}
    const pluginFunctions = plugins
        .map(plugin => isFunctionWithOptions(plugin) ? plugin : [plugin, {}] as [BumpupFunction, BumpupOptions])
        .map(([fn, option]) => fn({...options, ...option}))

    for (const plugin of pluginFunctions) {
        try {
            value = {...value, ...await plugin(value)}
        } catch (e) {
            throw new PluginExecutionError("Error occured executing a plugin",e)
        }
    }
    return value
};
