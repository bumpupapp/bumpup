/**
 * Generates an initial configuration
 */
export const init = (): string => {
    return `export default {
    version: "2.1.0",
    options: {},
    plugins: [
        (options)=>(data)=>console.log(options, data),
    ]
}`
}


