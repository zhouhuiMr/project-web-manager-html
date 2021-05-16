<template>
    <div class="web_container">
        <h1>bar传输参数:{{this.$route.query.menuId}}</h1>
        <el-button type="danger" plain v-if="buttonStatus.bt_query">bt_query</el-button>
        <el-button type="danger" plain v-if="buttonStatus.bt_confirm">bt_confirm</el-button>
        <el-button type="danger" plain v-if="buttonStatus.bt_cc">bt_cc</el-button>
        <el-button type="danger" plain v-if="buttonStatus.bt_dd">bt_dd</el-button>
    </div>
</template>

<script>


    export default {
        data(){
            return {
                buttonStatus : {
                    bt_query : false,
                    bt_confirm : false,
                    bt_cc : false,
                    bt_dd : false
                }
            }
        },
        created : function(){
            getButtonListOfHtml(this);
        }
    }

    function getButtonListOfHtml(obj){
        new htmlOfButton(obj,function(data){
            console.info(data);
        });
    }
</script>

<style>
    h1{
        font-size: 30px;
        color: #5eacfd;
        font-weight: 600;
    }
</style>