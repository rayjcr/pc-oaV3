<template>
    <div class="app-container">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="mt10 fl">
                    <el-button type="primary" icon="el-icon-plus">新增</el-button>
                    <el-button type="primary" icon="el-icon-delete">删除</el-button>
                    <el-button type="primary" icon="el-icon-upload2">导入</el-button>
                </div>
                <div class="mt10 fr">
                    <el-input class="fl w200"></el-input><el-button type="primary" class="fl ml10" icon="el-icon-search">查询</el-button>
                </div>
            </div>
            <div class="m_GenTableBox flexBox">
                <div class="selectTab fl">
                    <el-radio-group class="classType" v-model="classType" size="small">
                        <el-radio-button class="classTab" label="1">行政班</el-radio-button>
                        <el-radio-button class="classTab" label="2">临时班</el-radio-button>
                    </el-radio-group>
                    <div class="classTypeListBox">
                        <el-tree :data="classTypeList" :props="defaultProps"></el-tree>
                    </div>
                </div>
                <div class="pd20-lr ofhidden">
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column type="selection" width="55">                         
                        </el-table-column>
                        <el-table-column label="序号" width="50" prop="xh">
                        </el-table-column>
                        <el-table-column label="学生姓名" width="100" prop="name">
                        </el-table-column>
                        <el-table-column label="学号" width="100" prop="gh">
                        </el-table-column>
                        <el-table-column label="性别" width="100" prop="sex">
                        </el-table-column>
                        <el-table-column label="手机号" prop="phone">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            classType:'1',
            tableData:[
                {xh:'1',name:'张三',gh:'103',sex:'男',zc:'高级教师',js:'班主任',phone:'13566666544'},
                {xh:'2',name:'杜拉拉',gh:'105',sex:'女',zc:'高级教师',js:'任课教师',phone:'13566666544'},
                {xh:'3',name:'刘明超',gh:'112',sex:'男',zc:'高级教师',js:'班主任',phone:'13566666544'},
                {xh:'4',name:'吴彩鸾',gh:'113',sex:'女',zc:'高级教师',js:'班主任',phone:'13566666544'},
                {xh:'5',name:'李思琪',gh:'123',sex:'女',zc:'高级教师',js:'班主任',phone:'13566666544'},
            ],
            classTypeList: [
                {
                    label: '一年级',
                    children: [{
                        label: '1(1)班',
                    }, {
                        label: '1(2)班',
                    }]
                },{
                    label: '二年级',
                    children: [{
                        label: '2(1)班',
                    }, {
                        label: '2(2)班',
                    }]
                },{
                    label: '三年级',
                    children: [{
                        label: '3(1)班',
                    }, {
                        label: '3(2)班',
                    }, {
                        label: '3(3)班',
                    }]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
        }
    },
    mounted(){

    },
    methods:{

    }
}
</script>

<style lang='scss' scoped>
.selectTab{
    width: 200px;
    padding: 20px 20px 20px 0;
    height: 600px;
    border-right: 1px solid #e2e2e2;
    .classType{
        width: 100%;
        .classTab{
            width: 50%;
            /deep/ .el-radio-button__inner{
                width: 100%;
            }
        }
    }
}
.classTypeListBox{
    padding: 10px 0;
    /deep/ .el-tree-node__content{
        height: 32px;
    }
}
</style>