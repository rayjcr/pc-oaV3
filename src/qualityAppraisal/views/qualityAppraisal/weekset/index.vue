<template>
    <div class="app-container calendar-list-container cusMiniScroll">

        <div class="u_TableMain block ofhide" type="border-card">   

            <div class="filter-container"> 

                <span class="filterTit">学年学期：</span>


                <el-cascader @change="getWeekAllInfo" class="selMargin" v-model="selxnxq" placeholder="请选择学年学期" style="width:200px;" :options="xnxqList" filterable :props="{expandTrigger:'hover'}" clearable></el-cascader>


                <span class="filterTit ml30">关键词：</span>
                <el-input class="w200" suffix-icon="el-icon-search" v-model.trim="keyword" @blur="getWeekAllInfo"></el-input>

                <el-button type="primary" class="ml30" @click="importData">导入值周数据</el-button>

            </div>

            <div class="m_GenTableBox">
                <el-table class="tableBorder dimensionTable receivingTable" :data="weekDutyList">
                    <el-table-column label="学年" prop="schoolYear" width="120">
                    </el-table-column>
                    <el-table-column label="学期" prop="termName" width="120">
                    </el-table-column>
                    <el-table-column label="时间" prop="weekTime" width="250">
                    </el-table-column>
                    <el-table-column label="值周老师" prop="weekTeacherNameStr" >
                    </el-table-column>
                    <el-table-column label="操作" width="300" align="center">
                        <template slot-scope="scope">

                            <el-popover placement="top" width="400" v-model="scope.row.changetips" @show="settingDate(scope)">
                                <div class="block sliderDay">
                                    <span class="sliderTit">时间区域选择:</span>
                                    <span class="startDate">{{tipsWeekRange.start.split(" ")[0]}}</span>
                                    <span class="endDate">{{tipsWeekRange.end.split(" ")[0]}}</span>
                                    <!-- <span class="endDate">{{rangeDate}}</span> -->
                                    <el-slider :format-tooltip="formatDate" v-model="rangeDate" range show-stops :min='minDay' :max="sumDay">
                                    </el-slider>
                                </div>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="changeClose(scope.row)">取消</el-button>
                                    <el-button type="primary" size="mini" @click="updataWeekTime(scope)">确定</el-button>
                                </div>
                                <el-button  slot="reference" class="ml0" type="primary" icon="el-icon-edit" size="mini">调整时间</el-button>
                            </el-popover>


                            <el-button class="ml0" type="primary" icon="el-icon-edit" size="mini" @click="selTeacherWeek(scope)">调整值周老师</el-button>
                            <!-- <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                <p>是否删除此值周信息</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                    <el-button type="primary" size="mini">确定</el-button>
                                </div>
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-popover> -->
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination" background layout="prev, pager, next" :total="weekListSum" :page-size="pageLimit" :current-page="curPage" @current-change="PageChange"></el-pagination>
            </div>

        </div>





        <!--导入值周数据-->
        <el-dialog title="导入数据" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="wdform" ref="form" label-width="100px">

                <el-form-item label="学年学期：">
                    <el-cascader class="w200 selClass" size="small" v-model="importXnxq" placeholder="请选择学年学期" :options="xnxqList" :props="{expandTrigger: 'hover' }" clearable></el-cascader>
                </el-form-item>

                <el-form-item label="选择文件：">
                    <!-- <el-upload
                        :limit="1"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        action="/api/netcore/smartcredit/v2/Xmcj/BatchImportExcel"
                        :headers="headers"
                        :file-list="fileList"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload> -->
                    <upload-excel-component @on-selected-file='getExcelData'></upload-excel-component>
                </el-form-item>

                <div class="resultData">
                    <el-table :data="excelData">
                        <el-table-column label="周次" prop="周次"></el-table-column>
                        <el-table-column label="值周教师" prop="值周教师"></el-table-column>
                    </el-table>
                </div>


            </el-form>

            <div class="importTips">
                <b>注意事项：</b><br>
                1.教师按周设置，导入周数不能超过学期内最大周数；<br>
                2.默认按每周7天（周一到周日）设置；<br>
                3.教师出现重名情况，导入时默认为先创建教师，如已在教师名称后增加（大）（小）等区分的，则完整填写即可;
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="showInnerTips" type="warning">初始化周次</el-button>
                <el-button type="primary" icon="el-icon-download" @click="downLoadMB">下载值周模版</el-button>
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitImport">提 交</el-button>
            </div>
            
            <el-dialog width="400px" title="提示说明" class="innerTips" :visible.sync="innerTips" append-to-body>
                <b>注意事项：</b><br>
                初始化值周数据,会变更选中学年学期中,已调整的日期选择.<br>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerTips=false">取 消</el-button>
                    <el-button type="primary" @click="initWeek" :loading="isLoad">提 交</el-button>
                </div>
            </el-dialog>

        </el-dialog>


        <multipleselect ref="selectTeacher" v-bind:teacherList="teacherList" v-bind:checkTeacher="checkteacher" v-bind:multipleLimit='100' @handleChangeSel="handleChangeSel"></multipleselect>



        
    </div>
</template>

<script>
import _ from 'lodash';
import Cookies from 'js-cookie'
import UploadExcelComponent from '@comm/components/UploadExcel/index'
import * as searchBarApi from '@comm/api/components/searchbar';
import * as qualityApi from '@comm/api/qualityAppraisal';
import multipleselect from '@comm/components/multipleSelect/index';
import { teachclassAll } from '@comm/api/admin/teachclass/index'
import * as baseXnxqApi from '@comm/api/admin/division';
export default {
    name: "setReport",
    components: {
        multipleselect,
        UploadExcelComponent
    },
    data() {
        return {
            weekDutyList:[],                                //值周列表数据
            weekListSum:0,                                  //记录总条数
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制记录条数
            weekArr:[],                                     //值周详情前后前后1周+本周共3周信息
            teacherList:[],                                 //所有教师列表
            checkteacher:[],                                //选中的教师列表
            curWeekId:"",                                   //当前值周记录的ID
            tipsWeekRange:{start:"",end:""},                //设置区域上的日期提示信息
            selxnxq:[],                                     //选中的学年学期
            xnxqList:[],                                    //学年学期列表
            keyword:"",                                     //搜索关键词
            dialogFormVisible:false,                        //导入数据弹出开关
            fileList:[],                                    //导入数据文件列表
            wdform:{},                                      //导入数据form表单
            rangeDayNum:[],                                 //值周每个区域间相差几天
            rangeDate:[0,1],                                //值周滑动插件中,当前周显示的区域
            sumDay:1,                                       //1~3周数据统加的天数.用来设定滑动插件的长度参数
            minDay:0,                                       //可最小设置的天数
            importXnxq:[],                                  //导入周次的选择学年学期
            excelData:[],                                   //Excel里的数据
            innerTips:false,                                //初始化值周信息内部弹层
            isLoad:false,                                   //是否在处理数据
            xnxqObj:{},                                     //当前学年学期对象
        }
    },
    computed: {
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token")}
        },
    },
    watch: {

    },
    mounted(){
        
        this.init();
    },
    methods: {
        async init(){
            await this.getXnXqList();
            this.getWeekAllInfo();
            this.getTeacherList();
            
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
                console.log(error,"error")
                that.$notify({title:'错误',message:'数据初始化出错,刷新后再试',type:'error'});
            });
            
            var res = await baseXnxqApi.Getxndm({xxdm:this.$cookie.get('xxdm')})
            this.xnxqObj = res.data
            // console.log(this.xnxqObj,225500)
            this.selxnxq = [this.xnxqObj.xn,this.xnxqObj.xq]
        },

        /**
         * 子组件保存后提交值周老师数据 参数selTeacher是子组件回传的当前选中的教师数组
         * by:RayJ
         * time:2019-07-23
         */
        async handleChangeSel(selTeacher){
            var param = {};
            param.weekId = this.curWeekId;
            var  weekTeacherParamList = JSON.parse(JSON.stringify(selTeacher).replace(/gh/g,"teacherId"));
            weekTeacherParamList = JSON.parse(JSON.stringify(weekTeacherParamList).replace(/xm/g,"teacherName"));
            param.weekTeacherParamList = weekTeacherParamList
            //提交更新值周老师数据         
            var res = await qualityApi.updateWeekTeacher(param);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.$notify({title:"成功",message:"设置值周教师成功",type:"success"});
                this.$refs.selectTeacher.cancal();
                this.getWeekAllInfo();    
            }        
        },
        
        /**
         * 获取所有教师列表
         * by:RayJ
         * time:2019-07-23
         */
        async getTeacherList(){
            var res = await teachclassAll({xxdm:this.$cookie.get('xxdm')});
            this.teacherList = res.data.jsList;
        },

        /**
         * 结果集 - 翻页
         * by:RayJ
         * time:2019-07-23
         */
        PageChange(curpage){
            this.curPage = curpage;
            this.getWeekAllInfo();
        },

        /**
         * 获取所有值周信息
         * by:RayJ
         * time:2019-07-22
         */
        async getWeekAllInfo(){
            // var xnxqObj = await baseXnxqApi.Getxndm({xxdm:this.$cookie.get('xxdm')})
            // console.log(xnxqObj,225500)


            var param = {};
            param.page = this.curPage;
            param.limit = this.pageLimit;
            if(this.selxnxq.length>1){
                param.schoolYear = this.selxnxq[0];
                param.term = this.selxnxq[1];
            }
            if(this.keyword){
                param.teacherName = this.keyword
            }
            var res = await qualityApi.getWeekPage(param);
            this.weekDutyList = res.value.dataList;
            this.weekListSum = res.value.totalCount;
            console.log(res,200)
        },

        /**
         * 获取值周详细信息并初始化滑块和一些基础信息
         * by:RayJ
         * time:2019-07-22
         */
        async settingDate(scope){
            var res = await qualityApi.getWeekDetail(scope.row.weekId);
            this.weekArr = res.value;

            this.sumDay = 0;
            for(var i=0;i<this.weekArr.length;i++){
                this.rangeDayNum[i] = this.DateDiff(this.weekArr[i].startTime.split(" ")[0],this.weekArr[i].endTime.split(" ")[0]);
                this.sumDay = this.sumDay + this.rangeDayNum[i];
            }
            console.log(this.sumDay,228855)
            if(this.weekArr.length==1){
                //如果只有1条记录区域就是 0~长度-1
                this.rangeDate = [0,this.rangeDayNum[0]-1];
                //设置显示的起始和结束时间
                this.tipsWeekRange.start = this.weekArr[0].startTime;
                this.tipsWeekRange.end = this.weekArr[0].endTime;
                this.minDay = 0;
            }else if(this.weekArr.length==2){
                //如果只有2条记录代表在头部或者在尾部
                //获取当前周如果是0 那就是在头部,否则就是在尾部
                var curIndex = _.findIndex(this.weekArr,{"weekId":scope.row.weekId})
                if(curIndex == 0){
                    this.rangeDate = [0,this.rangeDayNum[0]-1];
                    this.minDay = 0;
                    this.sumDay = this.sumDay - 3;
                }else{
                    this.rangeDate = [this.rangeDayNum[0],this.rangeDayNum[0]+this.rangeDayNum[1]-1];
                    this.minDay = 2;
                }
                //设置显示的起始和结束时间
                this.tipsWeekRange.start = this.getDiffDate(this.weekArr[0].startTime,(curIndex!=0?2:0));
                this.tipsWeekRange.end = this.getDiffDate(this.weekArr[1].endTime,(curIndex==0?-2:0));
            }else{
                this.rangeDate = [this.rangeDayNum[0],this.rangeDayNum[0]+this.rangeDayNum[1]-1];
                //设置显示的起始和结束时间
                this.tipsWeekRange.start = this.getDiffDate(this.weekArr[0].startTime,2);
                this.tipsWeekRange.end = this.getDiffDate(this.weekArr[2].endTime,-2);
                this.minDay = 2;
                this.sumDay = this.sumDay - 3;
            }
            console.log(this.tipsWeekRange,331177)
            // console.log(this.rangeDayNum,229977)
            // console.log(this.rangeDate,229988)
        },

        /**
         * 提交更改值周时间
         * by:RayJ
         * time:2019-07-23
         */
        async updataWeekTime(scope){
            var weekList = $.extend(true,[],this.weekArr);
            //更新weekList数组,拖动滑块后的新的数据
            if(this.weekArr.length==1){
                weekList[0].startTime = this.getTargetDate(this.rangeDate[0]) + " 00:00:00";
                weekList[0].endTime = this.getTargetDate(this.rangeDate[1]) + " 23:59:59";
            }else if(this.weekArr.length==2){
                var curIndex = _.findIndex(this.weekArr,{"weekId":scope.row.weekId})
                if(curIndex == 0){
                    weekList[0].startTime = this.getTargetDate(this.rangeDate[0]) + " 00:00:00";
                    weekList[0].endTime = this.getTargetDate(this.rangeDate[1]) + " 23:59:59";
                    weekList[1].startTime = this.getTargetDate(this.rangeDate[1]+1) + " 00:00:00";
                }else{
                    weekList[0].endTime = this.getTargetDate(this.rangeDate[0]-1) + " 23:59:59";
                    weekList[1].startTime = this.getTargetDate(this.rangeDate[0]) + " 00:00:00";
                    weekList[1].endTime = this.getTargetDate(this.rangeDate[1]) + " 23:59:59";
                }
            }else{
                weekList[0].endTime = this.getTargetDate(this.rangeDate[0]-1) + " 23:59:59";
                weekList[1].startTime = this.getTargetDate(this.rangeDate[0]) + " 00:00:00";
                weekList[1].endTime = this.getTargetDate(this.rangeDate[1]) + " 23:59:59";
                weekList[2].startTime = this.getTargetDate(this.rangeDate[1]+1) + " 00:00:00";
            }
            

            var param = {};
            param.weekTimeList = weekList;
            var res = await qualityApi.updateWeekTime(param);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.getWeekAllInfo();
                this.$notify({title:"成功",message:"设置值周时间成功",type:"success"});
            }    
        },
        
        /**
         * 格式化vue滑块插件上的label显示的文字
         * by:RayJ
         * time:2019-07-22
         */
        formatDate(item){
            if(item||item==0){
                return this.getTargetDate(item)
            }
            
        },


        /**
         * 计算sDate1 和 sDate2 之间相差几天
         * by:RayJ
         * time:2019-07-22
         */
        DateDiff(sDate1,  sDate2){
            // console.log(sDate1,sDate2)
            aDate  =  sDate1.split("-");
            // console.log(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
            var  aDate,oDate1,oDate2,iDays;
            
            oDate1  =  new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2]);
            aDate  =  sDate2.split("-");
            oDate2  =  new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2]);
            // console.log(oDate1,oDate2)
            iDays  =  Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24;
            return  iDays + 1
        },

        /**
         * 计算初始时候+N天后的日期....参数num就是N天 this.weekArr[0].startTime就是初始日期
         * by:RayJ
         * time:2019-07-22
         */
        getTargetDate(num){
             if(this.weekArr.length>0){
             var  aDate,oDate1;
             //提取2019-07-22 20:15:23 中的日期属性
             aDate = this.weekArr[0].startTime.split(" ")[0].split("-");
             oDate1 = new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2]);
             //转换成毫秒值 再加上 N*1天的毫秒值 等于 目标日期的毫秒值
             var targetDay = new Date(oDate1.valueOf() + (num*1000*60*60*24)) 
             var year = targetDay.getFullYear();
             var month = (targetDay.getMonth()+1)>=10?(targetDay.getMonth()+1):('0'+(targetDay.getMonth()+1));
             var day = targetDay.getDate()>=10?targetDay.getDate():('0'+targetDay.getDate());    
             return year + "-" + month + "-" + day;
             }
        },

        /**
         * 计算num天前后的时间
         * by:RayJ
         * time:2019-08-14
         */
        getDiffDate(dayTime,num){
            console.log(dayTime,442233)
            // var  aDate,oDate1;
            //提取2019-07-22 20:15:23 中的日期属性
            var aDate = dayTime.split(" ")[0].split("-");
            var oDate1 = new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2]);
            //转换成毫秒值 再加上 N*1天的毫秒值 等于 目标日期的毫秒值
            var targetDay = new Date(oDate1.valueOf() + (num*1000*60*60*24)) 
            var year = targetDay.getFullYear();
            var month = (targetDay.getMonth()+1)>=10?(targetDay.getMonth()+1):('0'+(targetDay.getMonth()+1));
            var day = targetDay.getDate()>=10?targetDay.getDate():('0'+targetDay.getDate());    
            return year + "-" + month + "-" + day;
        },

        /**
         * 选择值周老师
         * by:RayJ
         * time:2019-07-23
         */
        selTeacherWeek(scope){
            this.checkteacher = [];
            var checkTeacherTemp = $.extend(true,[],scope.row.weekTeacherList); 
            checkTeacherTemp = JSON.parse(JSON.stringify(checkTeacherTemp).replace(/teacherId/g,"gh"));
            checkTeacherTemp = JSON.parse(JSON.stringify(checkTeacherTemp).replace(/teacherName/g,"xm"));  
            //设置当前选中的教师的列表
            this.checkteacher = checkTeacherTemp;
            //设置当前调整的值周ID
            this.curWeekId = scope.row.weekId;
            this.$nextTick(()=>{
                //唤醒选择教师的弹层组件
                this.$refs.selectTeacher.showSelect();
            })
        },

        /**
         * 下载值周模版结构
         * by:RayJ
         * time:2019-08-08
         */
        downLoadMB() {
        /** 下载excel**/
        this.downloadLoading = true;
            import('@comm/script/utils/Export2Excel').then(excel => {
                const tHeader = ['周次', '值周教师']
                const filterVal = ['weekNum', 'weekTeacherStr']
                // const list = this.tableData
                // const data = this.formatJson(filterVal,[],list)
                excel.export_json_to_excel(tHeader,[],'周次导入表格')
                this.downloadLoading = false;
            })
        },

        /**
         * 获取Excel中的数据
         * by:RayJ
         * time:2019-08-08
         */
        getExcelData(data){

            this.excelData = data.results;
            console.log(data);

            // data.results.forEach(element => {
            //     console.log(element,8)
            // });

            // {
            // "schoolYear": "string",
            // "term": "string",
            // "weekList": [
            //     {
            //     "weekName": "string",
            //     "weekNum": 0,
            //     "weekTeacherStr": "string"
            //     }
            // ]
            // }
            console.log(data)
        },
        /**
         * 导入值周信息
         * by:RayJ
         * time:2019-08-12
         */
        async submitImport(){
            if(this.importXnxq.length!=2){
                this.$notify({title:"提示",message:"请选择学年学期",type:"warning"});
                return
            }
            var weekList = [];
            this.excelData.forEach(element => {
                weekList.push({weekNum:element["周次"],weekTeacherStr:element["值周教师"]})
            });

            for(var i=0;i<weekList.length;i++){
                if(!parseInt(weekList[i].weekNum)){
                    this.$notify({title:"提示",message:"周次请填写数字",type:"warning"});
                    return
                }
            }
            
            if(weekList.length==0){
                this.$notify({title:"提示",message:"Excel中无正确格式数据",type:"warning"});
                return
            }

            var param = {}
            param.schoolYear = this.importXnxq[0];
            param.term =  this.importXnxq[1];
            param.weekList = weekList;

            var res = await qualityApi.importWeekData(param);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.dialogFormVisible = false;
                this.$notify({title:"成功",message:"值周数据导入成功",type:"success"});
                this.getWeekAllInfo();
            }  
        },

        /**
         * 显示初始化值周信息弹层
         * by:RayJ
         * time:2019-08-19
         */
        showInnerTips(){ 
            if(this.importXnxq.length!=2){
                this.$notify({title:"提示",message:"请选择学年学期",type:"warning"});
                return
            }
            this.innerTips = true;
        },

        /**
         * 确认初始化值周信息
         * by:RayJ
         * time:2019-08-19
         */
        async initWeek(){ 
            if(this.importXnxq.length!=2){
                this.$notify({title:"提示",message:"请选择学年学期",type:"warning"});
                return
            }
            this.isLoad = true;
            var param = {}
            param.schoolYear = this.importXnxq[0];
            param.term =  this.importXnxq[1];
            param.weekList = [];

            var res = await qualityApi.importWeekData(param);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.$notify({title:"成功",message:"初始化值周数据成功",type:"success"});
                this.getWeekAllInfo();
            }
            this.innerTips = false;
            this.isLoad = false;
        },



        /**
         * 关闭删除记录的tips
         * by:
         * time:
         */
        delClose(row){
            this.$set(row,'deltips',false);
        },
        changeClose(row){
            this.$set(row,'changetips',false);
        },
        




        importData(){
            this.excelData = [];
            this.dialogFormVisible = true;
        },
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
.resultData{
    width: 100%;
    max-height: 200px;
    overflow: auto;
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
.ml0{
    margin-left: 0px;
}
.sliderDay{
    position: relative;
    padding:20px 15px;
    .sliderTit{
        top: 5px;
        left: 10px;
        position: absolute;
    }
    .startDate{
        position: absolute;
        bottom: 10px;
        left: 0;
    }
    .endDate{
        position: absolute;
        bottom: 10px;
        right: 0;
    }
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
.importTips{
    padding-top: 10px;
    border-top: 1px dotted #d8d8d8;
    color: #888;
    line-height: 24px;
    font-size: 12px;
}
.pagination{
    width: 100%;
}
.innerTips{
    line-height: 30px;
}

</style>
