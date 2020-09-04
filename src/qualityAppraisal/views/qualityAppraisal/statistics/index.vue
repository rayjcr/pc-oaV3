<template>
    <div class="app-container calendar-list-container">

        <el-tabs class="u_TableMain block ofhide" v-model="curTab" @tab-click="getCurTabData" type="border-card">

            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-user"></i> 个人统计</span>
                <div class="filter-container innerTab">
                    <el-popover placement="right" width="420" trigger="click">
                        <div class="filterPopBox">
                            <div class="filterCol">
                                <span class="filterTit">班级：</span>
                                <el-cascader class="w300 selClass" size="small" placeholder="选择班级" v-model="classCode" :options="GradeClassList" filterable :props="{ children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">维度：</span>
                                <el-cascader class="w300 selClass" size="small" placeholder="请选择维度" v-model="dimensionId" :options="dimensionList" filterable :props="{value:'id', label:'name',emitPath:false, children:'dimensionItemVOList', checkStrictly: true,expandTrigger: 'hover',disabled:'' }" clearable></el-cascader>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">时间：</span>
                                <el-date-picker size="small" v-model="value1" value-format="yyyy-MM-dd" class="dataPicker w300" type="daterange" range-separator="至 " start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">关键词：</span>
                                <el-input class="w300" size="small" suffix-icon="el-icon-search" v-model="keyWords"></el-input>
                            </div>
                            <div class="filterCol">
                                <el-button size="small" type="primary" @click="getStudentStatics(1)" icon="el-icon-search">筛选</el-button>
                            </div>
                        </div>
                    <el-button slot="reference" type="primary" size="small" icon="el-icon-search">筛选条件</el-button>
                    </el-popover>
                    <!-- 一个高级查询 （按班级，维度，时间，关键词） -->
                    <el-button slot="reference" type="primary" size="small" icon="el-icon-upload2" @click="dialogVisible=true">导出</el-button>
                </div>

                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable receivingTable" :data="tableData">
                        <el-table-column label="姓名" prop="name">
                        </el-table-column>
                        <el-table-column label="学号" prop="userId">
                        </el-table-column>
                        <el-table-column label="性别" prop="gender">
                            <template slot-scope="scope">
                                {{scope.row.gender==1?'男':'女'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="班级" prop="className">
                        </el-table-column>
                        <el-table-column label="积分" prop="totalScore">
                        </el-table-column>
                        <el-table-column label="勋章等级">
                            <template slot-scope="scope">
                                <div class="dimensionImg" v-for="(item,index) in scope.row.studentMedal">
                                    <img :src="item.icon" :class="{'opacity':!item.have}">
                                    <img src="data:image/png;base64,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" :class="{'noHave':!item.have}">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="人物等级" prop="userLevel">
                            <template slot-scope="scope">
                                {{scope.row.userLevel!=''?scope.row.userLevel:'暂无等级'}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </el-tab-pane>

            <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-school"></i> 班级统计</span>

                <!-- 奖励方式---不奖励 -->
                <div class="filter-container innerTab" v-if="honorType==0">

                    <span class="filterTit">班级：</span>
                    <el-cascader class="w200 selClass" size="small" placeholder="选择班级" v-model="searchForm.classCode" @change="getClassStatistics(1)" :options="GradeClassList" filterable :props="{ children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>

                    <span class="filterTit ml30">维度：</span>
                    <el-cascader class="w250 selClass" size="small" placeholder="请选择维度" v-model="searchForm.dimensionId" @change="getClassStatistics(1)" :options="dimensionList" filterable :props="{value:'id', label:'name', children:'dimensionItemVOList', checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>

                    <span class="filterTit ml30">时间：</span>
                    <el-date-picker size="small" v-model="searchForm.dateRange" class="dataPicker w300" value-format="yyyy-MM-dd" @change="getClassStatistics(1)" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>

                </div>

                <!-- 奖励方式---自动奖励、手动奖励-->
                <div class="filter-container innerTab" v-else>

                    <div v-if="!detailFlg">
                        <span class="filterTit">学年学期：</span>
                        <el-cascader @change="getClassStatistics(1)" class="w250 selClass" v-model="searchForm.schoolYear" placeholder="请选择学年学期" :options="xnxqList" filterable :props="{expandTrigger:'hover'}" clearable></el-cascader>

                        <span class="filterTit ml30">状态：</span>
                        <el-select v-model="searchForm.status" @change="getClassStatistics(1)" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已发布" value="1"></el-option>
                            <el-option label="未发布" value="0"></el-option>
                        </el-select>

                    </div>
                    <div v-else>
                        <span class="filterTit">年级：</span>
                        <el-cascader class="w200 selClass" size="small" placeholder="选择班级" v-model="searchForm.classCode" @change="getClassHonorDetail()" :options="GradeClassList" filterable :props="{ children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>

                        <span class="filterTit ml30">荣誉：</span>
                        <!-- 自动发放 -->
                        <!-- <el-select v-if="honorType==1" @change="getClassHonorDetail()" v-model="searchForm.reward" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已获得" value="1"></el-option>
                            <el-option label="未获得" value="0"></el-option>
                        </el-select>       -->
                        <!-- 手动发放 -->
                        <el-select v-model="searchForm.reward" @change="getClassHonorDetail()" placeholder="请选择" clearable>
                            <el-option
                            v-for="item in honorData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>


                </div>

                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable receivingTable" :data="tableData1" v-if="honorType==0">
                        <el-table-column key="1" label="排名" type="index">
                        </el-table-column>
                        <el-table-column key="2" label="班级" prop="className">
                        </el-table-column>
                        <el-table-column key="3" label="得分" prop="totalScore">
                        </el-table-column>
                        <el-table-column key="4" label="评价次数" prop="evaluationTimes" >
                        </el-table-column>
                    </el-table>
                    <div v-else>
                        <el-table class="tableBorder dimensionTable receivingTable" :data="tableData1" v-if="!detailFlg" v-loading="tableLoading">
                            <el-table-column label="学年" prop="xueNian">
                            </el-table-column>
                            <el-table-column label="学期" prop="xueQi">
                            <template slot-scope="scope">
                                {{scope.row.xueQi=='01'?'上学期':'下学期'}}
                            </template>
                            </el-table-column>
                            <el-table-column label="时间">
                                <template slot-scope="scope">
                                    {{scope.row.week?scope.row.week:scope.row.month}}
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" prop="isPublish" >
                                <template slot-scope="scope">
                                    <span :class="{'green':scope.row.isPublish,'red':!scope.row.isPublish}">{{scope.row.isPublish?'已发布':'未发布'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <el-button @click="detailData = scope.row;detailFlg=true;getClassHonorDetail()" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-table class="tableBorder dimensionTable receivingTable" :data="tableData1" v-else>
                            <el-table-column label="班级" width="300" prop="className">
                            </el-table-column>
                            <el-table-column label="总分" width="200" prop="totalScore">
                            </el-table-column>
                            <el-table-column label="排名" width="200" prop="ranking">
                            </el-table-column>
                            <el-table-column label="荣誉" width="200" prop="honor">
                                <template slot-scope="scope">
                                   <el-select v-if="honorType==2" v-model="scope.row.honorId" @change="release(scope.row)" placeholder="请选择" :disabled="detailData.currentCycle=='1'||scope.row.isPublish!==0"><!--当前周和已发放不允许操作-->
                                        <el-option
                                        v-for="item in honorData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <div v-else>{{scope.row.honor}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="奖励">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.honor">
                                        <el-select :disabled="scope.row.isPublish!==0" v-model="scope.row.rewardType" clearable class="w150" @change="checkRelease(scope.row)" placeholder="请选择奖励类型"><!--当前周不允许操作-->
                                            <el-option label="分数" :value="1"></el-option>
                                            <el-option label="勋章" :value="2"></el-option>
                                        </el-select>
                                        <el-cascader :disabled="scope.row.isPublish!==0" v-model="scope.row.dimensionId" @change="checkRelease(scope.row)" class="w150" placeholder="请选择维度" :options="dimensionList" filterable :props="{value:'id', label:'name', children:'dimensionItemVOList', emitPath: false, checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
                                        <el-input :disabled="scope.row.isPublish!==0" v-model="scope.row.rewardNum" @blur="checkRelease(scope.row)" class="w100" maxlength="2" placeholder="请输入数值"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div style="margin-top: 20px" v-if="detailFlg">
                        <el-button @click="detailFlg=false;getClassStatistics(1);">返回</el-button>
                        <el-button type="primary" @click="publishReward(tableData1);" v-if="honorType==2">发布</el-button>
                    </div>
                </div>



            </el-tab-pane>
            <el-pagination v-if="honorType==0||curTab=='1'" class="pagination" background layout="prev, pager, next" :total="ruleItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination>
        </el-tabs>

        <el-dialog
        title="个人统计导出"
        :visible.sync="dialogVisible"
        width="30%"
        top="35vh">
        <div style="display:inline-block">导出类型：</div>
        <div style="display:inline-block">
            <el-radio v-model="exportType" label="1">按勋章等级导出</el-radio>
            <el-radio v-model="exportType" label="2">按勋章类型导出</el-radio>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="exportPersonRecord()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api//qualityAppraisal';
import * as evaluationApi from '@comm/api//evaluationSetting';
import * as baseClassApi from '@comm/api/admin/class';
import * as baseXnxqApi from '@comm/api/admin/division';
import * as searchBarApi from '@comm/api/components/searchbar';

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
            value1:"",
            keyWords:"",
            tableData: [],
            GradeClassList: [],
            dimensionList: [],
            tableData1: [],
            xnxqList:[],                                    //学年学期列表

            dimensionId: '',                                //维度id
            classCode: '',                                  //班级代码
            ruleItemSum:0,                                  //规则总条数
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制记录条数
            curTab:'1',                                     //当前选择的tab
            searchForm: {                                   //搜索表格
                classCode: '',
                dimensionId: '',
                dateRange: '',
                schoolYear: '',
                status: '',
                reward: '',
            },
            honorType: 0,                                   //荣誉类型---- 0 无荣誉项 1自动发放荣誉 2手动发放荣誉
            detailFlg: false,                               //查看详情
            detailData: {},                                 //详情信息暂存
            honorData: [],                                  //荣誉信息暂存
            dialogVisible: false,                           //导出对话框
            exportType: '1',                                //导出类型
            exportLoading: false,                           //导出状态
            tableLoading: false,                            //表格loading状态
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
            this.getDimensionList();
            this.getAllGradeClass();
            this.getSchoolSetting();
            this.getXnXqList();
            this.getCurTabData();
        },
        /**
         * 翻页采集规则列表
         * by:RayJ
         * time:2019-08-07
         */
        rulePageChange(curpage){
            this.curPage = curpage;
            this.getCurTabData();
        },
        /**
         * 获取学年学期列表并组装成联机菜单
         * by:RayJ
         * time:2019-07-23
         */
        async getXnXqList(){
            var that = this;
            await Promise.all([
                searchBarApi.getxqList({xxdm:this.$cookie.get('xxdm')}),
                searchBarApi.getxnList({xxdm:this.$cookie.get('xxdm')}),
            ]).then(result => {
                that.xnxqList = $.extend(true,[],result[1]);
                for(var i=0;i<that.xnxqList.length;i++){
                    that.xnxqList[i].value = that.xnxqList[i].xn;
                    that.xnxqList[i].label = that.xnxqList[i].xn + "学年";
                    that.xnxqList[i].children = $.extend(true,[],result[0]);
                    for(var j=0;j<that.xnxqList[i].children.length;j++){
                        that.xnxqList[i].children[j].value = that.xnxqList[i].children[j].xq;
                        that.xnxqList[i].children[j].label = that.xnxqList[i].children[j].xqmc;
                    }
                }
            }).catch(error => {
                that.$notify({title:'错误',message:'数据初始化出错,刷新后再试',type:'error'});
            });
        },
        //获取学校荣誉设置
        getSchoolSetting(){
            qualityApi.getClassHonorSetting().then(res=>{
                this.honorType = res.value.type?res.value.type:0;
            })
        },
        //获取当前tab底下的数据
        getCurTabData(){
            // this.curPage = 1;
            if(this.curTab=='1'){
                this.getStudentStatics();
            } else {
                this.getClassStatistics();
            }
        },
        //获取个人评价统计
        getStudentStatics(page = this.curPage,limit = this.pageLimit){
            var param = {
                schoolCode: this.$cookie.get('xxdm'),
                classCode: this.classCode[1],
                gradeCode: this.classCode[0],
                dimensionId: this.dimensionId,
                endTime: this.value1?this.value1[1]:'',
                startTime: this.value1?this.value1[0]:'',
                keyWords: this.keyWords,
                page,
                limit,
                type: 1,
                userId: '',
            }
            qualityApi.userStatistics(param).then(res=>{
                if(res.resultCode==1){
                    this.ruleItemSum = res.value.totalCount;
                    this.curPage = page;
                    this.tableData = res.value.dataList;
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage,
                        time: 1000
                    })
                }

            })
        },
        //获取班级评价统计
        getClassStatistics(page = this.curPage,limit = this.pageLimit){
            this.detailFlg = false;
            if(this.honorType==0){
                var param = {
                    schoolCode: this.$cookie.get('xxdm'),
                    classCode: this.searchForm.classCode[1],
                    gradeCode: this.searchForm.classCode[0],
                    dimensionId: this.searchForm.dimensionId[0],
                    endTime: this.searchForm.dateRange?this.searchForm.dateRange[1]:'',
                    startTime: this.searchForm.dateRange?this.searchForm.dateRange[0]:'',
                    // keyWords: this.keyWords,
                    page,
                    limit,
                    // type: 1
                }
                qualityApi.classStatistics(param).then(res=>{
                    if(res.resultCode==1){
                        this.ruleItemSum = res.value.totalCount;
                        this.curPage = page;
                        this.tableData1 = res.value.dataList;
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            time: 1000
                        })
                    }

                })
            } else {
                this.tableLoading = true;
                this.getHonorList();
                var param = {
                    xueNian: this.searchForm.schoolYear?this.searchForm.schoolYear[0]:'',
                    xueQi: this.searchForm.schoolYear?this.searchForm.schoolYear[1]:'',
                    status: this.searchForm.status,
                }
                qualityApi.classHonor(param).then(res=>{
                    if(res.resultCode==1){
                        // this.ruleItemSum = res.value.totalCount;
                        // this.curPage = page;
                        this.tableData1 = res.value;
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            time: 1000
                        })
                    }
                    this.tableLoading = false;
                })
            }

        },
        //获取全校所有班级荣誉项
        getHonorList(){
            qualityApi.classHonorList({type:this.honorType}).then(res => {
                this.honorData = res.value;
                this.honorData.forEach(e=>{e.id+=''})
            })
        },
        //筛选
        getClassHonorDetail(){
            this.detailFlg = true;
            if(this.searchForm.classCode==''&&this.searchForm.reward==''){//没筛选
                this.tableData1 = this.detailData.recordList;//直接显示
                return
            }
            this.tableData1 = _.filter(this.detailData.recordList, item => {
                let flg = (item.gradeCode == this.searchForm.classCode[0]||item.classCode == this.searchForm.classCode[1]) || (item.honorId == this.searchForm.reward)
                return flg;
            })
            console.log(this.tabledata1,410)
        },
        //手动选择荣誉
        release(row){
            var honor = this.honorData.find(e=>e.id==row.honorId)
            if(honor){
                row.honor = honor.name;
            }
            console.log(row,420)
            var param = {
                classCode: row.classCode,
                classHonor: row.honor,
                classHonorId: row.honorId,
                className: row.className,
                gradeCode: row.gradeCode,
                id: row.id,
                month: row.month,
                ranking: row.ranking,
                totalScore: row.addScore+row.cutScore,//每次发布荣誉重新计算总分
                weekId: this.detailData.weekId,
                xueNian: this.detailData.xueNian,
                xueQi: this.detailData.xueQi,
                year: row.year,
                cutScore: row.cutScore,
                dimensionId: row.dimensionId?row.dimensionId:null,
                rewardType: row.rewardType?row.rewardType:null,
                rewardNum: row.rewardNum?row.rewardNum:null
            }
            qualityApi.publishHonor(param).then(res=>{
                this.$notify({message:res.resultMessage,type:res.resultCode==1?'success':'error'});
                row.id = row.id?row.id:res.value;
            })
        },
        //判断是否可发奖励
        checkRelease(row){
            console.log(row,485);
            if(row.dimensionId == 'null'){
              row.dimensionId = null;
            }
            if(row.dimensionId&&row.rewardType&&row.rewardNum){
                var reg = /^[0-9]{1,2}$/;
                if(!reg.test(row.rewardNum)){
                    this.$notify({message:'奖励数量请输入0-99数字',type:'error'});
                }   
                else {
                    this.release(row);
                }
            } 
            // else if (!row.dimensionId&&!row.rewardType&&!row.rewardNum){
            //   this.release(row);
            // }
        },
        //确认发布荣誉
        publishReward(data){
            var canPublish= false;//是否能发
            var errmsg = '请至少选择一个荣誉';
            console.log(data,466)
            for(var d of data){
                if(d.honorId!=null){
                    if(d.dimensionId == 'null'){
                      d.dimensionId = null;
                    }
                    if(!d.rewardType&&!d.dimensionId&&!d.rewardNum){
                      canPublish = true;
                      //break;
                    } else if((!d.rewardType||!d.dimensionId||!d.rewardNum)&&!d.isPublish){
                      errmsg = "请填写完整奖励";
                      canPublish = false;
                      break;
                    } else {
                      canPublish = true;
                      //break;
                    }
                }
            }
            if(canPublish){
                var param = {
                    xxdm: this.$cookie.get('xxdm'),
                    isPublish: 1
                }
                if(this.detailData.weekId){//按周发放
                    this.$set(param,'weekId',this.detailData.weekId);
                } else {//按月发放
                    this.$set(param,'year',this.detailData.recordList[0].year);
                    this.$set(param,'month',this.detailData.recordList[0].month);
                }
                qualityApi.publishReward(param).then(res => {
                    this.$notify({message:res.resultMessage,type:res.resultCode==1?'success':'error'});
                    this.detailFlg=false;
                    this.getClassStatistics(1);
                })
            } else {
                console.log(this.detailData)
                this.$notify({message:errmsg,type:'error'});
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
            var arr = res.value
            this.checkDisable(arr);
            this.dimensionList = arr;
        },
        //根据hasMedal来检查是否可选
        checkDisable(arr){
            // ,disabled: 'hasMedal'
            for(var i of arr){
                i.disabled = !i.hasMedal;
                if(i.dimensionItemVOList&&i.dimensionItemVOList.length>0){
                this.checkDisable(i.dimensionItemVOList);
                }
            }
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
        //导出个人统计
        exportPersonRecord(){
            var params = {
                schoolCode: this.$cookie.get('xxdm'),
                classCode: this.classCode[1],
                gradeCode: this.classCode[0],
                dimensionId: this.dimensionId,
                endTime: this.value1?this.value1[0]:'',
                startTime: this.value1?this.value1[1]:'',
                keyWords: this.keyWords,
                page:this.curPage,
                limit:this.pageLimit,
                type: 1,
                userId: '',
            }
            var exportfunc;
            if(this.exportType=='1'){//按勋章等级导出
                exportfunc = qualityApi.exportLvMedalRecord;
            } else {//按勋章类型导出
                exportfunc = qualityApi.exportDimensionMedalRecord;
            }
            this.exportLoading = true;
            exportfunc(params).then((res)=>{
                const blob = new Blob([res], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                const downloadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = '个人统计.xls'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
                this.dialogVisible = false;
                this.exportLoading = false;
            })
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
.w150{
    width: 150px;
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
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .opacity{
            opacity: 0.5;
        }
        .noHave{
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: auto;
            margin-left: -20px;
            margin-top: -10px;
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
