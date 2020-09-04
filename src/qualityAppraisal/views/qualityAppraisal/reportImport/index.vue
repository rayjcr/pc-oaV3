<template>
    <div class="app-container">

        <div class="u_TableMain block ofhide noTransform" type="border-card">
            <div class="filter-container">
                <div>
                    <el-form ref="form" :model="form">
                        <el-row>
                            <el-form-item label="" style="min-width:600px;">
                                <el-input v-model="searchName" placeholder="请输入学生姓名" clearable style="width: 150px;"></el-input>
                                <el-button v-if="canEdit" type="success" @click.stop="ImportData">导入</el-button>
                                <el-button v-if="canEdit" type="primary" @click.stop="messageSubmit()" :loading="isout">提交</el-button>
                            </el-form-item>

                        </el-row>
                    </el-form>
                    <p class="tip"><span>注：</span>姓名标红表示内容未录完，班级名称右侧数字表示未录完学生个数</p>
                </div>
            </div>
        
        <div class="m_GenTableBox"  v-loading="loadingClass">
            <div class="content_left" :class="{'fix':isFix}">
                <div class="u_stuList">
                    <div class="noStu" v-if="allStudents.length==0">无任何班级学生信息<br>(此用户没有分配职教班级)</div>
                    <dl v-for="(item,index) in allStudents" :key="index">
                        <dt v-on:click="slidestu(index,item)">{{item.bjmc}}<span class="unImportCount">{{item.emptyCount!=null?item.emptyCount:item.students.length}}</span></dt>
                        <div v-show='curBjId.indexOf(item.bjdm)!=-1'  class="studdlist" :style="{height:32*item.students.length+'px'}">
                            <dd v-on:click="selstu(sitem,item)" v-for="(sitem,sindex) in item.students" :key="sindex" :class="{'on':sitem.xh==curStu,'off':sitem.xh!==curStu,'notFill':checkNotFill(index,sitem.xh)}">
                                {{sitem.xm}}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div class="content_right">

                <div class="reportLoading" v-loading="isLoadReport"  element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading"></div>

                <transition name="fade">
                    <div v-if="!isLoadReport&&curName!=''">
                      <h3>
                        {{curXn + (curXq=='01'?'上':'下')}}学期学生成长综合素质报告单  
                      </h3> 
                      <div class="baseInfo">
                        班级：<span class="textunderline">{{curClass.bjmc}}</span>
                        姓名：<span class="textunderline">{{curName}}</span>
                      </div>
                      <div class="bgdBlock">
                          <h4>班主任寄语</h4>
                          <el-input
                            resize="none"
                            type="textarea"
                            style="width:500px"
                            placeholder="请输入班主任寄语，最多200字"
                            v-model="curStuInfo.classTeacherMessage"
                            maxlength="200"
                            :rows="10"
                            :disabled="!canEdit"
                            show-word-limit>
                        </el-input>
                      </div>
                    </div>
                </transition>
                <!-- <coverpage></coverpage> -->
                <!-- <stuphoto></stuphoto> -->
                <!-- <physical></physical> -->
                <!-- <summaryscScore></summaryscScore> -->
                <!-- <course></course> -->
                <!-- <morals></morals>  完成 √ -->
                <!-- <practice></practice> -->
                <!-- <international></international> -->
                <!-- <growup></growup> -->
                <!-- <message></message> -->
                <!-- <backcover></backcover> -->
            </div>  
        </div>

        </div>






    <!-- 数据导入弹层 -->
    <el-dialog title="项目导入" :visible.sync="xmImportData" width="540px" class="import_box">

        <el-row style="margin-bottom:10px;">
            <el-col :span="6" class="colLineTit">执行班级：</el-col>
            <el-col :span="18">
                <el-select v-model="BatchSelClass" size="small"  placeholder="请选择">
                    <el-option v-for="(item,index) in backAllStudents" :key="item.bjdm" :label="item.bjmc" :value="item.bjdm" :disabled="!item.canEdit"></el-option>
                </el-select>
            </el-col>
        </el-row>
        
        <el-row>
            <el-col :span="6" class="colLineTit">文件选择：</el-col>
            <el-col :span="18">
                <el-upload
                    :limit="1"
                    name="file"
                    ref="BatchbzForm"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action="/api/evaluation/report/reportMessageImport"
                    :headers= "headersV2"
                    :file-list="bzList"
                    :onError="uploadError"
                    :onSuccess="(res,file,fileList)=>{return uploadSuccess(res,file,fileList,'xm')}"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-col>
        </el-row>

        <el-row> 
            <el-col :span="6" class="colLineTit">失败数据详情：</el-col>
            <el-table
            :data="errData"
            style="width: 100%;max-height: 200px;
                            overflow-y: scroll;">
            <el-table-column
                width="100"
                prop="name"
                label="姓名">
            </el-table-column>

            <el-table-column
                prop="message"
                label="错误信息">
            </el-table-column>

            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="importSubmit('BatchbzForm')">确 定</el-button>
            <el-button size="medium" @click="BatchimportCancel">取 消</el-button>
            <el-button size="medium" @click="BatchimportMb()">模版生成<i class="el-icon-download"></i></el-button>
            <el-row class="import_desc">
                <el-col :span="6" style="line-height:80px">
                    操作说明：
                </el-col>
                <el-col :span="18">
                    <p>1.请使用本页面提供的模版进行导入</p>
                    <p>2.请勿修改模版Excel的表头内容</p>
                    <p>3.模版提供的默认信息，请勿随意修改</p>
                    <p>4.具有星号(*)的条目位必填项</p>
                </el-col>
            </el-row>
        </div>

    </el-dialog>


















    </div>
</template>

<script>
import Cookies from 'js-cookie'

import _ from 'lodash';
import {Getjurisdiction} from '@comm/api/admin/class/index';
import * as detailPapi from '@comm/api/project/report/index'
import * as detailBase from '@comm/api/project/report/base'
import * as mainProject from '@comm/api/project/mainProject/index'
import * as reportApi from '@comm/api/project/creditInquiry/index';
import * as qualityApi from '@comm/api/qualityAppraisal';

export default {
    name: "setReport",
    components: {
    },
    data() {
        return {
            curStu:"",                              //学生选中的学号
            stuListMenu:[],                         //班级选中列表
            allStudents:[],                         //班级学生列表
            backAllStudents:[],                     //备份的原始的所有学生列表
            StuSumArr:[],                           //班级学生列表(总的合并所有班级的学生)
            // reportinfo:[],              
            isFix:false,                            //学生列表置顶的标识
            
            resReportAll:{},                        //数据返回的报告单全部数据

            //测试用的报告单顺序
            bgdMap:new Map([[0,'coverpage'],[1,'stuphoto'],[2,'physical'],[3,'morals'],[4,'summaryscScore'],[5,'course'],[6,'practice'],[7,'international'],[8,'growup'],[9,'message'],[10,'backcover'],]),
            allbgd:[],
            checkbgd:[],

            form: {},
            searchName: '',                 // 搜索学生姓名               
            isout: false,                   // 导出按钮加载效果控制
            xmImportData: false,            // 项目数据导入弹出显示
            BatchSelClass:"",               // 项目导入执行的班级
            BatchoutSelClass:[],            // 导出执行的班级
            bzList:[],                      //标准list(一般目前只支持单选)
            importLoading:false,            //上传中标识
            bgdId:"",                       //报告单ID
            isLoadReport:false,             //是否正在加载报告单
            curClass:{},                    //当前班级对象
            curName:'',                     //当前学生姓名
            lrsd:false,                     //是否录入锁定
            curBjId:"",                     //当前选中的班级ID
            xmOutPutData:false,             //批量导出弹层
            curXn:"",                       //当前学年
            curXq:"",                       //当前学期
            bgdPage:1,                      //报告单列表显示页码
            bgdTableData:[],
            bgdListTotalPages:0,
            bgdListTotal:0,
            bgdloading:false,
            isDownLoad:false,
            curStuInfo: {                   //当前学生信息
              classTeacherMessage:'',
            },
            // canEdit: false,                 //是否有权限编辑     
            reportFillList: [],             //报告单填写情况           
            loadingClass: false,            //加载班级信息
            errData: [],                    //导入错误信息
			honorClass: [],					//有权限修改的班级
        }
    },
    computed: {
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        },
        headersV2: function() {
            return {Authorization: Cookies.get("Admin-Token")}
        },
		canEdit: function() { //是否有权限编辑     
			//校管理员有权限修改
			var res = localStorage.getItem('lguserType') == '2';
			//班主任有权限修改
			if(!res&&localStorage.getItem('lguserType') == '3'){
				if(!this.curStu){
					return this.honorClass.length>0;
				} else {
					var ind = this.honorClass.findIndex(e=>e.classId==this.curStuInfo.classCode);
					return ind>=0;
				}
			}
			return res;
		}
    },
    watch: {
        //查询学生
        searchName(newname,oldname){
            if(newname==""){
                this.allStudents = $.extend(true,[],this.backAllStudents);
                this.curBjId = "";
            }else{
                for(var i=0;i<this.allStudents.length;i++){
                    this.allStudents[i].students = _.filter(this.allStudents[i].students, function(o) { return o.xm.indexOf(newname)!=-1; });
                    this.curBjId = this.curBjId + this.allStudents[i].bjdm + ","
                }
            }
        }
    },
    mounted(){
        var that = this;
        window.onscroll= function(e){
            //变量t是滚动条滚动时，距离顶部的距离
            var t = document.documentElement.scrollTop||document.body.scrollTop;
            if(t>=150){
                that.isFix = true;
            }else{
                that.isFix = false;
            }
        }
        this.bgdId = this.$route.query.bgdId;
        // this.curXn = this.$route.query.curXn;
        

        
        //this.checkbgd = this.testbgd;
        this.init();
    },
    methods: {
        /**
         * 说明:初始化页面数据 
         * 作者:RayJ
         * 更新时间:2019-1-11
         */
        async init(){
            //获取当前学年
            var res = await mainProject.dqxnxqObj({"xxdm":this.$cookie.get('xxdm')});
            console.log(res,330033)
            this.curXn = res.data.xn;
            this.curXq = res.data.xq;
			
			this.honorClass = await reportApi.getClassTeacherClassList({"schoolCode":this.$cookie.get('xxdm'),"teacherCode":localStorage.getItem("usercode")})
            // 根据当前班级判断是否可修改
            // this.canEdit = localStorage.getItem('lguserType') == '2' ||localStorage.getItem('lguserType') == '3';

            //获取班级学生列表的参数
            this.allStudents = [];
            this.StuSumArr = [];
            // this.reportinfo = [];

            this.loadingClass = true;
            if(localStorage.getItem("lguserType")==2){
                console.log("管理员驾到!")
                this.getAllClass();
            }else{
                let params = {
                    xxdm: this.$cookie.get('xxdm'),
                    zgh: localStorage.getItem("usercode"),
                    // zgh:'undefined',
                    xndm: this.curXn,
                    xm: '',
                }
                //获取当前报告单对象
                //this.reportinfo = JSON.parse(localStorage.getItem("reportinfo"))

                //获取班级学生列表
                let res = await Getjurisdiction(params);
				res.data.map((item)=>item.canEdit=false)
				// res.data
                this.allStudents = res.data; 

                this.backAllStudents = $.extend(true,[],this.allStudents);
                // console.log(this.backAllStudents,290);
				
				this.honorClass.map((cur)=>{
					var ind = this.allStudents.findIndex(e=>e.bjdm==cur.classId);
					if(ind>=0){//如果是班主任就可以操作
						this.allStudents[ind].canEdit = true;
					} else {//如果没找到这个班级就添加这个班级
						var item = {
							canEdit: true,
							students: [],
							bjdm: cur.classId,
							bjmc: cur.className,
							emptyCount: 0,
							njdm: cur.gradeId,
							njmc: cur.gradeName,
						}
						this.allStudents.push(item);
						this.getAllStudent(item.bjdm,this.allStudents.length-1);
					}
				})

                //合并总的学生列表
                for(let i=0;i<this.allStudents.length;i++){
                    //给每个学生对象添加bjnjindex便于合并所有学生后知道知道班级代码和年级代码(查询需要)
                    for(let j=0;j<this.allStudents[i].students.length;j++){
                        _.assign(this.allStudents[i].students[j], {bjnjindex:i});
                    }
                    //合并所有班级的学生到一个变量里
                    this.StuSumArr = _.concat(this.StuSumArr,this.allStudents[i].students)
                }

                if(this.allStudents.length==0){
                    this.loadingClass = false;
                    this.$notify({title:"提示",message:"该教职工无职教班级",type:"warning"});
                    return
                }


                await this.getClassDetails(this.allStudents);
                this.backAllStudents = $.extend(true,[],this.allStudents);
                //初始化第一个人员获取报告单信息
                //这里少个判断是否存在这个人物~!!!!!!!!!!!!!
                // console.log(this.allStudents[0],312)
                // this.curClass = this.allStudents[0]
                // this.curStu = this.allStudents[0].students[0].xh;
                // this.curName = this.allStudents[0].students[0].xm
                // this.getReportInfo(this.allStudents[0],this.allStudents[0].students[0]);
            }

        },

        /**
         * 说明：获取所有班级以及学生
         * by:RayJ
         * time:2019-06-28
         */
        async getAllClass(){
            var res =  await reportApi.Getallbjlist({"xxdm":this.$cookie.get('xxdm'),'dqxn':this.curXn});
            console.log(res,440099)
            var tempBjList = [];
            tempBjList = res;
            for(var i=0;i<tempBjList.length;i++){
                tempBjList[i]["bjdm"] = tempBjList[i].uuid;
                tempBjList[i]["bjmc"] = tempBjList[i].bj;
                tempBjList[i]["students"] = [];
            }

            this.allStudents = tempBjList
            for(var i=0;i<tempBjList.length;i++){
                this.getAllStudent(tempBjList[i].uuid,i)
                // tempBjList[i].emptyCount = this.reportFillList[i].emptyCount
            }
			this.allStudents.map(e=>{e.canEdit = true});
            await this.getClassDetails(this.allStudents);
            this.backAllStudents = $.extend(true,[],this.allStudents);
            // console.log(tempBjList,336)
        },

        /**
         * 说明：获取班级中学生
         * by:RayJ
         * time:2019-06-28
         */
        async getAllStudent(bjdm,index){
            var res =  await detailBase.getAllStudent({"xxdm":this.$cookie.get('xxdm'),"xn":this.curXn,"bjid":bjdm});
            this.$set(this.allStudents[index],"students",res);
            this.backAllStudents = $.extend(true,[],this.allStudents);
        },

        // 获取寄语填写情况
        async getClassDetails(bjList,index){
            var classCode = '';
            if(index!=undefined){
              classCode += bjList.classCode;
            } else {
              bjList.forEach(e=>{ classCode+=e.bjdm; classCode+=','})
            }
            var res =  await qualityApi.getReportMessageClassEntryStatus({"classCode":classCode,"schoolYear":this.curXn,"term":this.curXq});
            if(index!=undefined){
              this.reportFillList[index] = res.value[0];
              this.$set(this.allStudents[index],'emptyCount',res.value[0].emptyCount);
              this.allStudents.push({});
              this.allStudents.pop();
            } else {            
              this.reportFillList = res.value;
              for(var i=0;i<bjList.length;i++){
                  bjList[i].emptyCount = this.reportFillList[i].emptyCount
              }              
            }
            this.loadingClass = false;
        },

        //是否未填写
        checkNotFill(index, stuCode){
          if(this.reportFillList[index]){
            return (this.reportFillList[index].emptyStudentIdList.findIndex(e => e == stuCode)>=0);
          }
          return false;
        },

        /**
         * 说明:获取报告单全部信息
         * by:RayJ
         * time:2019-06-13
         */
        async getReportInfo(fitem,item){
            // console.log(fitem,325)
            this.curClass = fitem;
            this.curStu = item.xh;
            this.curName = item.xm;
            let params = {
                // xxdm: this.$cookie.get('xxdm'),
                // bgdId: this.bgdId,
                // njdm:fitem.njdm,
                // bjdm:fitem.bjdm,
                // xh:item.xh,
                // xmZgfLjRwZgf:false,
                // qrCodeSize:50,
                // bgdSZPX:"",
                schoolYear: this.curXn,
                term: this.curXq,
                classCode: fitem.bjdm,
                userId: item.xh
            }
            this.isLoadReport = true;
            try {
           
                var res = await qualityApi.getReportMessageByStudent(params);

                console.log(res,340);
                if(res.value){
                  this.curStuInfo = res.value;
                } else {
                  this.curStuInfo = {
                    classTeacherMessage: ''
                  }
                }
                

                // this.resReportAll = res;
                // var backResReportAll = $.extend(true,[],this.resReportAll);
                // this.lrsd = res.bgd.lrsd;
                
                // //整理报告单的格式
                // this.checkbgd = [];
                // this.allbgd = [];

                // // this.resReportAll.page = _.reject(this.resReportAll.page,{"mc":"成长规划"});
                // this.resReportAll.page = _.reject(this.resReportAll.page,{"mc":"国际理解"});
                // this.resReportAll.page = _.reject(this.resReportAll.page,{"mc":"国际理解"});

                // for(var i=0;i<this.resReportAll.page.length;i++){
                //     // console.log("this.resReportAll.page[i].mb="+this.resReportAll.page[i].mb)
                //     if(this.resReportAll.page[i].mb!="5_1"&&this.resReportAll.page[i].mb!="5_2"){
                //         this.allbgd.push({"id":parseInt(this.resReportAll.page[i].mb),"name":this.resReportAll.page[i].mc,"uuid":this.resReportAll.page[i].uuid})
                //     }
                // }
                // console.log(this.resReportAll.page,446688)

                // this.allbgd = _.reject(this.allbgd,{"id":5});

                // var showCourseList = [];
                // for(var i=0;i<4;i++){
                //     var tempobj;
                //     if(i==0){
                //         tempobj = _.find(backResReportAll.page,{"mc":"自主善学-语文"})
                //     }else if(i==1){
                //         tempobj = _.find(backResReportAll.page,{"mc":"自主善学-数学"})
                //     }else if(i==2){
                //         tempobj = _.find(backResReportAll.page,{"mc":"自主善学-英语"})
                //     }else if(i==3){
                //         tempobj = _.find(backResReportAll.page,{"mc":"自主善学-科学"})
                //     }
                //     showCourseList.push({"id":parseInt(tempobj.mb),"name":tempobj.mc,"uuid":tempobj.uuid});
                // }
                // // this

                // var insertIndex = _.findIndex(this.allbgd,{"id":4});
                // //console.log('insertIndex='+insertIndex)
                // showCourseList.unshift(insertIndex+1,0);
                // Array.prototype.splice.apply(this.allbgd, showCourseList);   

                // // console.log(this.allbgd,335544);
                // //初始全选报告单所有页面
                // this.checkbgd = this.allbgd;
            }
            catch(err) {
                // console.log(this.allbgd,335544);
                this.checkbgd = this.allbgd;
                console.log(err.message);
            }
            this.isLoadReport = false;
        },

        /**
         * 说明：切换学生获取当前学生的报告单
         * by:RayJ
         * time:2019-06-14
         */
        selstu(sitem,item){
            document.documentElement.scrollTop = 0;
            if(this.isLoadReport){
                this.tipsXX("正在读取报告单,请稍后","warning");
                return
            }
            this.curStu = sitem.xh;
            this.getReportInfo(item,sitem);
        },
        

        /**
         * 说明:班级学生列表展开和收起 
         * 作者:RayJ
         * 更新时间:2019-1-11
         */
        slidestu(index,item){
            if(this.curBjId.indexOf(item.bjdm)!=-1){
                this.curBjId = this.curBjId.replace(item.bjdm+",","")
            }else{
                this.curBjId = this.curBjId + item.bjdm + ",";
            }
            // console.log(this.curBjId,436)
            //this.$set(this.stuListMenu,index,!this.stuListMenu[index]);
            // console.log(this.stuListMenu);
        },

        changeBgd(){

            this.checkbgd = _.sortBy(this.checkbgd, ['id']);
            // console.log(this.checkbgd);
        },

        /**
         * @description: 调起弹窗准备导出处理，弹窗内包含所需导出数据模块选项，在确认所需导出信息表单后可开始进行导出操作
         * 同时进行相关验证判断是否可进行数据导出，或是否符合条件
         * @param {type} 
         * @return: 
         */
        async Popup(bgdId){
            this.xmOutPutData = true;
        },
        // 导出学生/班级
        Output () {
            this.isout = true;
            var that = this;
            if (this.curStu !== '') {

                var paraOutput = {
                    fqry:1,             //1为老师发起  2为学生发起
                    yx:'',
                    xxdm:this.$cookie.get('xxdm'),
                    bgdId:this.bgdId,
                    njdm:this.curClass.njdm,
                    bjdm:this.curClass.bjdm,
                    xh:this.curStu,
                }
                var notifyInstance = that.$notify({
                title: '提示',
                message: '报告单正在生成中,稍后点击报告单列表查看',
                type: 'success',
                duration:2000
                });
                // window.open("http://192.168.0.27:8215/index.html?xxdm="+this.reportinfo.xxdm+"&bgdId="+this.reportinfo.uuid+"&njdm="+this.outputBj.njdm+"&bjdm="+this.outputBj.bjdm+"&xh=&token="+getToken());
                detailPapi.outputReportV2(paraOutput).then(data => {
                //     var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                //     var downloadElement = document.createElement('a');
                // 　　var href = window.URL.createObjectURL(blob); //创建下载的链接
                // 　　downloadElement.href = href;
                // 　　downloadElement.download = that.curName + '报告单.pdf'; //下载后文件名
                // 　　document.body.appendChild(downloadElement);
                // 　　downloadElement.click(); //点击下载
                // 　　document.body.removeChild(downloadElement); //下载完成移除元素
                // 　　window.URL.revokeObjectURL(href); //释放掉blob对象
                //     that.downloads = false;
                //     that.outputXSFormVisible =false;
                //     notifyInstance.close()
                //     that.tipsXX("下载完毕","success");
                    that.isout = false;
                    if(data.status!=1){
                        that.tipsXX("生成失败,请重新再试","error");
                    }
                }).catch(error => {
                    notifyInstance.close()
                    that.isout = false;
                    setTimeout(() => {
                    that.downloads = false
                    }, 1000)
                    that.tipsXX("生成失败,请重新再试","error");
                    console.log(error)
                })
            } else {
                this.isout = false
                // this.isable1 = false
                that.tipsXX("请先选择对应学生！","warning");
                
                // this.$notify({title: '提示', message: '', type: 'error', duration: 2000})
            }
        },
        /***
         * 获取已经生成的报告单列表
         * by:RayJ
         * time：2019-07-09
         *  */
        async GetBgdList(){
            this.bgdloading = true;
            var paraOutput = {
                PageIndex:this.bgdPage,
                PageSize:10,
                xxdm:this.$cookie.get('xxdm'),
                bgdId:this.bgdId,
                fqry:1,             //1为老师发起  2为学生发起  
                // yx:'',
                // njdm:this.curClass.njdm,
                // bjdm:this.curClass.bjdm,
                // xh:this.curStu,
            }
            var res = await detailPapi.getOutBgdList(paraOutput);
            this.bgdPage = res.data.pageIndex;
            this.bgdTableData = res.data.list;
            this.bgdListTotalPages = res.data.pageCount;
            this.bgdListTotal = res.data.totalCount;
            this.bgdloading = false;
        },


        //取消生成报告单
        async cancelReport(item){
            var params = {
                xxdm: this.$cookie.get('xxdm'),
                scrwid:item.uuid,
            }
            try{
                var res = await detailPapi.CancelGenerateTask(params) 
                this.tipsXX(res.message,"success");
                this.GetBgdList();
            } catch(err) {
                this.tipsXX("请求发送失败，请稍后再试","error");
            }
        },

        /**
         * 切换页面
         * by:RayJ
         * time:2019-07-09
         */
        handleCurrentChange(val) {
            this.bgdPage = val;
            this.GetBgdList();
        },

        /**
         * 下载报告单
         * by:RayJ
         * time:2019-07-09
         */
        async downLoadReport(item){
            console.log(item,664455)
            var paraOutput = {
                xxdm:this.$cookie.get('xxdm'),
                SCRWID:item.uuid,
            }
            try{
                if(this.isDownLoad){
                   this.tipsXX("正在下载报告单请稍后","warning"); 
                   return
                }
                this.isDownLoad = true;
                var notifyInstance = this.$notify({
                title: '提示',
                    message: '报告单正在下载中...',
                    type: 'success',
                    duration:0
                });
                var res = await detailPapi.downloadReport(paraOutput)
                
                

                var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
                if(item.lx==1){
                　　downloadElement.download = item.mc + '.pdf'; //下载后文件名
                }else if(item.lx==2){
                    downloadElement.download = item.mc + '.zip'; //下载后文件名
                }
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象
                // that.downloads = false;
                // that.outputXSFormVisible =false;
                notifyInstance.close()
                this.isDownLoad = false;
                this.tipsXX("下载完毕","success");
            }catch(err){
                this.isDownLoad = false;
                this.tipsXX("下载错误,请联系管理员","error");
            }
        },

        /**
         * 数据导入弹出
         * by:RayJ
         * time:2019-07-09
         */
        ImportData(){
            this.xmImportData = true;
        },

        /**
         * 返回报告单生成状态
         * by:RayJ
         * time:2019-07-09
         */
        ztStr(status){
            switch(status){
                case 1:
                    return "<span class='status1'>等待生成</span>"
                case 2:
                    return "<span class='status2'>正在生成</span>"
                case 3:
                    return "<span class='status3'>生成失败</span>"
                case 4:
                    return "<span class='status4'>已完成</span>"  
                case 5:
                    return "<span class='status1'>已取消</span>"    
            }
        },

        /**
         * 批量导出报告单
         * by:RayJ
         * time:2019-07-09
         */
        async batOutputSubmit(){
            console.log(this.backAllStudents,668800)
            var njdm = _.find(this.backAllStudents,{"bjdm":this.BatchoutSelClass}).njdm
            // console.log(this.BatchoutSelClass,668822)
            if(this.BatchoutSelClass){
                var paraOutput = {
                    fqry:1,             //1为老师发起  2为学生发起
                    yx:'',
                    xxdm:this.$cookie.get('xxdm'),
                    bgdId:this.bgdId,
                    njdm:njdm,
                    bjdm:this.BatchoutSelClass,
                }
                var res =  await detailPapi.outputReportV2(paraOutput)

                if(res.status==1){
                    this.tipsXX("报告单正在生成中,稍后点击报告单列表查看","success");
                    this.xmOutPutData = false;
                } else {
                    this.tipsXX(res.message,"error");
                    // this.xmOutPutData = false;
                }


            }else{
                this.tipsXX("请选择要导出的班级",'warning','提示');
            }
        },
        

        /**
         * 上传错误
         * by:RayJ
         * time:2019-05-20
         */
        uploadError (response, file, fileList) {
            this.importLoading = false;
            console.log(response+"");
            this.tipsXX(response+"",'error','失败');
        },

        /**
         * 上传前对文件的大小的判断
         * by:RayJ
         * time:2019-05-20
         */
        beforeUpload (file) {
            this.importLoading = true;
            let extension = file.name.split('.')[1] === 'xls'
            let isLt2M = file.size / 1024 / 1024 < 10
            if (!extension) {
                this.tipsXX('上传模版只支持xls格式！','info','提示');
                this.importLoading = false;
            }else if (!isLt2M) {
                this.tipsXX('上传模板大小不能超过 10MB','info','提示');
                this.importLoading = false;
            }
            return extension && isLt2M
        },

        /**
         * 上传成功后的回调
         * by:RayJ
         * time:2019-05-20
         */
        uploadSuccess (response, file, fileList, type) {
            this.errData = [];
            console.log(response,816);
            if(response.resultCode==1){
                this.errData = response.value.filter(e=>!e.success);
                if(this.errData.length>0){
                    this.tipsXX(response.resultMessage,"warning");
                    this.errData = response.value;
                }else{
                    this.tipsXX("导入成功","success");
                    this.bzImportData = false;
                    this.xmImportData = false;
                    var index = this.backAllStudents.findIndex(e=>e.bjdm==this.BatchSelClass)
                    this.getClassDetails({classCode:this.BatchSelClass},index);
                }   
            }else if(response.resultCode==1){
                  this.tipsXX("导入成功","success");
                  this.bzImportData = false;
                  this.xmImportData = false;   
                  var index = this.backAllStudents.findIndex(e=>e.bjdm==this.BatchSelClass)
                  this.getClassDetails({classCode:this.BatchSelClass},index);    
            }else{
                this.tipsXX("导入失败","error");
            }
            this.bzList = [];
            console.log(this.bzList,554466);
        },

        /**
         * 关闭数据导入弹层
         * by:RayJ
         * time:2019-05-16
         */
        BatchimportCancel(){
            this.xmImportData = false;
            this.xmOutPutData = false;
        },

        /**
         * 提交导入数据
         * by:RayJ
         * time:2019-06-13
         */
        importSubmit(refName){
            if(this.lrsd){
                this.tipsXX("报告单已锁定无法导入数据,请联系校管理员","warning");
                return
            }
            if(this.$refs[refName].uploadFiles.length<1){
                this.tipsXX('请选择导入文件','error');
                return
            }
            if(this.BatchSelClass.length<1){
                this.tipsXX('请选择班级','error');
                return
            }
            this.$refs[refName].submit();
        },

        /**
         * 模版生成
         * by:RayJ
         * time:2019-05-16
         */
        async BatchimportMb(){

            // console.log(this.BatchSelClass,508)

            if(this.BatchSelClass == ""){
                this.tipsXX("请选择执行班级","warning");
                return
            }  

            // var bjobj = _.find(this.backAllStudents,{'bjdm':this.BatchSelClass});
            // console.log(bjobj,516)
            var className = this.backAllStudents.find(e=>e.bjdm==this.BatchSelClass).bjmc;
            var param = {};
            // param.xxdm = this.$cookie.get('xxdm');
            param.classCode = this.BatchSelClass;
            // param.njdm = bjobj.njdm;
            // param.bgdId = this.bgdId;
            // var kcobj = _.find(this.hasKcList,{"kcid":this.BatchSelKc});
            // var bjobj = _.find(this.hasBjList,{"uuid":this.BatchSelClass});
            // console.log(kcobj,2143)
            // console.log(bjobj,2144)
            var res = await qualityApi.reportMessageImportTemplate(param);
            const blob = new Blob([res], {
                type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            });
            
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = className + '报告单导入模版.xls'; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象 
        },

        /**
         * 提取出相应的页面里的数据
         * by:RayJ
         * time:2019-06-14
         */
        getPageInfo(uuid){
            // console.log(uuid,606);
            // console.log(_.find(this.resReportAll.page,{"uuid":uuid}),607)
            return _.find(this.resReportAll.page,{"uuid":uuid})
        },

        //提交寄语
        async messageSubmit(){
          if(!this.curStu){
            return;
          } else {
            var res = await qualityApi.saveReportMessage(this.curStuInfo);
            if(res.resultCode==1){
              this.tipsXX('提交成功','success','提示');
              var index = this.allStudents.findIndex(e=>e.bjdm==this.curStuInfo.classCode);
              this.getClassDetails(this.curStuInfo,index);
            }
          }
        },

        //提示信息
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit,
                message: data,
                type: xxtype,
                duration: 2000
            });
        },




    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.bgdTable{
    /deep/ .status1{
        color: #909399;
    }
    /deep/ .status2{
        color: #E6a23c;
    }
    /deep/ .status3{
        color: #F56c6c;
    }
    /deep/ .status4{
        color: #67c23a;
    }
}
.u_TableMain{
    /deep/ .el-checkbox-button{
        margin-bottom: 5px;
    }
}
.bgdPage{
    padding-top: 10px;
}
.fade-enter-active{
    animation-name:fadeIn;
    animation-duration:.5s;
}
.fade-leave-active{
    animation-name:fadeOut;
    animation-duration:.5s;
}
.import_box /deep/ .el-dialog__body{
    padding-top: 10px;
    .el-row{
        line-height: 32px;
        .colLineTit {
            text-align: right;
            padding-right: 10px;
        }
    }
}
.import_box /deep/ .el-dialog__footer{
    .import_desc {
        overflow: hidden;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        text-align: left;
    }
}
.content_left{
    float: left;
    width: 190px;
    height: 600px;
    border: 1px solid #e0e0e0;
    overflow: auto;
}
.content_left.fix{
    position: fixed;
    top: 70px;
}
.content_left::-webkit-scrollbar {
    width: 10px;
    height: 1px;
}
.content_left::-webkit-scrollbar-thumb {
    border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.6);
    background-color: rgb(97, 172, 247);
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
}

.content_left::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
    border-radius: 10px;
    background: #F4f4f4;
}

.content_right{
    padding-left:20px;
    overflow: hidden;
    margin-left: 190px;
    min-height: 500px;
    position: relative;
    .table_box{
    float: left;
    margin: 10px 20px 10px 0;
    }
}
.u_stuList{
    .noStu{
        font-size: 14px;
        width: 100%;
        text-align: center;
        color: #999;
        margin-top: 40%;
    }
    dl{
        .studdlist{
            width: 100%;
            float: left;
            transition: .2s all;
        }
        float: left;
        width: 100%;
        margin: 0;
        border-bottom: 1px solid #efefef;
    }
    dt,dd{
        line-height: 32px;
        font-size: 14px;
        padding-left:15px;
        cursor: pointer;
        color:#666;
        width:100%;
        float: left;
    }
    dd{
        padding-left: 30px;
        margin: 0;
    }
    dd:hover{
        background: #f5f7fa;
    }
    dd.on{
        background: #409EFF; 
        color: #FFF;
    }
    dt{
        background:#f5f7fa;
        border-radius: 5px;
    }
    dl.off .studdlist{
        height:0px !important;
        overflow: hidden;
    }
    dd.notFill{
        color:#f00;
    }
    dl .studdlist{
    }
}
/deep/ .innerTemplate{
    margin: 5px;
}
.reportLoading{
    width: 100%;
    height: 50px;
    position: absolute;
    top: 0;
}
.unImportCount{
    float: right;
    color: #ff0000;
    margin-right: 10px;
}
.baseInfo{
    font-size: 20px;
    display: flex;
    align-items: center;
    .textunderline{
        border-bottom: 1px solid;
        margin-right: 15px;
        width: 150px;
        text-align: center;
        display: inline-block;
        height: 30px;
    }
}
.bgdBlock{
    margin: 20px 0;
}
</style>
