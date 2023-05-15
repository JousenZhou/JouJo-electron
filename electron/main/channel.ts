/**
 * @author JouJo
 * @description: 通信接口
 * @date 2023/5/13
 */
import {ElectronChannel, accept, send} from './decorator/channel'
import {BrowserWindow} from 'electron'
import nodeCmd from 'node-cmd'
import fs from "fs" ;
import path from 'path'

interface Channel {
    bind: (win: BrowserWindow) => void
}

// 文件目录
const robot_path: string = path.join(__dirname, 'robot')

@ElectronChannel({name: 'process-message', desc: 'electron通信'})
class Channel {
    // 接收事件
    @accept({task: 'robot-env-check', desc: '机器人环境检测'})
    async getNodeVersion(): Promise<any> {
        const result = {};
        // 获取Node版本
        const node = nodeCmd.runSync('node -v');
        Object.assign(result, {node: node.err ? '' : node.data.replace(/\r\n/g, '')})
        // 获取git版本
        const git = nodeCmd.runSync('git -v');
        Object.assign(result, {git: node.err ? '' : git.data.replace(/\git version /g, 'v').replace(/\.windows/g, '')})
        // 获取环境是否已经生成
        try {
            const env = fs.statSync(robot_path)
            Object.assign(result, {env: env.isDirectory()})
        } catch (e) {
            Object.assign(result, {env: false})
        }
        return result;
    }

    // 安装环境
    @accept({task: 'robot-env-install', desc: '机器人环境安装'})
    async robotEnvInstall(): Promise<any> {
        // 创建目录文件夹
        fs.mkdir(robot_path, (err) => {
            console.log('done.')
        })
    }

    // 发送事件
    @send({task: 'server-close', desc: '服务崩坏告知渲染线程'})
    async sendMsg(): Promise<any> {
        return '服务器炸了'
    }
}

const channelExample = new Channel()

// 创建目录文件夹
fs.mkdir(robot_path, (err) => {
    // 创建文件
    fs.writeFile(
        //如果有文件则覆盖。没有则创建
        path.join(robot_path, 'package.json'),
        '{\n' +
        '  "name": "test",\n' +
        '  "version": "1.0.0",\n' +
        '  "description": "",\n' +
        '  "main": "index.js",\n' +
        '  "scripts": {\n' +
        '    "test": "echo \\"Error: no test specified\\" && exit 1"\n' +
        '  },\n' +
        '  "author": "",\n' +
        '  "license": "ISC"\n' +
        '}\n',
        // 错误优先的回调函数
        (err) => {
            if (err) {
                console.log(err.message)
            } else {
                console.log('文件创建成功')
            }
        })
})

export default channelExample