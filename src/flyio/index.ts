/**
 * @Description: fly请求插件 [交互比axios人性化很多]
 * @author BloodCat(JousenZhou)
 * @date 2020/11/30
 */
// @ts-ignore
import Fly from 'flyio/dist/npm/fly';
import {useUserStore} from '@/store';

let request = new Fly()

request.config = {
    baseURL: 'http://127.0.0.1:3000/',
    timeout: 1000 * 60 * 5
};
// 请求处理
request.interceptors.request.use((request: any) => {
    const userStore = useUserStore();
    if (userStore.Authorization) request.headers.Authorization = `Bearer ${userStore.Authorization}`
    return request;
});
// 响应处理
request['interceptors'].response.use(
    (response: any) => {
        return JSON.parse(response.data);
    },
    (error: any) => {
        return error;
    }
);
// 下载
request.download = function (url: string, needRequestPrefix = true) {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.target = '_blank';
    elink.setAttribute('download', '');
    elink.href = `${needRequestPrefix ? './' : ''}${url}`;
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
};
export default request;
