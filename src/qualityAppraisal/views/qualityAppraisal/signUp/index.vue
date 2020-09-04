<template>
    <div class="app-container calendar-list-container">

        <div class="u_TableMain block ofhide" type="border-card">
                <div class="filter-container">
                    <div class="filterBg">
                        <div class="conditionBox">
                            <span class="filterTit">报名时间：</span>
                            <el-date-picker size="small" v-model="searchTime" @change="getAllActivity" value-format="yyyy-MM-dd" class="dataPicker" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                        </div>
                        
                        <div class="conditionBox">
                            <span class="filterTit">报名条件：</span>
                            <el-select v-model="searchCondition" size="small" @change="getAllActivity" placeholder="请选择" clearable>
                                <el-option label="不限条件" :value="-1"> </el-option>
                                <el-option label="按等级" :value="2"> </el-option>
                                <el-option label="按勋章" :value="1"> </el-option>
                            </el-select>  
                        </div>                  

                        <div class="conditionBox">
                            <span class="filterTit">状态：</span>
                            <el-select v-model="searchStatus" @change="getAllActivity" size="small" clearable>
                                <el-option label="进行中" :value="0"> </el-option>
                                <el-option label="已结束" :value="2"> </el-option>
                                <el-option label="未开始" :value="1"> </el-option>
                            </el-select>
                        </div>

                        <div class="conditionBox">
                            <span class="filterTit">搜索：</span>
                            <el-input class="w200" size="small" @change="getAllActivity" suffix-icon="el-icon-search" v-model="searchText" placeholder="请输入活动名称搜索"></el-input>
                        </div>
                    </div>
                    <div class="mt10">
                      <el-button type="primary" size="medium" @click="createAct">新增活动</el-button>
                    </div>                    
                </div>
                <div class="m_GenTableBox">

                    <el-table class="tableBorder dimensionTable" :data="pageTableData">
                        <el-table-column label="活动名称" prop="activityName" width="150">
                        </el-table-column>
                        <el-table-column label="报名时间" width="180">
                            <template slot-scope="scope">
                                起：{{scope.row.startTime}}<br>
                                止：{{scope.row.endTime}}
                            </template>
                        </el-table-column>
                        <el-table-column label="适用范围" prop="activityRange">
                        </el-table-column>
                        <el-table-column label="报名条件" prop="activityCondition">
                        </el-table-column>
                        <el-table-column label="报名人数" width="120">
                            <template slot-scope="scope">
                                <span v-if='scope.row.activityCapacity==-1'>不限</span>
                                <span v-else>{{scope.row.alreadyApply}}/{{scope.row.activityCapacity}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报名消耗" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.activityConsume==-1?'不消耗':('勋章消耗:'+scope.row.activityConsume)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="120">
                            <template slot-scope="scope">
                                <span :class="scope.row.activityStatus==0?'green':scope.row.activityStatus==1?'gray':'red'">
                                    {{scope.row.activityStatus==0?'进行中':scope.row.activityStatus==1?'未开始':'已结束'}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                              <el-button type="text" @click="showRegistration(scope.row.activityId,scope.row.activityName)">查看报名</el-button>
                              <el-button type="text" @click="editActivity(scope.row)">编辑</el-button>
                              <el-button type="text" @click="deleteActivity(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :total="ruleItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination>

                </div>
        </div>

        <!-- 新增活动弹框 -->
        <el-dialog :title="textMap[dialogStatus]+'活动'" width="600px" :close-on-click-modal='false' :before-close="closeDialog" :visible.sync="dialogVisible" >
            <el-form ref="form" :model="formData" :rules="rules" label-position='left' label-width="100px">

                <el-form-item label="活动名称：" prop="name">
                  <el-input v-model="formData.name" class="w350" size="small" placeholder="请输入2-20位活动名称" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="报名时间：" prop="signUpTime">
                  <el-date-picker v-model="formData.signUpTime" size="small" value-format="yyyy-MM-dd HH:mm:ss" class="dataPicker w350" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-form-item>

                <el-form-item label="适用范围：" prop="range">
                  <el-cascader class="w350 selClass" v-model="formData.range" collapse-tags size="small" placeholder="请选择适用范围" :options="GradeClassList" filterable :props="{multiple:true, children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>
                </el-form-item>

                <el-form-item label="报名条件：" prop="condition" :rules="[{ required: true, message: '请选择报名条件', trigger: 'blur' },{validator: requirements,tigger:'blur'}]">
                  <el-radio-group v-model="formData.condition.type">
                    <el-radio :label="0">不限</el-radio>
                    <el-radio :label="1">按勋章</el-radio>
                    <el-radio :label="2">按等级</el-radio>
                  </el-radio-group>

                  <div v-if="formData.condition.type==1">
                    <el-select v-model="formData.condition.medalType" class="w100" size="small" placeholder="请选择">
                      <el-option label="勋章等级" :value="1"></el-option>
                      <el-option label="勋章数量" :value="2"></el-option>
                    </el-select>

                    <el-cascader @change="getMedalLevel" v-model="formData.condition.dimension" class="w200" size="small" placeholder="请选择维度" style="width:200px;" :options="dimensionOptions" filterable :props="{ emitPath:false,expandTrigger: 'hover',value: 'id',label: 'name', checkStrictly: true, children:'dimensionItemVOList' }" clearable></el-cascader>

                    <el-select v-if="formData.condition.medalType==1" value-key="level" class="w200" size="small" v-model="formData.condition.medalLevel" placeholder="请选择">
                      <el-option v-for="(item,index) in medalLevel" :key="item.level" :label="item.name" :value="item"></el-option>
                    </el-select>

                    <div class="inline" v-else>
                      <el-input v-model="formData.condition.medalCount" maxlength="3" class="w60" size="small"></el-input> 枚<span class="limit">(1~999)</span>
                    </div>

                  </div>
                  <div v-if="formData.condition.type==2">
                    <el-select v-model="formData.condition.level" class="w200" size="small" placeholder="请选择">
                      <el-option v-for="(item,index) in gradeList" :key="index" :label="item.name" :value="item.characterId"></el-option>
                    </el-select>                    
                  </div>
                  <div class="mytip">
                    <span v-if="formData.condition.type==1&&formData.condition.medalType==1">学生勋章等级达到所设置的要求才能报名</span>
                    <span v-if="formData.condition.type==1&&formData.condition.medalType==2">学生在对应维度获得的一级勋章数量达到要求才能报名</span>
                    <span v-if="formData.condition.type==2">学生达到对应等级才能报名</span>
                  </div>
                </el-form-item>
                <el-form-item label="名额限制：" prop="limit" :rules="[{ required: true, message: '请选择名额限制', trigger: 'blur' },{validator: limitCheck,tigger:'blur'}]">
                  <el-radio-group v-model="formData.limit.enable">
                    <el-radio :label="1">不限</el-radio>
                    <el-radio :label="2">限制</el-radio>
                  </el-radio-group>
                  <div class="inline">
                    <el-input maxlength="3" :disabled="formData.limit.enable==1" v-model="formData.limit.number" size="small" class="w60"></el-input><span class="limit">(1~999)</span>
                  </div>
                </el-form-item>
                <el-form-item label="报名消耗：" prop="consume" :rules="[{ required: true, message: '请选择报名消耗', trigger: 'blur' },{validator: costCheck,tigger:'blur'}]">
                  <el-radio-group v-model="formData.consume.enable">
                    <el-radio :label="1">不消耗</el-radio>
                    <el-radio :label="2">消耗勋章</el-radio>
                  </el-radio-group>
                  <div class="inline">
                    <el-input maxlength="2" :disabled="formData.consume.enable==1" v-model="formData.consume.number" size="small" class="w60"></el-input><span class="limit">(1~99)</span>
                  </div>
                </el-form-item>
                <el-form-item label="活动介绍：">
                  <quill-editor ref="myTextEditor"
                                class="ql-editor-class"
                                v-model="formData.content"
                                :options="editorOption"
                                @change="alertValue($event,formData.content)">
                  </quill-editor>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="activitySubmit" type="primary" >提交</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>

        <!-- 查看报名信息弹框 -->
        <el-dialog title="活动-报名信息" width="700px" :visible.sync="registrationVisible">
          <el-button type="primary" size="small" @click="outputActivityList" class="mb20">导出</el-button>

          <el-table :data="registration" ref="activityList">
            <el-table-column label="姓名" width="120px" prop="studentName"></el-table-column>
            <el-table-column label="性别" width="80px" prop="sex">
                <template slot-scope="scope">
                    <span>{{scope.row.gender==='1'?'男':'女'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="班级" prop="className"></el-table-column>
            <el-table-column label="报名时间" prop="submitTime"></el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delStudent(scope.row.activityId,scope.row.studentCode)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api//qualityAppraisal';
import * as baseXnxqApi from '@comm/api/admin/division';
import * as baseClassApi from '@comm/api/admin/class';
  import { quillEditor } from 'vue-quill-editor'
import * as api from '@comm/api/evaluationSetting'
import jcsj from '@comm/api/pkjcsj/pkjcsj';  
export default {
    name: "signUp",
    components: {
      quillEditor
    },
    data() {
      return {
          textMap: {                      //新增或编辑
              update: '编辑',
              create: '新增'
          },
          dialogStatus: '',
          searchTime: [],                 //搜索--报名时间
          searchCondition: '',            //搜索--报名条件
          searchStatus: '',               //搜索--状态
          searchText: '',                 //搜索--内容
        //   tableData: [{
        //     name: '活动名称',
        //     time: '2019-10-23 00:00:00',
        //     range: '一年级',
        //     condition: '报名条件',
        //     count: 10,
        //     cost: '报名消耗',
        //     status: '进行中'
        //   }],                             //活动表格信息
          tableData:[],                   //活动表格信息
          ruleItemSum: 0,                 //总共有多少数据
          pageLimit: 10,                  //每页最大数量
          curPage: 1,                     //当前页
          dialogVisible: false,           //新增活动弹框是否显示
          content: '',                    //富文本内容
          editorOption: {},               //富文本编辑器选项
          formData:{                      //活动信息--表格内容
            name: '',                     //活动名称
            signUpTime: [],               //报名时间范围
            range: '',                    //适用范围
            condition:{
              type: 0,                    //报名条件
              medalType: '',              //按勋章--勋章等级、勋章数量
              dimension: '',              //按勋章--维度选择
              medalLevel: '',             //按勋章--勋章等级通用名称
              medalCount: 1,              //按勋章--勋章数量
              level: '',                  //按等级--等级
            },
            limit: {                      //名额限制
              number: 1,
              enable: 1,                  
            },
            consume: {                    //报名消耗
              enable:1,
              number: 1
            },
            content: '',                  //活动介绍
          },
          registration:[{
            name: '姓名',
            sex: '男',
            class: '一年级一班',
            time: '2019-10-23 00:00:00'
          }],                             //报名信息列表
          registrationVisible: false,     //报名信息弹框
          rules:{
            name: [{required: true,message:'请输入活动名称',tigger:'blur'},
            {min:2,max:20,message:'请输入2-20位活动名称',tigger:'blur'}],
            signUpTime: [{type: 'array',required: true,message:'请选择报名时间',tigger:'blur'},],
            range: [{type: 'array',required: true,message:'请选择活动适用范围',tigger:'blur'}],
          },
          dimensionOptions: [{name:"全部维度",id:1},{name:"任意维度",id:2}],           //可选择的维度
          GradeClassList:[],              //年级班级级联菜单
          gradeList:[],                     //人物等级列表
          medalLevel:[],                    //指定维度后的所有等级勋章
          dimensionList:[],
          curActivityId:'',
          curActivityName:'',
      }
    },
    computed: {
      
    },
    watch: {

    },
    mounted(){

        this.init();
    },
    methods: {
        init(){
            this.getDimension();
            this.getAllGrade();
            this.getAllGradeClass();
            this.getAllActivity();
            // this.getList();
        },
        rulePageChange(curpage){
            this.curPage = curpage;
        },
        // 限制字数1000字
        alertValue(e,strValue){
            e.quill.deleteText(1000,1,strValue);//保留 strValue 的 前 decimalNum 位字符，
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
            console.log(this.GradeClassList,228811)
            for(var i=0;i<this.GradeClassList.length;i++){
                this.GradeClassList[i].label = this.GradeClassList[i].njmc;
                this.GradeClassList[i].value = this.GradeClassList[i].njdm;
                for(var j=0;j<this.GradeClassList[i].bjList.length;j++){
                    this.GradeClassList[i].bjList[j].value = this.GradeClassList[i].bjList[j].uuid;
                    this.GradeClassList[i].bjList[j].label = this.GradeClassList[i].bjList[j].bj;
                }
            }
        },
        async getAllActivity(){
            var param = {
              startTime: this.searchTime?this.searchTime[0]:null,
              endTime:this.searchTime?this.searchTime[1]:null,
              activityName:this.searchText,
              activityStatus: this.searchStatus,
              conditionType: this.searchCondition
            };
            // console.log(this.searchTime);
            // console.log(this.searchText)
            // console.log(this.searchStatus)
            var res = await api.getActivity(param);
            if(res.resultCode==1){
              this.curPage = 1;//默认是第一页
              this.tableData = res.value;
              this.ruleItemSum = res.value.length;
            } else {
              this.$notify({type: 'error',message: res.resultMessage})
            }
            
            // console.log(res,227777);
        },
        async getAllGrade(){
            var res = await api.getAllCharacter();
            this.gradeList = res.value;
            // console.log(res,229988)
        },
        //获取所有维度供选择
        getDimension(){
            api.getAllDimension().then(res=>{
                // var resdata = [];
                // this.dimensionList = res.value;
                var arr = res.value;
                // console.log(arr);
                
                this.checkDisable(arr);
                // console.log(arr);
                // this.dimensionOptions = arr 

                // this.clearDimension(this.dimensionList);


                this.dimensionOptions.push(...arr) 
                // this.dimensionOptions = res.value;
            })
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
        //报名条件验证
        requirements(rule, value, callback){
          console.log(value,371)
          if(value.type==1){//按勋章
            if(value.medalType!=1&&value.medalType!=2){//未选勋章等级或勋章数量
              callback('请选择报名条件');
            }
            if(!value.dimension){//未选维度
              callback('请选择维度');
            }
            if(value.medalType==1){//选勋章等级
              if(!value.medalLevel){
                callback('请选择勋章等级');
              }
            } else if(value.medalType==2){//选择勋章数量
              var reg =  /^[1-9]\d*$/;
              if (!reg.test(value.medalCount)) {
                  callback('请输入1-999之间的数字');
              }
            }
          } else if(value.type == 2){//按等级
            if(!value.level){
              callback('请选择等级');
            }
          } else if(value.type===''){//没选择
            callback('请选择报名条件');
          } else {
            callback();
          }
          callback();
        },
        //名额限制
        limitCheck(rule, value, callback){
          if(value.enable!=1&&value.enable!=2){
            callback('请选择名额限制');
          } else if(value.enable==2){//限制
            var reg =  /^[1-9]\d*$/;
            if (!reg.test(value.number)) {
                callback('请输入1-999之间的数字');
            }
          } else {
            callback();
          }
          callback();
        },
        //报名消耗
        costCheck(rule, value, callback){
          if(value.enable!=1&&value.enable!=2){
            callback('请选择报名消耗');
          } else if(value.enable==2){//限制
            var reg =  /^[1-9]\d*$/;
            if (!reg.test(value.number)) {
                callback('请输入1-99之间的数字');
            }
          } else {
            callback();
          }
          callback();
        },
        
        async activitySubmit(){
            var param = {};
            var valid = await this.$refs['form'].validate();
            if (valid) {
            } else {
                return false;
            }
            //按等级
            if(this.formData.condition.type===2){
                param.activityLevelCondition = {};
                param.activityLevelCondition.characterId = this.formData.condition.level;
            }
            //按勋章
            if(this.formData.condition.type===1){
                param.activityMedalCondition = {};
                param.activityMedalCondition.medalType = this.formData.condition.medalType;
                param.activityMedalCondition.dimensionId = this.formData.condition.dimension;

                

                //勋章等级
                if(this.formData.condition.medalType===1){
                    //勋章等级获取
                    if(this.formData.condition.dimension===1){
                        param.activityMedalCondition.dimensionType = 'all'
                        param.activityMedalCondition.medalId = this.formData.condition.medalLevel.medalId;
                    }else if(this.formData.condition.dimension===2){
                        param.activityMedalCondition.dimensionType = 'any'
                        param.activityMedalCondition.medalId = this.formData.condition.medalLevel.medalId;
                    }else{
                        param.activityMedalCondition.dimensionType = 'one'
                        param.activityMedalCondition.medalId = this.formData.condition.medalLevel.id;
                    }
                    param.activityMedalCondition.medalLevel = this.formData.condition.medalLevel.level;
                }else{
                //勋章数量
                    //勋章数量获取
                    if(this.formData.condition.dimension===1){
                        param.activityMedalCondition.dimensionType = 'all'
                        param.activityMedalCondition.medalId = 1
                    }else if(this.formData.condition.dimension===2){
                        param.activityMedalCondition.dimensionType = 'any'
                        param.activityMedalCondition.medalId = 2
                    }else{
                        param.activityMedalCondition.dimensionType = 'one'
                    }
                    param.activityMedalCondition.medalNumber = parseInt(this.formData.condition.medalCount);
                }
            }

            param.activityName = this.formData.name;
            param.conditionsType = (this.formData.condition.type===0?-1:this.formData.condition.type);
            param.consumeMedal = this.formData.consume.enable===1?-1:parseInt(this.formData.consume.number);
            param.capacity = this.formData.limit.enable===1?-1:parseInt(this.formData.limit.number);
            param.describe = this.formData.content;
            param.startTime = this.formData.signUpTime[0];
            param.endTime = this.formData.signUpTime[1];
            param.activityRangeList = [];
            var rangeStr = [];
            for(var i=0;i<this.formData.range.length;i++){
                param.activityRangeList.push({'classCode':this.formData.range[i][1],'gradeCode':this.formData.range[i][0]})
                for(var j=0;j<this.GradeClassList.length;j++){
                    var findRange = _.find(this.GradeClassList[j].bjList,{'value':this.formData.range[i][1]})
                    if(findRange){
                        rangeStr.push(findRange.bj);
                        break;
                    }
                }
            }    
            param.activityRangeName = rangeStr.join(',')
            // console.log(rangeStr)
            // console.log(this.formData)
            // console.log(param,339933);
            if(this.dialogStatus=='create'){
                var res = await api.addActivity(param);
                if(res.resultCode==1){
                    this.$notify({title:'成功',type: 'success',message: '活动创建成功'});
                    this.dialogVisible = false;
                    this.$refs['form'].resetFields();
                    this.getAllActivity();
                }else{
                    this.$notify({title:'提示',type: 'warning',message: '活动创建失败,请检查数据表单是否有误'});
                }
                console.log(res);
            }else if(this.dialogStatus=='update'){
                var res = await api.updateActivity(param,this.curActivityId);
                console.log(res,'修改返回');
                if(res.resultCode==1){
                    this.$notify({title:'成功',type: 'success',message: '活动修改成功'});
                    this.dialogVisible = false;
                    this.$refs['form'].resetFields();
                    this.getAllActivity();
                }else{
                    this.$notify({title:'提示',type: 'warning',message: '活动修改失败,请检查数据表单是否有误'});
                }
            }

            
        },

        async getMedalLevel(){
            console.log("aaaaaaa");
            this.medalLevel = [];
            this.formData.condition.medalLevel = "";
            var param = {};
            param.dimensionId = this.formData.condition.dimension;
            if(this.formData.condition.dimension==1){
                var res = await api.getAllMedal();
                this.medalLevel = res.value
            }else if(this.formData.condition.dimension==2){
                var res = await api.getAllMedal();
                this.medalLevel = res.value
            }else{ 
                var res = await api.getMedalByDimension(param);
                this.medalLevel = res.value;
            }
            this.medalLevel = _.sortBy(this.medalLevel,['level'])
            console.log(this.medalLevel,'列表')
        },

        //删除活动
        deleteActivity(active){
        //   console.log(active,454)
          this.$confirm('此操作将不可恢复，确认删除该活动?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            api.deleteActivity(active.activityId).then(res => {
              if(res.resultCode==1){
                this.$notify({
                  type: 'success',
                  message: '删除活动成功！'
                })
                this.getAllActivity();
              } else {
                this.$notify({
                  type: 'error',
                  message: res.message
                })                
              }
            })
          }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });          
          });
        },
        async editActivity(row){
            this.dialogStatus = 'update';
            this.dialogVisible = true;
            var res = await api.getActivityDetails(row.activityId);
            console.log(res.value);
            if(res.resultCode==1){
                var activity = res.value;
                this.curActivityId = activity.id;
                this.formData.name = activity.activityName;
                this.formData.signUpTime = [activity.startTime,activity.endTime];
                this.formData.range = []
                for(var i=0;i<activity.activityRangeList.length;i++){
                    this.formData.range.push([activity.activityRangeList[i].gradeCode,activity.activityRangeList[i].classCode])
                }
                this.formData.condition.type = (activity.conditionsType===-1?0:activity.conditionsType)
                

                if(activity.conditionsType == 1){
                    this.formData.condition.medalType = activity.activityMedalCondition.medalType;
                    if(activity.activityMedalCondition.dimensionType=='all'){
                        this.formData.condition.dimension = 1;
                    }else if(activity.activityMedalCondition.dimensionType=='any'){
                        this.formData.condition.dimension = 2;
                    }else{
                        this.formData.condition.dimension = activity.activityMedalCondition.dimensionId;
                    }
                    await this.getMedalLevel();
                    this.formData.condition.medalLevel = _.find(this.medalLevel,{'level':activity.activityMedalCondition.medalLevel})
                    this.formData.condition.medalCount = activity.activityMedalCondition.medalNumber;
                }else if(activity.conditionsType == 2){
                    this.formData.condition.level = activity.activityLevelCondition.characterId;
                }
                



                

                //这里少个人物等级

                this.formData.limit.enable = (activity.capacity==-1?1:2);
                this.formData.limit.number = activity.capacity==-1?1:activity.capacity;

                this.formData.consume.enable = (activity.consumeMedal==-1?1:2);
                this.formData.consume.number = activity.consumeMedal==-1?1:activity.consumeMedal;
                this.formData.content = activity.describe;

                // this.formData.condition.level

            }

        },
        async showRegistration(id,name){
            this.registrationVisible = true;
            var res = await api.getActivityRecord(id);
            this.registration = res.value;
            if(name){
              this.curActivityName = name;
            }
        },
        async delStudent(activityId,studentCode){
            console.log({'activityId':activityId,'studentCode':studentCode});
            var res = await api.delActivityRecord({'activityId':activityId,'studentCode':studentCode});
            if(res.resultCode==1){
                 this.$notify({type:'success',message: '删除成功！'})
                 this.showRegistration(activityId);
            }
            // console.log(activityId,studentCode);
        },
        createAct(){
            this.formData = {                      //活动信息--表格内容
                name: '',                     //活动名称
                signUpTime: [],               //报名时间范围
                range: '',                    //适用范围
                condition:{
                type: 0,                    //报名条件
                medalType: '',              //按勋章--勋章等级、勋章数量
                dimension: '',              //按勋章--维度选择
                medalLevel: '',             //按勋章--勋章等级通用名称
                medalCount: 1,              //按勋章--勋章数量
                level: '',                  //按等级--等级
                },
                limit: {                      //名额限制
                number: 1,
                enable: 1,                  
                },
                consume: {                    //报名消耗
                enable:1,
                number: 1
                },
                content: '',                  //活动介绍
            };
            this.dialogVisible = true;
            this.dialogStatus = 'create';

        },
        closeDialog(){
            // console.log("556699")
            this.$refs['form'].resetFields();
            this.dialogVisible = false;
        },
        outputActivityList(){
            // console.log("导出活动信息");
            const tableHtml = this.$refs.activityList.$el.outerHTML;
            // console.log(tableHtml)
            jcsj.exportTable2Excel(tableHtml, this.curActivityName + '报名列表', 14);
        },
        
    },
    computed:{
      //分页的数据
      pageTableData(){
        // console.log((this.curPage-1)*this.pageLimit)
        return this.tableData.slice((this.curPage-1)*this.pageLimit,this.curPage*this.pageLimit)
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
.limit{
  margin-left: 10px;
  color: #CCCCCC;
  font-size: 13px;
}
.mytip{
  color: #999999;
  font-size: 13px;
}
.w60{
  width: 60px;
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
.w350{
    width: 350px;
}
.inline{
  display: inline-block;
}
.fl{
    float: left;
}
.ml30{
    margin-left: 30px;
}
.mb20{
    margin-bottom: 20px;
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
.ql-editor-class {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    padding: 0 !important;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    word-wrap: break-word;

}

</style>
<style lang="scss">
.ql-editor.ql-blank::before{
  left: 30px;
}
</style>