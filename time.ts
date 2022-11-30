const version = JSON.parse(await Deno.readTextFile('version.json'))
version.buildtime = new Date()
await Deno.writeTextFile('version.json', JSON.stringify(version))
