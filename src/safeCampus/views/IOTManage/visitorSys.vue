<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">访客日期：</span>
                        <el-date-picker size="small" v-model="valDate" type="date"></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">访客年级：</span>
                        <el-select v-model="valGrade" size="small" class="w200" clearable>
                            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">访客部门：</span>
                        <el-select v-model="valBm" size="small" class="w200" clearable>
                            <el-option v-for="item in bmList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">访客类型：</span>
                        <el-select v-model="valLx" size="small" class="w200" clearable>
                            <el-option v-for="item in lxList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">访问人员：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="m_GenLeft fl">
                    <div class="mt10">
                        <el-select class="fr w150" size="small" v-model="valuechart" placeholder="请选择">
                            <el-option value="1">一年级</el-option>
                            <el-option value="2">二年级</el-option>
                        </el-select>
                    </div>
                    <div class="chartBox">
                        <div id="chartsObj_VISITOR"></div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <el-button type="primary mgAll10" size="small">导出</el-button>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="日期"  prop="rq">
                        </el-table-column>
                        <el-table-column label="被访客人" prop="bfkr">
                        </el-table-column>
                        <el-table-column label="被访部门" prop="bfbm">
                        </el-table-column>
                        <el-table-column label="访客类型" prop="fklx">
                        </el-table-column>
                        <el-table-column label="访客时间" prop="fksj">
                        </el-table-column>
                        <el-table-column label="身份证号" prop="sfzh">
                        </el-table-column>
                        <el-table-column label="访客人" prop="fkr">
                        </el-table-column>
                        <el-table-column label="访客原因" prop="fkyy">
                        </el-table-column>
                        <el-table-column label="审批状态" prop="spzt">
                        </el-table-column>
                        <el-table-column label="操作">
                            <el-button type="primary" size="small">访客确认</el-button>
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
            valBm:"",
            valLx:"",     
            gradeList:[
                {name:"一年级",id:1},
                {name:"二年级",id:2}
            ],
            bmList:[
                {name:"行政部",id:1},
                {name:"教务处",id:2}],
            lxList:[
                {name:"预约",id:1},
                {name:"现场",id:2}],
            valuechart:"",
            tableData:[
                {rq:"6-3",bfkr:"张三",bfbm:"一（1）班",fklx:"现场访客",fksj:"9：48",sfzh:"1103567468784",fkr:"王某",fkyy:"",spzt:"确认中"},
                {rq:"6-3",bfkr:"张三",bfbm:"一（1）班",fklx:"现场访客",fksj:"9：48",sfzh:"1103567468784",fkr:"王某",fkyy:"",spzt:"确认中"},
                {rq:"6-3",bfkr:"张三",bfbm:"一（1）班",fklx:"现场访客",fksj:"9：48",sfzh:"1103567468784",fkr:"王某",fkyy:"",spzt:"确认中"},
                {rq:"6-3",bfkr:"张三",bfbm:"一（1）班",fklx:"现场访客",fksj:"9：48",sfzh:"1103567468784",fkr:"王某",fkyy:"",spzt:"确认中"},
            ],
            studentChartsData:{
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['学生访客数','教师访客数']
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
                        name: '学生访客数',
                        type: 'bar',
                        stack: '访客',
                        barWidth: 15,
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '教师访客数',
                        type: 'bar',
                        stack: '访客',
                        barWidth: 15,
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                ]
            },
            dialogVisible: false
        }
    },
    watch:{
    },
    mounted(){
        let teacherCharts = echarts.init(document.getElementById('chartsObj_VISITOR'));
        teacherCharts.setOption(this.studentChartsData);
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