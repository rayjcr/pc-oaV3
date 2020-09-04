<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">设备类型：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>

                    <div class="conditionBox">
                        <span class="filterTit">区域：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>

                    <div class="conditionBox">
                        <span class="filterTit">位置：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">网络状态：</span>
                        <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="m_GenTableBox ">
                <el-alert class="tipsAlert" title="注：本模块操作前，请先设置【学校设备分布】的区域和位置" type="warning"></el-alert>
                <el-table class="tableBorder" :data="tableData">
                    <el-table-column type="selection" width="55">                         
                    </el-table-column>
                    <el-table-column label="序号" width="50" prop="xh">
                    </el-table-column>
                    <el-table-column label="设备序列号" width="150" prop="eqxh">
                    </el-table-column>
                    <el-table-column label="设备名称" width="150" prop="eqname">
                    </el-table-column>
                    <el-table-column label="设备类型" width="150" prop="eqtype">
                    </el-table-column>
                    <el-table-column label="区域"  width="100" prop="area">
                    </el-table-column>
                    <el-table-column label="位置"  width="100" prop="pos">
                    </el-table-column>
                    <el-table-column label="网络状态" width="100" prop="netstate">
                    </el-table-column>
                    <el-table-column label="最后一次连接时间" prop="lasttime">
                    </el-table-column>
                    <el-table-column label="操作" prop="phone">
                        <template>
                            <el-button size="mini" type="primary">详情</el-button>
                            <el-button size="mini" type="primary">编辑</el-button>
                            <el-button size="mini" type="danger">删除</el-button>
                        </template>
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
            tableData:[
                {xh:'1',eqxh:'20201563247',eqname:'考勤打卡机',eqtype:'安防设备',area:'学校大门',pos:'东门',netstate:'正常',lasttime:'2020-06-30 19:12:25'}
            ]
        }
    },
    mounted(){

    },
    methods:{

    }
}
</script>

<style lang='scss' scoped>
.tipsAlert{
    margin: 20px 0 10px 0;
}
</style>