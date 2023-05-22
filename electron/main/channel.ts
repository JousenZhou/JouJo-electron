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

const {spawn} = require('child_process')

interface Channel {
    bind: (win: BrowserWindow) => void
}

// 文件目录 __dirname
const robot_path: string = __dirname; //|| path.join(__dirname, 'robot')
const git: string = 'https://gitee.com/JousenZhou/robot-srcrpt.git';

const script = (common: string, args: string[], callback: any, cwd?: string) => new Promise((resolve, reject) => {
    const node_cmd = spawn(common, args, {
        cwd: cwd || robot_path,
        silent: false
    })
    const text = new TextDecoder('utf-8');
    // 结束
    node_cmd.stdout.on('close', resolve)
    node_cmd.stdout.on('error', reject)
    node_cmd.stdout.on('data', data => {
        callback(text.decode(data))
    })
})


@ElectronChannel({name: 'process-message', desc: 'electron通信'})
class Channel {
    @accept({task: 'robot-env-check', desc: 'robot环境检测'})
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
            const env = fs.statSync(path.join(robot_path, 'robot-srcrpt'))
            Object.assign(result, {env: env.isDirectory()})
        } catch (e) {
            Object.assign(result, {env: false})
        }
        return result;
    }

    @accept({task: 'robot-env-install', desc: 'robot环境安装'})
    async robotEnvInstall(): Promise<any> {
        try {
            await script('git', ['clone', git], this.sendMsg)
            await script('yarn.cmd', ['install'], this.sendMsg, path.join(robot_path, 'robot-srcrpt'))
            return true
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @accept({task: 'robot-run-script', desc: 'robot启动脚本'})
    async robotRunScript(msg): Promise<any> {
        await script('node', ['index.js'], this.sendMsg, path.join(robot_path, 'robot-srcrpt'))
        return 666
    }

    // 发送事件
    @send({task: 'server-close', desc: '服务崩坏告知渲染线程'})
    async sendMsg(...a: any[]): Promise<any> {
        return a?.[0] || '666'
    }
}

const channelExample = new Channel()


export default channelExample