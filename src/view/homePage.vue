<template>
    <scoll-bar :is-show-vertical="true" :is-show-horizontal="false" thumb-width="8" ref="scrollBar"
               :scroll-style="{backgroundColor:'#FFFFFF'}">
        <div class="dashboard_span">
            <div class="dashboard_user">
                <div class="dashboard_user_item dashboard_user_all">
                    <div class="user_item_left">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="user_item_right">
                        <p class="user_item_tips">用户总数</p>
                        <p class="user_item_data">{{dashboard.allUser}}</p>
                    </div>
                </div>
                <div class="dashboard_user_item dashboard_user_register">
                    <div class="user_item_left">
                        <i class="fas fa-sign-in-alt"></i>
                    </div>
                    <div class="user_item_right">
                        <p class="user_item_tips">今日注册</p>
                        <p class="user_item_data">{{dashboard.todayRegister}}</p>
                    </div>
                </div>
                <div class="dashboard_user_item dashboard_user_today">
                    <div class="user_item_left">
                        <i class="fas fa-laptop-code"></i>
                    </div>
                    <div class="user_item_right">
                        <p class="user_item_tips">今日登录</p>
                        <p class="user_item_data">{{dashboard.todayLogin}}</p>
                    </div>
                </div>
                <div class="dashboard_user_item dashboard_user_week">
                    <div class="user_item_left">
                        <i class="fas fa-list-alt"></i>
                    </div>
                    <div class="user_item_right">
                        <p class="user_item_tips">本周登录</p>
                        <p class="user_item_data">{{dashboard.weekLogin}}</p>
                    </div>
                </div>
            </div>
            <div class="dashboard_server_ip">
                <el-select class="dashboard_server_select" v-model="selectServer" size="small"
                @change="changeServer" placeholder="请选择服务器">
                    <el-option
                            v-for="item in serverList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="dashboard_server">
                <div class="dashboard_server_gauge">
                    <div class="server_gauge_item">
                        <v-chart :option="cpuOption"></v-chart>
                    </div>
                    <div class="server_gauge_item">
                        <v-chart :option="memoryOption"></v-chart>
                    </div>
                </div>
                <div class="dashboard_disk_list">
                    <h1>磁盘空间信息</h1>
                    <el-table
                            :data="diskList"
                            border
                            style="width: 99%;margin-left: auto;margin-right: auto">
                        <el-table-column
                                align="center"
                                prop="fileSystem"
                                label="文件系统"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="size"
                                label="分区大小"
                                width="90">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="used"
                                label="已使用"
                                width="90">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="avail"
                                label="可用"
                                width="90">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="useRate"
                                label="已用百分比"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="mountedOn"
                                label="挂载点"
                                min-width="180">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </scoll-bar>
</template>

<style>
    .dashboard_span{
        position: relative;
        display: flex;
        flex-flow: column;
        justify-content: center;
        width: 98%;
        height: 100%;
        margin-right: auto;
        margin-left: auto;
        background-color: #FFFFFF;
        font-family: Microsoft YaHei,Heiti SC,tahoma,arial,Hiragino Sans GB,"\5B8B\4F53",sans-serif;
    }
    .dashboard_span .dashboard_user{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        height: auto;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .dashboard_user .dashboard_user_item{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-width: 270px;
        height: 120px;
        margin-bottom: 10px;
        border-radius: 6px;
    }
    .dashboard_user_item .user_item_left{
        width: 80px;
        height : 80px;
        margin-left: 10px;
        margin-right: 10px;
        line-height: 80px;
        text-align: center;
        border-radius: 8px;
        font-size: 50px;
        color: #FFFFFF;
    }
    .dashboard_user_item .user_item_right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 140px;
        height: 100%;
        text-align: right;
        padding: 0px 20px 0px 10px;
    }
    .user_item_right .user_item_tips{
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        margin-bottom: 10px;
    }
    .user_item_right .user_item_data{
        font-size: 24px;
        font-weight: 600;
        color: #FFFFFF;
    }
    .dashboard_user .dashboard_user_all{
        background-color: #3a8ee6;
    }
    .dashboard_user .dashboard_user_register{
        background-color: #66CDAA;
    }
    .dashboard_user .dashboard_user_today{
        background-color: #FA8072;
    }
    .dashboard_user .dashboard_user_week{
        background-color: #00CDCD;
    }
    .dashboard_span .dashboard_server_ip{
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        margin-bottom: 20px;
    }
    .dashboard_server_ip .dashboard_server_select{
        width: 320px;
    }
    .dashboard_span .dashboard_server{
        width: 100%;
        height: auto;
    }
    .dashboard_server .dashboard_server_gauge{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        height: 480px;
        margin-bottom: 20px;
    }
    .dashboard_server_gauge .server_gauge_item{
        width: 480px;
        height: 100%;
    }
    .dashboard_server .dashboard_disk_list{
        width: 100%;
        height: auto;
        margin-bottom: 20px;
    }
    .dashboard_disk_list > h1{
        width: 100%;
        color: #606266;
        font-size: 20px;
        text-align: center;
        line-height: 20px;
        margin-bottom: 10px;
    }
    
    @media screen and (min-width: 1680px) {
        .dashboard_user_item .user_item_right{
            width: 190px;
        }
    }

</style>

<script>
    import ScollBar from '../component/scroll-bar.vue';
    import { use } from 'echarts/core';

    import {
        TitleComponent,
        TooltipComponent
    } from 'echarts/components';
    import {
        CanvasRenderer
    } from 'echarts/renderers';
    import {
        LineChart,
        GaugeChart
    } from 'echarts/charts';

    import VChart from "vue-echarts";

    use(
        [TitleComponent,TooltipComponent, GaugeChart, LineChart, CanvasRenderer]
    );

    export default {
        name : "homePage",
        data () {
            return {
                dashboard :{
                    allUser : 100,
                    todayRegister : 4,
                    todayLogin : 10,
                    weekLogin : 42
                },

                serverList : [],//服务器列表
                selectServer : "",//选择的服务器

                diskList : [],//硬盘信息

                cpuOption : {
                    title : {
                        text : "CPU使用率（%）",
                        textAlign : 'center',
                        top : "60%",
                        left : "50%",
                        textStyle : {
                            fontSize : 24,
                            color : '#606266'
                        }
                    },
                    series: [{
                        type: 'gauge',
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },

                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        data: [{
                            value: 20,
                            name: '已用',
                            title: {
                                offsetCenter: ['-30%', '70%']
                            },
                            detail: {
                                offsetCenter: ['-30%', '85%']
                            },
                            itemStyle: {
                                color: "#3a8ee6"
                            }
                        }, {
                            value: 40,
                            name: '峰值',
                            title: {
                                offsetCenter: ['30%', '70%']
                            },
                            detail: {
                                offsetCenter: ['30%', '85%']
                            },
                            itemStyle: {
                                color: "#66CDAA"
                            }
                        }],
                        title: {
                            fontSize: 16,
                        },
                        detail: {
                            width: 40,
                            height: 14,
                            fontSize: 14,
                            color: '#fff',
                            backgroundColor: 'auto',
                            borderRadius: 3,
                            formatter: '{value}%'
                        }
                    }]
                },
                memoryOption : {
                    title : {
                        text : "内存(M)",
                        textAlign : 'center',
                        top : "60%",
                        left : "50%",
                        textStyle : {
                            fontSize : 24,
                            color : '#606266'
                        }
                    },
                    series: [{
                        type: 'gauge',
                        min: 0,
                        max: 1024,
                        splitNumber: 4,
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: {
                                color: '#FAC858'
                            }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '80%',
                            offsetCenter: [0, '8%']
                        },

                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        data: [{
                            value: 128,
                            name: '已用',
                            title: {
                                offsetCenter: ['0%', '70%']
                            },
                            detail: {
                                offsetCenter: ['0%', '85%']
                            },
                            itemStyle: {
                                color: "#3a8ee6"
                            }
                        }],
                        title: {
                            fontSize: 16,
                        },
                        detail: {
                            width: 40,
                            height: 14,
                            fontSize: 14,
                            color: '#fff',
                            backgroundColor: 'auto',
                            borderRadius: 3,
                            formatter: '{value}MB'
                        }
                    }]
                },
            }
        },
        methods : {
            changeServer : function(){

            },
        },
        components : {
            ScollBar,
            VChart
        },
        mounted : function(){
            setChartsData(this);
        }
    }

    function setChartsData(obj){
        // setInterval(function () {
        //     console.info(obj.option);
        //     obj.option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        //     obj.option.series[0].data[1].value = (Math.random() * 100).toFixed(2) - 0;
        //     obj.option.series[0].data[2].value = (Math.random() * 100).toFixed(2) - 0;
        // }, 9000);

    }
</script>