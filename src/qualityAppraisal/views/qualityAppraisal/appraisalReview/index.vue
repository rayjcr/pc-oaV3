<template>
    <div class="app-container calendar-list-container">

        <div class="u_TableMain block ofhide" type="border-card">
                <div class="filter-container">
                    <div class="filterBg">
                        <div class="conditionBox">
                            <span class="filterTit">时间：</span>
                            <el-date-picker size="small" v-model="value1" @change="getList(1)" value-format="yyyy-MM-dd" class="dataPicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                        </div>

                        <div class="conditionBox">
                            <span class="filterTit">类型：</span>
                            <el-select v-model="value2" size="small" @change="getList(1)" style="width:100px;" clearable>
                                <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </div>

                        <div class="conditionBox">
                            <span class="filterTit">搜索：</span>
                            <el-input class="w200" size="small" @change="getList(1)" placeholder="搜索教师姓名" suffix-icon="el-icon-search" v-model="value3" clearable></el-input>
                        </div>
                    </div>

                    <div class="mt10">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="batchReview()">批量审核</el-button>
                    </div>
                </div>
                <div class="m_GenTableBox">

                    <el-table class="tableBorder dimensionTable" :data="tableData" @selection-change="selectionChange">
                        <el-table-column type="selection" width="55" :selectable="selectable">                         
                        </el-table-column>
                        <el-table-column label="评价时间" prop="auditTime" width="150">
                            <template slot-scope="scope">{{scope.row.createTime?(scope.row.createTime.split(':')[0]+":"+scope.row.createTime.split(':')[1]):''}}</template>
                        </el-table-column>
                        <el-table-column label="被评对象" prop="name" width="150">
                        </el-table-column>
                        <el-table-column label="评价项" prop="evaluationName" width="150">
                        </el-table-column>
                        <el-table-column label="奖惩" width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.score">
                                    <span :class="scope.row.score<0?'red':'green'">{{scope.row.score}}  分</span>
                                </div>
                                <div v-if="scope.row.medal">
                                    <div class="dimensionImg">
                                        <img :src="scope.row.medalDimensionIdIcon"> 
                                    </div>
                                    <span :class="scope.row.medal<0?'red':'green'">{{scope.row.medal}} 枚</span> 
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="评语" prop="content">
                        </el-table-column>
                        <el-table-column label="评价教师" prop="evaluatorName" width="150">
                        </el-table-column>
                        <el-table-column label="状态" prop="status" width="150">
                            <template slot-scope="scope">
                                <div :class="scope.row.status==0?'':scope.row.status==1?'green':'red'">{{scope.row.status==0?'待审核':scope.row.status==1?'通过':'不通过'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                            <template slot-scope="scope">
                                <div v-show="scope.row.status==0">
                                <!-- <div> -->
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="examine(scope.row)">审核</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :total="ruleItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination>

                </div>
        </div>

        <el-dialog title="审核" :visible.sync="dialogVisible" width="400px">
            <div>
                <el-form ref="form" label-width="80px">
                    <el-form-item label="审核：">
                        <template>
                            <el-radio v-model="radio" label="1">通过</el-radio>
                            <el-radio v-model="radio" label="-1">不通过</el-radio>                    
                        </template>
                    </el-form-item>
                    <el-form-item label="备注：" v-if="radio==-1">
                        <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="remark">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="auditLoading" @click="audit">提交</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api/qualityAppraisal';

export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            textMap: {
                update: '编辑',
                create: '新增'
            },
            value1:'',
            value2:'',
            value3:'',
            option2:[
                {
                    value:"0",
                    label:"未审核"
                },{
                    value:"1",
                    label:"通过"
                },{
                    value:"-1",
                    label:"未通过"
                }
            ],
            dialogStatus:'',
            tableData: [],

            ruleItemSum:0,                                  //规则总条数
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制记录条数
            dialogVisible: false,                           //审核弹框
            radio:'',                                       //审核是否通过
            remark: '',                                     //不通过的备注
            toBeAudited: {},                                //待审核数据
            auditLoading: true,                             //审核等待
            multipleSelection:[],
        }
    },
    computed: {
        // headers: function() {
        //     return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        // },
        // headersV2: function() {
        //     return {Authorization: Cookies.get("Admin-Token")}
        // },
    },
    watch: {

    },
    mounted(){

        this.init();
    },
    methods: {
        init(){
            this.getList();
        },
        /**
         * 翻页采集规则列表
         * by:RayJ
         * time:2019-08-07
         */
        rulePageChange(curpage){
            this.curPage = curpage;
            this.getList();
        },
        //获取评价审核列表
        getList(page = this.curPage,limit = this.pageLimit){
            var param = {
                startTime: this.value1?this.value1[0]:'',
                endTime: this.value1?this.value1[1]:'',
                staffNO: localStorage.getItem("usercode")!='undefined'?localStorage.getItem("usercode"):localStorage.getItem("username"),
                limit,
                page,
                status: this.value2,
                keyWords: this.value3
            }
            qualityApi.evaluationRecodeItem(param).then(res=>{
                this.ruleItemSum = res.value.totalCount;
                this.curPage = page;
                this.tableData = res.value.dataList;
                this.tableData.forEach(e=>{//循环查找姓名为空的----班级评价
                    if(e.name==null){//把姓名改为班级名称
                        qualityApi.getClass({uuid:e.classCode}).then(result => {
                            e.name=result.bj;
                        })                        
                    }
                })
            })
        },
        //点击审核按钮
        examine(row){
            this.radio = '';
            this.remark = '';
            this.auditLoading = false;
            this.dialogVisible = true;
            this.toBeAudited = row;
            this.multipleSelection = [];
        },
        /**
         * 选择列表
         * by:RayJ
         * time:2019-09-18
         */
        selectionChange(val){
            this.multipleSelection = val;
            console.log(this.multipleSelection);
        },
        //审核
        async audit(){
            if(this.radio==''){
                this.$notify({
                    type: 'error',
                    message: '请选择审核状态！',
                    time: 1000
                })          
                return       
            }

            if(this.multipleSelection.length==0){//单个审批
                var param={
                    remark: this.remark,
                    recordItemId: this.toBeAudited.id,
                    status: this.radio
                }

                this.auditLoading = true;
                qualityApi.audit(param).then(res=>{
                    if(res.resultCode==1){
                        this.$notify({
                            type: 'success',
                            message: '操作成功！',
                            time: 1000
                        }) 
                        this.getList();
                        this.auditLoading = false;
                        this.dialogVisible = false;
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            time: 1000
                        })
                        this.auditLoading = false;                   
                    }
                }).catch(e=>{
                    this.$notify({
                        type: 'error',
                        message: '网络异常，请检查网络后重试！',
                        time: 1000
                    })       
                    this.auditLoading = false;           
                })                
            } else {//批量审批
                var param={
                    remark: this.remark,
                    recordItemIds: [],
                    status: this.radio
                }
                this.multipleSelection.forEach(e => {
                    // param.recordItemIds+=e.id;
                    // param.recordItemIds+=','
                    param.recordItemIds.push(e.id)
                })
                this.auditLoading = true;
                qualityApi.batchaudit(param).then(res=>{
                    if(res.resultCode==1){
                        this.$notify({
                            type: 'success',
                            message: '操作成功！',
                            time: 1000
                        }) 
                        this.getList();
                        this.auditLoading = false;
                        this.dialogVisible = false;
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            time: 1000
                        })
                        this.auditLoading = false;                   
                    }
                }).catch(e=>{
                    this.$notify({
                        type: 'error',
                        message: '网络异常，请检查网络后重试！',
                        time: 1000
                    })       
                    this.auditLoading = false;           
                })     
            }

        },
        batchReview(){            
            if(this.multipleSelection.length==0){
                this.$notify({
                    type: 'error',
                    message: '请至少选择一条记录！',
                    time: 1000
                })          
                return       
            }
            this.radio = '';
            this.remark = '';
            this.auditLoading = false;
            this.dialogVisible = true;
        },
        selectable(row,index){
            if(row.status!=0)
                return false;
            return true;
        }
    }
}
</script>

<style scoped lang="scss">
.sliderLeft-enter-active {
    animation-name: fadeInLeft;
    animation-duration: .5s;
}

.sliderLeft-leave-active {
    animation-name: fadeOutLeft;
    animation-duration: .5s;
}
.w100{
    width: 100px;
}
.w200{
    width: 200px;
}
.w250{
    width: 250px;
}
.w300{
    width: 300px;
}
.fl{
    float: left;
}
.ml30{
    margin-left: 30px;
}
.filterTit{
    font-weight: 700;
    font-size: 14px;
    color: #666;
}
.filter-container.innerTab{
    line-height: 0px;
    padding: 0 20px;
    padding-bottom: 15px;
    min-height: auto;
}
.filterPopBox{
    padding:5px;
    .filterCol{
        width: 100%;
        position: relative;
        padding: 5px 0;
        padding-left: 70px;
        .filterTit{
            position: absolute;
            width:60px;
            left: 0;
            height: 32px;
            line-height: 32px;
            text-align: right;
        }
    }
}
.goodsType{
    width: 350px;
    float: left;
    margin-right: 20px;
}
.dimensionTable{
    
    /deep/ .inline{
        display: inline;
    }
    /deep/ .cell{
        line-height: 28px;
    }
    .dimensionImg{
        width: 40px;
        height: 40px;
        display: inline-block;
        float: left;
        margin-right: 4px;
        border-radius: 20px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.dataPicker{
    /deep/ .el-range-separator{
        padding: 0;
    }
}
.dimensionTable .green{
    font-weight: 700;
    color: #208900;
    line-height: 40px;
}
.dimensionTable .red{
    font-weight: 700;
    color: #ff334b;
    line-height: 40px;
}


</style>
