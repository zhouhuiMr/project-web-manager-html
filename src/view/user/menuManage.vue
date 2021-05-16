<template>
    <div class="menu_manage_span">
        <search-span
                :current-page="menuSearchCondition.page"
                :page-size="menuSearchCondition.pageSize"
                :total="dataTotal"
                :isShowTool="isShowTool"
                :size-change="handleSizeChange" :current-change="handleCurrentChange">
            <template v-slot:searchItem>
                <div class="search_item_span">
                <el-input size="mini" v-model="menuSearchCondition.menuName"
                          placeholder="请输入菜单名称" clearable></el-input>
            </div>
                <div class="search_item_span">
                    <el-select v-model="menuSearchCondition.parentId" placeholder="请选择一级菜单"
                               size="mini" clearable>
                        <el-option
                                v-for="item in parentList"
                                :key="item.menuId"
                                :label="item.menuName"
                                :value="item.menuId">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item_span">
                    <el-select v-model="menuSearchCondition.menuLevel" placeholder="请选择菜单级别"
                               size="mini" clearable>
                        <el-option
                                v-for="item in menuLevelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item_span">
                    <el-select v-model="menuSearchCondition.menuScope" placeholder="请选择适用范围"
                               size="mini" clearable>
                        <el-option
                                v-for="item in menuScopeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item_span">
                    <el-button icon="el-icon-search" size="mini" type="primary" @click="searchData">查询</el-button>
                </div>
            </template>

            <template v-slot:searchTool>
                <div class="bt_tool_span">
                    <el-button icon="el-icon-plus" size="mini"
                               type="primary" v-if="btOption.btSave.isAllow == '1'"
                               @click="insertData">新增菜单</el-button>
                    <!--<el-button icon="el-icon-edit" size="mini" type="primary" v-if="btOption.btUpdate.isAllow == '1'">编辑菜单</el-button>-->
                    <!--<el-button icon="el-icon-delete" size="mini" type="primary" v-if="btOption.btUpdateStatus.isAllow == '1'">删除菜单</el-button>-->
                </div>
            </template>

            <template v-slot:searchTable>
                <el-table class="my_scroller_style"
                          :data="menuList"
                          @expand-change="tableRowExpand"
                          size="small" height="100%" style="width: 100%;">

                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="expand_span">
                                <div class="expand_span_main">
                                    <el-table
                                            :data="props.row.requestList"
                                            style="width: 100%"
                                            size="small"
                                            border
                                            v-loading="requestListLoading"
                                            element-loading-text="加载中"
                                            element-loading-spinner="el-icon-loading"
                                            element-loading-background="rgba(255, 255, 255, 0.8)"
                                            :show-header="true">
                                        <el-table-column
                                                align="center"
                                                type="index"
                                                width="50">
                                        </el-table-column>
                                        <el-table-column
                                                align="left"
                                                header-align="center"
                                                prop="requestUrl"
                                                label="请求地址"
                                                min-width="260">
                                        </el-table-column>
                                        <el-table-column
                                                align="left"
                                                header-align="center"
                                                prop="btName"
                                                label="按钮名称"
                                                width="180">
                                        </el-table-column>
                                        <el-table-column
                                                align="center"
                                                prop="btDescribe"
                                                label="描述"
                                                min-width="120">
                                        </el-table-column>
                                        <el-table-column
                                                align="center"
                                                label="操作"
                                                width="160">
                                            <template slot="header" slot-scope="menuScope">
                                                <el-button type="primary" size="mini" :disabled="!(btOption.btSaveRequest.isAllow == '1')"
                                                           @click="saveRequest(props.row)" style="width: 120px">新增</el-button>
                                            </template>
                                            <template slot-scope="menuScope">
                                                <el-button size="mini" :disabled="!(btOption.btUpdateRequest.isAllow == '1')"
                                                           @click="updateRequest(menuScope.$index, menuScope.row, props.row)">编辑</el-button>
                                                <el-button size="mini" type="danger"  :disabled="!(btOption.btUpdateRequestStatus.isAllow == '1')"
                                                           @click="updateRequestStatus(menuScope.$index, menuScope.row, props.row)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                            align="center"
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="parentMenuName"
                            label="父级菜单"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="menuName"
                            label="菜单名称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="icon"
                            label="菜单图标"
                            width="80">
                        <template slot-scope="scope">
                            <i :class="scope.row.icon" style="font-size: 20px"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="menuLevelName"
                            label="菜单级别"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="menuOrder"
                            label="菜单序号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="menuUrl"
                            label="菜单地址"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="menuScopeName"
                            label="适应范围"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="menuTypeName"
                            label="展开方式"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作"
                            width="160">
                        <template slot-scope="scope">
                            <el-button size="mini" :disabled="!(btOption.btUpdate.isAllow == '1')"
                                       @click="updateData(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger"  :disabled="!(btOption.btUpdateStatus.isAllow == '1')"
                                       @click="updateDataStatus(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </search-span>

        <el-dialog
                :title="dialogOption.dialogTitle"
                :visible="dialogOption.isShow"
                :append-to-body="false"
                @close="dialogClose"
                :before-close="dialogBeforeClose"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="450px">
            <el-form ref="menuForm" :model="dataForm" :rules="dataRules" label-width="80px" size="mini">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="dataForm.menuName" placeholder="请填写菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                    <el-input v-model="dataForm.icon" placeholder="请填写菜单图标">
                        <el-button icon="el-icon-search" slot="append" @click="openSearchIcon"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="菜单级别" prop="menuLevel">
                    <el-select v-model="dataForm.menuLevel" placeholder="请选择菜单级别"
                               size="mini" @change="menuFormChangeLevel">
                        <el-option
                                v-for="item in menuLevelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="dataForm.menuLevel=='1'">
                    <el-form-item label="父级菜单">
                        <el-select v-model="dataForm.parentId" placeholder="请选择父级菜单"
                                   size="mini" :disabled="true">
                            <el-option
                                    v-for="item in parentList"
                                    :key="item.menuId"
                                    :label="item.menuName"
                                    :value="item.menuId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="父级菜单" prop="parentId">
                        <el-select v-model="dataForm.parentId" placeholder="请选择父级菜单"
                                   size="mini" :disabled="false">
                            <el-option
                                    v-for="item in parentList"
                                    :key="item.menuId"
                                    :label="item.menuName"
                                    :value="item.menuId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>

                <template v-if="dataForm.menuLevel=='1'">
                    <el-form-item label="菜单地址">
                        <el-input v-model="dataForm.menuUrl" placeholder="请填写菜单地址"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="菜单地址" prop="menuUrl">
                        <el-input v-model="dataForm.menuUrl" placeholder="请填写菜单地址"></el-input>
                    </el-form-item>
                </template>

                <el-form-item label="适应范围" prop="menuScope">
                    <el-select v-model="dataForm.menuScope" placeholder="请选择适应范围"
                               size="mini">
                        <el-option
                                v-for="item in menuScopeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="展开方式" prop="menuType">
                    <el-select v-model="dataForm.menuType" placeholder="请选择展开方式"
                               size="mini">
                        <el-option
                                v-for="item in menuTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单排序" prop="menuOrder">
                    <el-input-number v-model="dataForm.menuOrder"
                                     :min="1" :max="99" ></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogCancel">取 消</el-button>
                <el-button size="mini" type="primary" @click="dialogSave">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :title="requestOption.dialogTitle"
                :visible="requestOption.isShow"
                :append-to-body="false"
                @close="requestDialogClose"
                :before-close="requestDialogBeforeClose"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="450px">
            <el-form ref="requestForm" :model="requestDataForm" :rules="requestDataRules" label-width="80px" size="mini">
                <el-form-item label="请求地址" prop="requestUrl">
                    <el-input v-model="requestDataForm.requestUrl" placeholder="请填写请求地址"></el-input>
                </el-form-item>
                <el-form-item label="按钮名称" prop="btName">
                    <el-input v-model="requestDataForm.btName" placeholder="请填写按钮名称"></el-input>
                </el-form-item>
                <el-form-item label="内容描述" prop="btDescribe">
                    <el-input v-model="requestDataForm.btDescribe" placeholder="请填写内容描述"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="requestDialogCancel">取 消</el-button>
                <el-button size="mini" type="primary" @click="requestDialogSave">保存</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    import SearchSpan from '../../component/search-span.vue';

    export default {
        data : function(){
            return {
                btOption : {
                    btSave : {
                        btDescribe: "",
                        btName: "btSave",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    },
                    btUpdate : {
                        btDescribe: "",
                        btName: "btUpdate",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    },
                    btUpdateStatus : {
                        btDescribe: "",
                        btName: "btUpdateStatus",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    },
                    btSaveRequest : {
                        btDescribe: "",
                        btName: "btSaveRequest",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    },
                    btUpdateRequest : {
                        btDescribe: "",
                        btName: "btUpdateRequest",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    },
                    btUpdateRequestStatus : {
                        btDescribe: "",
                        btName: "btUpdateRequestStatus",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    }
                },
                parentList : [],
                menuLevelList : [
                    {"value": 1,"label":"一级菜单"},
                    {"value": 2,"label":"二级菜单"}
                ],
                menuScopeList :  [
                    {"value":"0","label":"客户端"},
                    {"value":"1","label":"管理端"}
                ],
                menuTypeList : [
                    {"value":"0","label":"当前页面"},
                    {"value":"1","label":"新页签"}
                ],
                menuSearchCondition : {
                    menuName : "",
                    menuLevel : "",
                    parentId : null,
                    menuScope : "",
                    page : 1,
                    pageSize : 50
                },
                menuList : [],//菜单列表
                dataTotal : 0,//总数据量
                isShowTool : false,//true显示；false不显示
                dialogOption : {
                    dialogTitle : "",//弹窗名称
                    isShow : false,//true显示；false不显示
                    dialogType : 0,//0、新增；1、编辑
                },
                dataForm : {
                    menuName : "",
                    icon : "",
                    menuLevel : "",
                    menuScope : "",
                    menuType : "",
                    parentId : null,
                    menuUrl : "",
                    menuOrder : 1
                },
                dataRules : {
                    menuName : [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    menuLevel : [
                        { required: true, message: '请选择菜单级别', trigger: 'blur' }
                    ],
                    parentId : [
                        { required: true, message: '请选择父级菜单', trigger: 'blur' }
                    ],
                    menuUrl : [
                        { required: true, message: '请填写页面地址', trigger: 'blur' }
                    ],
                    menuScope : [
                        { required: true, message: '请选择适应范围', trigger: 'blur' }
                    ],
                    menuType : [
                        { required: true, message: '请选择页面展开方式', trigger: 'blur' }
                    ],
                    menuOrder : [
                        { required: true, message: '请设置菜单的序号', trigger: 'blur' }
                    ]
                },
                expandMenuData : null,
                requestOption : {
                    dialogTitle : "",//弹窗名称
                    isShow : false,//true显示；false不显示
                    dialogType : 0,//0、新增；1、编辑
                },
                requestDataForm : {
                    requestId : 0,
                    menuId : 0,
                    requestUrl : "",
                    btName : "",
                    btDescribe : ""
                },
                requestDataRules : {
                    requestUrl : [
                        { required: true, message: '请填写请求地址', trigger: 'blur' }
                    ]
                },
                requestListLoading : false,
            }
        },
        methods : {
            searchData : function(){
                this.menuSearchCondition.page = 1;
                getParentList(this,this.menuSearchCondition,"2");
            },
            handleSizeChange : function(val){
                this.menuSearchCondition.pageSize = val;
                this.menuSearchCondition.page = 1;
                getParentList(this,this.menuSearchCondition,"2");
            },
            handleCurrentChange : function(val){
                this.menuSearchCondition.page = val;
                getParentList(this,this.menuSearchCondition,"2");
            },
            insertData : function(){
                this.dialogOption.dialogType = 0;
                this.dialogOption.dialogTitle = "新增菜单";
                this.dialogOption.isShow = true;
            },
            updateData : function(index,row){
                this.dialogOption.dialogType = 1;
                this.dialogOption.dialogTitle = "编辑菜单";
                this.dialogOption.isShow = true;

                this.dataForm = {
                    menuId : row.menuId,
                    menuName : row.menuName,
                    icon : row.icon,
                    menuLevel : row.menuLevel,
                    menuScope : row.menuScope,
                    menuType : row.menuType,
                    parentId : row.parentId,
                    menuUrl : row.menuUrl,
                    menuOrder : row.menuOrder
                };
                if(row.parentId == -1){
                    this.dataForm.parentId = null;
                }
            },
            updateDataStatus : function(index,row){
                var obj = this;
                var confirmMessage = "是否删除当前选择的菜单：" + row.menuName + "?";
                this.$confirm(confirmMessage).then(function(){
                    const param = {
                        menuId : row.menuId,
                        status : "1"
                    };
                    updateMenuStatus(obj,param);
                }).catch(function(){

                });
            },
            dialogClose : function(){
                //清除弹出框数据
                this.dataForm = {
                    menuId : 0,
                    menuName : "",
                    icon : "",
                    menuLevel : "",
                    menuScope : "",
                    menuType : "",
                    parentId : null,
                    menuUrl : "",
                    menuOrder : 1
                };
                this.$refs["menuForm"].clearValidate();
            },
            dialogCancel : function(){
                dialogCloseTips(this);
            },
            dialogSave : function(){
                var obj = this;
                this.$refs["menuForm"].validate(function(valid){
                    if (valid) {
                        if(obj.dialogOption.dialogType == 0){
                            //保存
                            const confirmMessage = "是否保存新增的数据？";
                            obj.$confirm(confirmMessage).then(function(){
                                insertMenu(obj,obj.dataForm);
                            }).catch(function(){insert

                            });
                        }else if(obj.dialogOption.dialogType == 1){
                            //编辑
                            const confirmMessage = "是否提交修改的数据？";
                            obj.$confirm(confirmMessage).then(function(){
                                updateMenu(obj,obj.dataForm);
                            }).catch(function(){

                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            dialogBeforeClose : function(done){
                dialogCloseTips(this);
            },
            openSearchIcon : function(){
                window.open("https://fa5.dashgame.com/#/图标");
            },
            menuFormChangeLevel : function(){
                //选择一级菜单设置父级菜单选项为空
                if(this.dataForm.menuLevel == "1"){
                    this.dataForm.parentId = null;
                    this.$refs["menuForm"].clearValidate();
                }
            },
            tableRowExpand : function(row,expandedRows){
                if(!row.isExpand){
                    getRequestList(this,row);
                    row.isExpand = true;
                }else{
                    row.isExpand = false;
                    //清空数据内容
                    row["requestList"].splice(0,row["requestList"].length);
                }

            },
            saveRequest : function(row){
                this.expandMenuData = row;
                this.requestOption.dialogType = 0;
                this.requestOption.dialogTitle = row.menuName + "-新增按钮";
                this.requestOption.isShow = true;
            },
            updateRequest : function(index,row, menu){
                this.expandMenuData = menu;
                this.requestOption.dialogType = 1;
                this.requestOption.dialogTitle = menu.menuName + "-编辑按钮";
                this.requestOption.isShow = true;

                this.requestDataForm = {
                    requestId : row.requestId,
                    menuId : menu.menuId,
                    requestUrl : row.requestUrl,
                    btName : row.btName,
                    btDescribe : row.btDescribe
                }
            },
            updateRequestStatus : function(index,row,menuObject){
                var obj = this;
                var confirmMessage = "是否删除当前选择的按钮或请求地址";
                this.$confirm(confirmMessage).then(function(){
                    const param = {
                        requestId : row.requestId,
                        status : "1"
                    };
                    updateRequestStatus(obj,param,menuObject);
                }).catch(function(){

                });
            },
            requestDialogClose : function(){
                this.expandMenuData = null;
                this.requestDataForm = {
                    menuId : 0,
                    requestUrl : "",
                    btName : "",
                    btDescribe : ""
                };
                this.$refs["requestForm"].clearValidate();
            },
            requestDialogBeforeClose : function(){
                requestDialogCloseTips(this);
            },
            requestDialogCancel : function(){
                requestDialogCloseTips(this);
            },
            requestDialogSave : function(){
                var obj = this;
                this.$refs["requestForm"].validate(function(valid){
                    if (valid) {
                        if(obj.requestOption.dialogType == 0){
                            //保存
                            const confirmMessage = "是否保存新增的数据？";
                            obj.$confirm(confirmMessage).then(function(){
                                obj.requestDataForm.menuId = obj.expandMenuData.menuId;
                                insertRequest(obj,obj.requestDataForm);
                            }).catch(function(){

                            });
                        }else if(obj.requestOption.dialogType == 1){
                            //编辑
                            const confirmMessage = "是否提交修改的数据？";
                            obj.$confirm(confirmMessage).then(function(){
                                updateRequest(obj,obj.requestDataForm);
                            }).catch(function(){

                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        created : function(){
            //获取一级菜单
            var param = {
                menuLevel:1
            };
            getParentList(this, param, "1");

            //获取菜单列表
            getParentList(this, this.menuSearchCondition, "2");
            //获取页面的按钮
            var obj = this;
            new htmlOfButton(this,function(data){
                if(data.code === "0000"){
                    var result = data.data;
                    for(var i=0;i<result.length;i++){
                        var item = result[i];
                        var btName = item.btName;
                        if(btName != null && btName != ""){
                            var btValue = obj.btOption[btName];
                            if(typeof(btValue) === "object"){
                                btValue.btDescribe = item.btDescribe;
                                btValue.btName = item.btName;
                                btValue.isAllow = item.isAllow;
                                btValue.requestId = item.requestId;
                                btValue.requestUrl = item.requestUrl;
                                if(!obj.isShowTool && item.isAllow == 1){
                                    obj.isShowTool = true;
                                }
                            }
                        }
                    }
                }else{
                    obj.$alert(data.message, {
                        confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                        type : 'error'
                    });
                }
            });
        },
        components : {
            SearchSpan
        },
    }
    /**
     * 获取一级菜单
     * @param app app对象
     * @param param 获取数据的列表
     * @param type 类型，1、查询一级菜单；2、查询所有菜单；
     */
    function getParentList(app,param,type){
        var url = config.domain + config.project + "/action/user/menu/list";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                if(type === "1"){
                    app.parentList = data.data.dataList;
                }else if(type === "2"){
                    app.menuList = data.data.dataList;
                    app.dataTotal = data.data.dataRow;
                    app.menuSearchCondition.page = data.data.page;
                    app.menuSearchCondition.pageSize = data.data.pageSize;

                    for(var i=0;i<app.menuList.length;i++){
                        var item = app.menuList[i];
                        if(item.menuLevel == 1){
                            item["menuLevelName"] = "一级菜单";
                        }else if(item.menuLevel == 2){
                            item["menuLevelName"] = "二级菜单";
                        }
                        if(item.menuScope == "0"){
                            item["menuScopeName"] = "客户端";
                        }else if(item.menuScope == "1"){
                            item["menuScopeName"] = "管理端";
                        }

                        if(item.menuType == "0"){
                            item["menuTypeName"] = "当前页面";
                        }else if(item.menuType == "1"){
                            item["menuTypeName"] = "新页签";
                        }
                        item["isExpand"] = false;//true已经展开；false未展开
                        item["requestList"] = [];
                    }
                }
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 新增菜单信息
     * @param app app对象
     * @param param 获取数据的列表
     */
    function insertMenu(app,param){
        var url = config.domain + config.project + "/action/user/menu/insert";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });
                app.menuSearchCondition.page = 1;
                getParentList(app,app.menuSearchCondition,"2");
                app.dialogOption.isShow = false;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新菜单信息
     * @param app app对象
     * @param param 获取数据的列表
     */
    function updateMenu(app,param){
        var url = config.domain + config.project + "/action/user/menu/update";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });
                app.menuSearchCondition.page = 1;
                getParentList(app,app.menuSearchCondition,"2");
                app.dialogOption.isShow = false;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新菜单状态
     * @param app app对象
     * @param param 获取数据的列表
     */
    function updateMenuStatus(app,param){
        var url = config.domain + config.project + "/action/user/menu/updateStatus";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });
                app.menuSearchCondition.page = 1;
                getParentList(app,app.menuSearchCondition,"2");
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 获取页面对应的按钮及请求地址
     * @param app app对象
     * @param param 获取数据的列表
     */
    function getRequestList(app,menuObject){
        app.requestListLoading = true;
        var option = {
            "menuId" : menuObject.menuId
        };
        var url = config.domain + config.project + "/action/user/menuRequest/getByMenuId";
        new formJsonRequest(url,option,function(){
            app.requestListLoading = false;
        },function(data){
            app.requestListLoading = false;
            if(data.code == "0000"){
                //清空数组
                menuObject["requestList"].splice(0,menuObject["requestList"].length);

                var result = data.data;
                for(var i=0;i<result.length;i++){
                    var item = result[i];
                    menuObject["requestList"].push(item);
                }
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }


    /**
     * 新增请求或者按钮
     * @param app app对象
     * @param param 获取数据的列表
     */
    function insertRequest(app,param){
        var url = config.domain + config.project + "/action/user/menuRequest/insert";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });

                getRequestList(app,app.expandMenuData);

                app.requestOption.isShow = false;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新请求或者按钮信息
     * @param app app对象
     * @param param 获取数据的列表
     */
    function updateRequest(app,param){
        var url = config.domain + config.project + "/action/user/menuRequest/update";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });

                getRequestList(app,app.expandMenuData);

                app.requestOption.isShow = false;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新请求或者按钮的状态
     * @param app app对象
     * @param param 获取数据的列表
     */
    function updateRequestStatus(app,param,menuObject){
        var url = config.domain + config.project + "/action/user/menuRequest/updateStatus";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });
                getRequestList(app,menuObject);

            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }


    /**
     * 关闭dialog的提示信息
     * @param app
     */
    function dialogCloseTips(app) {
        var confirmMessage = "";
        var obj = app;
        if(app.dialogOption.dialogType == 0){
            confirmMessage = "是否放弃新增菜单?";
        }else if(app.dialogOption.dialogType == 1){
            confirmMessage = "是否放弃编辑菜单?";
        }
        app.$confirm(confirmMessage).then(function(){
            obj.dialogOption.isShow = false;
        }).catch(function(){

        });
    }

    /**
     * 关闭dialog的提示信息
     * @param app
     */
    function requestDialogCloseTips(app) {
        var confirmMessage = "";
        var obj = app;
        if(app.requestOption.dialogType == 0){
            confirmMessage = "是否放弃新增按钮?";
        }else if(app.requestOption.dialogType == 1){
            confirmMessage = "是否放弃编辑按钮?";
        }
        app.$confirm(confirmMessage).then(function(){
            obj.requestOption.isShow = false;
        }).catch(function(){

        });
    }
</script>

<style scoped>
    .menu_manage_span{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        font-family: Microsoft YaHei,Heiti SC,tahoma,arial,Hiragino Sans GB,"\5B8B\4F53",sans-serif;
        flex-wrap : wrap;
    }
    .search_item_span{
        min-width: 80px;
        height: auto;
        margin-top: 5px;
        margin-left: 10px;
    }
    .bt_tool_span{
        width: 100%;
        height: auto;
    }
    .expand_span{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>