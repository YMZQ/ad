import Vue from 'vue';
import Vuex from 'vuex'; //引入 vuex
import VuexPersistence from 'vuex-persist'
import db from '@/utils/localstorage'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});
Vue.use(Vuex); //使用 vuex
import {  setCookie } from '@/utils/storage';

export default new Vuex.Store({
    state: {
        token: '',
        userInfo: {},
        someLists: [],
        agOption: [],
        permissions:db.get('PERMISSIONS') || [],
        ga_code:'',
        routes: db.get('USER_ROUTER') || []
    },
    mutations: {
        increment(state, payload) {
            state.count += payload.step || 1;
        },
        setToken(state, data) {
            setCookie('token',data);
            state.token = data;
        },
        setGa_code(state, data) {
            state.ga_code = data;
        },
        setUserInfo(state, data) {
            state.userInfo = data;
        },
        setPermissions(state, val) {
            db.save('PERMISSIONS', val)
            state.permissions = val
        },
        setRoutes(state, val) {
            db.save('USER_ROUTER', val)
            state.routes = val
        },
    },
    actions: {
        increment(context, param) {
            context.state.count += param.step;
            context.commit('increment', context.state.count)//提交改变后的state.count值
        },
    },
    getters: {
    },
    plugins: [vuexLocal.plugin]
});
