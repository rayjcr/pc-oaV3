<template>
    <div class="app-container calendar-list-container">

        <el-tabs class="u_TableMain columns ofhide" type="border-card" @tab-click="changeTab">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-collection"></i> 教师评价统计</span>
                <div class="filter-container innerTab">
                    <span class="filterTit">时间：</span>
                    <el-date-picker size="small" v-model="filterDate" class="dataPicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>

                    <span class="filterTit ml30">搜索：</span>
                    <el-input class="w200" size="small" clearable suffix-icon="el-icon-search" v-model="filterKey"></el-input>

                    <el-button type="primary" size="small" @click="getEvaluationRecord">搜索</el-button>

                </div>
                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable" :data="EvaluationList">
                        <el-table-column label="教师姓名" prop="evaluatorName" width="150">
                        </el-table-column>
                        <el-table-column label="关联班级" prop="classNameList">
                            <template slot-scope="scope">
                                {{scope.row.classNameList.join(",")}}
                            </template>
                        </el-table-column>
                        <el-table-column label="评价次数" prop="evaluationTimes" width="150">
                        </el-table-column>
                        <el-table-column label="奖励积分" prop="totalScore" width="150">
                        </el-table-column>
                        <el-table-column label="奖励勋章" prop="medalNum" width="150">
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :total="recordSum" :page-size="pageLimit" :current-page="curPage" @current-change="listPageChange"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-receiving"></i> 日志记录</span>

                <div class="filter-container innerTab">
                    
                    <el-popover placement="right" width="400" trigger="click">
                        <div class="filterPopBox">
                            <div class="filterCol">
                                <span class="filterTit">班级：</span>
                                <el-cascader class="w250 selClass" v-model="targetClass" size="small" placeholder="请选择班级或年级" :options="GradeClassList" filterable :props="{multiple:true, children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">维度：</span>
                                <el-cascader v-model="dimensionId" class="w250 selClass" size="small" placeholder="请选择维度" :options="dimensionList" filterable :props="{value:'id', label:'name', children:'dimensionItemVOList', checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">时间：</span>
                                <el-date-picker size="small" v-model="filterDate" class="dataPicker w250" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">关键词：</span>
                                <el-input class="w250" size="small" suffix-icon="el-icon-search" v-model="filterKey"></el-input>
                            </div>
                            <div class="filterCol">
                                <el-button size="small" type="primary" icon="el-icon-search" @click="getLogList">筛选</el-button>
                            </div>
                        </div>
                    <el-button slot="reference" type="primary" size="small" icon="el-icon-search" @click="initFilter">筛选条件</el-button>
                    </el-popover>
                    <!-- 一个高级查询 （按班级，维度，时间，关键词） -->
                </div>

                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable receivingTable" :data="logList">
                        <el-table-column label="评价时间" prop="createTime" width="150">
                            <template slot-scope="scope">{{scope.row.createTime?(scope.row.createTime.split(':')[0]+":"+scope.row.createTime.split(':')[1]):''}}</template>
                        </el-table-column>
                        <el-table-column label="教师姓名" prop="evaluatorName" width="150">
                        </el-table-column>
                        <el-table-column label="学生姓名" prop="name" width="150">
                        </el-table-column>
                        <el-table-column label="班级" prop="className" width="150">
                        </el-table-column>
                        <el-table-column label="评价项" prop="evaluationName" width="250">
                        </el-table-column>
                        <el-table-column label="奖惩" width="150">
                            <template slot-scope="scope">
                                <!-- <span :class="(scope.row.type==1||scope.row.type==3)?'green':'red'">{{(scope.row.type==1||scope.row.type==3)?'+':'-'}}{{scope.row.jc}} {{(scope.row.type==1||scope.row.type==2)?'分':'勋章'}}</span> -->
                                <span v-if="scope.row.rewardOperation!=null" :class="scope.row.rewardOperation.indexOf('-')==-1?'green':'red'">{{scope.row.rewardOperation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="维度" prop="dimensionName" width="220">
                        </el-table-column>
                        <el-table-column label="评语" prop="content">
                        </el-table-column>   
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :total="logSum" :page-size="pageLimit" :current-page="curLogPage" @current-change="logPageChange"></el-pagination>
                </div>




            </el-tab-pane>

        </el-tabs>


        
    </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import * as qualityApi from '@comm/api/qualityAppraisal';
import * as baseClassApi from '@comm/api/admin/class';
import * as baseXnxqApi from '@comm/api/admin/division';
import * as evaluationApi from '@comm/api/evaluationSetting';
export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制数量
            recordSum:0,                                    //总的记录条数
            curLogPage:1,                                   //当前日志页码
            logSum:0,                                       //日志的总记录条数
            filterKey:'',                                   //过滤查询字符串
            filterDate:[],                                  //过滤时间区间
            EvaluationList:[],                              //评价记录列表
            GradeClassList:[],                              //年级班级级联菜单
            targetClass:[],                                 //目标范围
            dimensionList:[],                               //所有维度列表
            dimensionId:[],                                 //所选的维度ID

            logList:[],                                     //日志列表


            textMap: {update: '编辑',create: '创建'},
            dialogStatus:'',
            
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
            this.getEvaluationRecord();
            this.getLogList();
        },
        
        /**
         * 获取所有教师评价记录
         * by:RayJ
         * time:2019-08-07
         */
        async getEvaluationRecord(){
            var param = {};
            console.log(this.filterDate,229922)
            if(this.filterDate&&this.filterDate.length!=0){
                param.startTime = moment(this.filterDate[0]).format('YYYY-MM-DD');
                param.endTime = moment(this.filterDate[1]).format('YYYY-MM-DD');
            }
            param.evaluatorName = this.filterKey;
            param.page = this.curPage;
            param.limit = this.pageLimit;
            var res = await qualityApi.getEvaluationRecord(param);
            this.EvaluationList = res.value.dataList;
            this.recordSum = res.value.totalCount;
        },

        /**
         * 获取所有日志记录
         * by:RayJ
         * time:2019-08-07
         */
        async getLogList(){
            var param = {};
            console.log(this.targetClass);
            console.log(this.dimensionId);
            console.log(this.filterDate);
            console.log(this.filterKey);
            // {
            // "classList": [
            //     "string"
            // ],
            // "dimensionList": [
            //     "string"
            // ],
            // "endTime": "string",
            // "limit": 0,
            // "page": 0,
            // "personName": "string",
            // "startTime": "string"
            // }
            if(this.targetClass.length>0){
                var classCodeList = [];
                for(var i=0;i<this.targetClass.length;i++){
                    classCodeList.push(this.targetClass[i][1]);
                }
                param.classList = classCodeList;
            }

            param.dimensionList = this.dimensionId;
            if(this.filterDate&&this.filterDate.length!=0){
                param.startTime = moment(this.filterDate[0]).format('YYYY-MM-DD');
                param.endTime = moment(this.filterDate[1]).format('YYYY-MM-DD');
            }
            param.personName = this.filterKey;
            param.page = this.curLogPage;
            param.limit = this.pageLimit;
            var res = await qualityApi.getTeacherLog(param);
            this.logList = res.value.dataList;
            this.logSum = res.value.totalCount;
            console.log(this.logList,220066)
            // this.recordSum = res.value.totalCount;
        },
        

        /**
         * 切页列表
         */
        listPageChange(curpage){
            this.curPage = curpage;
            this.getEvaluationRecord();
        },

        logPageChange(curpage){
            this.curLogPage = curpage;
            this.getLogList();
        },


        /**
         * 切换标签卡,重置过滤条件
         * by:RayJ
         * time:2019-08-07
         */
        changeTab(){
            this.filterKey = '';
            this.filterDate = [];
        },

        /**
         * 获取年级班级信息做一个级联菜单
         * by:RayJ
         * time:2019-07-24
         */
        async getAllGradeClass(){
            var xnxqObj = await baseXnxqApi.Getxndm({xxdm:this.$cookie.get('xxdm')})
            var res = await baseClassApi.GetNjBjList({xxdm:this.$cookie.get('xxdm'),xndm:xnxqObj.data.xn});
            this.GradeClassList = res.data;
            for(var i=0;i<this.GradeClassList.length;i++){
                this.GradeClassList[i].label = this.GradeClassList[i].njmc;
                this.GradeClassList[i].value = this.GradeClassList[i].njdm;
                for(var j=0;j<this.GradeClassList[i].bjList.length;j++){
                    this.GradeClassList[i].bjList[j].value = this.GradeClassList[i].bjList[j].uuid;
                    this.GradeClassList[i].bjList[j].label = this.GradeClassList[i].bjList[j].bj;
                }
            }
        },

        /**
         * 获取所有维度列表
         * by:RayJ
         * time:2019-07-24
         */
        async getDimensionList(){
            //如果维度列表里有值.就跳出不访问接口
            if(this.dimensionList.length>0){
                return
            }
            var res = await evaluationApi.getAllDimension();
            var resdata = res.value;
            var arr = []
            resdata.forEach(element => {//循环列表做处理
                if(element.pids!=null&&element.pids!="0"){//如果是子维度
                    var pids = element.pids.split(',');
                    var temp = arr;
                    pids.forEach(pid=>{//循环查找创建他的父维度
                        if(pid=="0"){
                        } else {
                            var item = temp.find(e => e.id==pid);
                            if(item){//如果找到父维度
                                //继续找    
                                if(!item.dimensionItemVOList){
                                    this.$set(item,'dimensionItemVOList',[]);
                                }
                                temp = item.dimensionItemVOList;//
                            } else {//如果没找到父维度
                                //增加这个维度的值
                                temp.push({id:Number(pid),dimensionItemVOList:[]});
                                temp = temp[temp.length-1].dimensionItemVOList;//一直往下找  
                            }
                              
                        }
                    })
                    //找到位置后放入该维度
                    var ind = temp.findIndex(t=>t.id==element.id)
                    if(ind==-1){//没有新建过
                        temp.push(element);
                    } else {
                        element.dimensionItemVOList = temp[ind].dimensionItemVOList;
                        temp[ind] = element;
                    }
                }else{//父维度
                    var ind = arr.findIndex(e=>e.id==element.id);//找这个维度是否已经被创建
                    if(ind>-1){//创建就更新
                        element.dimensionItemVOList = arr[ind].dimensionItemVOList;
                        arr[ind] = element;
                    } else {//没创建就创建
                        arr.push(element);
                    }
                }
            });
            this.dimensionList = arr;

        },


        /**
         * 初始化过滤条件
         * by:RayJ
         * time:2019-08-07
         */
        initFilter(){
           this.getAllGradeClass(); 
           this.getDimensionList();
        },


    }
}
</script>

<style scoped lang="scss">
.sliderRight-enter-active {
    animation-name: fadeInRight;
    animation-duration: .5s;
}

.sliderRight-leave-active {
    animation-name: fadeOutRight;
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
.receivingTable .green{
    font-weight: 700;
    color: #208900;
}
.receivingTable .red{
    font-weight: 700;
    color: #ff334b;
}



</style>
