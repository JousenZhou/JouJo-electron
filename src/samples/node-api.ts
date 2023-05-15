import {lstat} from 'node:fs/promises'
import {cwd} from 'node:process'
import {ipcRenderer} from 'electron'

ipcRenderer.invoke('process-message', {task: 'node-version', data: '887766'}).then((msg) => {
    console.log('msg', msg)
})

ipcRenderer.on('process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
})

lstat(cwd()).then(stats => {
    console.log('[fs.lstat]', stats)
}).catch(err => {
    console.error(err)
})
