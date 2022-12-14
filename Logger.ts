import {mainSymbols} from 'https://esm.sh/figures@5.0.0';
export type LogLevel = {
    name: string,
    format: (message: unknown)=>string
}

const defaultLevels: LogLevel[] =[
    {name: "silent", format: ()=>''},
    {name: "error", format: (message)=>`${mainSymbols.cross}  ${message}`},
    {name: "error", format: (message)=>`${mainSymbols.cross}  ${message}`},
    {name: "warning", format: (message)=>`${mainSymbols.warning}  ${message}`},
    {name: "success", format: (message)=>`${mainSymbols.tick}  ${message}`},
    {name: "info", format: (message)=>`${mainSymbols.info}  ${message}`},
    {name: "debug", format: (message)=>`${mainSymbols.pointer}  ${message}`},
]
export class Logger{
    constructor(private level: string = 'error', private levels:LogLevel[] = defaultLevels, private logImpl = console.log) {
    }

    public log(level: string, message: unknown){
        const currentLevelIndex = this.levels.findIndex(({name})=>name === this.level)
        const wantedLevelIndex = this.levels.findIndex(({name})=>name === level)
        if(wantedLevelIndex <= currentLevelIndex){
            this.logImpl(this.levels[wantedLevelIndex].format(message))
        }
    }
}
