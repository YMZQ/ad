import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index';
import Home from '@//components/common/Home.vue';
import { getCookie, setCookie } from '@/utils/storage';
import { getRouting } from '@/api/index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(Router);

const constRouter = [
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
        meta: { title: '登录' }
    },
    {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
        redirect: '/dashboard',
        meta: { title: '自述文件' },
        children: [
            {
                path: '/dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                meta: { title: '系统首页' }
            },
            {
                path: '/404',
                component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                meta: { title: '404' }
            },
            {
                path: '/user',
                component: () => import(/* webpackChunkName: "user" */ '../components/page/user.vue'),
                meta: { title: '个人中心' }
            }
        ]
    }
];


const router = new Router({
    routes: constRouter,
    // mode: 'history'
});

const whiteList = ['/login'];
let asyncRouter;


router.beforeEach((to, from, next) => {
    NProgress.start();
    if (whiteList.indexOf(to.path) !== -1) {
        next();
    } else {
        let token = getCookie('token');
        const userRouter = get('USER_ROUTER');
        if (token) {
            if (!asyncRouter || !userRouter) {
                if (!userRouter || !asyncRouter) {
                    getRouting().then(res => {
                        const permissions = res.data.permissions;
                        asyncRouter = res.data.routes;
                        store.commit('setPermissions', permissions);
                        store.commit('setRoutes', asyncRouter);
                        save('USER_ROUTER', asyncRouter);
                        go(to, next);
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    asyncRouter = userRouter;
                    go(to, next);
                }
            } else {
                if (to.matched.length === 0) { // 如果未匹配到路由
                    next('/404')
                } else {
                    next() // 如果匹配到正确跳转
                }
            }
        } else {
            if (to.path === '/login') {
                next();
            } else {
                next('/login');
            }
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});

function go(to, next) {
    asyncRouter = filterAsyncRouter(asyncRouter);
    router.addRoutes(asyncRouter);
    next({ ...to, replace: true });
}

function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

function get(name) {
    return JSON.parse(localStorage.getItem(name));
}

function filterAsyncRouter(routes) {
    return routes.filter((route) => {
        const component = route.component;
        if (component) {
            if (route.component === 'Layout') {
                route.component = Home;
            } else {
                route.component = view(component);
            }
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children);
            }
            return true;
        }
    });
}

function view(path) {
    return (resolve) => require([`@/views/${path}.vue`], resolve);
}

export default router;