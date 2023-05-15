/**
 * @author JouJo
 * @description: electron通信装饰器
 * @date 2023/5/13
 */
import {ipcRenderer} from 'electron'

interface ElectronChannelConfig {
    desc: string
    name: string
}

interface props {
    desc: string
    task?: string
}

// 通信
export function ElectronChannel(props: ElectronChannelConfig): any {
    // 写入构造函数
    return function (constructor: any) {
        // 接受任务集合
        const taskMap: Map<any, any> = new Map();

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
                            return new Promise(async (resolve, reject) => {
                                ipcRenderer.invoke(props.name, {
                                    task,
                                    result: await faker(data)
                                }).then(resolve).catch(reject)
                            })
                        }
                    }
                }
            }
        )

        return class extends constructor {

            constructor() {
                super();
                // 接受统一函数再分发
                ipcRenderer.on(props.name, (event, {task, result}) => {
                    const res = taskMap.get(task);
                    if (!result) {
                        console.error({status: false, msg: `服务器消息：[${task}]任务未注册`})
                        return;
                    }
                    res(result)
                });
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