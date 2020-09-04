<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker size="small" class="w200" v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
                    </div>

                    <div class="conditionBox" v-if="jurisdictionType=='1'">
                        <span class="filterTit">部门：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox" v-if="jurisdictionType=='1'">
                        <span class="filterTit">教师姓名：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>

                    <div class="conditionBox" v-if="jurisdictionType=='2'">
                        <span class="filterTit">年级：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox" v-if="jurisdictionType=='2'">
                        <span class="filterTit">班级：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox" v-if="jurisdictionType=='2'">
                        <span class="filterTit">学生姓名：</span>
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
                        <el-select class="fr w150" size="small" v-model="value" placeholder="请选择">
                            <el-option>晨检</el-option>
                            <el-option>午检</el-option>
                            <el-option>晚检</el-option>
                        </el-select>
                    </div>
                    <div class="chartBox">
                        <div id="chartsObj2"></div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <el-button type="primary" class="mgAll10" size="small">导出</el-button>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="日期" width="100" prop="rq">
                        </el-table-column>
                        <el-table-column label="教师姓名" width="100" prop="name">
                        </el-table-column>
                        <el-table-column label="部门" width="100" prop="bm">
                        </el-table-column>
                        <el-table-column label="检查项目" width="100" prop="lx">
                        </el-table-column>
                        <el-table-column label="检查时间"  width="100" prop="sj">
                        </el-table-column>
                        <el-table-column label="体温"  width="80" prop="tw">
                        </el-table-column>
                        <el-table-column label="健康状态"  width="100" prop="zt">
                        </el-table-column>
                        <el-table-column label="操作" prop="sb">
                            <el-button type="primary" size="mini">复检</el-button>
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
            teacherChartsData:{
                title:{
                    zlevel: 0,
                    text: ['教师总人数',135+'人'].join('\n'),
                    x:'center',
                    y:'center',
                    // top: 'center',
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
                            {value: 150, name: '正常'},
                            {value: 10, name: '异常'},
                        ]
                    }
                ]
            },
            studentChartsData:{

            },
            tableData:[
                {rq:'06-03',name:'张三老师',bm:'行政部',lx:'晨检',sj:'07：53',tw:'36.5',zt:'健康',sb:'中控ZC-3644'},
                {rq:'06-03',name:'张三老师',bm:'行政部',lx:'晨检',sj:'07：53',tw:'36.8',zt:'健康',sb:'中控ZC-3644'},
                {rq:'06-03',name:'张三老师',bm:'行政部',lx:'晨检',sj:'07：53',tw:'37.1',zt:'健康',sb:'中控ZC-3644'}
            ],
        }
    },
    mounted(){
        let teacherCharts = echarts.init(document.getElementById('chartsObj2'));
        teacherCharts.setOption(this.teacherChartsData);
    },
    methods:{

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
    #chartsObj2{
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
</style>