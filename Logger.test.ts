import {
    assertEquals,
    describe,
    it,
} from "./dev_deps.ts"
import { Logger, LogLevel} from './Logger.ts'

const defaultLevels: LogLevel[] =[
    {name: "silent", format: ()=>''},
    {name: "error", format: (message: unknown)=>`${message}`},
    {name: "warning", format: (message: unknown)=>`${message}`},
    {name: "success", format: (message: unknown)=>`${message}`},
    {name: "info", format: (message: unknown)=>`${message}`},
    {name: "debug", format: (message: unknown)=>`${message}`},
]
describe('Logger',()=>{
    it('should log if the required level is lower than the set level',()=>{
        let actual = ''
        const logger = new Logger('info', defaultLevels,message=>{actual=message})
        logger.log('error','message')
        assertEquals(actual, 'message')
    })
    it('should log if the required level is equal to the set level',()=>{
        let actual = ''
        const logger = new Logger('info',defaultLevels, message=>{actual=message})
        logger.log('info','message')
        assertEquals(actual, 'message')
    })
    it('should not log if the required level is greater than the set level',()=>{
        let actual = ''
        const logger = new Logger('info',defaultLevels, message=>{actual=message})
        logger.log('debug','message')
        assertEquals(actual, '')
    })
})
