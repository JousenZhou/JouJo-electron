interface OptionsProps {
	type: "trigger" | "plugin",
	name: string
}

interface paramProps {
	desc: string;
	required: boolean;
	type: string;
	options?: object;
}

interface enterProps {
	desc: string;
	port: string;
}

interface outPutProps {
	desc: string;
	port: string;
}

interface InputMap {
	[prop: string]: string
}

export function Component(options: OptionsProps): any {
	return function (constructor: any) {
		// 赋予组件名字
		Object.defineProperty(constructor, "name", {
			value: options.name,
			writable: false,
		})
		const inputMap: InputMap = {}

		Object.entries(Object.getOwnPropertyDescriptors(constructor)).forEach(
			([field, {value}]) => {
				if (Object.hasOwnProperty.call(value, "characteristic")) {
					const {characteristic} = value
					// 重构出口函数解析
					if (characteristic === "output-function") {
						const faker = constructor.prototype[field]
						constructor.prototype[field] = async (...any: any[]) => {
							return {output: value.port, result: await faker(...any)}
						}
					}
					// 入口函函数映射
					if (characteristic === "enter-function") {
						Object.assign(inputMap, {[value.port]: field})
					}
				}
			}
		)
		// 插件组件 赋予run函数
		if (options.type === "plugin") {
			// 运行函数
			constructor.prototype.run = function (enterType: string, ...param: any[]) {
				return this?.[inputMap[enterType]]?.(...param)
			}
		}
	}
}

// 属性装饰器
export function Param(props: paramProps): (target: any, field: string) => void {
	return function (target, field) {
		Object.defineProperty(target.constructor, field, {
			value: {...props, characteristic: "attribute"},
			writable: true,
		})
	}
}

// 入口函数装饰器
export function Enter(props: enterProps): (target: any, field: string) => void {
	return function (target, field) {
		Object.defineProperty(target.constructor, field, {
			value: {...props, characteristic: "enter-function"},
		})
	}
}

// 出口函数装饰器
export function Output(props: outPutProps): (target: any, field: string) => void {
	return function (target, field) {
		Object.defineProperty(target.constructor, field, {
			value: {...props, characteristic: "output-function"},
		})
	}
}