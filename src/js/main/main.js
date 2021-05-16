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


const SELECT_MENU_INDEX = "selectMenuIndex";
const SELECT_MENU_PATH = "selectMenuPath";
const MENU_TAG_LIST_NAME = "menuTagList";

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
                menuUrl : "/homePage",
                closable : false,
                tagClassName : "tag_item tag_selected"
            }
        ],
        language : "zh",
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

            if(this.selectMenu.menuObject.menuType === "0"){
                //页面内打开其他页面
                runRouterTo(app.selectMenu.menuNameList[indexPath.length-1].url,app.selectMenu.menuObject.menuId);
            }else if(this.selectMenu.menuObject.menuType === "1"){
                //新的页面打开
                window.open(app.selectMenu.menuNameList[indexPath.length-1].url);
            }

            //存储选择的菜单
            saveSelectMenuFromStorage(index,indexPath);
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
        },
        changeLanguage : function(lang){
            this.language = lang;
            window.language = lang;
        }
    },
    created : function(){

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
function runRouterTo(curRouterTo,menuId){
    if(app.preRouterTo != curRouterTo){
        var routerOption = {
            path : curRouterTo,
            query : {
                menuId : menuId
            }
        };
        router.push(routerOption).catch(function(){});
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
        if(menuItem.index == menuId){
            app.selectMenu.menuNameList.push({
                menuName : menuItem.menuName,
                menuId : menuId,
                url : menuItem.menuUrl
            });
            curMenu = menuItem;
            menuObject = menuItem;
            break;
        }
    }
    if(curMenu != null){
        for(var i=1;i<indexPath.length;i++){
            for(var j=0;j<curMenu.children.length;j++){
                var menuItem = curMenu.children[j];
                if(indexPath[i] == menuItem.index){
                    app.selectMenu.menuNameList.push({
                        menuName : menuItem.menuName,
                        menuId : menuItem.index,
                        url : menuItem.menuUrl
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
 *   tagClassName : "tag_item tag_selected" （选中） 或"tag_item tag_unselected"（未选中）
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
        item.tagClassName = "tag_item tag_unselected";
    }
    if(isExist){
        if(index == 1){
            selectTag.closable = false;
        }
        selectTag.effect = "dark";
        selectTag.isSelect = true;
        selectTag.tagClassName = "tag_item tag_selected";
    }else{
        var tagItem = {
            effect : "dark",//dark,plain
            index : index,
            indexPath : indexPath,
            label : app.selectMenu.menuObject.menuName,
            menuUrl : app.selectMenu.menuObject.menuUrl,
            closable : true,
            isSelect : true,
            tagClassName : "tag_item tag_selected"
        };
        if(index == 1){
            tagItem.closable = true;
        }
        app.menuTagList.push(tagItem);
    }
    //存储menuTagList
    saveMenuTagList(app.menuTagList);
}

/**
 * 根据菜单的名称查询菜单信息
 * @param menuName 菜单的名称
 */
function searchMenuByName(menuName){
    app.searchMenuList = [];
    for(var i=0;i<app.menuList.length;i++){
        var item = app.menuList[i];
        if(item.menuName.indexOf(menuName) >= 0){
            if(item.children.length == 0){
                var similarItem = {
                    name : [item.menuName],
                    index : item.index,
                    indexPath : [item.index]
                };
                app.searchMenuList.push(similarItem);
                continue;
            }
        }
        for(var j=0;j<item.children.length;j++){
            var childItem = item.children[j];
            if(childItem.menuName.indexOf(menuName) >= 0){
                var similarItem = {
                    name : [item.menuName],
                    index : childItem.index,
                    indexPath : [item.index]
                };
                similarItem.name.push(childItem.menuName);
                similarItem.indexPath.push(childItem.index);
                app.searchMenuList.push(similarItem);
            }
        }
    }
}

//获取菜单
var getMenuUrl = config.domain + config.project + "/action/user/webUserInfo";
new formRequest(getMenuUrl,{},function(){

},function(data){
    if(data.code === '0000'){
        app.menuList = data.data.menuList;

        let menuTagList = getMenuTagList();
        if(menuTagList != null){
            app.menuTagList = menuTagList;
        }

        let menu = getSelectMenuFromStorage();
        if(menu == null){
            app.btSelectMenu("1","1");
        }else{
            app.btSelectMenu(menu.index,menu.indexPath);
        }
    }else{
        app.$alert('登录异常，请重新登录！', {
            confirmButtonText: '确定',
            callback: function(){
                window.location.href = "./index.html";
            }
        });
    }
});

/**
 * 将当前选择的菜单存入seesionStorage
 * @param index 菜单索引
 * @param indexPath 菜单的路径
 */
function saveSelectMenuFromStorage(index, indexPath){
    sessionStorage.setItem(SELECT_MENU_INDEX,index);
    sessionStorage.setItem(SELECT_MENU_PATH,JSON.stringify(indexPath))
}

/**
 * 获取存储的菜单的索引和菜单的路径
 * @returns
 * {
 *           "index" : index,
 *          "indexPath" : indexPath
 *  }
 */
function getSelectMenuFromStorage(){
    let index = sessionStorage.getItem(SELECT_MENU_INDEX);
    let indexPath = sessionStorage.getItem(SELECT_MENU_PATH);

    if((index == null || index == "") || (indexPath == null || indexPath == "")){
        return null;
    }else{
        return {
            "index" : index,
            "indexPath" : JSON.parse(indexPath)
        }
    }
}

/**
 * 存储菜单标签的列表
 * @param menuTagList 当前显示的菜单列表
 */
function saveMenuTagList(menuTagList){
    let strMenuTagList = JSON.stringify(menuTagList);
    sessionStorage.setItem(MENU_TAG_LIST_NAME,strMenuTagList);
}

/**
 * 获取之前存储的菜单标签列表
 * @returns {*}
 */
function getMenuTagList(){
    let menuTagList = sessionStorage.getItem(MENU_TAG_LIST_NAME);
    if(menuTagList == null || menuTagList == ""){
        return null;
    }
    return JSON.parse(menuTagList);
}

