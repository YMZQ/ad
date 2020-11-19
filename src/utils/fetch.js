import Vue from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';
import { removeCookie, getCookie } from '@/utils/storage';
import db from '@/utils/localstorage';

import store from '@/store/index';

const ajax = axios.create({
    baseURL: '',
    timeout: 30000,
    headers: {}
});

axios.defaults.headers.post['Content-Type'] = 'Content-Type: application/json';//配置请求头

ajax.interceptors.request.use(
    config => {
        try {
            const token = getCookie('token');
            if (token) {
                // config.headers['Authorization'] = 'Bearer ' + token;
                config.headers['Authorization'] = token;
            }
            if (store.state.ga_code) {
                config.headers['ga-code'] = store.state.ga_code;
            }
        } catch (e) {
            console.error(e);
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

ajax.interceptors.response.use((config) => {
    return config;
}, (error) => {
    if (error.response) {
        const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message;
        switch (error.response.status) {
            case 404:
                Message({
                    message: '很抱歉，资源未找到',
                    type: 'error'
                });
                break;
            case 403:
                Message({
                    message: '很抱歉，当前网关用户暂无该操作权限',
                    type: 'error'
                });
                break;
            case 401:
                removeCookie('token');
                db.clear();
                store.commit('setPermissions', '');
                store.commit('setRoutes', '');
                router.push('/login');
                break;
            default:
                Message({
                    message: errorMessage,
                    type: 'error'
                });
                break;
        }
    }
    return Promise.reject(error);
});

export default (url = '', data = {}, type = 'GET') => {
    axios.defaults.withCredentials = false;
    var httpUrl = url;
    // console.log('请求参数', httpUrl, data);
    type = type.toUpperCase();
    if (type == 'GET') {
        return new Promise((resolve, reject) => {
            // ajax.get(httpUrl, isData ? '' : { 'params': data })
            ajax.get(httpUrl, { 'params': data })
                .then(response => {
                    // console.log('返回结果', response.data);
                    let result = response.data;
                    if (result.status !== 200) {
                        Message({
                            message: result.message,
                            type: 'error'
                        });
                    } else if (result.status == 40161) {
                        Message({
                            message: '登陆失效',
                            type: 'error',
                            duration: 10,
                            onClose: () => {
                                removeCookie('token');
                                router.push('/login');
                            }
                        });
                    }
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    } else if (type == 'POST') {
        return new Promise((resolve, reject) => {
            ajax.post(httpUrl, data)
                .then(response => {
                    store.commit('setGa_code', '');
                    let result = response.data;
                    console.log(result.status)

                    if (result.status == 40121) {
                        Message({
                            message: result.message,
                            type: 'error'
                        });
                        reject(result);
                    } else if (result.status !== 200) {
                        reject(result);
                        Message({
                            message: result.message,
                            type: 'error'
                        });
                    } else if (result.status == 40161) {
                        Message({
                            message: '登陆失效',
                            type: 'error',
                            duration: 10,
                            onClose: () => {
                                removeCookie('token');
                                router.push('/login');
                            }
                        });
                    } else if (result.status == 200) {
                        resolve(result);
                    }
                }, err => {
                    store.commit('setGa_code', '');
                    reject(err);
                });
        });
    } else if (type == 'PUT') {
        return new Promise((resolve, reject) => {
            ajax.put(httpUrl, data)
                .then(response => {
                    let result = response.data;
                    if (result.status !== 200) {
                        Message({
                            message: result.message,
                            type: 'error'
                        });
                    } else if (result.status == 40161) {
                        Message({
                            message: '登陆失效',
                            type: 'error',
                            duration: 10,
                            onClose: () => {
                                removeCookie('token');
                                router.push('/login');
                            }
                        });
                        return false;
                    } else {
                        resolve(result);
                    }
                }, err => {
                    reject(err);
                });
        });
    } else if (type == 'DELETE') {
        return new Promise((resolve, reject) => {
            ajax.delete(httpUrl, { data: data }).then(response => {
                store.commit('setGa_code', '');
                let result = response.data;
                if (result.status !== 200) {
                    Message({
                        message: result.message,
                        type: 'error'
                    });
                    return false;

                } else if (result.status == 40161) {
                    Message({
                        message: '登陆失效',
                        type: 'error',
                        duration: 10,
                        onClose: () => {
                            removeCookie('token');
                            router.push('/login');
                        }
                    });
                    return false;
                }
                resolve(result);
            }, err => {
                store.commit('setGa_code', '');
                reject(err);
            });
        });
    } else if (type == 'PATCH') {
        return new Promise((resolve, reject) => {
            ajax.patch(httpUrl, data)
                .then(response => {
                    store.commit('setGa_code', '');
                    let result = response.data;
                    if (result.status == 40121) {
                        Message({
                            message: result.message,
                            type: 'error'
                        });
                        reject(result);
                    } else if (result.status !== 200) {
                        Message({
                            message: result.message,
                            type: 'error'
                        });
                        return false;
                    } else if (result.status == 40161) {
                        Message({
                            message: '登陆失效',
                            type: 'error',
                            duration: 10,
                            onClose: () => {
                                removeCookie('token');
                                router.push('/login');
                            }
                        });
                        return false;
                    } else if (result.status == 200) {
                        resolve(result);
                    }
                }, err => {
                    console.log(err)
                    store.commit('setGa_code', '');
                    reject(err);
                });
        });
    }
}

