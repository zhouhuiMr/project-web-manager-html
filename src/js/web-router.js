
// import Foo  from '../../view/foo.vue';
const homePage = () => import('../view/homePage.vue');
const foo = () => import('../view/foo.vue');
const bar_bar = () => import('../view/bar/bar.vue');

const routes = [
    { path: '/homePage', component: homePage },
    { path: '/foo', component: foo },
    { path: '/bar/bar', component: bar_bar }
];

export {routes};