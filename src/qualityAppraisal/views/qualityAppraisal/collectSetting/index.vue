<template>
    <div class="app-container calendar-list-container">

        <div class="u_TableMain columns ofhide">
            <div class="filter-container innerTab">
                <el-button icon="el-icon-plus" type="primary" @click="addCollect">新增规则</el-button>
            </div>
            <div class="m_GenTableBox">
                <el-table class="tableBorder dimensionTable" :data="ruleItemList">
                    <el-table-column label="规则名称" prop="name" width="150">
                    </el-table-column>
                    <el-table-column label="适用范围" prop="ruleClassStr">
                    </el-table-column>
                    <el-table-column label="有效期" prop="effectiveStr">
                    </el-table-column>
                    <el-table-column label="评价项" prop="evaluationNum" width="100">
                    </el-table-column>
                    <el-table-column label="最新修改" prop="updateTime" width="200">
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCollect(scope)">编辑</el-button>
                            <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                <p>是否删除此规则?</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                    <el-button type="primary" size="mini" @click="deleteRule(scope)">确定</el-button>
                                </div>
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination" background layout="prev, pager, next" :total="ruleItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination>
            </div>
        </div>

        
        <!--新增采集规则价项-->
        <el-dialog :title="textMap[dialogStatus]+'采集规则'" @closed="closeRuleLayer" :close-on-click-modal="false" top='10vh' :visible.sync="dialogFormVisible" width="900px">
            <el-form :model="wdform" ref="form" label-width="100px" class="collectForm">
                <div class="collectLeft">

                    <el-form-item required label="名称：">
                        <el-input class="w300" v-model.trim="ruleName" maxlength="20" size="small"></el-input>
                    </el-form-item>

                    <el-form-item required label="适用对象：">
                        <el-cascader class="w300 selClass" v-model="targetClass" collapse-tags size="small" placeholder="请选择班级或年级" :options="GradeClassList" filterable :props="{multiple:true, children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>
                    </el-form-item>

                    <el-form-item required label="有效期：">
                        <el-select v-model="validityTime" class="w100" placeholder="请选择有效期" size='small'>
                            <el-option value="0" label="长期">长期</el-option>
                            <el-option value="2" label="按学年学期">按学年学期</el-option>
                        </el-select>
                        <el-cascader v-if="validityTime=='2'" size="small" v-model="selxnxq" placeholder="请选择学年学期" style="width:195px;" :options="xnxqList" filterable :props="{expandTrigger:'hover'}" clearable></el-cascader>
                    </el-form-item>
                    
                    <div class="pjxMain flexbox">
                        <div class="title">已选评价项：</div>
                        <div class="checkPjx cusMiniScroll">
                            <transition-group name="bounce">
                                <div class="pjxItem" :label="item.uuid" :key="item.id" v-for="(item,index) in checkEvaluate" @click="removeCheckEvaluateFun(item,index)">
                                    <div class="pjxImg">
                                        <el-image fit="cover"  :src="item.icon"    >
                                            <div slot="error"  >
                                                <el-image :lazy="true" fit="cover" src="/static/quality/noimage.png">
                                                </el-image>
                                            </div>
                                            <div slot="placeholder"  >
                                                    未加载是显示的内容
                                            </div>
                                        </el-image>
                                    </div>
                                    <div class="pjxName">{{item.name}}</div>
                                </div>
                            </transition-group>
                        </div>
                        

                    </div>

                    <!-- <el-form-item label="" class="flexbox">
                        
                    </el-form-item> -->
                </div>
                <div class="collectRight">
                    <div class="collectTit">筛选评价项:</div>
                    <div class="screenCol">
                        <span class="screenTit">评价类型:</span>
                        <el-radio-group v-model="evaluateType" size="small" @change="filterEvaluateLisst">
                            <el-radio-button label="0">全部</el-radio-button>
                            <el-radio-button label="1">录入型({{inputCount.selected}}/{{inputCount.select}})</el-radio-button>
                            <el-radio-button label="2">任务型({{taskCount.selected}}/{{taskCount.select}})</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="screenCol">
                        <span class="screenTit">奖惩类型:</span>
                        <el-radio-group v-model="rewardType" size="small" @change="filterEvaluateLisst">
                            <el-radio-button label="0" >全部</el-radio-button>
                            <el-radio-button v-for="item in rewardTypeList" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
                        </el-radio-group>
                    </div>


                    <div class="pjxBox">
                        <div class="chooseHeader">
                            <el-cascader @change="filterEvaluateLisst" v-model="dimensionId" style="width:100%;" class="selClass" size="small" placeholder="请选择维度" :options="dimensionList" filterable :props="{value:'id', label:'name', children:'dimensionItemVOList', checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
                            <el-button class="headerBtn" type="primary" @click="selectAllEvaluate" size="medium">选择全部评价项</el-button>
                        </div>

                        <div class="pjxList cusMiniScroll">
                            <transition-group name="bounce">
                                <div class="pjxItem" v-show="!item.ischeck" @click="checkEvaluateFun(item)" :label="item.uuid" :key="item.id" v-for="(item,index) in EvaluateList">
                                    <div class="pjxImg">
                                        <el-image fit="cover"  :src="item.icon"    >
                                            <div slot="error"  >
                                                <el-image fit="cover" :src="defineImgSrc">
                                                </el-image>
                                            </div>
                                            <div slot="placeholder"  >
                                                    未加载是显示的内容
                                            </div>
                                        </el-image>
                                        <!-- <img :src="item.icon"> -->
                                    </div>
                                    <div class="pjxName">{{item.name}}</div>
                                </div>
                            </transition-group>
 
                        </div>
                    </div>

                </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRuleLayer">取 消</el-button>
                <el-button type="primary" :loading="loadingFlag" @click="submitRule('form')">确 定</el-button>
            </div>

        </el-dialog>

        
    </div>
</template>

<script>
import _ from 'lodash';
import * as searchBarApi from '@comm/api/components/searchbar';
import * as qualityApi from '@comm/api/qualityAppraisal';
import * as evaluationApi from '@comm/api/evaluationSetting';
import * as baseClassApi from '@comm/api/admin/class';
import * as baseXnxqApi from '@comm/api/admin/division';
export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            textMap: {update: '编辑',create: '创建'},
            ruleId:"",                                      //编辑时用的当前规则Id
            ruleName:"",                                    //采集规则名称
            ruleItemList:[],                                //采集规则列表数据
            targetClass:[],                                 //目标范围
            ruleItemSum:0,                                  //规则总条数
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制记录条数
            evaluateType:'0',                                 //评价项类型(录入型、任务型)
            GradeClassList:[],                              //年级班级级联菜单
            
            allEvaluateList:[],                             //所有评价项列表
            EvaluateList:[],                                //显示评价项列表
            checkEvaluate:[],                               //选中的评价项
            isAnimate:false,                                //是否在播放动画
            validityTime:"0",                               //采集规则有效期(默认长期)
            xnxqList:[],                                    //学年学期列表
            selxnxq:[],                                     //选中的学年学期

            rewardType:'0',                                  //奖惩类型
            rewardTypeList:[{value:3,label:"加分"},         //奖惩类型列表
            {value:4,label:"减分"},
            {value:5,label:"加勋章"},
            {value:6,label:"减勋章"},],

            dimensionList:[],                               //所有维度列表
            dimensionId:"",                                 //所选的维度ID
            defineImgSrc:"/static/quality/noimage.png",     //默认图片地址

            dialogStatus:'',
            dialogFormVisible:false,
            wdform:{},                               
            loadingFlag: false,                             //防止重复点击
            
        }
    },
    computed: {
        // headers: function() {
        //     return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        // },
        // headersV2: function() {
        //     return {Authorization: Cookies.get("Admin-Token")}
        // },
        //录入型统计
        inputCount(){
            var select = _.filter(this.allEvaluateList,{type:1})
            var selected = _.filter(this.checkEvaluate,{type:1})
            console.log(select)
            return {
                select: select.length,
                selected: selected.length,
            }
        },
        //任务型统计
        taskCount(){
            var select = _.filter(this.allEvaluateList,{type:2})
            var selected = _.filter(this.checkEvaluate,{type:2})
            return {
                select: select.length,
                selected: selected.length,
            }
        }
    },
    watch: {

    },
    mounted(){
        this.init();
        // this.init();
    },
    methods: {
        init(){
            this.getRuleItemList();
            this.getAllGradeClass();
            this.getXnXqList();
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

        /**
         * 获取评价项列表
         * by:RayJ
         * time:2019-07-24
         */
        async getEvaluationList(){
            
            var param = {};
            param.scope = '1,2';
            //如所有评价项列表有值,不访问接口
            if(this.allEvaluateList.length<=0){
                var res = await evaluationApi.getEvaluationList(param);
                if(res.resultCode != 1){
                    this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                    return;
                }else{
                    this.allEvaluateList = $.extend(true,[],res.value);
                }
            }
            this.filterEvaluateLisst();
        },

        /**
         * 过滤评价项列表
         * by:RayJ
         * time:2019-07-24
         */
        filterEvaluateLisst(){
            this.EvaluateList = $.extend(true,[],this.allEvaluateList);
            if(this.evaluateType){
                if(this.evaluateType!="0"){
                    this.EvaluateList = _.filter(this.EvaluateList,{type:parseInt(this.evaluateType)})
                }
            }
            if(this.rewardType){
                if(this.rewardType!="0"){
                this.EvaluateList = _.filter(this.EvaluateList,{rewardType:parseInt(this.rewardType)})
                }
            }
            if(this.dimensionId.length>0){
                this.EvaluateList = _.filter(this.EvaluateList,{dimensionId:this.dimensionId[this.dimensionId.length-1]})
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
         * 获取采集规则列表
         * by:RayJ
         * time:2019-07-24
         */
        async getRuleItemList(){
            var param = {};
            param.page = this.curPage;
            param.limit = this.pageLimit;
            var res = await qualityApi.getRuleItem(param);
            if(res.resultCode!=1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return
            }else{
                this.ruleItemList = res.value.dataList;
                this.ruleItemSum = res.value.totalCount;
            }
        },

        /**
         * 翻页采集规则列表
         * by:RayJ
         * time:2019-08-07
         */
        rulePageChange(curpage){
            this.curPage = curpage;
            this.getRuleItemList();
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
         * 采集规则弹层关闭
         * by:RayJ
         * time:2019-07-25
         */
        closeRuleLayer(){
            //所有数据清空初始化
            this.ruleName = "";
            this.ruleId = "";
            this.targetClass = [];
            this.validityTime = "0";
            this.selxnxq = [];
            this.checkEvaluate = [];
            var checkEvaluate = _.filter(this.allEvaluateList,{"ischeck":true});
            //所有的评价项的ischeck都置为false
            for(var i=0;i<checkEvaluate.length;i++){
                this.$set(checkEvaluate[i],"ischeck",false);
            }
            this.$refs.form.resetFields();
            this.dialogFormVisible = false;
        },

        /**
         * 新增采集规则
         * by:RayJ
         * time:2019-07-24
         */
        addCollect(){
            this.dialogStatus = 'create';
            this.loadingFlag=false;
            this.dialogFormVisible = true;
            this.getEvaluationList();
            this.getDimensionList();
        },

        /**
         * 编辑采集规则
         * by:RayJ
         * time:2019-07-25
         */
        async editCollect(scope){
            this.dialogStatus = 'update';
            this.loadingFlag=false;
            this.dialogFormVisible = true;
            await this.getEvaluationList();
            this.getDimensionList();
            var res = await qualityApi.getRuleItemDetail(scope.row.ruleId);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.ruleId = res.value.ruleId;
                this.ruleName = res.value.name;
                var ruleClassList = [];
                for(var i=0;i<res.value.ruleClassList.length;i++){
                    ruleClassList.push([res.value.ruleClassList[i].gradeCode,res.value.ruleClassList[i].classCode])
                }
                this.targetClass = ruleClassList;
                this.validityTime = res.value.effectiveType.toString();
                if(res.value.effectiveType==2){
                    this.selxnxq = [res.value.schoolYear,res.value.term];
                }
                this.checkEvaluate = this.getcheckEvaluate(res.value.ruleEvaluateList);
                this.filterEvaluateLisst();
            }
            console.log(res,441199);
        },

        /**
         * 获取已经选中的评价项(用于修改初始化)
         * by:RayJ
         * time:2019-07-25
         */
        getcheckEvaluate(eList){
            var checkEvaluate = [];
            for(var i=0;i<eList.length;i++){
                var eUnitIndex = _.findIndex(this.allEvaluateList,{id:eList[i].evaluateId})
                if(eUnitIndex!=-1){
                    checkEvaluate.push($.extend(true,{},this.allEvaluateList[eUnitIndex]));
                    this.$set(this.allEvaluateList[eUnitIndex],"ischeck",true)
                }
            }
            return checkEvaluate;
        },

        /**
         * 点击评价项
         * by:RayJ
         * time:2019-07-24
         */
        checkEvaluateFun(item){
            var that = this;
            if(!this.isAnimate){
                this.checkEvaluate.push(item);
                this.$set(item,"ischeck",true)
                this.$set(_.find(this.allEvaluateList,{"id":item.id}),"ischeck",true)
                this.isAnimate = true
                setTimeout(function(){
                    that.isAnimate = false
                },400)
            }
            
        },

        /**
         * 移除已选的评价项
         * by:RayJ
         * time:2019-07-24
         */
        removeCheckEvaluateFun(item,index){
            this.checkEvaluate.splice(index,1);
            if(_.find(this.EvaluateList,{"id":item.id})){
                this.$set(_.find(this.EvaluateList,{"id":item.id}),"ischeck",false)
            }
            this.$set(_.find(this.allEvaluateList,{"id":item.id}),"ischeck",false)
        },

        /**
         * 保存采集项
         * by:RayJ
         * time:2019-07-24
         */
        async submitRule(formName){  
            
            if(this.ruleName==""||this.targetClass.length==0){
                this.$notify({title:"提示",message:"请完整填写信息",type:"warning"});
                return
            }
            if(this.validityTime=="2"&&this.selxnxq.length==0){
                this.$notify({title:"提示",message:"请选择学年学期",type:"warning"});
                return
            }
            this.loadingFlag=true;
            var param = {};
            param.effectiveType = parseInt(this.validityTime);
            if(this.validityTime=="2"){
                param.schoolYear = this.selxnxq[0]
                param.term = this.selxnxq[1]
            }
            param.name = this.ruleName;
            param.ruleClassList = [];
            param.ruleEvaluateList = [];
            for(var i=0;i<this.checkEvaluate.length;i++){
                param.ruleEvaluateList.push({evaluateId:this.checkEvaluate[i].id})
            }
            for(var i=0;i<this.targetClass.length;i++){
                param.ruleClassList.push({gradeCode:this.targetClass[i][0],classCode:this.targetClass[i][1]})
            }
            var res = {}
            if(this.dialogStatus=='create'){
                res = await qualityApi.addRuleItem(param);
            }else{
                param.ruleId = this.ruleId;
                res = await qualityApi.updateRuleItem(param);
            }
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                this.loadingFlag=false;
                return;
            }else{
                this.$notify({title:"成功",message:"保存成功",type:"success"});
                this.closeRuleLayer();
                this.getRuleItemList();
            }


            
        },

        /**
         * 删除采集项
         * by:RayJ
         * time:2019-07-25
         */
        async deleteRule(scope){
            var res = await qualityApi.delRuleItem(scope.row.ruleId);
            // console.log(res,446688)
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.$notify({title:"成功",message:"规则删除成功",type:"success"});
                this.curPage = 1;
                this.getRuleItemList();
            }
        },

        /**
         * 关闭删除记录的tips
         * by:
         * time:
         */
        delClose(row){
            this.$set(row,'deltips',false);
        },
        //选择全部评价项
        selectAllEvaluate(){
            for(var item of this.EvaluateList){
                if(!item.ischeck){
                    console.log(item,613)
                    this.checkEvaluateFun(item)
                    this.isAnimate = false                    
                }
            }            
        }
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

.bounce-enter-active {
    animation-name: bounceIn;
    animation-duration: .3s;
}

.bounce-leave-active {
    animation-name: bounceOut;
    animation-duration: .3s;
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
.selClass{
    /deep/ .el-tag{
        margin-top: 4px;
    }
}
.hfSel{
    margin: 5px;
    width: 200px;
}
.pjxItem{
    display: inline-block;
    text-align: center;
    margin: 3px;
    width: 90px;
    height: 90px;
    padding-top: 10px;
    transition: .2s all;
    /deep/ .el-checkbox__label{
        width: 75px;
        padding-left: 5px;
    }
    /deep/ .el-checkbox__input{
        transform: translateY(-5px);
    }
}
.pjxItem:hover{
    background: #DCDFE6;
    border-radius: 5px;
    cursor: pointer;
    transform: scale(1.05);
}
.pjxBox{
    width: 100%;
    border: 1px solid #DCDFE6;
    margin-bottom: 20px;
    padding: 5px;
    display: flex;
    flex: 1;
    flex-direction: column;
    .headerBtn{
        margin-top: 10px;
    }
}
.pjxList{
    width: 100%;
    flex: 1;
    overflow: auto;
}
.checkPjx{
    position: absolute;
    left: 100px;
    width: 300px;
    border: 1px solid #DCDFE6;
    height: 100%;
    overflow: auto;
    margin-bottom: 20px;
}
.pjxImg{
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border-radius: 25px;
    overflow: hidden;
    .el-image{
        width: 100%;
        height: 100%;
    }
    img{
        width: 100%;
        height: 100%;
    }
}
.pjxName{
    // margin-top: 10px;
    width: 100%;
    font-size: 12px;
    line-height: 14px;
    padding-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.pjxMain{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
    .title{
        font-size: 14px;
        font-weight: 700;
        padding-right: 12px;
        text-align: right;
        width: 100px;
        float: left;
    }
}
.displayflex{
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.collectForm{
    float: left;
    width: 100%;
    height: 500px;
    .collectTit{
        width: 100%;
        font-size: 14px;
        font-weight: 700;
        line-height: 30px;
    }
    .collectLeft{
        float: left;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .flexbox{
            flex: 1;
        }
        .pjxbox{
            border: 1px solid #DCDFE6;
        }
    }
    .collectRight{
        overflow: hidden;
        padding-left: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .screenCol{
            padding-bottom: 10px;
            .screenTit{
                float: left;
                padding-right: 5px;
                line-height: 32px;
                font-weight: 700px;
            }
        }
    }
}



</style>
