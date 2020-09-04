<template>
    <div class="app-container">
        <div class="u_TableMain">
            <div class="filter-container">
                <el-input class="searchIpt" @clear="clearSearch" v-model="searchtext" placeholder="请输入内容" clearable></el-input>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button class="filter-item" type="primary" @click="addRoles" icon="el-icon-plus">创建角色</el-button>
            </div>

            <div class="m_GenTableBox">
                <el-table class="tableBorder roleTable" :data="roleList">
                    <el-table-column prop="roleName" width="180" label="角色名称"></el-table-column>
                    <el-table-column prop="summary"  width="200" label="描述"></el-table-column>
                    <el-table-column label="成员">
                        <template slot-scope="scope">
                            <span class="member" v-for="(item,index) in scope.row.members" v-show="index<20||scope.row.showAll">{{item.name}}</span>
                            <span class="moremember" v-if="scope.row.count>=20&&!scope.row.showAll" @click="checkMore(scope.row)">更多成员</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-setting" size="mini" @click="setRole(scope.row)">配置权限</el-button>
                            <el-button type="primary" icon="el-icon-edit" v-if="scope.row.type==1" size="mini" @click="editTeacher(scope.row)">编辑</el-button>
                            <el-popover placement="top" width="160" v-model="scope.row.deltips"  v-if="scope.row.type==1">
                                <p>是否删除此角色</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                    <el-button type="primary" size="mini" @click="deleteRole(scope.row)">确定</el-button>
                                </div>
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>



        <!--设置升级条件的弹层-->
        <el-dialog :title="textMap[dialogStatus]+'角色'" :close-on-click-modal="false" :visible.sync="roleDialog" width="550px">
            <el-form :model="roleForm" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="名称：" prop="roleName">
                    <el-input  maxlength="20" size="small" style="width:400px;" placeholder="请输入角色名称" v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" maxlength="200" rows="4" resize="none" style="width:400px;" placeholder="请输入角色描述(选填)" v-model="roleForm.summary"></el-input>
                </el-form-item>

                <el-form-item label="成员：">
                    <el-tag class="tag" :key="index" v-for="(item,index) in checkTeacher" closable :disable-transitions="false" @close="delTeacher(index)">{{item.xm}}</el-tag>
                    <el-button type="primary" class="button-new-tag" size="small" @click="addTeacher">+ 添加教师</el-button>
                </el-form-item>
            
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialog=false">取 消</el-button>
                <el-button type="primary" @click="submitSaveRole">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="配置权限" :close-on-click-modal="false" :visible.sync='roleSetDialog' width="700px">
            <!--自定义角色配置-->
            <div v-if="curEditRole.type==1&&isReShow">
                <el-tabs v-model="activeRule" tab-position="left" class="tabsMain">
                    <el-tab-pane label="基础权限">
                        <div class="tabCont">
                            <div class="tabloop" :key="index" v-for="(item,index) in permissionList">
                                <div class="setTit">{{item.name}}</div>
                                <div class="setCont" :key="sindex" v-for="(sitem,sindex) in item.permissions">
                                    <el-checkbox v-model="sitem.isPermitted">{{sitem.name}}</el-checkbox>
                                </div>
                            </div>
                            <el-button @click="submitPermission" type="primary" size="small" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="商城管理(移动端)">
                        <div class="tabCont">
                            <div class="setTit">商城管理(移动端)</div>
                            <div class="setCont">
                                <el-checkbox v-model="isOrderManage">订单管理</el-checkbox>
                            </div>
                            <el-button type="primary" size="small" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane> -->
                    <el-tab-pane label="个人评价权限">
                        <div class="tabCont">
                            <div class="setTit">个人评价权限</div>
                            <div class="setCont">
                                <personalEval v-bind:role="curEditRole" ref="personalEval"></personalEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitEval(curEditRole.type,'personalEval','1')" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="班级评价权限">
                        <div class="tabCont">
                            <div class="setTit">班级评价权限</div>
                            <div class="setCont">
                                <classEval v-bind:role="curEditRole" ref="classEval"></classEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitEval(curEditRole.type,'classEval','2')" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="团队评价权限">
                        <div class="tabCont">
                            <div class="setTit">团队评价权限</div>
                            <div class="setCont">
                                <teamEval v-bind:role="curEditRole" ref="teamEval"></teamEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitTeam(curEditRole.type,'teamEval')" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!--任课老师配置-->
            <div v-if="curEditRole.type==4&&isReShow">
                <el-tabs  v-model="activeTeacher" tab-position="left" class="tabsMain">
                    <el-tab-pane :lazy='true' label="所有任课老师">
                        <div class="tabCont">
                            <div class="setTit">所有任课老师</div>
                            <div class="setCont">
                                <personalEval v-bind:role="curEditRole" v-bind:allCourse="'all'" ref="allTeacher"></personalEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitAllCourseEval()" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :lazy='true' :label="item.kcmc+'老师'" :key="item.kcmc" v-for="(item,index) in courseList">
                        <div class="tabCont">
                            <div class="setTit">{{item.kcmc}}老师</div>
                            <div class="setCont">
                                <personalEval v-bind:allTeacherCheck="allTeacherCheck" v-bind:role="curEditRole" :ref="item.uuid" v-bind:courseID="item.uuid"></personalEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitCourseEval(item)" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!--班主任配置-->
            <div v-if="curEditRole.type==6&&isReShow">
                <el-tabs v-model="activeWeek" tab-position="left" class="tabsMain">
                    <el-tab-pane label="个人评价权限">
                        <div class="tabCont">
                            <div class="setTit">个人评价权限</div>
                            <div class="setCont">
                                <personalEval v-bind:role="curEditRole" ref="classManager"></personalEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitEval(curEditRole.type,'classManager','1')" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!--值周老师和年级主任配置-->
            <div v-if="(curEditRole.type==5&&isReShow)||(curEditRole.type==7&&isReShow)">
                <el-tabs  v-model="activeManager" tab-position="left" class="tabsMain">
                    <el-tab-pane label="个人评价权限">
                        <div class="tabCont">
                            <div class="setTit">个人评价权限</div>
                            <div class="setCont">
                                <personalEval v-bind:role="curEditRole" ref="person_weekManager"></personalEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitEval(curEditRole.type,'person_weekManager','1')" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="班级评价权限">
                        <div class="tabCont">
                            <div class="setTit">班级评价权限</div>
                            <div class="setCont">
                                <classEval v-bind:role="curEditRole" ref="class_weekManager"></classEval>
                            </div>
                            <el-button type="primary" size="small" @click="submitEval(curEditRole.type,'class_weekManager','2')" class="tabSubmit">提交</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
   
        </el-dialog>


        <multipleselect ref="selectTeacher" v-bind:teacherList="teacherList" v-bind:checkTeacher="checkTeacher" v-bind:multipleLimit='200' @handleChangeSel="handleChangeSel"></multipleselect>


    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api/qualityAppraisal'
import * as courseApi from '@comm/api/admin/course'
import multipleselect from '@comm/components/multipleSelect/index';
import personalEval from './components/personalEvaluation.vue';
import classEval from './components/ClassEvaluation.vue';
import teamEval from './components/team.vue';
import { teachclassAll } from '@comm/api/admin/teachclass/index';
export default {
    name: "setReport",
    components: {
        multipleselect,
        personalEval,
        classEval,
        teamEval
    },
    data() {
        return {
            textMap: {                      //新增或编辑
                update: '编辑',
                create: '新增'
            },
            dialogStatus: '',
            searchtext: "",                 //角色搜索的关键词,
            customRoleList:[],              //自定义角色列表
            systemRoleList:[],              //系统角色列表
            roleList:[],                    //角色列表
            cloneRoleList:[],               //克隆的角色列表搜索用
            roleDialog:false,               //角色新建、修改弹层显示
            roleSetDialog:false,            //角色权限设置的弹层显示
            roleForm:{roleName:'',summary:''},                    //角色新建、修改表单对象
            rules: {
                roleName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
            },
            isReShow:true,                 //重新载入组件
            checkTeacher:[],
            teacherList:[],
            courseList:[],
            curEditRole:{},
            isReleaseTask:false,
            isOrderManage:false,
            activeRule:'0',
            activeTeacher:'0',
            activeManager:'0',
            activeWeek:'0',
            permissionList:[],
            allTeacherCheck:[],                 //全部老师选择的评价项
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
        async init(){
            await this.getSystemRole();
            await this.getAllCustomRole();
            await this.getCourseList();
            this.getRoleList();
        },
        async getCourseList(){
            var param = {};
            param.page = 1
            param.limit = 100
            param.xxdm = this.$cookie.get('xxdm')
            // param.ssxn = 
            // param.ssxq = 

            var res = await courseApi.page(param);
            this.courseList = res.data.rows
        },
        async getSystemRole(){
            if(this.systemRoleList.length==0){
                var res = await qualityApi.getSystemroleAll();
                this.systemRoleList = res.value;
            }
        },
        async getAllCustomRole(){
            var param = {};
            param.keyword = this.searchtext;
            var res = await qualityApi.getCustomroleAll(param);
            this.customRoleList = res.value;
        },
        getRoleList(){
            this.roleList = this.systemRoleList.concat(this.customRoleList);
            this.cloneRoleList = _.cloneDeep(this.roleList);
        },
        clearSearch(){
            this.searchtext = "";
            this.roleList = this.cloneRoleList;
        },
        addRoles(){
            this.roleDialog = true;
            this.dialogStatus = 'create';
            this.checkTeacher = [];
            this.roleForm = {roleName:'',summary:''};
        },
        async search(){
            var that = this;
            this.roleList = _.filter(this.cloneRoleList, function(o){
                return o.roleName.indexOf(that.searchtext)!=-1;
            })
        },
        delTeacher(index){
            this.checkTeacher.splice(index,1);
        },
        async addTeacher(){
            if(this.teacherList.length==0){
                var res = await teachclassAll({xxdm:this.$cookie.get('xxdm')});
                this.teacherList = res.data.jsList;
            }
            this.$nextTick(()=>{
                //唤醒选择教师的弹层组件
				this.$refs.selectTeacher.showSelect();
			})
        },
        editTeacher(item){
            this.checkTeacher = [];
            this.roleForm = {roleName:'',summary:''};
            this.curEditRole = item;
            this.roleDialog = true;
            this.dialogStatus = 'update';
            this.roleForm.roleName = item.roleName;
            this.roleForm.summary = item.summary;
            for(var i=0;i<item.members.length;i++){
                item.members[i].gh = item.members[i].teacherId;
                item.members[i].xm = item.members[i].name;
            }
            this.checkTeacher = item.members;
        },
        handleChangeSel(selTeacher){
            this.checkTeacher = selTeacher;
            this.$refs.selectTeacher.cancal();
        },
        async submitSaveRole(){
            var param = {};
            param.count = this.checkTeacher.length;
            param.members = [];
            param.roleName = this.roleForm.roleName;
            param.schoolCode = this.$cookie.get('xxdm');
            param.summary = this.roleForm.summary;
            for(var i=0;i<this.checkTeacher.length;i++){
                param.members.push({'teacherId':this.checkTeacher[i].gh,'name':this.checkTeacher[i].xm,'xxdm':this.$cookie.get('xxdm')});
            }

            if(this.dialogStatus=='create'){
                var res = await qualityApi.addCustomrole(param);
                if(res.resultCode==1){
                    this.$notify({type: 'success',message: '新增角色成功'})   
                    this.roleDialog = false;
                    await this.getAllCustomRole();
                    this.getRoleList();
                }else{
                    this.$notify({type: 'error',message: res.resultMessage})   
                }
            }else{
                param.roleId = this.curEditRole.roleId;
                var res = await qualityApi.editCustomrole(param);
                if(res.resultCode==1){
                    this.$notify({type: 'success',message: '修改角色成功'})   
                    this.roleDialog = false;
                    await this.getAllCustomRole();
                    this.getRoleList();
                }else{
                    this.$notify({type: 'error',message: res.resultMessage})   
                }
            }
        },
        delClose(row){
            this.$set(row,'deltips',false);
        },
        async deleteRole(item){
            var param = {};
            param.roleId = item.roleId;
            var res = await qualityApi.delCustomrole(param);
            if(res.resultCode==1){
                this.$notify({type: 'success',message: '删除角色成功'})   
                await this.getAllCustomRole();
                this.getRoleList();
            }else{
                this.$notify({type: 'error',message: res.resultMessage})   
            }
        },
        async setRole(item){
            // console.log(item,223322);
            this.curEditRole = item;
            this.roleSetDialog = true;
            if(item.type==1){
                var param = {};
                param.permissionType = item.type;
                param.roleId = item.roleId
                var res = await qualityApi.getRulePermission(param);
                this.permissionList = res.value;
                // console.log(res,"自定义角色权限列表")
            }else if(item.type==4){
                var param = {};
                param.schoolCode = this.$cookie.get('xxdm');
                param.scope = "1";
                param.jurisdictionType = 4;
                var res = await qualityApi.getEvaluation(param);
                this.allTeacherCheck = res.value;
                // console.log(this.allTeacherCheck,'全部老师选择的评价项')
            }
            this.isReShow = false;
            await this.$nextTick()
            this.isReShow = true;
        },
        async submitEval(type,refname,scope){
            var param = {};
            if(type==1){
                param.customRoleId = this.curEditRole.roleId;
            }
            param.evaluationItemIdList = [];
            param.jurisdictionType = type;
            param.scope = scope;
            param.schoolCode = this.$cookie.get('xxdm');
            // console.log(this.$refs.personalEval.allEvaluateList,'0099')
            // var checkEval = _.filter(this.$refs.personalEval.allEvaluateList,{'check':true});
            // console.log(this.$refs[refname],'6699');
            var checkEval = _.filter(this.$refs[refname].allEvaluateList,{'check':true});
            // console.log(checkEval);
            for(var i=0;i<checkEval.length;i++){
                param.evaluationItemIdList.push(checkEval[i].id)
            }
            var res = await qualityApi.saveEvaluation(param);
            if(res.resultCode==1){
                this.$notify({type: 'success',message: '保存成功'}); 
            }else{
                this.$notify({type: 'error',message: res.resultMessage});
            }
            // console.log(res);
        },

        async submitCourseEval(item){
            var param = {};
            param.schoolCode = this.$cookie.get('xxdm');
            param.jurisdictionType = 2;
            param.courseId = item.uuid;
            param.evaluationItemIdList = [];
            param.scope = '1';
            var checkEval = _.filter(this.$refs[item.uuid][0].allEvaluateList,{'check':true});
            for(var i=0;i<checkEval.length;i++){
                param.evaluationItemIdList.push(checkEval[i].id)
            }
            var res = await qualityApi.saveEvaluation(param);
            if(res.resultCode==1){
                this.$notify({type: 'success',message: '保存成功'}); 
            }else{
                this.$notify({type: 'error',message: res.resultMessage});
            }
        },

        async submitAllCourseEval(){
            var param = {};
            param.schoolCode = this.$cookie.get('xxdm');
            param.jurisdictionType = 4;
            param.scope = '1';
            param.evaluationItemIdList = [];
            var allCheckEval = _.filter(this.$refs.allTeacher.allEvaluateList,{'check':true});
            for(var i=0;i<allCheckEval.length;i++){
                param.evaluationItemIdList.push(allCheckEval[i].id)
            }
            var res = await qualityApi.saveEvaluation(param);
            if(res.resultCode==1){
                this.$notify({type: 'success',message: '保存成功'}); 
            }else{
                this.$notify({type: 'error',message: res.resultMessage});
            }
        },

        async submitPermission(){
            var param = {};
            param.roleId = this.curEditRole.roleId;
            param.schoolCode = this.$cookie.get('xxdm');
            param.type = this.curEditRole.type;
            param.authorityCode = [];

            for(var i=0;i<this.permissionList.length;i++){
                for(var j=0;j<this.permissionList[i].permissions.length;j++){
                    if(this.permissionList[i].permissions[j].isPermitted){
                        param.authorityCode.push(this.permissionList[i].permissions[j].code);
                    }
                }
            }
            var res = await qualityApi.saveRulePermission(param);
            if(res.resultCode==1){
                this.$notify({type: 'success',message: '保存成功'}); 
            }else{
                this.$notify({type: 'error',message: res.resultMessage});
            }
        },

        async submitTeam(type,refname){
            var param = {};
            param.roleId = this.curEditRole.roleId;
            param.studentGroupList = [];
            var checkEval = _.filter(this.$refs[refname].allTeamList,{'check':true});
            for(var i=0;i<checkEval.length;i++){
                param.studentGroupList.push(checkEval[i].groupId)
            }
            var res = await qualityApi.saveRuleTeam(param);
            if(res.resultCode==1){
                this.$notify({type: 'success',message: '保存成功'}); 
            }else{
                this.$notify({type: 'error',message: res.resultMessage});
            }
        },
        checkMore(row){
            this.$set(row,"showAll",true);
        },





    }
}
</script>

<style scoped lang="scss">
.searchIpt{
    width: 200px;
    float: left;
}
.filter-item{
    float: left;
    margin-left:10px;
}
.roleTable{
    .member,.moremember{
        width: 80px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .moremember{
        cursor: pointer;
        color: #409EFF;
    }
}
.tabsMain{
    /deep/ .el-tabs__header.is-left{
        min-height: 200px;
    }
}
.tag{
    margin-right: 8px;
}
.tabCont{
    padding: 10px;
    min-height: 200px;
    position: relative;
    .tabloop{
        margin-bottom: 30px;
    }
}
.setTit{
    font-size: 16px;
    font-weight: bold;
}
.setCont{
    padding: 10px 0;
}
.tabSubmit{
    position: absolute;
    bottom: 0;
    left: 10px;
}
</style>
