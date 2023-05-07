// @ts-ignore
import {PropOptions, WatchOptions} from 'vue'
// @ts-ignore
import { InjectKey } from "vue/types/options";

export declare type Constructor = {
    new(...args: any[]): any;
};

export declare function Prop(options?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator;

export declare function Watch(path: string, options?: WatchOptions): MethodDecorator;

export declare function Emit(event?: string): MethodDecorator;

export declare function Model(event?: string, options?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator;

export declare function Provide(key?: string | symbol): PropertyDecorator;

export declare function Inject(options?: {
    from?: InjectKey;
    default?: any;
} | InjectKey): PropertyDecorator;