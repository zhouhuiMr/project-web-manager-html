import _ from 'lodash';
import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ScollBar from '../../component/scroll-bar.vue';
import {routes} from '../web-router.js';

Vue.use(VueRouter);
Vue.use(ElementUI);

NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
});

const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
});

//显示内容加载的进度条
router.beforeEach((to, from , next) => {
    NProgress.start();
    next();
});

router.afterEach(() => {
    NProgress.done();
});

//菜单数据格式
var menuData = [
    {
        menuId : "1",
        icon : "fas fa-home",
        name : "首页",
        url : "/homePage",
        childList : [
        ]
    },{
        menuId : "2",
        icon : "fas fa-tools",
        name : "工具",
        url : "/bar/bar",
        childList : [
            {
                menuId : "2-1",
                icon : "",
                name : "工具1",
                url : "/foo",
                childList : [
                ],
            },{
                menuId : "2-2",
                icon : "",
                name : "工具2",
                url : "/bar/bar",
                childList : [
                ],
            },
            {
                menuId : "2-3",
                icon : "",
                name : "工具3",
                url : "/bar/bar",
                childList : [
                ],
            },
            {
                menuId : "2-4",
                icon : "",
                name : "工具4",
                url : "/foo",
                childList : [
                ],
            },
            {
                menuId : "2-5",
                icon : "",
                name : "工具5",
                url : "/foo",
                childList : [
                ],
            },
        ],
    },{
        menuId : "3",
        icon : "fas fa-feather",
        name : "测试",
        url : "/bar/bar",
        childList : [
        ]
    },{
        menuId : "4",
        icon : "fas fa-tools",
        name : "工具",
        url : "/bar/bar",
        childList : [
            {
                menuId : "4-1",
                icon : "",
                name : "工具1",
                url : "/foo",
                childList : [
                ],
            },{
                menuId : "4-2",
                icon : "",
                name : "工具2",
                url : "/bar/bar",
                childList : [
                ],
            },
        ],
    },
];

window.app= new Vue({
    el : "#app",
    router,
    data : {
        theme : {
            titleBackgroundColor : "#353b40",//标题背景颜色
            menuBackgroundColor : "#545c64",//菜单背景颜色
            menuTextColor : "#ffffff",//菜单文字颜色
            menuActiveTextColor : "#409EFF",//菜单选中文字颜色
            btChangeMenuSpan : "#303133",//折叠菜单按钮颜色
        },
        logoUrl : "",//logo的url
        avatarUrl : "./resources/avatar.png",//头像的url
        menuTitle : {
            name : "系统管理",//菜单标题名称
            color : "#ffffff"//菜单标题颜色
        },

        isMenuFold : {
            "el-icon-s-fold" : true,
            "el-icon-s-unfold" : false
        },
        isCrumbHomePage : false,
        isCollapse : false,
        topSearchIsShow : false,
        menuContainerStyle : {
            menuWidth : "200px",
            mainWidth : "calc(100% - 200px)",
            isShowTitle : true,
        },
        isFullWindow : {
            "fa" : true,
            "fa-expand" : true,
            "fa-compress" : false
        },
        preRouterTo : "",
        viewTransitionName : "",//内容切换的动画效果

        menuList : [],//菜单列表
        defaultActiveMenu : 1,
        selectMenu : {
            menuId : "",//当前选择的菜单id
            menuIdList : [],//菜单id的列表
            menuNameList : [],//菜单名称列表
            parentMenuId : "",//父菜单的菜单id
            menuObject : null //选中的菜单对象
        },
        searchMenuList : [],//查询到的菜单列表
        searchInputPopoverShow : false,
        menuSearchText : "",//查询的菜单文字
        menuTagList : [
            {
                effect : "dark",//dark,plain
                index : "1",
                indexPath : ["1"],
                label : "首页",
                url : "/homePage",
                closable : false
            }
        ],
    },
    methods : {
        btSelectMenu : function(index, indexPath){
            this.defaultActiveMenu = index;
            this.selectMenu.menuId = index;
            this.selectMenu.menuIdList = indexPath;
            if(indexPath.length > 1){
                this.selectMenu.parentMenuId = indexPath[0];
            }
            getMenuNameListById(indexPath);

            if(index != "1"){
                this.isCrumbHomePage = true;
            }else{
                this.isCrumbHomePage = false;
            }

            createMenuTag(index, indexPath);

            runRouterTo(app.selectMenu.menuNameList[indexPath.length-1].url);

        },
        toHomePage : function(){
            this.btSelectMenu("1","1");
        },
        closeMenuTag : function(menuObject){
            //关闭菜单标签
            var curSelect = null;//当前选择的菜单
            var closeCurMenu = false;
            for(var i=0;i<app.menuTagList.length;i++){
                var tagItem = app.menuTagList[i];
                if(tagItem.index == menuObject.index){
                    app.menuTagList.splice(i,1);
                    closeCurMenu = tagItem.isSelect;
                    break;
                }
            }
            if(closeCurMenu){
                //关闭当前选中的菜单
                var lastMenu = app.menuTagList[app.menuTagList.length - 1];
                this.btSelectMenu(lastMenu.index,lastMenu.indexPath);
            }
        },
        changeMenuPanel : function(){
            if(this.isMenuFold["el-icon-s-fold"]){
                //执行折叠菜单
                this.isMenuFold["el-icon-s-fold"] = false;
                this.isMenuFold["el-icon-s-unfold"] = true;
                this.isCollapse = true;
                this.menuContainerStyle.isShowTitle = false;
                this.menuContainerStyle.menuWidth = "64px";
                this.menuContainerStyle.mainWidth = "calc(100% - 64px)";
            }else{
                //执行展开菜单
                this.isMenuFold["el-icon-s-fold"] = true;
                this.isMenuFold["el-icon-s-unfold"] = false;
                this.isCollapse = false;
                this.menuContainerStyle.isShowTitle = true;
                this.menuContainerStyle.menuWidth = "200px";
                this.menuContainerStyle.mainWidth = "calc(100% - 200px)";
            }
        },
        menuSearch : function(){
            //查询菜单
            if(this.menuSearchText != "" && this.menuSearchText != null){
                searchMenuByName(this.menuSearchText);
                if(this.searchMenuList.length > 0){
                    this.searchInputPopoverShow = true;
                }else{
                    this.searchInputPopoverShow = false;
                }
            }else{
                this.searchInputPopoverShow = false;
                this.menuSearchText = "";
                this.searchMenuList = [];
            }
        },
        outSearchInput : function(){
            // this.searchInputPopoverShow = false;
            // this.menuSearchText = "";
            // this.searchMenuList = [];
        },
        loginOut : function () {
            //注销
        },
        btFullWindow : function(){
            //是否进行全屏
            if(this.isFullWindow["fa-expand"]){
                fullScreen();
                this.isFullWindow["fa-expand"] = false;
                this.isFullWindow["fa-compress"] = true;
            }else{
                exitFullscreen();
                this.isFullWindow["fa-expand"] = true;
                this.isFullWindow["fa-compress"] = false;
            }
        },
        btSearch : function(){
            if(this.topSearchIsShow){
                this.topSearchIsShow = false;
                this.searchInputPopoverShow = false;
                this.menuSearchText = "";
                this.searchMenuList = [];
            }else{
                this.topSearchIsShow = true;
            }
        }
    },
    computed: {

    },
    watch : {
        '$route' (to, from) {
            const toDepth = to.path.split('/').length;
            const fromDepth = from.path.split('/').length;
            this.viewTransitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
        }
    },
    components : {
        ScollBar
    }
});

/**
 * 执行菜单的跳转
 * @param curRouterTo 当前选择的菜单路径
 */
function runRouterTo(curRouterTo){
    if(app.preRouterTo != curRouterTo){
        router.push(curRouterTo);
    }
    app.preRouterTo = curRouterTo;
}

/**
 * 全屏显示
 */
function fullScreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}
/**
 * 取消全屏显示
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * 根据菜单的唯一标识获取菜单的名称
 * 存储数据的格式
 * {
 *   menuId : "",
 *   menuName : "",
 *   url : ""
 * }
 * @param indexPath 选择的菜单
 */
function getMenuNameListById(indexPath){
    app.selectMenu.menuNameList = [];
    var menuId = indexPath[0];//一级菜单
    var curMenu = null;
    var menuObject = null;
    for(var i=0;i<app.menuList.length;i++){
        var menuItem = app.menuList[i];
        if(menuItem.menuId == menuId){
            app.selectMenu.menuNameList.push({
                menuName : menuItem.name,
                menuId : menuId,
                url : menuItem.url
            });
            curMenu = menuItem;
            menuObject = menuItem;
            break;
        }
    }
    if(curMenu != null){
        for(var i=1;i<indexPath.length;i++){
            for(var j=0;j<curMenu.childList.length;j++){
                var menuItem = curMenu.childList[j];
                if(indexPath[i] == menuItem.menuId){
                    app.selectMenu.menuNameList.push({
                        menuName : menuItem.name,
                        menuId : menuItem.menuId,
                        url : menuItem.url
                    });
                    menuObject = menuItem;
                    break;
                }
            }
        }
    }
    app.selectMenu.menuObject = menuObject;
}

/**
 * 判断tag是否存在，
 * 如果存在进行选中；
 * 如果不存在创建新的tag，并进行选中
 * 存储的数据结构
 * {
 *   effect : "dark",//dark,plain
 *   index : "1", 菜单唯一标识
 *   indexPath : ["1"], 唯一标识列表
 *   label : "首页", 菜单名称
 *   url : "/foo", 访问地址
 *   closable : false, 是否可关闭
 *   isSelect : false 是否选中
 * }
 * @param index 菜单的唯一标识
 * @param indexPath 选择的菜单
 */
function createMenuTag(index,indexPath){
    var isExist = false;
    var selectTag = null;
    for(var i=0;i<app.menuTagList.length;i++){
        var item = app.menuTagList[i];
        if(item.index == index){
            isExist = true;
            selectTag = item;
        }
        item.effect = "plain";
        item.isSelect = false;
    }
    if(isExist){
        if(index == 1){
            selectTag.closable = false;
        }
        selectTag.effect = "dark";
        selectTag.isSelect = true;
    }else{
        var tagItem = {
            effect : "dark",//dark,plain
            index : index,
            indexPath : indexPath,
            label : app.selectMenu.menuObject.name,
            url : app.selectMenu.menuObject.url,
            closable : true,
            isSelect : true
        };
        if(index == 1){
            tagItem.closable = true;
        }
        app.menuTagList.push(tagItem);
    }
}

/**
 * 根据菜单的名称查询菜单信息
 * @param menuName 菜单的名称
 */
function searchMenuByName(menuName){
    app.searchMenuList = [];
    for(var i=0;i<app.menuList.length;i++){
        var item = app.menuList[i];
        if(item.name.indexOf(menuName) >= 0){
            if(item.childList.length == 0){
                var similarItem = {
                    name : [item.name],
                    index : item.menuId,
                    indexPath : [item.menuId]
                };
                app.searchMenuList.push(similarItem);
                continue;
            }
        }
        for(var j=0;j<item.childList.length;j++){
            var childItem = item.childList[j];
            if(childItem.name.indexOf(menuName) >= 0){
                var similarItem = {
                    name : [item.name],
                    index : childItem.menuId,
                    indexPath : [item.menuId]
                };
                similarItem.name.push(childItem.name);
                similarItem.indexPath.push(childItem.menuId);
                app.searchMenuList.push(similarItem);
            }
        }
    }
}

window.setTimeout(function(){
    app.menuList = menuData;
    app.btSelectMenu("1","1");
},1000);