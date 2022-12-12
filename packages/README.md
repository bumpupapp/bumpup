# Packages

bumpup consists of the [@bumpup/cli](packages/cli) package that you install with `deno install` and various plugins
that you reference in your `bumpup.config.ts`.

To see all bumpup packages visit https://github.com/bumpupapp/bumpup/tree/main/packages

## Plugins
### Development
> 🚧️Currently you have to write your plugin completely from scratch.
> Some kind of bootstrapping process is planned for the future.

A plugin can be any number of javascript or typescript files, however typescript gives you the advantage of typechecking.

To write your own plugin simply create a file called `plugin.ts`, optionally import the types for type checking, create
a function that conforms to the BumpupFunction type (accepts an options object and returns a function that accepts data and returns data,
for the available builtin options and data see [common/src](common/src)).
```ts
import {BumpupFunction} from 'https://denopkg.dev/gh/danielr1996/bumpup@main/packages/common/mod.ts';

const plugin: BumpupFunction = options => data => {
    // Do something with options and data.
    return data;
};

export default plugin;

```

Then import the plugin in your `bumpup.config.ts` locally or from an url:
```ts
import plugin from "./plugin.ts";
// or
import plugin from "https://some.remote.url/plugin.ts";

const config: BumpupConfig = {
    version: "2.0.0",
    plugins: [
        plugin
    ],
};
export default config;
```

That's it, no need to compile your javascript.
#### Best Practices
##### Respect options
Command line arguments are passed to your plugin as options, like the `--dry` flag or the log level.
It's up to you how or if you handle these options, but keep in mind that a user has some expectations when
specifying these options:

`--dry`: don't modify files or change something in a database, remote service, etc. instead log what
changes would have been performend

`--log`: the available log levels are `critical`, `error`, `warning`, `info`, `debug`

* info is the default log level and it's messages should be relevant fpr ~80% of users
* debug is for messages that might help find and issue
* warn is for events that are uncommon but don't prevent the plugin from working correctly
* error is for events that are unrecoverable
