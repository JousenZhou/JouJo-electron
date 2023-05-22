/**
 * @author JouJo
 * @description: electron通信装饰器
 * @date 2023/5/13
 */
import {BrowserWindow} from 'electron'
import {ipcMain} from 'electron'

interface ElectronChannelConfig {
    desc: string
    name: string
}

interface props {
    desc?: string
    task: string
}

// 通信
export function ElectronChannel(props: ElectronChannelConfig): any {
    // 写入构造函数
    return function (constructor: any) {
        // 接受任务集合
        const taskMap: Map<any, any> = new Map();

        let windowBrowser: BrowserWindow | null = null

        constructor.prototype.bind = (win: BrowserWindow) => {
            windowBrowser = win
        }

        Object.entries(Object.getOwnPropertyDescriptors(constructor)).forEach(
            ([field, {value}]) => {
                if (Object.hasOwnProperty.call(value, "characteristic")) {
                    const {characteristic, task} = value
                    // 查询函数重构
                    if (characteristic === "accept") {
                        const faker = constructor.prototype[field]
                        if (taskMap.get(task)) {
                            console.log(`${task}重复注册`)
                            return
                        }
                        taskMap.set(task, faker);
                    }
                    // 插入函数重构
                    if (characteristic === "send") {
                        const {fields} = value
                        const faker = constructor.prototype[field]
                        constructor.prototype[field] = async function (data: any[]) {
                            if (!windowBrowser) {
                                console.log('win 未绑定')
                                return
                            }
                            const res = await faker.bind(this)(data)
                            windowBrowser.webContents.send(props.name, {
                                task,
                                result: res
                            });
                        }
                    }
                }
            }
        )

        return class extends constructor {

            constructor() {
                super();
                // 接受统一函数再分发
                ipcMain.handle(props.name, async (event, {task, result:data}) => {
                    const result = taskMap.get(task);
                    if (!result) return {status: false, msg: `[${task}]任务未注册`}
                    try {
                        return {status: true, result: await result.bind(this)(result)}
                    } catch (e) {
                        return {status: false, result: e}
                    }
                })
            }
        }
    }
}

// 接收事件
export function accept(props: props) {
    return function (...a: any[]) {
        const [target, field, val] = a;
        Object.defineProperty(target.constructor, field, {
            value: {task: props.task, val, characteristic: "accept"},
        })
    }
}

// 接收事件
export function send(props: props) {
    return function (...a: any[]) {
        const [target, field, val] = a;
        Object.defineProperty(target.constructor, field, {
            value: {task: props.task, val, characteristic: "send"},
        })
    }
}