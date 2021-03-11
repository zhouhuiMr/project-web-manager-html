<template>
    <div class="web_container">
        <div class="myExample" v-on:click="bt_show">{{ msg }}</div>
        <el-button type="danger" plain>危险按钮</el-button>
    </div>
</template>

<style>
    .myExample{
        font-size: 20px;
        color: #5eacfd;
        font-weight: 600;
    }
</style>

<script>
    export default {
        data () {
            return {
                msg: 'Hello world!'
            }
        },
        methods : {
            bt_show : function(){
                console.info(1111)
            }
        }
    }
</script>