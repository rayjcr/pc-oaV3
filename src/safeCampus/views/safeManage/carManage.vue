<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker size="small" class="w200" v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
                    </div>

                    <div class="conditionBox">
                        <span class="filterTit">车辆类型：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">出入类型：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>

                    <div class="conditionBox">
                        <span class="filterTit">车牌号：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">姓名：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>

                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="m_GenLeft fl">
                    <div class="typeTabs mt10 fl" style="font-size:20px;padding-top:10px;">
                        车辆管理
                    </div>
                    <div class="chartBox">
                        <div id="chartsObj4"></div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <el-radio-group v-model="carListType" size="small" class="mgAll10">
                        <el-radio-button label="1">车辆管理记录</el-radio-button>
                        <el-radio-button label="2">白名单设置</el-radio-button>
                        <el-radio-button label="3">黑名单设置</el-radio-button>
                    </el-radio-group>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="日期" width="100" prop="rq">
                        </el-table-column>
                        <el-table-column label="姓名" width="100" prop="name">
                        </el-table-column>
                        <el-table-column label="车辆类型" width="100" prop="lx">
                        </el-table-column>
                        <el-table-column label="车牌号" width="100" prop="cp">
                        </el-table-column>
                        <el-table-column label="出入类型"  width="100" prop="crlx">
                        </el-table-column>
                        <el-table-column label="出入时间"  width="80" prop="sj">
                        </el-table-column>
                        <el-table-column label="设备名称"  prop="sb">
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
            carListType:'1',
            teacherChartsData:{
                tooltip: {
                    trigger: 'item',
                    show:false,
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    show:false,
                    left: 10,
                    data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '31%'],

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
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '61%'],
                        label: {
                            position:'inner'
                        },
                        data: [
                            {value: 50, name: '外来\n50'},
                            {value: 100, name: '校内\n100'},
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['60%', '90%'],
                        label: {
                            position:'inner'
                        },
                        data: [
                            {value: 15, name: '出\n15'},
                            {value: 35, name: '入\n35'},
                            {value: 50, name: '出\n50'},
                            {value: 50, name: '入\n50'}
                        ]
                    }
                ]
            },
            studentChartsData:{

            },
            tableData:[
                {rq:'06-03',name:'张三老师',lx:'校内',cp:'浙A-125456',sj:'07：53',crlx:'入校',zt:'健康',sb:'中控ZC-3644'},
                {rq:'06-03',name:'张三老师',lx:'校内',cp:'浙A-125456',sj:'07：53',crlx:'入校',zt:'健康',sb:'中控ZC-3644'},
                {rq:'06-03',name:'张三老师',lx:'校内',cp:'浙A-125456',sj:'07：53',crlx:'入校',zt:'健康',sb:'中控ZC-3644'}
            ],
        }
    },
    mounted(){
        let teacherCharts = echarts.init(document.getElementById('chartsObj4'));
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
    margin-top: 40px;
    #chartsObj4{
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