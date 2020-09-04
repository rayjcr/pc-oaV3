<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker size="small" v-model="valDate" type="date"></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">年级：</span>
                        <el-select v-model="valGrade" size="small" class="w200" clearable>
                            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">班级：</span>
                        <el-select v-model="valClass" size="small" class="w200" clearable>
                            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    
                    <div class="conditionBox" v-if="jurisdictionType=='2'">
                        <span class="filterTit">学生姓名：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>
                    <div class="conditionBox" v-if="jurisdictionType=='1'">
                        <span class="filterTit">教师姓名：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="m_GenLeft fl">
                    <div class="typeTabs mt10 fl">
                        <el-radio-group v-model="jurisdictionType" size="small">
                            <el-radio-button label="1">老师</el-radio-button>
                            <el-radio-button label="2">学生</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="">
                        <el-select class="fr w150" size="small" v-model="valuechart" placeholder="请选择">
                            <el-option value="1">一年级</el-option>
                            <el-option value="2">二年级</el-option>
                        </el-select>
                    </div>
                    <div class="chartBox">
                        <div id="chartsObj_FEATURE"></div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <el-button type="primary mgAll10" size="small">导出</el-button>
                    <el-alert class="tipsAlert" :closable="false" title="注：请手机端人脸录入，以下表统计" type="info"></el-alert>
                    <div class="statistics">
                        总人数：875 人      已录入数：589 人       未录入数：286 人
                    </div>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="班级"  prop="class">
                        </el-table-column>
                        <el-table-column label="学生姓名" prop="name">
                        </el-table-column>
                        <el-table-column label="人脸状态" prop="states">
                        </el-table-column>
                        <el-table-column label="人脸照片" prop="photo">
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
            jurisdictionType:'1',
            valDate:"",
            valGrade:"",        
            valClass:"",       
            gradeList:[
                {name:"一年级",id:1},
                {name:"二年级",id:2}
            ],
            classList:[
                {name:"（1）班",id:1},
                {name:"（2）班",id:2}],
            valuechart:"",
            tableData:[
                {class:"一（1）班",name:"张三",states:"已录入",photo:""},
                {class:"一（1）班",name:"张三",states:"已录入",photo:""},
                {class:"一（1）班",name:"张三",states:"已录入",photo:""},
            ],
            teacherChartsData:{
                title:{
                    zlevel: 0,
                    text: ['总人数',135+'人'].join('\n'),
                    x:'center',
                    y:'center',
                    left: '193',
                    textAlign: 'center',
                    textStyle: {
                        color: '#444444',
                        fontSize: 20,
                        fontWeight: 'bold',
                        lineHeight: 35,
                    },
                },
                tooltip: {
                    trigger: 'item',
                    show:true,
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    show:true,
                    top:10,
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        top: 0,
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            position: 'inner'
                        },
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
                            {value: 150, name: '已采集'},
                            {value: 10, name: '未采集'},
                        ]
                    }
                ]
            },
            studentChartsData:{
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['已采集','未采集']
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['一年级', '二年级', '三年级']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '已采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '未采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                ]
            },
            dialogVisible: false
        }
    },
    watch:{
        jurisdictionType(val){
            let teacherCharts = echarts.init(document.getElementById('chartsObj_FEATURE'));
            teacherCharts.clear()
            if(val == "1"){
                teacherCharts.setOption(this.teacherChartsData);
            }else{
                teacherCharts.setOption(this.studentChartsData);
            }
        }
    },
    mounted(){
        let teacherCharts = echarts.init(document.getElementById('chartsObj_FEATURE'));
        teacherCharts.setOption(this.teacherChartsData);
    },
    methods:{
        getList(){

        },
    }
}
</script>
<style lang='scss' scoped>
.typeTabs{
    width: 100%;
}
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
}
.m_GenRight{
    overflow: hidden;
}
.statistics{
    font-size: 14px; line-height: 36px;
    padding: 0 16px;
}
</style>