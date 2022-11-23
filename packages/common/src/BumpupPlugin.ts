import { BumpupFunction } from "./BumpupFunction.ts";
import { BumpupOptions } from "./BumpupOptions.ts";

export type BumpupPlugin = BumpupFunction | [BumpupFunction, BumpupOptions];
