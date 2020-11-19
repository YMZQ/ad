import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementUI from 'element-ui';
import axios from 'axios';
import md5 from 'js-md5';
import VueClipboard from 'vue-clipboard2'
import VueCropper from 'vue-cropper';
import { hasPermission, hasNoPermission, hasAnyPermission } from '@/utils/permissionDirect'
import Methods from '@/utils/methods';
import store from '@/store/index';


import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import '@/styles/index.scss' // global css
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import 'default-passive-events'



Vue.use(VueCropper);
Vue.use(VueClipboard)
Vue.use(ElementUI, {
    size: 'small'
});





import * as filters from '@/utils/filters'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})


Vue.prototype.$md5 = md5;
Vue.prototype.$axios = axios;
Vue.prototype.Methods = Methods;



const Plugins = [
    hasPermission,
    hasNoPermission,
    hasAnyPermission
]

Plugins.map((plugin) => {
    Vue.use(plugin)
})


Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
