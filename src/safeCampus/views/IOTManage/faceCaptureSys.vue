<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker size="small" v-model="valDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">人员类型：</span>
                        <el-select v-model="valType" size="small" class="w200" clearable>
                            <el-option v-for="item in lxList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
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
                        <span class="filterTit">姓名：</span>
                        <el-input size="small" class="w150"></el-input>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <div class="boxList mt10">
                    <el-card class="box-card mgAll10" v-for="(item,index) in list" :key="index">
                        <div class="imgbox"></div>
                        <ul class="info">
                            <li>经过时间：{{item.time}}</li>
                            <li>人员类型：{{item.rylx}}</li>
                            <li>经过地点：{{item.jgdd}}</li>
                        </ul>
                    </el-card >
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
            valType:"",
            valQy:"", 
            valWz:"",
            lxList:[
                {name:"白名单",id:1},
                {name:"黑名单",id:2},
                {name:"陌生人",id:3},
            ],
            qyList:[
                {name:"教学楼",id:1,wzList:[{name:"教学楼一楼",id:1},{name:"教学楼二楼",id:2}]},
                {name:"行政楼",id:2,wzList:[{name:"行政楼一楼",id:1},{name:"行政楼二楼",id:2}]},
                {name:"文艺楼",id:3,wzList:[{name:"文艺楼一楼",id:1},{name:"文艺楼二楼",id:2}]},
            ], 
            wzList:[],
            list:[
                {time:"2020-06-08",rylx:"白名单",jgdd:"学校东大门门口"},
                {time:"2020-06-08",rylx:"白名单",jgdd:"学校东大门门口"},
                {time:"2020-06-08",rylx:"白名单",jgdd:"学校东大门门口"},
                {time:"2020-06-08",rylx:"白名单",jgdd:"学校东大门门口"},
            ]
        }
    },
    watch:{
        
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
.statistics{
    font-size: 14px; line-height: 36px;
    padding: 0 16px;
}
.classType{
    width: 100%;
    text-align: center;
}
.selectTab{
    width: 200px;
    padding: 0 20px 20px 0;
    height: 600px;
    border-right: 1px solid #e2e2e2;
}
.classTypeListBox{
    padding: 10px 0;
    /deep/ .el-tree-node__content{
        height: 32px;
    }
}
.boxList{
    .box-card{
        width: 250px; height: 300px;
        position: relative;
        float: left;
        
        .imgbox{
            width: 100%; height: 180px;
            background: #999;
        }
        ul{
            margin-top: 10px;
            li{
                font-size: 14px; color: #666; line-height: 24px;
            }
        }
    }
}
</style>