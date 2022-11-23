import { BumpupPlugin } from "./BumpupPlugin.ts";

export type BumpupConfig = {
  version: string;
  plugins: BumpupPlugin[];
};
