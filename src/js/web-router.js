
// import Foo  from '../../view/foo.vue';
const homePage = () => import('../view/homePage.vue');
const foo = () => import('../view/foo.vue');
const bar_bar = () => import('../view/bar/bar.vue');
const user_menuManage = () => import('../view/user/menuManage.vue');
const user_roleManage = () => import('../view/user/roleManage.vue');

const routes = [
    { path: '/homePage', component: homePage },
    { path: '/foo', component: foo },
    { path: '/bar/bar', component: bar_bar },
    { path: '/user/menuManage', component: user_menuManage },
    { path: '/user/roleManage', component: user_roleManage }
];

export {routes};