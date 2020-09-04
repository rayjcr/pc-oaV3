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
                        <span class="filterTit">预警类型：</span>
                        <el-select v-model="valType" size="small" @change="getList(1)" class="w200" clearable>
                            <el-option v-for="item in securityList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
                <el-button type="primary mgAll10" size="small">导出</el-button>
                <el-table class="tableBorder" :data="tableData">
                    <el-table-column label="序号" width="50" type="index">
                    </el-table-column>
                    <el-table-column label="预警日期"  prop="yjrq">
                    </el-table-column>
                    <el-table-column label="预警来源" prop="ly">
                    </el-table-column>
                    <el-table-column label="预警提醒人" prop="yjtxr">
                    </el-table-column>
                    <el-table-column label="预警时间" prop="yjsj">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            valDate:"",
            valType:"",             //预警类型   
            securityList:[                  //预警类型
                {name:"行为预警",id:1,valist:["打架斗殴","人员拥挤"]},
                {name:"人员预警",id:2,valist:["陌生人","黑名单","非法人员","健康预警"]},
                {name:"传感预警",id:3,valist:["烟感检测","燃气检测","压力检测","PM2.5"]},
                {name:"事件预警",id:4,valist:["非法入侵","重点区域","消防通道占用","周边区域"]},

            ],
            tableData:[
                {yjrq:"2020-6-6",ly:"智能访客",yjtxr:"王老师、张老师",yjsj:"11：38"},
                {yjrq:"2020-6-6",ly:"智能访客",yjtxr:"王老师、张老师",yjsj:"11：38"},
                {yjrq:"2020-6-6",ly:"智能访客",yjtxr:"王老师、张老师",yjsj:"11：38"},
                {yjrq:"2020-6-6",ly:"智能访客",yjtxr:"王老师、张老师",yjsj:"11：38"},],
            dialogVisible: false
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