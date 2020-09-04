<template>
    <div class="app-container calendar-list-container">

        <div class="u_TableMain block ofhide" type="border-card">   
            <div class="filter-container">
                <div class="mt10">
                    <el-button type="primary" size="medium" @click="addTeam">新增团体</el-button>
                    <el-button type="primary" size="medium" @click="addTeamType">新增团体类型</el-button>
                </div>                    
            </div>

            <div class="m_GenTableBox">
                <el-table class="tableBorder dimensionTable receivingTable" :data="teamData">
                    <el-table-column label="团体名称" prop="groupName" width="120">
                    </el-table-column>
                    <el-table-column label="类型" prop="groupTypeName" width="120">
                    </el-table-column>
                    <el-table-column label="成员">
                        <template slot-scope="scope">
                            <span v-for="(item,index) in scope.row.students" v-if="index<=10">{{item.name}},</span>
                            <span v-if="scope.row.students&&scope.row.students.length>10">...</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最新修改" prop="createTime" width="220">
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" @click="editTeam(scope.row)">修改</el-button>
                            <el-button type="text" @click="delTeam(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-pagination class="pagination" background layout="prev, pager, next" :total="weekListSum" :page-size="pageLimit" :current-page="curPage" @current-change="PageChange"></el-pagination> -->
            </div>

        </div>
        

        <el-dialog :title="textMap[dialogStatus]+'团体'" width="620px" :close-on-click-modal='false' :visible.sync="dialogVisible" @close="cancleDialog" >
            <el-form ref="form" :model="formData" :rules="rules" label-position='right' label-width="100px">

                <el-form-item label="团体名称：" prop="teamName">
                  <el-input v-model="formData.teamName" class="w200" size="small" placeholder="请输入1-30字团体名称" maxlength="30"></el-input>
                </el-form-item>

                <el-form-item label="图标：" class="lh50">
                    <el-upload  class="genImg" action="/api/evaluation/file/upload" accept="image/*" :before-upload="checkSize" :headers="headers" :on-success="handleChange(formData)" :on-error="errUpload" name='files' :show-file-list="false">
                        <img v-if="formData.icon" :src="formData.icon" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="选择类型：" prop="teamType">
                    <el-select v-model="formData.teamType" size="small" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <!-- <el-cascader class="w350 selClass" v-model="formData.teamType" collapse-tags size="small" placeholder="请选择适用范围" :options="typeList"  :props="{ children:'evaluationGroupVOList',value:'id',label:'name', expandTrigger: 'hover',checkStrictly: true,emitPath:false }" clearable></el-cascader> -->
                </el-form-item>

                <el-form-item label="成员：" class="selectedBox">
                    <div class="tagbox">
                        <el-tag class="tag" :key="index" v-for="(item,index) in studentSelList" closable :disable-transitions="false"
                    @close="tagClose(item)">{{item.name}}<br>{{item.bjmc}}</el-tag>
                    </div>
                <el-button class="addStu" @click="selStudent">选择学生</el-button>
                </el-form-item>

                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitTeam">提交</el-button>
                <el-button @click="cancleDialog">取消</el-button>
            </span>
        </el-dialog>



    <el-dialog title="类型维护" :visible.sync="dialogFormVisible" @close="closeTypeDialog">
        <div class="mb20 fl">
            <el-input class="searchIpt" v-model="searchtext" placeholder="请输入内容" size="small" clearable></el-input>
            <el-button class="filter-item" size="small" type="primary"  icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button class="filter-item" size="small" type="primary" @click="addDimension" >新增类型</el-button>
        </div>

        <div style="margin-top:20px;">
            <el-table class="middleTable dimensionTable" ref="dimensionTable" :data="dimensionData" row-key="id" :tree-props="{children: 'evaluationGroupVOList'}">
                <el-table-column prop="name" label="类型名称">
                    <template slot-scope="scope">
                        
                        <div class="inline" v-if="!scope.row.name||scope.row.edit">
                            <el-input v-model="scope.row.name" style="width:150px;" maxlength="10" placeholder="请输入类型名称" size="mini"></el-input>
                            <i class="delfont el-icon-check" style="color:#67C23A" @click="saveDimension(scope.row)"></i>
                            <i class="delfont el-icon-close" v-if="scope.row.new" @click="cancel(scope.row)"></i>
                        </div>
                        <span v-else>
                            {{scope.row.name}} <i class="dimensionEdit el-icon-edit" @click="editDimension(scope.row)"></i>
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="updateTime" label="最新修改" width="150" align="center"></el-table-column> -->
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="addSubDimension(scope.row)" :disabled="!(!scope.row.new&&scope.row.level<5)">增加下级类型</el-button>
                        <!-- <i class="el-icon-afsadf" style="width: 116px;height: 14px;margin: 0 8px;" v-else></i>无意义，占位 -->
                        <!-- <span class="addfont">增加下级类型</span> -->
                        <!-- 没有子类型且不在编辑状态才可以删 -->
                        <el-button  type="danger" icon="el-icon-delete" size="mini" :disabled="!((!scope.row.evaluationGroupVOList||scope.row.evaluationGroupVOList.length==0)&&!scope.row.edit)" @click="deleteDimension(scope.row)">删除</el-button>
                        <!-- <i class="delfont el-icon-delete" v-if="(!scope.row.evaluationGroupVOList||scope.row.evaluationGroupVOList.length==0)&&!scope.row.edit" @click="deleteDimension(scope.row)"></i> -->
                        <!-- <i class="el-icon-afsadf" style="width: 68px;height: 14px;margin: 0 8px;" v-else></i>无意义，占位 -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button> -->
        <el-button @click="dialogFormVisible = false;">关 闭</el-button>
        </div>
    </el-dialog>

    <studentcheck types="drawer" 
    ref="studentcheck" v-bind:studentSelList="studentSelList" @changeStudentSel="changeStudentSel"></studentcheck>



    </div>
</template>

<script>
import _ from 'lodash';
import Cookies from 'js-cookie'
import * as searchBarApi from '@comm/api/components/searchbar';
import * as qualityApi from '@comm/api/qualityAppraisal';
import { teachclassAll } from '@comm/api/admin/teachclass/index'
import * as baseXnxqApi from '@comm/api/admin/division';
import * as api from '@comm/api/evaluationSetting'
import studentcheck from '@comm/components/StudentCheck/index'
export default {
    name: "setReport",
    components: {
        studentcheck
    },
    data() {
        var teamTypeValidator = function(rule, value, callback){
            console.log(value,140)
            if(value==undefined||value.length==0||value==null){
                callback('请选择团体类型');
            }
            else {
                callback();
            }
        }
        return {
            textMap: {                      //新增或编辑
                update: '编辑',
                create: '新增'
            },
            dialogStatus: '',
            teamData:[],                                //团队列表数据
            dialogVisible:false,
            dialogFormVisible:false,
            formData:{
                teamName:'',
                icon: '',
                teamType: '',
            },
            typeList:[],
            studentSelList: [],
            curTeamId:'',

            dimensionData: [],//类型信息,
            searchtext: '',//搜索内容
            dimensionDataSave: [],//缓存类型信息
            editflg: false,//添加或修改类型的flg---限制只能操作一个类型
            checkstudentList:[],
            studentList:[],
            rules:{
                teamName: [{required: true,message:'请输入团体名称',tigger:'blur'}],
                teamType: [{required: true,validator: teamTypeValidator,tigger:'blur'},],
                // studentSelList: [{type: 'array',required: true,message:'请选择活动适用范围',tigger:'blur'}],
            },
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
        handleChangeSel(res){
            console.log(res,174)
        },
        async init(){
            this.getGroupList();
            this.getGroupTypeList();
        }, 
        async getGroupList(){
            var param = {};
            param.name = '';
            param.type = '';
            var res = await api.getGroupList(param);
            if(res.resultCode==1){
                this.teamData = res.value;
            }
            // console.log(res,66);
        },
        async getGroupTypeList(){
            var param = {};
            param.name = '';
            var res = await api.getGroupTypeList(param);
            if(res.resultCode==1){
               this.typeList = res.value;
            }
        },
        addTeam(){
            // this.formData = {
            //     teamName:'',
            //     icon: '',
            //     teamType: '',
            // };
            if(this.$refs['form']){
                this.$refs['form'].clearValidate();
            }
            this.studentSelList = [];
            this.dialogStatus = 'create'
            this.dialogVisible = true;
        },
        editTeam(row){
            this.formData = {
                teamName:'',
                icon: '',
                teamType: '',
            };
            console.log(row,119999)
            this.curTeamId = row.groupId;
            this.formData.teamName = row.groupName;
            this.formData.icon = row.fileInfoVO?row.fileInfoVO.absolutePath:'';
            this.formData.teamType = row.groupType;
            this.studentSelList = this.formateStudent(row.students);
            this.dialogStatus = 'update'
            this.dialogVisible = true;
        },
        //上传图片成功
        handleChange(value){
            return (response,file, fileList) => {
                // console.log(response);
                this.$set(value,'fileInfoVO',response.value[0]);  
                this.$set(value,'icon',response.value[0].absolutePath);                
            }
        },
        //上传图片失败
        errUpload(err, file, fileList){
            console.log(err);
            if(err.status=='500'){
                this.$notify({
                    type: 'error',
                    message: '图片上传失败，请重试！',
                    time: 1000
                })                
            } else {
                this.$notify({
                    type: 'error',
                    message: '网络异常，请检查网络后重试！',
                    time: 1000
                })                  
            }
        },
        //检查图片大小
        checkSize(file){
            let isLt2M = file.size / 1024 / 1024 < 5
            if(!isLt2M){
                this.$notify({title:'提示',message:"图片容量不能大于5MB!",type:'warning'});
            }
            return isLt2M
        },
        formateStudent(list){
            if(!list){
                return [];
            }
            for(var i=0;i<list.length;i++){
                list[i].njdm = list[i].gradeId;
                list[i].bjdm = list[i].classId;
                list[i].bjmc = list[i].className;
            }
            return list;
        },
        async delTeam(row){

            this.$confirm('此操作将不可恢复，确认删除该团队?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                var res = await api.delTeam(row.groupId);
                if(res.resultCode==1){
                    this.$notify({title:'成功',message:"团队删除成功!",type:'success'});
                    this.getGroupList();
                }
            }).catch(() => {

            })   
        },
        cancleDialog(){
            this.dialogVisible = false;
            this.formData = {
                teamName:'',
                icon: '',
                teamType: '',
            };            
            this.$refs['form'].resetFields();
            this.$refs['form'].clearValidate();
        },
        async submitTeam(){
            var param = {};
            var valid = await this.$refs['form'].validate();
            if (valid) {
            } else {
                return false;
            }
            if(this.formData.fileInfoVO){
                param.fileInfoVO = this.formData.fileInfoVO;
            }
            param.groupName = this.formData.teamName;
            if(Array.isArray(this.formData.teamType)){
                param.groupType = this.formData.teamType[this.formData.teamType.length-1];
            }else{
                param.groupType = this.formData.teamType;
            }
            param.members = [];
            for(var i=0;i<this.studentSelList.length;i++){
                param.members.push({"classId":this.studentSelList[i].bjdm,"gradeId":this.studentSelList[i].njdm,"studentId":this.studentSelList[i].studentId})
            }


            console.log(param,117722);

            var res = {};
            if(this.dialogStatus=='create'){
                res = await api.addTeam(param);
                if(res.resultCode==1){
                    this.$notify({type:'success',message: '团体添加成功！'})
                }
            }else if(this.dialogStatus=='update'){
                res = await api.updateTeam(param,this.curTeamId)
                if(res.resultCode==1){
                    this.$notify({type:'success',message: '团体修改成功！'})
                }
            }
            if(res.resultCode!=1){
                this.$notify({type:'warning',message:res.message})
            }else{
                this.getGroupList();
                this.cancleDialog();
            }
        
        },
        handleClose(){
        },
        addTeamType(){
            this.dialogFormVisible = true;
            this.getDimension();
        },
        selStudent(){
            this.$nextTick(()=>{
                //唤醒选择学生的弹层组件
                this.$refs.studentcheck.showSelect();
            })
        },

        // closeSelStudent(){
        //     this.$refs.studentcheck.closeSelStudent();
        // },

        /**
         * 新增一级类型
         * by:
         * time:
         */
        addDimension(){
            if(this.editflg){
                this.$notify({
                    type: 'error',
                    message: '请先保存修改',
                    duration: 1000
                });     
                return;
            }
            this.editflg = true;
            this.dimensionData.unshift({
                id:parseInt(Math.random()*1000000),//随机一个id
                updateTime:'',
                name:"",
                level: 1,//一级类型
                pid: '0',
                pids: '0',
                edit:true,
                new: true,
            })
        },
        /**
         * 新增其他类型
         * by:
         * time:
         */
        addSubDimension(row){
            if(this.editflg){
                this.$notify({
                    type: 'error',
                    message: '请先保存修改',
                    duration: 1000
                });     
                return;
            }
            this.editflg = true
            console.log(row);
            if(row.evaluationGroupVOList){
                row.evaluationGroupVOList.unshift({
                    id:parseInt(Math.random()*1000000),
                    updateTime:'',
                    name:"",
                    level: row.level+1,
                    pid: row.id,
                    pids: (row.pids!=null&&row.pids!=''?row.pids + ',':'') + row.id,
                    edit:true,
                    new: true,
                })
            }else{
                this.$set(row,"evaluationGroupVOList",[]);
                // row.children = [];
                row.evaluationGroupVOList.unshift({
                    id:parseInt(Math.random()*1000000),
                    updateTime:'',
                    name:"",
                    level: row.level+1,
                    pid: row.id,
                    pids: (row.pids!=null?row.pids + ',':'') + row.id,
                    edit:true,
                    new: true,
                })   
            }
            setTimeout(()=>{//等它渲染完了才能展开
                this.$refs.dimensionTable.toggleRowExpansion(row, true) // 展开
            },100);
            
        },
        //删除类型
        deleteDimension(row){
            console.log(row)
            //弹框确认
            this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //请求删除
                api.deleteGroupType(row.id).then(res=>{
                    if(res.resultCode==1){
                        this.$notify({
                            type: 'success',
                            message: '删除成功!',
                            duration: 1000
                        });    
                        //刷新页面数据
                        this.getDimension();                          
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            duration: 1000
                        });                          
                    }
                                
                })                

            }).catch(() => {
                this.$notify({
                    type: 'info',
                    message: '已取消删除',
                    duration: 1000
                });          
            });               
        },
        //编辑类型
        editDimension(row){
            if(this.editflg){
                this.$notify({
                    type: 'error',
                    message: '请先保存修改',
                    duration: 1000
                });     
                return;
            }
            this.editflg = true;
            this.$set(row,"edit",true);
        },
        //取消新建类型
        cancel(row){
            if(row.pids){//是子类型
                var pids = row.pids.split(',');
                var temp = this.dimensionData
                pids.forEach(pid=>{
                    var item = temp.find(d => d.id==pid);
                    if(item){
                        temp=item.evaluationGroupVOList
                    }
                })
                var ind = temp.findIndex(d => d.id==row.id)
                temp.splice(ind,1);
            }else {
                var ind = this.dimensionData.findIndex(d => d.id==row.id);
                if(ind>-1){
                    this.dimensionData.splice(ind,1);
                }
            }
            this.editflg=false
        },
        //保存新建/编辑类型
        saveDimension(row){
            if(row.name!=''){
                this.$set(row,"edit",false);
                //这里要提交已保存的类型然后刷新
                var params = {
                    level:row.level,
                    name:row.name,
                    pid:row.pid,
                    pids: row.pids
                }
                console.log(params);
                //这里要做判断是否为新建
                if(row.new){//新建
                    api.addGroupType(params).then(res=>{
                        console.log(res);
                        if(res.resultCode==1){
                            this.searchtext = ''
                            this.editflg = false
                            this.getDimension();//刷新
                            this.$notify({
                                type: 'success',
                                message: res.resultMessage,
                                duration: 1000
                            });  
                            
                        } else {
                            // this.cancel(row);
                            row.edit = true;
                            this.$notify({
                                type: 'error',
                                message: res.resultMessage,
                                duration: 1000
                            });                              
                        }
                    })
                } else {//更新
                    params.id = row.id;
                    api.updateGroupType(row.id,params).then(res=>{
                        console.log(res);
                        if(res.resultCode==1){
                            this.editflg = false
                            this.getDimension();//刷新
                            this.$notify({
                                type: 'success',
                                message: res.resultMessage,
                                duration: 1000
                            });  
                            
                        } else {
                            // this.cancel(row);
                            row.edit = true;
                            this.$notify({
                                type: 'error',
                                message: res.resultMessage,
                                duration: 1000
                            });                              
                        }
                    })
                }
                // this.$set(row,'new',false);//这个做了提交刷新后会自动更新
            } else{
                this.$notify({
                    type: 'error',
                    message: '请填写类型名称！',
                    duration: 1000
                });   
            }   
        },
        // 获取所有类型
        getDimension(name){
            api.getAllGroupType().then(res=>{
                this.typeList = res.value;
                this.dimensionData = res.value;
                this.dimensionDataSave = res.value;
            })
        },
        // 根据名称搜索类型
        search(){
            api.getAllGroupType({name:this.searchtext}).then(res =>{
                var resdata = res.value;
               
                this.dimensionData = res.value;          
            })
        },

        changeStudentSel(studentList){
            this.studentSelList = studentList;
        },

        tagClose(tag){
            this.studentSelList = _.reject(this.studentSelList,{"studentId":tag.studentId});
        },

        // 关闭类型对话框
        closeTypeDialog(){
            this.editflg = false;
            this.searchtext = '';
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
.resultData{
    width: 100%;
    max-height: 200px;
    overflow: auto;
}
.lh50{
    /deep/ .el-form-item__label{
        line-height: 50px;
    }
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
.mb20{
    margin-bottom: 20px;
}
.ml30{
    margin-left: 30px;
}
.ml0{
    margin-left: 0px;
}
.genImg{
    height: 50px;
    position: relative;
}
.genImg /deep/ .el-upload {
    width: 50px;
    height: 50px;
    border: 1px dashed #d9d9d9;
    border-radius: 25px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}
.genImg.card /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 0;
    width: 108px;
    height: 50px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}
.genImg.upcard /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 0;
    width: 88px;
    height: 44px;
    overflow: hidden;
    cursor: pointer;
}
.genImg.upcard .avatar{
    width: 100%;
    height: 100%;
}
.genImg.card /deep/ .el-upload__tip{
    top: 2px !important;
    left: 130px !important;
}
.genImg .el-upload:hover {
    border-color: #409EFF;
}
.genImg-icon {
    font-size: 16px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.tagbox{
    width: 100%;
    max-height: 150px;
    overflow: auto;
}
.tag{
    margin-right: 5px;
    margin-bottom: 5px;
    height: auto;
    line-height: 18px;
    padding: 4px 10px;
    float: left;
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    height: 46px;
}
.addStu{
    float: left;
    width: 100px;
    height: 46px;
    line-height: 46px;
    padding: 0;
}
.selectedBox{
    /deep/ .el-tag .el-icon-close{
        top: -20px;
        position: absolute;
        top: 5px;
        right: 5px;
    }
}

.dimensionTable{
    /deep/ .inline{
        display: inline;
    }
    /deep/ .cell{
        line-height: 28px;
    }
    .dimensionEdit{
        color: #409eff;
        display: none;
        cursor: pointer;
    }
    tr:hover .dimensionEdit{
        display: inline-block;
    }
    .addfont{
        color: #409eff;
        margin: 0 8px;
        cursor: pointer;
    }
    .delfont{
        color: #E33939;
        margin: 0 8px;
        cursor: pointer;
    }
}
.searchIpt{
    width: 200px;
    float: left;
}
.filter-item{
    float: left;
    margin-left:10px;
}

</style>
