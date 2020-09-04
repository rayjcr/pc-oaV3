<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear pd20">
            <div class="typeTabs">
                <el-radio-group v-model="jurisdictionType" size="small">
                    <el-radio-button label="1">老师</el-radio-button>
                    <el-radio-button label="2">学生</el-radio-button>
                </el-radio-group>
            </div>
            <el-tabs v-model="activeName" class="mt10">
                <el-tab-pane name='1' :label="tabLabel[jurisdictionType-1][0]">
                    
                    <el-tabs type="border-card" tab-position="left">
                        <el-tab-pane label="星期一">
                            <attendTable></attendTable>
                        </el-tab-pane>
                        <el-tab-pane label="星期二">
                            <attendTable></attendTable>
                        </el-tab-pane>
                        <el-tab-pane label="星期三">
                            <attendTable></attendTable>
                        </el-tab-pane>
                        <el-tab-pane label="星期四">
                            <attendTable></attendTable>
                        </el-tab-pane>
                        <el-tab-pane label="星期五">
                            <attendTable></attendTable>
                        </el-tab-pane>
                        <el-tab-pane label="星期六">
                            <attendTable></attendTable>
                        </el-tab-pane>
                        <el-tab-pane label="星期日">
                            <attendTable></attendTable>
                        </el-tab-pane>
                    </el-tabs>


                </el-tab-pane>
                <el-tab-pane name='2' :label="tabLabel[jurisdictionType-1][1]">配置管理</el-tab-pane>
                <el-tab-pane name='3' :label="tabLabel[jurisdictionType-1][2]">角色管理</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import attendTable from './components/attendanceTable'
export default {
    data(){
        return{
            jurisdictionType:1,
            tabLabel:[['教师上班时间设置','例外情况调整','设置'],['学生上课时间设置','例外情况调整','设置']],
            activeName:"1",
        }
    },
    components: {
        attendTable
    },
    mounted(){

    },
    methods:{

    }
}
</script>

<style>

</style>