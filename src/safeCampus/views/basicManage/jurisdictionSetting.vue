<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filterBg">
                    <div class="conditionBox">
                        <span class="filterTit">查询老师：</span>
                        <el-input size="small" class="w200" placeholder="请输入查询关键字"></el-input>
                    </div>
                    <div class="pd5 fl">
                        <el-button size="small" type="primary" icon="el-icon-plus">新增角色</el-button>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox ">
               
                <el-table class="tableBorder" :data="tableData">
                    <el-table-column type="selection" width="55">                         
                    </el-table-column>
                    <el-table-column label="角色" width="150" prop="jsname">
                    </el-table-column>
                    <el-table-column label="人员"  prop="jspeople">
                    </el-table-column>
                    <el-table-column label="操作" width="300" prop="phone">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary">编辑</el-button>
                            <el-button size="mini" type="primary">权限详情</el-button>
                            <el-button size="mini" type="danger" v-if="scope.row.jsname!='管理员'&&scope.row.jsname!='子管理员'">删除角色</el-button>
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
                {jsname:'管理员',jspeople:'李老师'},
                {jsname:'子管理员',jspeople:'李老师 , 王老师 , 周老师'},
                {jsname:'班主任',jspeople:'李老师 , 王老师 , 周老师 , 姜老师 , 杜老师 , 赵老师 , 钱老师 , 孙老师 , 吴老师'},
            ]
        }
    },
    mounted(){

    },
    methods:{

    }
}
</script>

<style>

</style>