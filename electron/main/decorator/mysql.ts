import mysql, {Connection, ConnectionConfig} from "mysql"

// sql装饰器
export function Sql(props: ConnectionConfig): any {

    const coonnection: Connection = mysql.createConnection(props)

    // 连接测试
    coonnection.connect(function (err) {
        if (err) {
            console.log("connect is not good" + err.stack)
            return
        }
        console.log("connect is ok:   " + coonnection.threadId)
    })

    // 写入构造函数
    return function (constructor: any) {

        Object.entries(Object.getOwnPropertyDescriptors(constructor)).forEach(
            ([field, {value}]) => {
                if (Object.hasOwnProperty.call(value, "characteristic")) {
                    const {characteristic, sql} = value
                    // 查询函数重构
                    if (characteristic === "query") {
                        const faker = constructor.prototype[field]
                        constructor.prototype[field] = function () {
                            // rejects
                            return new Promise((resolve) => {
                                coonnection.query(sql, (err, result) => {
                                    if (err) throw err
                                    resolve(faker(result))
                                })
                            })
                        }
                    }
                    // 插入函数重构
                    if (characteristic === "insert") {
                        const {fields} = value
                        const faker = constructor.prototype[field]
                        constructor.prototype[field] = async function (data: any[]) {
                            const res = await faker(data)
                            const last = res.map((e:any) => fields.map((x:string) => e[x]))
                            // rejects
                            return new Promise((resolve) => {
                                coonnection.query(sql, [last],(err, result) => {
                                    if (err) throw err
                                    resolve("insert success")
                                })
                            })
                        }
                    }
                }
            }
        )
    }
}
// sql查询
export function Query(props: string): (target: any, field: string, val: any) => void {
    return function (target, field, val) {
        Object.defineProperty(target.constructor, field, {
            value: {sql: props, val, characteristic: "query"},
        })
    }

}
// sql插入
export function Insert(props: string, fields: string[]): (target: any, field: string) => void {
    return function (target, field) {
        Object.defineProperty(target.constructor, field, {
            value: {sql: props, fields, characteristic: "insert"},
        })
    }

}