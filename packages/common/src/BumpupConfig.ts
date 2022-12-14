import { BumpupPlugin } from "./BumpupPlugin.ts";


export type BumpupConfigV210 = {
  version: '2.1.0'
  // deno-lint-ignore no-explicit-any
  options?: Record<any,any>
  plugins: BumpupPlugin[];
}

export type BumpupConfig = BumpupConfigV210
