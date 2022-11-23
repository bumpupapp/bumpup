import { BumpupOptions } from "./BumpupOptions.ts";
import { BumpupData } from "./BumpupData.ts";

export type BumpupFunction = (
  options: BumpupOptions,
) => (data: BumpupData) => BumpupData | Promise<BumpupData>;
