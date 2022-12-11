const name = 'http-fetch'

const setup = ({onResolve, onLoad}) => {
    onResolve({filter: /^https:\/\//}, resolveFile)
    onResolve({filter: /.*/, namespace: 'http-fetch'}, resolveUrl)
    onLoad({filter: /.*/, namespace: 'http-fetch'}, loadSource)
}

const resolveFile = ({path}) => ({
    path: path,
    namespace: 'http-fetch'
})

const resolveUrl = ({path, importer}) => ({
    path: new URL(path, importer).href,
    namespace: 'http-fetch'
})

const loadSource = async ({path}) => {
    const source = await fetch(path)

    if (!source.ok) {
        const message = `GET ${path} failed: status ${source.status}`
        throw new Error(message)
    }

    const contents = await source.text()
    const pattern = /\/\/# sourceMappingURL=(\S+)/
    const match = contents.match(pattern)
    if (match) {
        const url = new URL(match[1], source.url)
        const dataurl = await loadMap(url)
        const comment = `//# sourceMappingURL=${dataurl}`
        contents = contents.replace(pattern, comment)
    }

    const allowedLoaders = ['js','ts','tsx','jsx','json','css','text','binary','base64','dataurl','file','copy']
    const {pathname} = new URL(source.url)
    let loader = pathname.match(/[^.]+$/)[0]
    if(!allowedLoaders.includes(loader)){
        loader = 'ts'
    }

    return {contents, loader}
}

const loadMap = async url => {
    const map = await fetch(url)
    const type = map.headers.get('content-type').replace(/\s/g, '')
    const buffer = await map.arrayBuffer()
    const blob = new Blob([buffer], {type})
    const reader = new FileReader()
    return new Promise(cb => {
        reader.onload = e => cb(e.target.result)
        reader.readAsDataURL(blob)
    })
}

export default {name, setup}
