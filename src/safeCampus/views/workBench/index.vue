<template>
    <div class="app-container">
        <div class="workBenchMain">
            <div class="w33per pdR7">
                <div class="box_h300">
                    <div class="boxTit">xx校园师生</div>
                    <div class="statisticsInfo clear">
                        <div class="statisBox">
                            <div class="tit">校区数量</div>
                            <div class="num">2</div>
                        </div>
                        <div class="statisBox">
                            <div class="tit">在校学生总数</div>
                            <div class="num">12890</div>
                        </div>
                        <div class="statisBox">
                            <div class="tit">在校教职工总数</div>
                            <div class="num">679</div>
                        </div>
                        <div class="statisBox">
                            <div class="tit">安保人员总数</div>
                            <div class="num">139</div>
                        </div>
                    </div>
                    <div class="boxTit mt20">日常巡更</div>
                    <div class="patrolStatis">
                        <div class="patrolBox bg_1">
                            今日巡更计划
                            <span>5</span>
                        </div>
                        <div class="patrolBox bg_2">
                            今日巡更人员
                            <span>4</span>
                        </div>
                        <div class="patrolBox bg_3">
                            未完成计划
                            <span>3</span>
                        </div>
                    </div>
                </div>


                <div class="box_h300">
                    <div class="boxTit">设备联网</div>
                    <div class="pd5">
                        <el-carousel indicator-position='none' :autoplay='false' :interval="4000" class="pdt10" type="card" height="100px">
                            <el-carousel-item v-for="(item,index) in 3" :key="item">
                            <div class="carouselTit">普通摄像头: 152</div>
                            <div class="chartBox">
                                <div class="carouseChart">
                                    <el-progress class="circle" type="circle" width='60' :percentage="25"></el-progress>
                                    <div class="smLegend">
                                        <div class="legend online">在线</div>
                                        <div class="legend offline">不在线</div>
                                    </div>
                                </div>
                            </div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <el-table class="miniTable" height="130" :data="tableData">
                        <el-table-column :show-overflow-tooltip='true' label="设备名称" prop="mc">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip='true'  label="安装位置" prop="pos">
                        </el-table-column>
                        <el-table-column label="数据状态" prop="zt">
                        </el-table-column>
                        <el-table-column label="处理状态" prop="optzt">
                        </el-table-column>
                    </el-table>

                </div>
            </div>
            <div class="w33per pdLR8">
                <div class="box_h300">
                    <div class="boxTit">考勤管理 
                        <el-select v-model="value" class="w150" size="small" placeholder="请选择年级">
                            <el-option>一年级</el-option>
                        </el-select>
                        <div class='setting'>预警设置</div>
                    </div>
                    <div class="kqbox">
                        <div id="chartsBox1"></div>
                    </div>
                </div>
                <!---车辆管理--->
                <div class="box_h300">
                    <div class="boxTit">车辆管理</div>
                    <div class="kqbox">
                        <div id="chartsBox2"></div>
                    </div>
                </div>
            </div>
            <div class="w33per pdL7">
                <div class="box_h200">
                    <div class="boxTit">智能访客</div>
                    <div class="kqbox200">
                        <div id="chartsBox3"></div>
                    </div>
                </div>
                <div class="box_h200">
                    <div class="boxTit noWidth fl">体温检测</div>
                    <div class="twCont">
                        <div class="twBox bg_3">复查合格<span>5</span></div>
                        <div class="twBox bg_2">体温异常<span>13</span></div>
                        <div class="twBox bg_1">体温正常<span>867</span></div>
                    </div>
                    <div class="tableData">
                        <el-table class="miniTable" height="110" :data="tableData2">
                            <el-table-column :show-overflow-tooltip='true' label="异常人员" prop="mc">
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip='true'  label="部门" prop="bm">
                            </el-table-column>
                            <el-table-column label="检查项目" prop="xm">
                            </el-table-column>
                            <el-table-column label="体温" prop="tw">
                            </el-table-column>
                            <el-table-column label="处理状态" prop="optzt">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>


                <div class="box_h200">
                    <div class="boxTit">安防预警
                        <div class='setting'>预警设置</div>
                    </div>
                    <div class="kqbox200">
                        <div id="chartsBox4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return {
            tableData:[
                {mc:'监控0014',pos:'教学楼1楼',offtime:'2020-06-03 21:00:00',zt:'断开',optzt:'待处理'},
                {mc:'监控0014',pos:'教学楼1楼',offtime:'2020-06-03 21:00:00',zt:'断开',optzt:'待处理'},
                {mc:'监控0014',pos:'教学楼1楼',offtime:'2020-06-03 21:00:00',zt:'断开',optzt:'待处理'},
                {mc:'监控0014',pos:'教学楼1楼',offtime:'2020-06-03 21:00:00',zt:'断开',optzt:'待处理'},
                {mc:'监控0014',pos:'教学楼1楼',offtime:'2020-06-03 21:00:00',zt:'断开',optzt:'待处理'},
            ],
            tableData2:[
                {mc:'冯秀兰',bm:'三年级(1)班',xm:'晨检',tw:'38.3',optzt:'待处理'},
                {mc:'冯秀兰',bm:'三年级(1)班',xm:'晨检',tw:'38.3',optzt:'待处理'},
                {mc:'冯秀兰',bm:'三年级(1)班',xm:'晨检',tw:'38.3',optzt:'待处理'},
                {mc:'冯秀兰',bm:'三年级(1)班',xm:'晨检',tw:'38.3',optzt:'待处理'},
                {mc:'冯秀兰',bm:'三年级(1)班',xm:'晨检',tw:'38.3',optzt:'待处理'},
            ],
            chartData1: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    top: 20,
                    data: ['正常', '迟到/早退', '缺勤', '请假']
                },
                grid: {
                    left: '0%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    nameTextStyle:{
                        width: 50
                    },
                    data: ['一年级(1)班', '一年级(2)班', '一年级(3)班', '一年级(4)班']
                },
                series: [
                    {
                        name: '正常',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20,
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [320, 320, 340, 360]
                    },
                    {
                        name: '迟到/早退',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20,
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [100, 100, 120, 140]
                    },
                    {
                        name: '缺勤',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20,
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [10, 5, 7, 8]
                    },
                    {
                        name: '请假',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20,
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [2, 7, 1, 9]
                    },
                   
                ]
            },

            chartData2:{
                tooltip: {
                    trigger: 'item',
                    show:true,
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    // show:false,
                    top:30,
                    right: 10,
                    data: ['滞留', '外来', '校内', '校外出', '校外入', '校内出', '校内入']
                },
                grid: {
                    left: '0%',
                    containLabel: true
                },
                series: [
                    {
                        name: '滞留',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '26%'],
                        center: ['30%', '50%'],
                        label: {
                            position: 'inner',
                            fontSize:14,
                            padding:[-50,0,0,0]
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '滞留\n335'},
                        ]
                    },
                    {
                        name: '车辆',
                        type: 'pie',
                        radius: ['25%', '51%'],
                        center: ['30%', '50%'],
                        label: {
                            position:'inner'
                        },
                        data: [
                            {value: 50, name: '外来'},
                            {value: 100, name: '校内'},
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '75%'],
                        center: ['30%', '50%'],
                        label: {
                            position:'inner'
                        },
                        data: [
                            {value: 15, name: '校外出'},
                            {value: 35, name: '校外入'},
                            {value: 50, name: '校内出'},
                            {value: 50, name: '校内入'}
                        ]
                    }
                ]
            },

            chartData3: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    top: 8,
                    data: ['入校','出校','校内','不通过']
                },
                grid: {
                    top: 40,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        axisLabel: {  
                            interval:0,  
                            rotate:20  
                        },
                        type: 'category',
                        data: ['预约来访', '家长来访', '一般拜访', '公务来访', '会议来访', '快递来访']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '入校',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        data: [10, 20, 10, 10, 10, 10]
                    },
                    {
                        name: '出校',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        data: [10, 18, 8, 8, 8, 6]
                    },
                    {
                        name: '校内',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        data: [20, 15, 18, 22, 14, 25]
                    },
                    {
                        name: '不通过',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        data: [1, 2, 3, 4, 2, 1]
                    },    
                ]
            },

            chartData4:{
                tooltip: {
                    trigger: 'item',
                    show:true,
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    // show:false,
                    top:20,
                    right: 10,
                    data: ['行为预警 50', '人为预警 100', '传感预警 50', '事件预警 100']
                },
                grid: {
                    left: '0%',
                    containLabel: true
                },
                series: [
                    {
                        name: '滞留',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: ['30%', '85%'],
                        center: ['30%', '50%'],
                        label: {
                            position: 'inner',
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 50, name: '行为预警 50'},
                            {value: 100, name: '人为预警 100'},
                            {value: 50, name: '传感预警 50'},
                            {value: 100, name: '事件预警 100'},
                        ]
                    },
                ]
            },

        }
    },
    mounted(){
        let chartsObj1 = echarts.init(document.getElementById('chartsBox1'));
        chartsObj1.setOption(this.chartData1);
        
        let chartsObj2 = echarts.init(document.getElementById('chartsBox2'));
        chartsObj2.setOption(this.chartData2);

        let chartsObj3 = echarts.init(document.getElementById('chartsBox3'));
        chartsObj3.setOption(this.chartData3);

        let chartsObj4 = echarts.init(document.getElementById('chartsBox4'));
        chartsObj4.setOption(this.chartData4);

    },
    methods:{

    }
}
</script>

<style lang='scss' scoped>
.workBenchMain{
    min-width: 1200px;
    // height: 100px;
    // background: #FFF;
}
.w33per{
    float: left;
    width: 33%;
}
.pdLR8{
    padding: 0 8px;
}
.pdR7{
    padding-right: 7px;
}
.pdL7{
    padding-left: 7px;
}
.box_h300,.box_h200{
    border-radius: 10px;
    background: #FFF;
    margin-bottom: 15px;
    padding: 20px;
}
.box_h300{
    width: 100%;
    height: 307px;
}
.box_h200{
    width: 100%;
    height: 200px;
}
.boxTit{
    width: 100%;
    position: relative;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    &.noWidth{
        width: auto;
    }
    .setting{
        font-size: 12px;
        color: #168DFF;
        position: absolute;
        right: 0;
        top: 5px;
        cursor: pointer;
    }
}
.twCont{
    float: right;
    .twBox{
        width: 68px;
        height: 53px;
        border-radius: 10px;
        float: right;
        margin-left:10px;
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
        padding: 6px;
        line-height: 20px;
        span{
            display: block;
            font-size: 16px;
        }
        &.bg_1{
            background:linear-gradient(180deg,rgba(22,141,255,1) 0%,rgba(136,197,255,1) 100%);
        }
        &.bg_2{
             background:linear-gradient(180deg,rgba(250,140,22,1) 0%,rgba(255,204,149,1) 100%);
        }
        &.bg_3{
            background:linear-gradient(180deg,rgba(41,220,158,1) 0%,rgba(164,241,214,1) 100%);
        }
    }
}
.tableData{
    width: 100%;
}
.statisticsInfo{
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
    .statisBox{
        float: left;
        width: 25%;
        .tit{
            font-size: 14px;
            width: 90%;
            color: #808080;
            text-align: center;
            display: block;
            height: 32px;
        }
        .num{
            font-size: 26px;
            color: #333;
            width: 90%;
            font-weight: bold;
            text-align: center;
            padding: 10px 0;
        }
    }
}
.patrolStatis{
    width: 100%;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .patrolBox{
        width: 32%;
        height: 80px;
        border-radius: 10px;
        font-size: 14px;
        color: #FFF;
        text-align: center;
        padding: 10px;
        span{
            clear: both;
            display: block;
            font-size: 26px;
            padding-top: 5px;
        }
        &.bg_1{
            background:linear-gradient(180deg,rgba(22,141,255,1) 0%,rgba(136,197,255,1) 100%);
        }
        &.bg_2{
            background:linear-gradient(180deg,rgba(41,220,158,1) 0%,rgba(164,241,214,1) 100%);
        }
        &.bg_3{
            background:linear-gradient(180deg,rgba(250,140,22,1) 0%,rgba(255,204,149,1) 100%);
        }
    }
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
}
.el-carousel__item {
    background: #FFF;
    border-radius: 10px;
    border: 1px solid #e2e2e2;
    padding: 5px 10px;
    box-shadow: 0 0 1px 1px rgba($color: #999, $alpha: .2);
}
.carouselTit{
    font-size: 14px;
    color: #444;
}
.chartBox{
    width: 100%;
    height: 60px;
}
.carouseChart{
    width: 100%;
    height: 60px;
    padding-top: 5px;
    .circle{
        height: 100%;
        float: left;
    }
    .smLegend{
        overflow: hidden;
        padding-left: 30px;
        .legend{
            margin: 5px 0;
            font-size: 12px;
            color: #808080;
            position: relative;
            &.online::after{
                content: '\20';
                position: absolute;
                top: 8px;
                left: -10px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #54ABFF;
            }
            &.offline::after{
                content: '\20';
                position: absolute;
                top: 8px;
                left: -10px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #dcdcdc;
            }
        }
    }
}
.miniTable{
    /deep/ td,/deep/ th{
        padding: 4px 0;
    }
}
.kqbox{
    width: 100%;
    height: 250px;
    #chartsBox1{
        width: 100%;
        height: 250px;
    }
    #chartsBox2{
        width: 100%;
        height: 250px;
    }
}
.kqbox200{
    width: 100%;
    height: 150px;
    #chartsBox3{
        width: 100%;
        height: 150px;
    }
    #chartsBox4{
        width: 100%;
        height: 150px;
    }
}
</style>