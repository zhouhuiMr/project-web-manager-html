<template>
    <scoll-bar :is-show-vertical="true" :is-show-horizontal="true" thumb-height="8" thumb-width="8">
        <div style="width: 4000px;height: 2000px;background-color: #ffffff"></div>
    </scoll-bar>
</template>

<style>
    .myExample{
        font-size: 20px;
        color: #5eacfd;
        font-weight: 600;
    }
</style>

<script>
    import ScollBar from '../component/scroll-bar.vue'
    export default {
        name : "homePage",
        data () {
            return {
                msg: 'Hello world!'
            }
        },
        methods : {
            bt_show : function(){
                console.info(1111)
            }
        },
        components : {
            ScollBar
        }
    }
</script>