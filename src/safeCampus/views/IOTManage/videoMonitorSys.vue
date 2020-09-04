<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker size="small" v-model="valDate" type="date"></el-date-picker>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <el-radio-group class="classType mgAll10" v-model="classType" size="small">
                    <el-radio-button class="classTab" label="1">实时监控</el-radio-button>
                    <el-radio-button class="classTab" label="2">回放监控</el-radio-button>
                </el-radio-group>
                <div class="selectTab fl">
                    <div class="classTypeListBox">
                        <el-tree :data="classTypeList" :props="defaultProps"></el-tree>
                    </div>
                </div>
                <div class="pd20-lr ofhidden">
                    <div class="boxList">
                        <div class="box">
                            <div class="imgbox">

                            </div>
                            <div class="opcmask">第一小学 操场</div>
                        </div>
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
                {class:"一（1）班",name:"张三",states:"已录入",kh:"1010101011"},
                {class:"一（1）班",name:"张三",states:"已录入",kh:"1010101011"},
                {class:"一（1）班",name:"张三",states:"已录入",kh:"1010101011"},
            ],
            
            classType:'1',
            classTypeList: [
                {
                    label: '第一小学',
                    children: [{
                        label: '教室',
                    }, {
                        label: '操场',
                    }]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            dialogVisible: false
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
    .box{
        width: 200px; height: 150px;
        position: relative;
        .imgbox{
            width: 100%; height: 100%;
            background: #999;
        }
        .opcmask{
            position: absolute; bottom: 0; left: 0;
            width: 100%; height: 30px;
            line-height: 30px; font-size: 14px;
            background: rgba($color: #000000, $alpha: .3);
            color: #fff;
            text-align: center;
        }
    }
}
</style>