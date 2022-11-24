import { BumpupFunction } from "./BumpupFunction.ts";
import { BumpupOptions } from "./BumpupOptions.ts";

export type BumpupPlugin = BumpupFunction | [BumpupFunction, BumpupOptions];

export function isFunctionWithOptions(plugin: BumpupPlugin): plugin is [BumpupFunction, BumpupOptions]{
    return Array.isArray(plugin) && plugin.length === 2 && typeof plugin[0] === 'function'
}
