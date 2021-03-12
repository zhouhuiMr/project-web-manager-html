<template>
    <scoll-bar :is-show-vertical="true" :is-show-horizontal="false" thumb-width="8">
        <div style="width: 100%;height: 2000px">
            <v-chart class="chart" :option="option" />
        </div>
    </scoll-bar>
</template>

<style>
    .myExample{
        font-size: 20px;
        color: #5eacfd;
        font-weight: 600;
    }
    .chart{
        height: 400px;
        width: 600px;
    }
</style>

<script>
    import ScollBar from '../component/scroll-bar.vue';
    import { use } from 'echarts/core';

    import {
        TooltipComponent
    } from 'echarts/components';
    import {
        GaugeChart
    } from 'echarts/charts';
    import {
        CanvasRenderer
    } from 'echarts/renderers';

    import VChart from "vue-echarts";

    use(
        [TooltipComponent, GaugeChart, CanvasRenderer]
    );

    export default {
        name : "homePage",
        data () {
            return {
                option : {
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [{
                        name: 'Pressure',
                        type: 'gauge',
                        progress: {
                            show: true
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}'
                        },
                        data: [{
                            value: 80,
                            name: 'SCORE'
                        }]
                    }]
                },
            }
        },
        methods : {
            bt_show : function(){
                console.info(1111)
            },
        },
        components : {
            ScollBar,
            VChart
        },
        computed : function(){
        }
    }
</script>