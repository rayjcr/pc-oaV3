<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">区域：</span>
                        <el-select v-model="valQy" size="small" class="w200" clearable>
                            <el-option v-for="item in qyList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">位置：</span>
                        <el-select v-model="valWz" size="small" class="w200" clearable>
                            <el-option v-for="item in wzList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">预警类型：</span>
                        <el-select v-model="valType" size="small" class="w200" clearable>
                            <el-option v-for="item in securityList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">月份：</span>
                        <el-date-picker size="small" v-model="valDate" type="month" placeholder="选择月"></el-date-picker>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="m_GenLeft fl">
                    <div class="title">周边预警</div>
                    <div class="chartBox">
                        <div id="chartsObj_CAMPUS"></div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <el-button type="primary mgAll10" size="small">导出</el-button>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="序号" width="50" type="index">
                        </el-table-column>
                        <el-table-column label="设备名称"  prop="sbmc">
                        </el-table-column>
                        <el-table-column label="设备类型" prop="sblx">
                        </el-table-column>
                        <el-table-column label="区域" prop="qy">
                        </el-table-column>
                        <el-table-column label="位置" prop="wz">
                        </el-table-column>
                        <el-table-column label="预警类型" prop="yjlx">
                        </el-table-column>
                        <el-table-column label="预警时间" prop="yjsj">
                        </el-table-column>
                        <el-table-column label="监控播放">
                            <i class="el-icon-video-play"></i>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            valDate:"",
            valType:"",             //预警类型   
            valQy:"", 
            valWz:"",
            qyList:[
                {name:"教学楼",id:1,wzList:[{name:"教学楼一楼",id:1},{name:"教学楼二楼",id:2}]},
                {name:"行政楼",id:2,wzList:[{name:"行政楼一楼",id:1},{name:"行政楼二楼",id:2}]},
                {name:"文艺楼",id:3,wzList:[{name:"文艺楼一楼",id:1},{name:"文艺楼二楼",id:2}]},
            ], 
            wzList:[],
            securityList:[                  //预警类型
                {name:"行为预警",id:1,valist:["打架斗殴","人员拥挤"]},
                {name:"人员预警",id:2,valist:["陌生人","黑名单","非法人员","健康预警"]},
                {name:"传感预警",id:3,valist:["烟感检测","燃气检测","压力检测","PM2.5"]},
                {name:"事件预警",id:4,valist:["非法入侵","重点区域","消防通道占用","周边区域"]},

            ],
            tableData:[
                {sbmc:"海康DS-IPC-E22H",sblx:"监控摄像头",qy:"东门",wz:"一区",yjlx:"周边预警",yjsj:"2020-6-3 11：38"},
                {sbmc:"海康DS-IPC-E22H",sblx:"监控摄像头",qy:"东门",wz:"一区",yjlx:"周边预警",yjsj:"2020-6-3 11：38"},
                {sbmc:"海康DS-IPC-E22H",sblx:"监控摄像头",qy:"东门",wz:"一区",yjlx:"周边预警",yjsj:"2020-6-3 11：38"},
                {sbmc:"海康DS-IPC-E22H",sblx:"监控摄像头",qy:"东门",wz:"一区",yjlx:"周边预警",yjsj:"2020-6-3 11：38"},
            ],
            chartsData:{
                tooltip: {
                    trigger: 'item',
                    show:true,
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    show:true,
                    orient: 'vertical',
                    top:10,
                    right: 10,
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: "55%",
                        top: 0,
                        avoidLabelOverlap: false,
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 150, name: '东门一区'},
                            {value: 10, name: '南门一区'},
                            {value: 15, name: '北门一区'},
                            {value: 20, name: '西门一区'},
                        ]
                    }
                ]
            },
        }
    },
    mounted(){
        let charts = echarts.init(document.getElementById('chartsObj_CAMPUS'));
        charts.setOption(this.chartsData);
    },
    methods:{
        getList(){

        },
    }
}
</script>

<style lang='scss' scoped>
.chartBox{
    width: 100%;
    height: 400px;
    float: left;
    margin-top: 10px;
    >div{
        width: 390px;
        height: 100%;
        margin: 0 auto;
        position: relative;
    }
}
.m_GenLeft{
    width: 40%;
    padding-right: 20px;
    min-width: 400px;
    min-height: 550px;
    border-right: 1px solid #e2e2e2;
    .title{
        font-size: 14px; line-height: 36px;
    }
}
.m_GenRight{
    overflow: hidden;
}
.el-icon-video-play{
    font-size: 20px; color: rgb(64,158,255);
}
</style>