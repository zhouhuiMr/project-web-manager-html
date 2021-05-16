<template>
    <div class="plug_search_span" ref="searchSpan">
        <div class="plug_search_top" ref="topSpan">
            <!-- 查询条件组件 -->
            <div class="plug_search_main" ref="mainSpan">
                <div class="plug_search_item_span" v-if="isShowSearchItem">
                    <slot name="searchItem"></slot>
                </div>
                <div class="plug_search_pull" @click="foldSearchSpan">
                    <i :class="pullObject.bt_pull"></i>
                </div>
            </div>
            <!-- 其他一些组件 -->
            <div class="plug_search_tool" ref="toolSpan" v-if="plugIsShowTool">
                <slot name="searchTool"></slot>
            </div>
        </div>

        <!-- table列表-->
        <div class="plug_search_table" ref="plugTableSpan">
            <div class="plug_table_span">
                <slot name="searchTable"></slot>
            </div>
        </div>


        <!-- 分页组件 -->
        <div class="plug_search_page" v-if="isShowPagePlug" ref="pageSpan">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :current-page="pagePlug.currentPage"
                    :page-sizes="pagePlug.pageSizes"
                    :page-size="pagePlug.pageSize"
                    pager-count="5"
                    :layout="pagePlug.pageLayout"
                    :total="pagePlug.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name : "SearchSpan",
        props : {
            currentPage : {
                type : Number,
                default : 1
            },
            total : {
                type : Number,
                default : 0
            },
            pageSizes : {
                type : Array,
                default : [10,50,100,150,200]
            },
            pageSize : {
                type : Number,
                default : 50
            },
            sizeChange : {
                type : Function,
                default : function(){}
            },
            currentChange : {
                type : Function,
                default : function(){}
            },
            pageLayout : {
                type : String,
                default : "total, sizes, prev, pager, next, jumper"
            },
            isShowTool : {
                type : Boolean,
                default : false
            }
        },
        data : function(){
            return {
                pullObject : {
                    bt_pull : "fa fa-angle-up",
                    isFold : true // true已展开；false未展开
                },
                isShowSearchItem : true,
                isShowPagePlug : true,
                pagePlug : {
                    currentPage : this.currentPage,
                    pageSizes : this.pageSizes,
                    pageSize : this.pageSize,
                    total : this.total,
                    pageLayout : this.pageLayout
                },
                plugIsShowTool : this.isShowTool,
                tableHeight : 0,
            }
        },
        methods : {
            foldSearchSpan : function(){
                if(this.pullObject.isFold){
                    this.pullObject.bt_pull = "fa fa-angle-down";
                    this.pullObject.isFold = false;
                    this.isShowSearchItem = false;
                }else{
                    this.pullObject.bt_pull = "fa fa-angle-up";
                    this.pullObject.isFold = true;
                    this.isShowSearchItem = true;
                }
            }
        },
        mounted : function(){
            if(this.pagePlug.total > 0){
                this.isShowPagePlug = true;
            }else{
                this.isShowPagePlug = false;
            }
            this.tableHeight = calcTableHeight(this);
        },
        watch : {
            total(val,oldVal){
                this.pagePlug.total = val;
                if(this.pagePlug.total > 0){
                    this.isShowPagePlug = true;
                }else{
                    this.isShowPagePlug = false;
                }
            },
            pageSize(val,oldVal){
                this.pagePlug.pageSize = val;
            },
            currentPage(val,oldVal){
                this.pagePlug.currentPage = val;
            },
            isShowTool(val,oldVal){
                this.plugIsShowTool = val;
            },
            pageLayout(val,oldVal){
                this.pagePlug.pageLayout = val;
            }
        }
    }

    function calcTableHeight(obj){
        //总容器的高度
        var height = 0;
        if( typeof obj.$refs["searchSpan"] != "undefined" ){
            height = obj.$refs["searchSpan"].offsetHeight;
        }else{
            height = 0;
        }
        //查询条件容器高度
        var topSpanHeight = 0;
        if(typeof obj.$refs["topSpan"] != "undefined"){
            topSpanHeight = obj.$refs["topSpan"].offsetHeight
        }else{
            topSpanHeight = 0;
        }
        //分页容器高度
        var pageSpanHeight = 0;
        if(typeof obj.$refs["pageSpan"] != "undefined"){
            pageSpanHeight = obj.$refs["pageSpan"].offsetHeight;
        }else{
            pageSpanHeight = 0;
        }
        var tableHeigth = height - topSpanHeight - pageSpanHeight - 15;
        return tableHeigth;
    }
</script>

<style scoped>
    .plug_search_span{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        color: #606266;
        border: none;
    }
    .plug_search_span .plug_search_top{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: auto;
    }
    .plug_search_span .plug_search_top .plug_search_main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: auto;
    }
    .plug_search_main .plug_search_item_span{
        display: flex;
        flex-direction: row;
        width: 99%;
        height: auto;
        margin-right: auto;
        margin-left: auto;
        margin-top: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }
    .plug_search_main .plug_search_pull{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 16px;
        cursor: pointer;
        font-size: 18px;
        color: #606266;
        border-bottom: 1px solid #EBEEF5;
        box-shadow: 0 1px 4px rgba(0,21,41,0.08);
        z-index: 10
    }
    .plug_search_top .plug_search_tool{
        display: flex;
        flex-direction: row;
        width: 99%;
        height: 30px;
        margin-right: auto;
        margin-left: auto;
        margin-top: 8px;
        margin-bottom: 5px;
    }

    .plug_search_span .plug_search_table{
        display: flex;
        width: 99%;
        height: 100%;
        margin-right: auto;
        margin-left: auto;
        margin-top: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }
    .plug_search_table .plug_table_span{
        width: 100%;
        height: auto;
        overflow: hidden;
    }
    .plug_search_span .plug_search_page{
        display: flex;
        align-self: flex-end;
        width: 99%;
        height: 35px;
        margin-right: auto;
        margin-left: auto;
        margin-bottom: 5px;
    }

</style>