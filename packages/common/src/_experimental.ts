export type VersionProvider = Record<string, string>;

// provide version, read history, determine next version, write version, do postprocessing like commit, do build, do release
export type Workflow = Record<string, string>;

// Mulitple "Workflows" per config file
