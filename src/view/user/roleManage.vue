<template>
    <div class="role_span">
        <div class="role_left_span">
            <search-span
                    :current-page="roleSearchCondition.page"
                    :page-size="roleSearchCondition.pageSize"
                    :total="roleDataTotal"
                    :isShowTool="showToolStatus"
                    :page-layout="rolePageLayout"
                    :size-change="roleHandleSizeChange" :current-change="roleHandleCurrentChange">
                <template v-slot:searchItem>
                    <div class="search_item_span">
                        <el-input size="mini" v-model="roleSearchCondition.roleName"
                                  placeholder="请输入角色名称" clearable style="width: 140px"></el-input>
                    </div>
                    <div class="search_item_span">
                        <el-button icon="el-icon-search" size="mini" type="primary" @click="searchData">查询</el-button>
                    </div>
                    <div class="search_item_span">
                        <el-button icon="el-icon-plus" size="mini"
                                   type="primary" v-if="btOption.btSave.isAllow == '1'"
                                   @click="insertData">新增角色</el-button>
                    </div>
                </template>

                <template v-slot:searchTool>
                </template>

                <template v-slot:searchTable>
                    <el-table class="my_scroller_style"
                            :data="roleData"
                            :highlight-current-row="true"
                            size="mini"
                            :select-on-indeterminate="false"
                            @select-all="cancelRole"
                            @select="selectCurRole"
                            ref="roleTable"
                            height="100%"
                            style="width: 100%">
                        <el-table-column
                                align="center"
                                type="selection"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="roleName"
                                label="角色名称"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作"
                                width="160">
                            <template slot-scope="scope">
                                <el-button size="mini"
                                        @click="roleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger"
                                           @click="roleDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </search-span>
        </div>
        <div class="angle_span">
            <i class="fas fa-angle-double-right"></i>
        </div>
        <div class="role_center_span">
            <el-table class="my_scroller_style"
                    :data="parentMenuData"
                    :highlight-current-row="true"
                    size="mini"
                    height="100%"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="icon"
                        label="图标"
                        width="60">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon" style="font-size: 20px"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="menuName"
                        label="菜单名称"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="menuUrl"
                        label="请求地址"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="访问权限"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.isallow == '0'" type="danger" effect="dark">禁止访问</el-tag>
                        <el-tag size="mini" v-else type="success" effect="dark">允许访问</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="240">
                    <template slot-scope="scope">
                        <!--   设置访问权限  -->
                        <el-button size="mini" v-if="scope.row.isallow == '0'"
                                   @click="setRoleIsAllow(scope.$index, scope.row)" type="primary">设置授权访问</el-button>
                        <el-button size="mini" v-else
                                   @click="setRoleIsAllow(scope.$index, scope.row)" type="primary">设置禁止访问</el-button>

                        <!--   详细的权限设置  -->
                        <el-button size="mini" v-if="scope.row.isallow == '0'" type="primary" disabled>详细权限</el-button>
                        <el-button size="mini" v-else type="primary"
                                   @click="roleDetail(scope.$index, scope.row)">详细权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--   角色修改的弹出框   -->
        <el-dialog
                :title="roleDialogOption.title"
                :visible="roleDialogOption.isShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="360px"
                :before-close="roleDialogBeforeClose"
                @close="roleDialogClose">
            <el-form ref="roleDataRef" :model="roleDataForm" :rules="roleDataRules" label-width="80px" size="mini">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleDataForm.roleName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogCancel" size="mini">取 消</el-button>
                <el-button type="primary" @click="roleDialogConfirm" size="mini">确 定</el-button>
            </span>
        </el-dialog>


        <!--   角色对应菜单，按钮的权限设置   -->
        <el-dialog
                :title="menuRequestOption.title"
                :visible="menuRequestOption.isShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="960px"
                :before-close="menuRequestBeforeClose"
                @close="menuRequestClose">
            <el-table class="my_scroller_style"
                    :data="menuRequestData"
                    @expand-change="menuRequestTableRowExpand"
                    size="mini"
                    :max-height="menuRequestOption.menuRequestMaxHeight"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="expand_span">
                            <el-table
                                    :data="props.row.requestList"
                                    style="width: 100%"
                                    size="mini"
                                    :border="true"
                                    :show-header="true">
                                <el-table-column
                                        align="center"
                                        type="index"
                                        width="50">
                                </el-table-column>
                                <el-table-column
                                        align="left"
                                        header-align="center"
                                        prop="name"
                                        label="按钮名称"
                                        width="140">
                                </el-table-column>
                                <el-table-column
                                        align="left"
                                        header-align="center"
                                        prop="url"
                                        label="请求地址"
                                        min-width="140">
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="btDescribe"
                                        label="描述"
                                        min-width="160">
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="访问权限"
                                        width="100">
                                    <template slot-scope="scope">
                                        <el-tag size="mini" v-if="scope.row.isAllow == '0'" type="danger" effect="dark">禁止访问</el-tag>
                                        <el-tag size="mini" v-else type="success" effect="dark">允许访问</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        label="操作"
                                        width="140">
                                    <template slot-scope="scope">
                                        <!--   设置访问权限  -->
                                        <el-button size="mini" v-if="scope.row.isAllow == '0'"
                                                   @click="setMenuRquestIsAllow(scope.$index, scope.row,2)" type="primary">设置授权访问</el-button>
                                        <el-button size="mini" v-else
                                                   @click="setMenuRquestIsAllow(scope.$index, scope.row,2)" type="primary">设置禁止访问</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        align="center"
                        label="名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="类型"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.type == '1'" type="" effect="dark">菜单页面</el-tag>
                        <el-tag size="mini" v-else-if="scope.row.type == '2'" type="" effect="dark">按钮请求</el-tag>
                        <el-tag size="mini" v-else type="" effect="dark">其它</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="url"
                        align="center"
                        label="访问地址"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="访问权限"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.isAllow == '0'" type="danger" effect="dark">禁止访问</el-tag>
                        <el-tag size="mini" v-else type="success" effect="dark">允许访问</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="140">
                    <template slot-scope="scope">
                        <!--   设置访问权限  -->
                        <el-button size="mini" v-if="scope.row.isAllow == '0'"
                               @click="setMenuRquestIsAllow(scope.$index, scope.row,1)" type="primary">设置授权访问</el-button>
                        <el-button size="mini" v-else
                               @click="setMenuRquestIsAllow(scope.$index, scope.row,1)" type="primary">设置禁止访问</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="menuRequestOption.isShow = false" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import SearchSpan from '../../component/search-span.vue';

    export default {
        name: "roleManage",
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
                    btRoleMenuIsAllow : {
                        btDescribe: "",
                        btName: "btRoleMenuIsAllow",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    },
                    btRoleRequestIsAllow : {
                        btDescribe: "",
                        btName: "btRoleRequestIsAllow",
                        isAllow: "0",
                        requestId: 0,
                        requestUrl: "",
                    }
                },
                roleSearchCondition : {
                    roleName : "",
                    page : 1,
                    pageSize : 50
                },
                requestSearchCondition : {
                    requestName : "",
                    page : 1,
                    pageSize : 50
                },
                roleDataTotal : 0,
                rolePageLayout: "sizes,prev, pager, next",
                showToolStatus : false,
                requestDataTotal : 0,
                requestIsShowTool : false,

                roleData : [],
                parentMenuData : [],

                //role dialog
                roleDialogOption : {
                    isShow : false,
                    title : "更新角色信息",
                    type : 0,//0、新增；1、修改
                },
                roleDataForm : {
                    "roleId" : 0,
                    "roleName" : ""
                },
                selectedRole : null,//当前选择的角色
                selectParentMenu : null,//当前选择的一级菜单
                roleDataRules : {
                    roleName : [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
                },

                menuRequestOption : {
                    isShow : false,
                    title : "详细权限信息",
                    menuRequestMaxHeight : 320
                },
                menuRequestData : [],
            }
        },
        methods : {
            searchData : function(){
                this.roleSearchCondition.page = 1;
                getRoleList(this,this.roleSearchCondition);
                this.parentMenuData = [];
            },
            roleHandleSizeChange : function(val){
                this.roleSearchCondition.page = 1;
                this.roleSearchCondition.pageSize = val;
                getRoleList(this,this.roleSearchCondition);
            },
            roleHandleCurrentChange : function(val){
                this.roleSearchCondition.page = val;
                getRoleList(this,this.roleSearchCondition);
            },
            insertData : function () {
                this.roleDialogOption.title = "新增角色信息";
                this.roleDialogOption.isShow = true;
                this.roleDialogOption.type = 0;
            },
            roleEdit : function(index,row){
                this.roleDialogOption.isShow = true;
                this.roleDataForm.roleName = row.roleName;
                this.roleDataForm.roleId = row.roleId;
                this.roleDialogOption.title = "更新角色信息";
                this.roleDialogOption.type = 1;
            },
            roleDel : function(index,row){
                const obj = this;
                const confirmMessage = "是否删除当前选择的角色：" + row.roleName + "?";
                this.$confirm(confirmMessage, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    let param = {
                        "roleId" : row.roleId,
                        "roleName" : row.roleName,
                        "status" : "1"
                    };

                    updateRoleStatus(obj,param);
                }).catch(function() {

                });
            },
            cancelRole : function(selection){
                //选择表头的单选框
                this.$refs.roleTable.clearSelection();
                selection = [];

                this.parentMenuData = [];
            },
            selectCurRole : function(selection,row){
                if(selection.length == 0){
                    this.$refs.roleTable.clearSelection();
                    this.parentMenuData = [];
                    this.selectedRole = null;
                }else{
                    this.$refs.roleTable.clearSelection();
                    selection = [];
                    selection.push(row);
                    this.$refs.roleTable.toggleRowSelection(row);

                    this.selectedRole = row;

                    //获取父级菜单
                    getParentMenuByRole(this,row);
                }
            },
            roleDetail : function(index,row){
                this.menuRequestOption.isShow = true;
                this.selectParentMenu = row;//当前选择的一级菜单
                let param = {
                    "roleId" : this.selectedRole.roleId,
                    "menuId" : row.menuId
                };
                getMenuRequestByMenuOfRole(this,param);
            },
            roleDialogBeforeClose : function(){
                dialogCloseTips(this);
            },
            roleDialogClose : function(){
                //清除提示信息
                this.roleDataForm.roleId = 0;
                this.roleDataForm.roleName = "";
                this.$refs["roleDataRef"].resetFields();
            },
            roleDialogCancel : function(){
                dialogCloseTips(this);
            },
            roleDialogConfirm : function(){
                let obj = this;
                if(this.roleDialogOption.type == 0){
                    //新增
                    this.$refs["roleDataRef"].validate(function(valid){
                        if(valid){
                            const confirmMessage = "是否保存新增的角色数据？";
                            obj.$confirm(confirmMessage).then(function(){
                                insertRole(obj,obj.roleDataForm);
                            }).catch(function(){

                            });
                        }else{
                            return false;
                        }
                    });
                }else {
                    //修改
                    this.$refs["roleDataRef"].validate(function(valid){
                        if(valid){
                            const confirmMessage = "是否保存修改的角色数据？";
                            obj.$confirm(confirmMessage).then(function(){
                                updateRole(obj,obj.roleDataForm);
                            }).catch(function(){

                            });
                        }else{
                            return false;
                        }
                    });
                }
            },
            setRoleIsAllow : function(index,row){
                //设置一级菜单是否允许访问
                let obj = this;

                let param = {
                    "roleId" : this.selectedRole.roleId,
                    "menuId" : row.menuId,
                    "status" : "0"
                };
                //设置菜单的状态，0有效，1无效
                if(row.isallow == "0"){
                    param.status = "0";
                    let confirmMessage = "是否设置角色  [" + this.selectedRole.roleName + "] ";
                    confirmMessage += "<span style='color: #F56C6C'>允许访问 </span>";
                    confirmMessage += "[" + row.menuName + "] ?";

                    this.$confirm(confirmMessage, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(function() {
                        updateRoleMenuStatus(obj,param,1);
                    }).catch(function() {

                    });
                }else{
                    param.status = "1";
                    let confirmMessage = "是否设置角色  [" + this.selectedRole.roleName + "] ";
                    confirmMessage += "<span style='color: #F56C6C'>禁止访问 </span>";
                    confirmMessage += "[" + row.menuName + "] ?";

                    this.$confirm(confirmMessage, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(function() {
                        updateRoleMenuStatus(obj,param,1);
                    }).catch(function() {

                    });
                }
            },
            menuRequestBeforeClose : function(){
                this.menuRequestOption.isShow = false;
            },
            menuRequestClose : function(){
                this.menuRequestData = [];
            },
            setMenuRquestIsAllow : function(index,row,isExpand){
                //isExpand,1根目录，2展开的信息
                let obj = this;
                if(row.type == 1){
                    //菜单或者页面
                    let param = {
                        "roleId" : this.selectedRole.roleId,
                        "menuId" : row.menuId,
                        "status" : "0"
                    };
                    //设置菜单的状态，0有效，1无效
                    if(row.isAllow == "0"){
                        param.status = "0";
                        let confirmMessage = "是否设置角色  [" + this.selectedRole.roleName + "] ";
                        confirmMessage += "<span style='color: #F56C6C'>允许访问 </span>";
                        confirmMessage += "[" + row.name + "] ?";

                        this.$confirm(confirmMessage, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true
                        }).then(function() {
                            updateRoleMenuStatus(obj,param,2);
                        }).catch(function() {

                        });
                    }else{
                        param.status = "1";
                        let confirmMessage = "是否设置角色  [" + this.selectedRole.roleName + "] ";
                        confirmMessage += "<span style='color: #F56C6C'>禁止访问 </span>";
                        confirmMessage += "[" + row.name + "] ?";

                        this.$confirm(confirmMessage, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true
                        }).then(function() {
                            updateRoleMenuStatus(obj,param,2);
                        }).catch(function() {

                        });
                    }
                }else if(row.type == 2){
                    //按钮或者请求
                    let param = {
                        "roleId" : this.selectedRole.roleId,
                        "menuId" : row.menuId,
                        "requestId" : row.requestId,
                        "isAllow" : "0"
                    };
                    //设置菜单的状态，0禁止访问，1授权访问
                    if(row.isAllow == "0"){
                        param.isAllow = "1";
                        let confirmMessage = "是否设置角色  [" + this.selectedRole.roleName + "] ";
                        confirmMessage += "<span style='color: #F56C6C'>允许访问 </span>";
                        confirmMessage += "[" + row.url + "] ?";

                        this.$confirm(confirmMessage, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true
                        }).then(function() {
                            updateRoleRequestStauts(obj,param,row,isExpand)
                        }).catch(function() {

                        });
                    }else{
                        param.isAllow = "0";
                        let confirmMessage = "是否设置角色  [" + this.selectedRole.roleName + "] ";
                        confirmMessage += "<span style='color: #F56C6C'>禁止访问 </span>";
                        confirmMessage += "[" + row.url + "] ?";

                        this.$confirm(confirmMessage, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true
                        }).then(function() {
                            updateRoleRequestStauts(obj,param,row,isExpand)
                        }).catch(function() {

                        });
                    }
                }
            },
            menuRequestTableRowExpand : function(row,expandedRows){
                if(row.isAllow == '0'){
                    return;
                }
                if(row.type != 1){
                    return;
                }
                if(!row.isExpand){
                    row.isExpand = true;
                    let param = {
                        "roleId" : this.selectedRole.roleId,
                        "menuId" : row.menuId
                    };
                    getRequestByMenuOfRole(this,param,row);
                }else{
                    //关闭
                    row.isExpand = false;
                    row["requestList"].splice(0,row["requestList"].length);
                }
            }
        },
        created : function(){

            let dialogHeight = calcDialogHeight();
            let dialogTableHeight = dialogHeight - 130;
            if(dialogTableHeight < 320){
                dialogTableHeight = 320;
            }

            this.menuRequestOption.menuRequestMaxHeight = dialogTableHeight;
            getRoleList(this,this.roleSearchCondition);

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
     * 获取角色信息列表
     * @param app
     * @param param
     */
    function getRoleList(app,param){
        var url = config.domain + config.project + "/action/role/list";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.roleDataTotal = data.data.dataRow;
                app.roleData = data.data.dataList;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 根据角色的唯一标识获取菜单信息
     * @param app
     * @param param 查询条件 角色的唯一标识
     */
    function getParentMenuByRole(app,param){
        var url = config.domain + config.project + "/action/role/getParentMenuByRole";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.parentMenuData = data.data;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新角色信息
     * @param app vue对象
     * @param param 操作的参数
     */
    function insertRole(app,param){
        var url = config.domain + config.project + "/action/role/insert";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });

                app.roleDialogOption.isShow = false;

                // app.roleSearchCondition.page = 1;
                getRoleList(app,app.roleSearchCondition);

                app.parentMenuData = [];
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新角色信息
     * @param app vue对象
     * @param param 操作的参数
     */
    function updateRole(app,param){
        var url = config.domain + config.project + "/action/role/update";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });

                app.roleDialogOption.isShow = false;

                // app.roleSearchCondition.page = 1;
                getRoleList(app,app.roleSearchCondition);

                app.parentMenuData = [];
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 删除角色信息
     * @param app vue对象
     * @param param 操作的参数
     */
    function updateRoleStatus(app,param){
        var url = config.domain + config.project + "/action/role/updateStatus";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });

                app.parentMenuData = [];
                app.roleSearchCondition.page = 1;
                getRoleList(app,app.roleSearchCondition);
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 更新角色对应的菜单的状态信息（是否进行授权）
     * @param app vue对象
     * @param param 操作的参数
     * @param type 菜单级别，1、一级菜单；2、二级菜单
     */
    function updateRoleMenuStatus(app,param,type){
        var url = config.domain + config.project + "/action/role/update/roleMenuStatus";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });
                if(type == 1){
                    getParentMenuByRole(app,app.selectedRole);
                }else if(type == 2){
                    let menuRequestParam = {
                        "roleId" : app.selectedRole.roleId,
                        "menuId" : app.selectParentMenu.menuId
                    };
                    getMenuRequestByMenuOfRole(app,menuRequestParam);
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
     * 更新角色对应的按钮请求的状态信息（是否进行授权）
     * @param app vue对象
     * @param param 操作的参数
     * @param curRequest 当前的请求或者按钮的对象（通过parentMenu获取父级对象）
     */
    function updateRoleRequestStauts(app,param,curRequest,isExpand){
        var url = config.domain + config.project + "/action/role/update/roleRequestStauts";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                app.$message({
                    showClose: true,
                    message: writerInfo.dataUpdateSuccess[language],
                    type: 'success'
                });
                if(isExpand == 1){
                    let menuRequestParam = {
                        "roleId" : app.selectedRole.roleId,
                        "menuId" : app.selectParentMenu.menuId
                    };
                    getMenuRequestByMenuOfRole(app,menuRequestParam);
                }else if(isExpand == 2){
                    let menuRequestParam = {
                        "roleId" : app.selectedRole.roleId,
                        "menuId" : curRequest.menuId
                    };
                    getRequestByMenuOfRole(app,menuRequestParam,curRequest["parentMenu"]);
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
     * 弹窗关闭时的提示信息
     * @param app
     */
    function dialogCloseTips(app) {
        let confirmMessage = "";
        if(app.roleDialogOption.type == 0){
            confirmMessage = "是否放弃新增角色？";
        }else{
            confirmMessage = "是否放弃编辑角色？"
        }
        var obj = app;
        app.$confirm(confirmMessage).then(function(){
            obj.roleDialogOption.isShow = false;
        }).catch(function(){

        });
    }

    /**
     * 获取二级菜单和按钮请求信息
     * @param app vue对象
     * @param param 操作的参数
     */
    function getMenuRequestByMenuOfRole(app,param){
        var url = config.domain + config.project + "/action/role/getMenuRequestByMenuOfRole";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                let result = data.data;
                for(let i=0;i<result.length;i++){
                    let item = result[i];
                    if(item.type == "1"){
                        item["typeName"] = "菜单";
                    }else if(item.type == "2"){
                        item["typeName"] = "按钮请求";
                    }else{
                        item["typeName"] = "其它";
                    }

                    item["requestList"] = [];
                    item["isExpand"] = false;
                }
                app.menuRequestData = result;
            }else{
                app.$alert(data.message, {
                    confirmButtonText: writerInfo.bt_requestErrorConfirm[language],
                    type : 'error'
                });
            }
        });
    }

    /**
     * 根据角色和菜单的唯一标识获取按钮或者请求信息
     * @param app vue对象
     * @param param 操作的参数
     * @param menuObject 菜单信息对象
     */
    function getRequestByMenuOfRole(app,param,menuObject){
        var url = config.domain + config.project + "/action/role/getMenuRequestByMenuOfRole";
        new formJsonRequest(url,param,null,function(data){
            if(data.code === "0000"){
                let result = data.data;
                menuObject["requestList"] = result;
                for(let i=0;i<result.length;i++){
                    let item = result[i];
                    item["parentMenu"] = menuObject;
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
     * 计算页面显示的dialog的高度
     * @returns {number} dialog的高度值
     */
    function calcDialogHeight(){
        let height = window.pageSizeMsg.height;
        let top = height / 100 * 15;

        let dilogHeight = height - 2 * top;

        return dilogHeight;
    }

</script>

<style scoped>
    .role_span{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        font-family: Microsoft YaHei,Heiti SC,tahoma,arial,Hiragino Sans GB,"\5B8B\4F53",sans-serif;
        flex-wrap : wrap;
        overflow-x: auto;
    }
    .role_span .role_left_span{
        width: 400px;
        height: 100%;
        border-right: 1px solid #EBEEF5;

    }
    .role_span .role_center_span{
        width: calc(100% - 460px);
        height: 100%;
        border-left: 1px solid #EBEEF5;
        border-right: 1px solid #EBEEF5;
    }
    .role_span .role_right_span{
        min-width: 200px;
        width: calc(100% - 570px);
        height: 100%;
        border-left: 1px solid #EBEEF5;
    }
    .role_span .angle_span{
        display: flex;
        align-items: center;
        justify-content: center;
        width : 38px;
        height: 100%;
        margin-left: 1px;
        margin-right: 1px;
        font-size: 28px;
        font-weight: 400;
        color: #909399;
    }
    .search_item_span{
        min-width: 80px;
        height: auto;
        margin-top: 5px;
        margin-left: 10px;
    }
    .expand_span{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>