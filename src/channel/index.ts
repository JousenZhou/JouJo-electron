/**
 * @author JouJo
 * @description: 通信接口
 * @date 2023/5/13
 */
import {ElectronChannel, accept, send} from '@/decorator/channel'

@ElectronChannel({name: 'process-message', desc: 'electron通信'})
class ClientChannel {
    // 接收事件
    @accept({task: 'server-close', desc: '获取本机node版本'})
    async test(data: any): Promise<any> {
        console.log('客户端接收到消息', data)
    }

    // 发送事件
    @send({task: 'robot-env-check', desc: '机器人环境检测'})
    async getRobotEnv(): Promise<any> {
    }
}

const channelExample = new ClientChannel()


export default channelExample