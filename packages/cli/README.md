# @bumpup/cli

## Installation

To run bumpup directly from url use:
```
deno run -A https://packages.danielr1996.de/@bumpup/cli.bundle.ts
```

To install bumpup as a global executable use:

```shell
deno install -b bumpup -A https://packages.danielr1996.de/@bumpup/cli.bundle.ts
```

## Usage

To see all options and commands run `bumpup --help` or
`bumpup <subcommands> --help`

## Configuration

> 🚧 Currently you have to manually assemble your plugins even if you use a
> standard workflow. For a future version it is planned to support presets for
> common use cases like `babel` does with their
> [babel presets](https://babeljs.io/docs/en/presets).

A default `bumpup.config.ts` config file can be generated with `bumpup init`. It
contains the plugins for a standard 'deno, git, semver' use case.

> bumpup also supports plain javascript config files, but typescript config
> files give you built in validation

### bumpup.config.ts

A configuration file is an ES Module with a configuration object as its default
export. CommonJS Modules are not supported.

#### Minimal config

The most basic example (although not very useful because it contains no plugins)
would be:

```ts
export default {
  version: "2.0.0",
  plugins: [],
};
```

#### Adding external plugins

To add a plugin import it and add it to the plugin array:

```ts
import {read, write} from "https://packages.danielr1996.de/@bumpup/json/mod.ts";
import {type,record} from "https://packages.danielr1996.de/@bumpup/git/mod.ts";
import determine from "https://packages.danielr1996.de/@bumpup/semver/mod.ts";
import {BumpupConfig} from "https://packages.danielr1996.de/@bumpup/common/mod.ts";

const config: BumpupConfig = {
  version: "2.0.0",
  plugins: [
    read,
    type,
    determine,
    write,
    record,
  ],
};
export default config;
```

#### Providing options to plugins

To pass options to a plugin add an array with the plugin and its options instead
of the plugin: For a list of options supported by the plugin see the plugins
doc.

```ts
import {read, write} from "https://packages.danielr1996.de/@bumpup/json/mod.ts";
import {type,record} from "https://packages.danielr1996.de/@bumpup/git/mod.ts";
import determine from "https://packages.danielr1996.de/@bumpup/semver/mod.ts";
import {BumpupConfig} from "https://packages.danielr1996.de/@bumpup/common/mod.ts";

const config: BumpupConfig = {
  version: "2.0.0",
  plugins: [
    read,
    type,
    determine,
    [write, { dry: true }],
    record,
  ],
};
export default config;
```

#### Inline Plugins

Because the configuration is just plain javascript/typescript it is also possible to
specify a plugin inline. This might be useful if you want to debug the workflow
or slightly alter a plugins behaviour without writing and publishing a complete
plugin for it.

A simple inline plugin that just logs the options and data looks like this:

```ts
export default {
  version: "2.0.0",
  plugins: [
    (options) =>
      (data) => {
        console.log(options, data);
        return data;
      },
  ],
};
```
