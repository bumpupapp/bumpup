import {
    BumpupConfig,
    BumpupData,
    BumpupFunction,
    BumpupOptions,
    BumpupPlugin,
    isFunctionWithOptions
} from "../../common/mod.ts";
import {path} from "../../../deps.ts";
import {ConfigNotFoundError} from "./ConfigNotFoundError.ts";
import {PluginExecutionError} from "./PluginExecutionError.ts";
import {InvalidConfigError} from "./InvalidConfigError.ts";
import {assertRejects} from "https://deno.land/std@0.165.0/testing/asserts.ts";
import {UnknownConfigError} from "./UnknownConfigError.ts";

/**
 * Loads the config from a given {url} and runs the steps defined in the config
 * @param url
 * @param options
 */
export const runConfig = async (url: URL, options: BumpupOptions = {}): Promise<BumpupData> => {
    let config: BumpupConfig;
    try {
        config = (await import(url.href)).default
    } catch (e) {
        // TODO: better distinguish between errors
        throw new UnknownConfigError(e.message,e)
    }
    return composePlugins(config.plugins, {...config.options, options})
}

/**
 * Applies global options and config to a plugin function and executes the plugins in order, returning the end results
 * @param plugins
 * @param options
 */
export const composePlugins = async (plugins: BumpupPlugin[], options: BumpupOptions = {}): Promise<BumpupData> => {
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
