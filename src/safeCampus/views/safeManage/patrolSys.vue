<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">开始日期：</span>
                        <el-date-picker size="small" class="w200" v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
                    </div>

                    <div class="conditionBox">
                        <span class="filterTit">结束日期：</span>
                        <el-date-picker size="small" class="w200" v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">巡更计划</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="patrolTabs">
                    <div class="patrolTab"><span class='color_1'>8</span><br>总保安人员</div>
                    <div class="patrolTab"><span class='color_2'>4</span><br>今日执勤人员</div>
                    <div class="patrolTab"><span class='color_3'>2</span><br>今日巡更人员</div>
                    <div class="patrolTab"><span class='color_4'>4</span><br>计划巡更次数</div>
                    <div class="patrolTab"><span class='color_5'>5</span><br>计划巡更地点数</div>
                </div>
                <div class="mgAll10 fl">
                    <el-button type="primary" size="small">巡更设置</el-button>
                    <el-button type="primary" size="small">保安排班</el-button>
                </div>
                <el-table class="tableBorder" :data="tableData">
                    <el-table-column label="巡更日期" width="100" prop="rq">
                    </el-table-column>
                    <el-table-column label="当日巡更计划" width="150" prop="jhname">
                    </el-table-column>
                    <el-table-column align='center' label="巡更开始时间" width="150" prop="starttime">
                    </el-table-column>
                    <el-table-column align='center' label="巡更结束时间" width="150" prop="endtime">
                    </el-table-column>
                    <el-table-column align='center' label="总巡更地点数"  width="150" prop="placesum">
                    </el-table-column>
                    <el-table-column align='center' label="已巡更地点数"  width="150" prop="placenum">
                    </el-table-column>
                    <el-table-column align='center' label="巡更状态"  width="100" prop="zt">
                    </el-table-column>
                    <el-table-column label="操作">
                        <el-button type="primary" size="mini">复检</el-button>
                    </el-table-column>
                </el-table>

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
            
            tableData:[
                {rq:'2020-06-03',jhname:'晚间巡更计划1',starttime:'9:06',endtime:'9:42',placesum:'8',placenum:'5',zt:'未完成'},
                {rq:'2020-06-03',jhname:'晚间巡更计划2',starttime:'9:06',endtime:'9:42',placesum:'8',placenum:'8',zt:'已完成'},
                {rq:'2020-06-03',jhname:'晚间巡更计划3',starttime:'9:06',endtime:'9:42',placesum:'8',placenum:'5',zt:'未完成'},
                {rq:'2020-06-03',jhname:'晚间巡更计划4',starttime:'9:06',endtime:'9:42',placesum:'8',placenum:'5',zt:'未完成'},
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
.patrolTabs{
    width: 100%;
    .patrolTab{
        width: 19%;
        height: 100px;
        margin: 15px .5% 10px;
        float: left;
        border-radius: 10px;
        border:1px solid #e2e2e2;
        text-align: center;
        padding: 20px 10px;
        font-size: 14px;
        color: #444;
        font-weight: bold;
        line-height: 30px;
        span{
            font-size: 30px;
        }
        .color_1{
            color: royalblue;
        }
        .color_2{
            color: chocolate;
        }
        .color_3{
            color: green;
        }
        .color_4{
            color: burlywood;
        }
        .color_5{
            color: aquamarine;
        }
    }
}



</style>