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
                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="m_GenLeft fl">
                    <div class="title">校园设备分布</div>
                    <el-alert class="tipsAlert" :closable="false" title="注：带星号属于必填。" type="info"></el-alert>
                    <div class="cardlist">
                        <div class="box-card flexMain-row">
                            <div class="title required">区域</div>
                            <div class="flexBox">
                                <span>全部</span><span v-for="(item, index) in qyList" :key="index">{{item.name}}</span>
                            </div>
                            <div class="opcBox">
                                <i class="el-icon-circle-plus-outline"></i>
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                        <div class="box-card flexMain-row">
                            <div class="title">位置</div>
                            <div class="flexBox">
                                <span>全部</span><span v-for="(item, index) in qyList" :key="index">{{item.name}}</span>
                            </div>
                            <div class="opcBox">
                                <i class="el-icon-circle-plus-outline"></i>
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                        <div class="box-card flexMain-row">
                            <div class="title required">硬件设备</div>
                            <div class="flexBox">
                                <span>全部</span><span v-for="(item, index) in qyList" :key="index">{{item.name}}</span>
                            </div>
                            <div class="opcBox">
                                <i class="el-icon-circle-plus-outline"></i>
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="m_GenRight">
                    <el-radio-group class="mgAll10" v-model="jurisdictionType" size="small">
                        <el-radio-button label="1">区域设备汇总</el-radio-button>
                        <el-radio-button label="2">区域设备明细</el-radio-button>
                    </el-radio-group>
                    <div class="statistics" v-if="jurisdictionType=='1'">
                        设备总数量：<span>79</span>
                        设备正常数：<span>79</span>
                        设备异常数：<span>79</span>
                    </div>
                    <div class="statistics" v-if="jurisdictionType=='2'">
                        区域：<span>教学楼</span>
                        设备正常数：<span>79</span>
                        设备异常数：<span>79</span>
                    </div>
                    <el-table class="tableBorder" :data="tableData" v-if="jurisdictionType=='1'">
                        <el-table-column label="序号" width="50" type="index">
                        </el-table-column>
                        <el-table-column label="区域"  prop="qy">
                        </el-table-column>
                        <el-table-column label="设备类型" prop="sblx">
                        </el-table-column>
                        <el-table-column label="总数量" prop="zsl">
                        </el-table-column>
                        <el-table-column label="正常数" prop="zcs">
                        </el-table-column>
                        <el-table-column label="异常数" prop="ycs">
                        </el-table-column>
                        <el-table-column label="明细">
                            <el-button type="primary" size="small">明细</el-button>
                        </el-table-column>
                    </el-table>
                    <el-table class="tableBorder" :data="tableData2" v-if="jurisdictionType=='2'">
                        <el-table-column label="序号" width="50" type="index">
                        </el-table-column>
                        <el-table-column label="设备名称"  prop="name">
                        </el-table-column>
                        <el-table-column label="设备类型" prop="sblx">
                        </el-table-column>
                        <el-table-column label="区域" prop="qy">
                        </el-table-column>
                        <el-table-column label="位置" prop="wz">
                        </el-table-column>
                        <el-table-column label="设备状态" prop="sbzt">
                        </el-table-column>
                        <el-table-column label="最近在线时间" prop="sj">
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
            valQy:"", 
            valWz:"",
            qyList:[
                {name:"教学楼",id:1,wzList:[{name:"教学楼一楼",id:1},{name:"教学楼二楼",id:2}]},
                {name:"行政楼",id:2,wzList:[{name:"行政楼一楼",id:1},{name:"行政楼二楼",id:2}]},
                {name:"文艺楼",id:3,wzList:[{name:"文艺楼一楼",id:1},{name:"文艺楼二楼",id:2}]},
            ], 
            wzList:[],

            valuechart:"",
            tableData:[
                {qy:"1号教学楼",sblx:"监控摄像头",zsl:"10",zcs:"10",ycs:"10"},
                {qy:"1号教学楼",sblx:"监控摄像头",zsl:"10",zcs:"10",ycs:"10"},
                {qy:"1号教学楼",sblx:"监控摄像头",zsl:"10",zcs:"10",ycs:"10"},
                {qy:"1号教学楼",sblx:"监控摄像头",zsl:"10",zcs:"10",ycs:"10"},
            ],
            tableData2:[
                {qy:"1号教学楼",sblx:"监控摄像头",wz:"一楼左侧",name:"海康DS-IPC-E22H",sbzt:"正常",sj:"2020-6-3 11：38"},
                {qy:"1号教学楼",sblx:"监控摄像头",wz:"一楼左侧",name:"海康DS-IPC-E22H",sbzt:"正常",sj:"2020-6-3 11：38"},
                {qy:"1号教学楼",sblx:"监控摄像头",wz:"一楼左侧",name:"海康DS-IPC-E22H",sbzt:"正常",sj:"2020-6-3 11：38"},
                {qy:"1号教学楼",sblx:"监控摄像头",wz:"一楼左侧",name:"海康DS-IPC-E22H",sbzt:"正常",sj:"2020-6-3 11：38"},
            ],
            dialogVisible: false,
            jurisdictionType:"1"
        }
    },
    mounted(){
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
.title{
    font-size: 16px; line-height: 36px;
    text-align: center;
    &.required::before{
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
    }
}
.cardlist{
    border: 1px solid #bbb;
    .box-card{
        border-bottom: 1px solid #bbb;
        padding: 5px 0;
        &:last-child{
            border: none;
        }
        .title{
            width: 80px; text-align: center; font-size: 14px;
            display: flex; 
            align-items: center;         /* 垂直居中 */
            justify-content: center;
        }
        .flexBox{
            padding: 0 5px;
            border-left: 1px solid #eee;
            border-right: 1px solid #eee;
            span{
                display: inline-block;
                width: 80px; height: 36px;
                background: #F3F47E;
                text-align: center; line-height: 36px;
                margin: 5px;
                border-radius: 10px;
            }
        }
        .opcBox{
            display: flex; 
            align-items: center;         /* 垂直居中 */
            justify-content: center;
            font-size: 20px;
            i{
                margin: 0 5px;
                color: rgb(64,158,255);
            }
        }
    }
}

.statistics{
    font-size: 14px; line-height: 36px;
    padding: 0 16px;
    span{
        color: #1EA42E;
        margin-right: 10px;
    }
}
</style>