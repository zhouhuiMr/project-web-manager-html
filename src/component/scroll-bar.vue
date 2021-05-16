<template>
    <div class="scrollbar-span" @mouseenter="scrollEnter" @mouseleave="scrollMouseLeave"
         ref="scrollBarRef" @mousemove="thumbMouseMove" @mouseup="thumbMouseUp"
         :style="scrollStyle">
        <div class="scrollbar-content-span" ref="scrollContentRef" @scroll="scrollWheel"
             :style="scrollSpanStyle">
            <div class="scrollbar-content-scroll" ref="scrollContentScrollRef">
                <slot></slot>
            </div>
        </div>
        <!--   水平   -->
        <transition name="horizontal-thumb">
            <div class="scrollbar-bar scrollbar-horizontal" v-if="setIsHorizontal">
                <div class="scrollbar-bar-thumb"
                     :style="{width : barThumbHorizontal + '%',height : thumbHeight + 'px',
                     transform : 'translateX('+ horizontalW +'px)',backgroundColor : h_thumbColor}"
                     ref="horizontalThumbRef" @mousedown="thumbMouseDown($event,'horizontal')">
                </div>
            </div>
        </transition>
        <!--   垂直   -->
        <transition name="vertical-thumb">
            <div class="scrollbar-bar scrollbar-vertical" v-if="setIsVertical">
                <div class="scrollbar-bar-thumb"
                     :style="{height : barThumbVertical + '%',width : thumbWidth + 'px',
                     transform : 'translateY('+ verticalH +'px)',backgroundColor : v_thumbColor}"
                     ref="verticalThumbRef" @mousedown="thumbMouseDown($event,'vertical')">
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import elementResizeDetectorMaker from 'element-resize-detector'

    export default {
        name: "ScollBar",
        props : {
            isShowHorizontal : {
                type : Boolean,
                default : false //水平
            },
            isShowVertical : {
                type : Boolean,
                default : false //垂直
            },
            thumbColor : {
                type : String,
                default : "#8c939d" //按钮的颜色
            },
            activeThumbColor : {
                type : String,
                default : "#6b7380" //激活后按钮的颜色
            },
            thumbWidth : {
                type : Number,
                default : 10,
            },
            thumbHeight : {
                type : Number,
                default : 10,
            },
            scrollStyle :{
                type : Object,
                default : null //滚动条容器的样式
            },
        },
        data : function() {
            return {
                scrollSpanStyle : {
                    width : "100%",
                    height : "100%",
                    paddingRight : "18px",
                    paddingBottom : "0px",
                    overflowX : "scroll",
                    overflowY : "scroll"
                },

                setIsHorizontal : false,
                setIsVertical : false,
                //是否使用显示水平、垂直滚动条
                setShowHorizontal : this.isShowHorizontal,
                setShowVertical : this.isShowVertical,

                //水平滑块
                barThumbHorizontal : 0,
                horizontalW : 0,

                //垂直滑块
                barThumbVertical : 0,
                verticalH : 0,

                setThumbColor : this.thumbColor,
                setActiveThumbColor : this.activeThumbColor,

                h_thumbColor : this.thumbColor,
                v_thumbColor : this.thumbColor,

                isMouseDown : false,
                thumbMoveObject : {
                    type : "",
                    preX : "",
                    preY : "",
                }
            }
        },
        methods : {
            scrollWheel :  function(event){
                if(this.setShowVertical){
                    //垂直滚动条
                    let verticalOption = calcScollHeight(this);
                    if(verticalOption != null){
                        let v_scrollTop = this.$refs["scrollContentRef"].scrollTop;
                        this.verticalH = v_scrollTop / verticalOption.v_canScroll * verticalOption.v_canMove;
                        this.setIsVertical = true;
                    }
                }
                if(this.setShowHorizontal){
                    //水平滚动条
                    let horizontalOption = calcScollWidth(this);
                    if(horizontalOption != null){
                        let v_scrollLeft = this.$refs["scrollContentRef"].scrollLeft;
                        this.horizontalW = v_scrollLeft / horizontalOption.v_canScroll * horizontalOption.v_canMove;
                        this.setIsVertical = true;
                    }
                }
            },
            scrollEnter : function(){
                if(this.setShowVertical){
                    let verticalOption = compareVerticalSize(this);
                    if(verticalOption.isShowScroll){
                        this.setIsVertical = true;
                        this.v_thumbColor = this.setThumbColor;
                        this.isMouseDown = false;
                    }
                }
                if(this.setShowHorizontal){
                    let horizontalOption = comparehorizontalSize(this);
                    if(horizontalOption.isShowScroll){
                        this.setIsVertical = true;
                        this.h_thumbColor = this.setThumbColor;
                        this.isMouseDown = false;
                    }
                }
            },
            scrollMouseLeave : function(){
                this.setIsVertical = false;
                this.v_thumbColor = this.setThumbColor;
                this.h_thumbColor = this.setThumbColor;
                this.isMouseDown = false;

                this.thumbMoveObject.type = "";
                this.thumbMoveObject.preX = 0;
                this.thumbMoveObject.preY = 0;
            },
            thumbMouseDown : function(event,type){
                if(type === 'vertical'){
                    this.v_thumbColor = this.setActiveThumbColor;
                    this.isMouseDown = true;
                    this.thumbMoveObject = {
                        type : type,
                        preX : event.clientX,
                        preY : event.clientY
                    };
                }else{
                    this.h_thumbColor = this.setActiveThumbColor;
                    this.isMouseDown = true;
                    this.thumbMoveObject = {
                        type : type,
                        preX : event.clientX,
                        preY : event.clientY
                    };
                }
            },
            thumbMouseUp : function(){
                this.v_thumbColor = this.setThumbColor;
                this.h_thumbColor = this.setThumbColor;
                this.isMouseDown = false;
            },
            thumbMouseMove : function(event){
                if(this.isMouseDown){
                    if(this.thumbMoveObject.type === "vertical"){
                        let verticalOption = calcScollHeight(this);
                        let moveDistance = event.clientY - this.thumbMoveObject.preY;
                        this.$refs["scrollContentRef"].scrollTop += moveDistance * verticalOption.v_canScroll / verticalOption.v_canMove;
                        this.thumbMoveObject.preY = event.clientY;
                    }else{
                        let horizontalOption = calcScollWidth(this);
                        let moveDistance = event.clientX - this.thumbMoveObject.preX;
                        this.$refs["scrollContentRef"].scrollLeft += moveDistance * horizontalOption.v_canScroll / horizontalOption.v_canMove;
                        this.thumbMoveObject.preX = event.clientX;
                    }
                }
            }
        },
        mounted : function(){
            let obj = this;
            let erd = elementResizeDetectorMaker();
            erd.listenTo(document.querySelector(".scrollbar-content-scroll"), function(element) {
                if(obj.setShowVertical){
                    setBarThumbVertical(obj);
                }
                if(obj.setShowHorizontal){
                    setBarThumbHorizontal(obj);
                }
            });

            erd.listenTo(document.querySelector(".scrollbar-span"), function(element) {
                if(obj.setShowVertical){
                    setBarThumbVertical(obj);
                }
                if(obj.setShowHorizontal){
                    setBarThumbHorizontal(obj);
                }
            });

            //垂直滚动条
            if(this.setShowVertical){
                this.scrollSpanStyle.width = "100%";
                this.scrollSpanStyle.overflowY = "scroll";
                this.scrollSpanStyle.paddingRight = "18px";
                this.setIsVertical = true;
            }else{
                this.scrollSpanStyle.width = "100%";
                this.scrollSpanStyle.overflowY = "hidden";
                this.scrollSpanStyle.paddingRight = "0px";
                this.setIsVertical = false;
            }
            //水平滚动条
            if(this.setShowHorizontal){
                this.scrollSpanStyle.height = "100%";
                this.scrollSpanStyle.overflowX = "scroll";
                this.scrollSpanStyle.paddingBottom = "18px";
                this.setIsHorizontal = true;
            }else{
                this.scrollSpanStyle.height = "100%";
                this.scrollSpanStyle.overflowX = "hidden";
                this.scrollSpanStyle.paddingBottom = "0px";
                this.setIsHorizontal = false;
            }
        }
    }

    /**
     * 设置垂直滚动条的高度
     * @param obj Vue实例化对象
     */
    function setBarThumbVertical(obj){
        let verticalOption = compareVerticalSize(obj);
        if(verticalOption.isShowScroll){
            //显示滚动条
            obj.setIsVertical = true;
            obj.barThumbVertical =  verticalOption.v_scrollBarHeight / verticalOption.v_scrollContentHeight * 100;
        }else{
            obj.setIsVertical = false;
        }
    }

    /**
     * 设置垂直滚动条的高度
     * @param obj Vue实例化对象
     */
    function setBarThumbHorizontal(obj){
        let horizontalOption = comparehorizontalSize(obj);
        if(horizontalOption.isShowScroll){
            //显示滚动条
            obj.setIsHorizontal = true;
            obj.barThumbHorizontal =  horizontalOption.v_scrollBarWidth / horizontalOption.v_scrollContentWidth * 100;
        }else{
            obj.setIsHorizontal = false;
        }
    }

    /**
     * 垂直滚动条
     * 1、计算可以滚动高度；
     * 2、计算滑块可以上下移动的长度；
     *
     * @param obj vue对象
     * @return 处理结果
     */
    function calcScollHeight(obj){
        let verticalOption = compareVerticalSize(obj);
        if( verticalOption.isShowScroll ){
            if(obj.$refs["verticalThumbRef"] != null && obj.$refs["scrollContentRef"] != null){
                let v_thumbHeight = obj.$refs["verticalThumbRef"].offsetHeight;
                let v_canScroll = verticalOption.v_scrollContentHeight - verticalOption.v_scrollBarHeight;
                let v_canMove = verticalOption.v_scrollBarHeight - v_thumbHeight;
                let option = {
                    isShowScroll : verticalOption.isShowScroll,
                    v_scrollBarHeight : verticalOption.v_scrollBarHeight,//外层容器的高度
                    v_scrollContentHeight : verticalOption.v_scrollContentHeight,//滚动内容总高度
                    v_canScroll : v_canScroll,//滚动内容的高度
                    v_canMove : v_canMove//滑块移动的高度
                };
                return option;
            }
        }
        return null;
    }

    /**
     * 水平滚动条
     * 1、计算可以滚动高度；
     * 2、计算滑块可以上下移动的长度；
     *
     * @param obj vue对象
     * @return 处理结果
     */
    function calcScollWidth(obj){
        let horizontalOption = comparehorizontalSize(obj);
        if( horizontalOption.isShowScroll ){
            if(obj.$refs["verticalThumbRef"] != null && obj.$refs["scrollContentRef"] != null){
                let v_thumbWidth = obj.$refs["horizontalThumbRef"].offsetWidth;
                let v_canScroll = horizontalOption.v_scrollContentWidth - horizontalOption.v_scrollBarWidth;
                let v_canMove = horizontalOption.v_scrollBarWidth - v_thumbWidth;
                let option = {
                    isShowScroll : horizontalOption.isShowScroll,
                    v_scrollBarWeight : horizontalOption.v_scrollBarWidth,//外层容器的长度
                    v_scrollContentWeight : horizontalOption.v_scrollContentWidth,//滚动内容总长度
                    v_canScroll : v_canScroll,//滚动内容的长度
                    v_canMove : v_canMove//滑块移动的长度
                };
                return option;
            }
        }
        return null;
    }

    /**
     * 判断在“垂直”方向上容器的大小，
     *
     * @return 如果内容面板大于容器（需要滚动条）返回true，
     * 否则返回false。
     */
    function compareVerticalSize(obj){
        let option = {
            isShowScroll : false,
            v_scrollBarHeight : 0,
            v_scrollContentHeight : 0
        };
        if(obj.$refs["scrollBarRef"] == null || obj.$refs["scrollContentScrollRef"] == null ){
            return option;
        }

        let v_scrollBarHeight = obj.$refs["scrollBarRef"].offsetHeight;//最外层容器大小
        let v_scrollContentHeight = obj.$refs["scrollContentScrollRef"].scrollHeight;//内部容器大小
        option = {
            isShowScroll : false,
            v_scrollBarHeight : v_scrollBarHeight,
            v_scrollContentHeight : v_scrollContentHeight
        };
        if(v_scrollBarHeight < v_scrollContentHeight){
            option.isShowScroll = true;
            return option
        }else{
            option.isShowScroll = false;
            return option;
        }
    }

    /**
     * 判断在“水平”方向上容器的大小，
     *
     * @return 如果内容面板大于容器（需要滚动条）返回true，
     * 否则返回false。
     */
    function comparehorizontalSize(obj){
        let option = {
            isShowScroll : false,
            v_scrollBarWidth : 0,
            v_scrollContentWidth : 0
        };
        if(obj.$refs["scrollBarRef"] == null || obj.$refs["scrollContentScrollRef"] == null ){
            return option;
        }
        let v_scrollBarWidth = obj.$refs["scrollBarRef"].offsetWidth;//最外层容器大小
        let v_scrollContentWidth = obj.$refs["scrollContentScrollRef"].scrollWidth;//内部容器大小
        option = {
            isShowScroll : false,
            v_scrollBarWidth : v_scrollBarWidth,
            v_scrollContentWidth : v_scrollContentWidth
        };
        if(v_scrollBarWidth < v_scrollContentWidth){
            option.isShowScroll = true;
            return option
        }else{
            option.isShowScroll = false;
            return option;
        }
    }

</script>

<style>
    .scrollbar-span{
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        user-select : none;
    }
    .scrollbar-span .scrollbar-content-span{
        position: relative;
    }
    .scrollbar-content-span .scrollbar-content-scroll{
        width: calc(100% + 18px);
    }

    .scrollbar-span .scrollbar-bar{
        position: absolute;
        z-index: 10;
    }
    .scrollbar-span .scrollbar-vertical{
        width: 10px;
        height: 100%;
        top: 0px;
        right: 0px;
    }
    .scrollbar-span  .scrollbar-horizontal{
        width: 100%;
        height: 10px;
        bottom: 0px;
        left: 0px;
    }
    .scrollbar-horizontal .scrollbar-bar-thumb{
        height: 100%;
        border-radius: 4px;
        background-color: #8c939d;
        cursor: pointer;
    }
    .scrollbar-vertical .scrollbar-bar-thumb{
        width: 100%;
        height: 0px;
        border-radius: 4px;
        background-color: #8c939d;
        cursor: pointer;
    }

    .vertical-thumb-enter-active, .vertical-thumb-leave-active,
    .horizontal-thumb-enter-active, .horizontal-thumb-leave-active{
        transition : opacity 0.5s;
    }
    .vertical-thumb-enter, .vertical-thumb-leave-to,
    .horizontal-thumb-enter, .horizontal-thumb-leave-to
    {
        opacity : 0;
    }
</style>