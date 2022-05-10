import { createApp } from 'vue';
import {
    createRouter,
    createWebHashHistory
} from 'vue-router';
import routes from './routers';
import * as d3 from "d3";
import 'assets/css/main.less';
import ElementPlus from 'element-plus';
import 'assets/css/index.css';
import * as Icons from '@element-plus/icons-vue'

// TroisJS
import { TroisJSVuePlugin } from 'troisjs'

window.d3 = d3;
const myApp = createApp({
    el: '#app-wrapper',
});

// router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
myApp.use(router);

// element
myApp.use(ElementPlus);
for (let icon in Icons) {
    myApp.component(
        icon, Icons[icon]
    )
}

myApp.use(TroisJSVuePlugin);
myApp.mount("#app-wrapper");
