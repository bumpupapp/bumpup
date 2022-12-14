export type BumpupOptions = {
     dry: boolean;
     log: "critical" | "error" | "warning" | "info" | "debug";
     file: string
// deno-lint-ignore no-explicit-any
 } & Record<any, any>
