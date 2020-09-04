<template>
    <div class="app-container calendar-list-container">
        <div class="pr">
            <el-tabs class="u_TableMain columns ofhide" :class="{'mini':isMini}" type="border-card" @tab-click="changeTab">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-medal"></i> 勋章设置</span>

                    <div class="m_GenTableBox">

                        <el-table class="tableBorder middleTable dimensionTable" :data="metalData" row-key="id" default-expand-all :tree-props="{children: 'children'}">
                            <el-table-column label="勋章等级" width="100">
                                <template slot-scope="scope">
                                    Lv{{scope.row.level }}<!-- scope.row.level?levelName -->
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="勋章名称" :width="isMini?'':'150'"></el-table-column>
                            <el-table-column label="图标" v-if="!isMini">
                                <template slot-scope="scope"  v-show="!isMini"><!-- scope.row.icon -->
                                    <div class="dimensionImg" :class="{'card':isInspireCard}" v-for="(item,index) in scope.row.iconList" :key="index">
                                        <img :src="item">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="updateTime" label="最新修改" v-if="!isMini" width="180"></el-table-column><!-- prop='updateTime' -->
                            <el-table-column label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeMedalList('update',scope.row)">编辑</el-button>
                                    <el-popover placement="top" width="160" v-model="scope.row.deltips" v-if="scope.row.level==metalData.length">
                                        <p>是否删除此等级勋章</p>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                            <el-button type="primary" size="mini" @click="deleteMedal(scope.row)">确定</el-button>
                                        </div>
                                        <el-button slot="reference" :disabled="isMini" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="addMedal">
                            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="metalData.length<10" @click="changeMedalList('create')">加一级</el-button>
                        </div>
                    </div>
                    
                </el-tab-pane>

                <el-tab-pane>
                    <span slot="label"><i class="el-icon-trophy"></i> 等级设置</span>

                    <div class="m_GenTableBox">

                        <el-table class="tableBorder middleTable dimensionTable" :data="levelData" row-key="id" default-expand-all :tree-props="{children: 'children'}">
                            <el-table-column label="等级" width="100">
                                <template slot-scope="scope">
                                    Lv{{scope.$index+1}}<!-- scope.row.levelName -->
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="名称" :width="isMini?'':'150'"></el-table-column>
                            <el-table-column label="图标" v-if="!isMini">
                                <template slot-scope="scope"  v-show="!isMini">
                                    <div class="dimensionImg">
                                        <img :src="scope.row.icon"><!-- scope.row.icon -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="updateTime" label="最新修改" v-if="!isMini" width="180"></el-table-column>
                            <el-table-column label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeLevelList('update',scope.row)">编辑</el-button>
                                    <el-popover placement="top" width="160" v-model="scope.row.deltips" v-if="scope.$index==levelData.length-1" >
                                        <p>是否删除此等级</p>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                            <el-button type="primary" @click="deleteLevel(scope.row)" size="mini">确定</el-button>
                                        </div>
                                        <el-button slot="reference" :disabled="isMini" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="addMedal">
                            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="levelData.length<10" @click="changeLevelList('create',levelData.length+1)">加一级</el-button>
                        </div>


                    </div>

                </el-tab-pane>

            </el-tabs>

            <!-- 勋章设置从右侧弹出的弹框 -->
            <transition name="sliderRight" v-on:beforeEnter="mystyle=''" v-on:afterEnter="mystyle='position:relative'">
                <div class="levelLayer" :style="mystyle" v-if="addLayer">
                    <div class="u_TableMain pr pb72">
                            <!-- <div style="display:inline-block;width:50px;height:50px;">1</div><div style="display:inline-block;width:50px;height:50px;">2</div> -->
                            <div class="m_tit">勋章详情</div>
                            
                            <div class="m_form">
                                <div class="m_col">
                                    <span class="m_col_tit">等级</span>
                                    {{editMetalForm.levelName?editMetalForm.levelName:('Lv'+editMetalForm.level)}}
                                    <!-- {{levelNames[editMetalForm.level-1].name}} -->
                                </div>

                                <div class="m_col"><span class="m_col_tit required">名称</span> <el-input size="mini" class="ipt" maxlength="20" v-model="editMetalForm.name"></el-input></div>
                                
                                <div class="m_col"><span style="line-height:50px;" class="m_col_tit">通用图标</span> 
                                    <el-upload  class="genImg" :class="{'card':isInspireCard}" action="/api/evaluation/file/upload" :headers="headers" accept="image/*" :before-upload="checkSize" :on-success="handleChange(editMetalForm)" :on-error="errUpload" name='files' :show-file-list="false">
                                        <img v-if="editMetalForm.icon" :src="editMetalForm.icon" class="avatar"> 
                                        <i v-else class="el-icon-plus genImg-icon"></i>
                                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                                    </el-upload>
                                </div>
    
                            </div>

                            <div class="m_tit">维度设置</div>

                            <div class="m_GenTableBox">
                                <el-table class="tableBorder dimensionTable" height="250" :data="editMetalForm.medalDimensionDetailsList" row-key="id" default-expand-all :tree-props="{children: 'children'}">
                                    <el-table-column label="序号" width="80">
                                        <template slot-scope="scope">
                                            子勋章{{scope.$index+1}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" prop="name" width="80"></el-table-column>
                                    <el-table-column label="图标" width="100">
                                        <template slot-scope="scope">
                                            <div class="dimensionImg" :class="{'card':isInspireCard}">
                                                <img :src="editMetalForm.level>1?editMetalForm.iconList[scope.$index].icon:scope.row.icon">
                                            </div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="dimensionName" label="维度名称"></el-table-column>
                                    <el-table-column label="操作" width="180" align="center" v-if="(dialogStatus=='create'? metalData.length+1:editMetalForm.level )==1">
                                        <template slot-scope="scope">
                                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="addWd('update',scope.$index)">编辑</el-button>
                                            <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                                <p>是否删除此等级勋章</p>
                                                <div style="text-align: right; margin: 0">
                                                    <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                                    <el-button type="primary" size="mini" @click="deleteWd(scope.$index)">确定</el-button>
                                                </div>
                                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="220" align="center" v-if="(dialogStatus=='create'? metalData.length+1:editMetalForm.level )!=1">
                                        <template slot-scope="scope">
                                            <div class="inlineFont">升级为</div> 
                                            <el-upload  class="genImg inlineImg" :class="{'upcard':isInspireCard}" action="/api/evaluation/file/upload"  accept="image/*" :before-upload="checkSize" :headers="headers" :on-success="handleChange(scope.row)" :on-error="errUpload" name='files' :show-file-list="false">
                                                <img v-if="scope.row.icon" :src="scope.row.icon" class="avatar">
                                                <i v-else class="el-icon-plus genImg-icon"></i>
                                            </el-upload> <div class="inlineFont setupdata" @click="updataMedal(scope.row,scope.$index)">编辑</div>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <div class="addMedal" v-if="(dialogStatus=='create'? metalData.length+1:editMetalForm.level )==1">
                                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="addWd('create',editMetalForm.medalDimensionDetailsList.length+1)">增加维度</el-button>
                                </div>
                            </div>

                            <div class="m_optbox">
                                <el-button size="small" @click="addLayer=isMini=false">取消</el-button>
                                <el-button size="small" :loading="saveMetalLoading" @click="saveMetal" type="primary">保存</el-button>
                            </div>

                    </div>    
                </div>
            </transition>


        </div>


        <!--添加维度的弹层-->
        <el-dialog :title="textMap[wdDialogStatus]+'维度'" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="600px">
            <el-form :model="dimensionSetting" ref="form" :rules="dimensionRule" label-width="100px">
                <el-form-item label="序号：">
                    <span>子勋章{{dimensionSetting.level}}</span>
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <el-input  style="width:217px;" maxlength="20" v-model="dimensionSetting.name"></el-input>
                </el-form-item>
                <el-form-item label="选择维度：" prop="dimensionId">
                    <el-cascader placeholder="请选择或搜索维度" @change="changeDimension" ref="changeDimension" v-model="dimensionSetting.dimensionId" :options="dimensionOptions" filterable :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList' }" clearable></el-cascader>
                </el-form-item>
                
                <el-form-item label="上传图标：" prop="icon" class="lh50"><!-- -->
                    <el-upload  class="genImg" action="/api/evaluation/file/upload" :before-upload="checkSize"  accept="image/*" :headers="headers" name='files' :on-success="handleChange(dimensionSetting)" :on-error="errUpload" :show-file-list="false">
                        <img v-if="dimensionSetting.icon" :src="dimensionSetting.icon" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="获得条件：">
                    <div class="condition_col">
                        <el-checkbox v-model="dimensionSetting.teacherSwitch"></el-checkbox>教师奖惩
                        <div class="condition_tips">（勾选后评价项才能选择奖励/扣除该勋章）</div>
                    </div>
                    <div class="condition_col"><!---->
                        <el-checkbox v-model="dimensionSetting.reachSwitch"></el-checkbox>本维度积分每达到 <el-input size='mini' style="width:60px;" placeholder="1-99" v-model="dimensionSetting.medalDimensionRuleReachVO.reachScore" maxlength="2"></el-input> 
                        分自动兑换 {{dimensionSetting.medalDimensionRuleReachVO.number=1}} 枚
                        <div class="condition_tips">（积分扣除不会使勋章减少，可以为负值，如设置10分兑换1枚勋章，当前维度积分为-5时，需要再获得15分才能获得1枚勋章）</div>
                    </div>
                    <div class="condition_col"><!--dimensionSetting.medalDimensionRuleRankingVO.periodType  rangeType top-->
                        <el-checkbox v-model="dimensionSetting.rankingSwitch"></el-checkbox>本维度积分 <el-select  v-model="dimensionSetting.medalDimensionRuleRankingVO.periodType" placeholder="请选择" size='mini' style="width:70px;">
                                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>  达到 <el-select v-model="dimensionSetting.medalDimensionRuleRankingVO.rangeType" placeholder="请选择" size='mini' style="width:70px;">
                                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select> 前 <el-input size='mini' style="width:47px;" maxlength="2" v-model="dimensionSetting.medalDimensionRuleRankingVO.top"></el-input> 名获得
                             <el-input size='mini' maxlength="2" style="width:47px;" v-model="dimensionSetting.medalDimensionRuleRankingVO.number"></el-input> 枚
                        <div class="condition_tips">（排名在时间周期结束后自动计算，如选择“每月”则在下月1号计算上月排名）</div>
                    </div>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel(dimensionSetting)">取 消</el-button>
                <el-button type="primary" @click="confirmSetting">确 定</el-button>
            </div>
        </el-dialog>


        <!--设置升级条件的弹层-->
        <el-dialog title="升级设置" :close-on-click-modal="false" :visible.sync="dialogFormVisible2" width="550px">
            <el-form :model="upgradeForm" ref="form" label-width="100px">
                
                <el-form-item label="升级后图标：" class="lh50">
                    <el-upload  class="genImg" :class="{'card':isInspireCard}" action="/api/evaluation/file/upload"  accept="image/*" :before-upload="checkSize" :headers="headers" :on-success="handleChange(upgradeForm)" :on-error="errUpload" name='files' :show-file-list="false">
                        <img v-if="upgradeForm.icon" :src="upgradeForm.icon" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="名称：" class="lh50">
                    <el-input  maxlength="20" style="width:140px;" placeholder="请输入名称" v-model="upgradeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="升级条件：">
                    <div class="condition_col">
                        本维度【{{upgradeForm.prename}}】达到 <el-input size='mini' style="width:80px;" maxlength="2" placeholder="输入数字" v-model="upgradeForm.medalDimensionRuleReachVO.reachScore"></el-input> 个兑换{{upgradeForm.medalDimensionRuleReachVO.number=1}}枚
                    </div>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel(upgradeForm)">取 消</el-button>
                <el-button type="primary" @click="confirmUpgrade()">确 定</el-button>
            </div>
        </el-dialog>


        <!--添加等级的弹层-->
        <el-dialog :title="textMap[dialogStatus]+'等级'" :close-on-click-modal="false" :visible.sync="addLevelLayer" width="600px">
            <el-form :model="levelForm" ref="form" class="levelForm" label-width="100px">
                <el-form-item label="等级">
                    <span style='font-size:16px;'>Lv{{ dialogStatus=='create'?(levelData.length+1):levelForm.level}}</span>
                </el-form-item>

                <el-form-item required label="名称">
                    <el-input size='small' style="width:250px" maxlength="20" v-model="levelForm.name"></el-input>
                </el-form-item>

                <el-form-item label="图标：" class="lh50">
                    <el-upload  class="genImg" action="/api/evaluation/file/upload" accept="image/*" :before-upload="checkSize" :headers="headers" :on-success="handleChange(levelForm)" :on-error="errUpload" name='files' :show-file-list="false">
                        <img v-if="levelForm.icon" :src="levelForm.icon" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>

                <!-- <el-form-item label="选择维度：">
                    <el-cascader placeholder="请选择或搜索维度":options="dimensionOptions" filterable :props="{ expandTrigger: 'hover' }" clearable></el-cascader>
                </el-form-item> -->
                
                

                <el-form-item label="获得条件：">
                    
                    <div class="condition_col">
                        <el-select  v-model="levelForm.dimensionDetails[0].type" placeholder="请选择维度" size='small' style="width:100px;">
                                <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                            
                            <span v-show="levelForm.dimensionDetails[0].type!='2'">的一级勋章数量达到  <el-input size='smaill' style="width:55px;" maxlength="3" v-model="levelForm.dimensionDetails[0].number"></el-input> 枚</span>
                            <span v-show="levelForm.dimensionDetails[0].type=='2'">的一级勋章数量都达到目标值</span>
                            <el-button type="primary" v-if="levelForm.dimensionDetails[0].type=='2'" icon="el-icon-plus" size="small" class="ml10" @click="addDimension(levelForm.dimensionDetails.length-1,levelForm.dimensionDetails)"></el-button>
                            <div v-show="levelForm.dimensionDetails[0].type=='2'" class="setother">
                                <!-- <span >levelForm.dimensionDetails.length={{levelForm.dimensionDetails.length}}</span> -->
                                <div class="wdListSet"  v-for="(item,index) in levelForm.dimensionDetails" :key="index">
                                    <el-cascader size="small" v-model="item.dimensionId" placeholder="请选择维度" ref="cascader" class="w200" :options="dimensionOptions" :props="{emitPath:false,checkStrictly: true, expandTrigger: 'hover',value: 'id',label: 'name',children:'dimensionItemVOList'}" clearable></el-cascader>
                                    <el-input size="small" class="w100" v-model="item.number" placeholder="请输入数量" maxlength="3"></el-input>

                                    <span style="display:inline-block;width:6px"></span>
                                    <!-- <el-button type="primary"v-if="index<levelForm.dimensionDetails.length"  v-else icon="el-icon-plus" size="small" class="ml10" @click="addDimension(index,levelForm.dimensionDetails)"></el-button> -->
                                    <el-button type="danger" icon="el-icon-delete" size="small" class="ml0" @click="deleteDimension(index,levelForm.dimensionDetails)"></el-button>

                                </div>


                                <div class="condition_tips_sub">（选择上级维度时，会将下级维度全部纳入统计）</div>
                            </div>
                            <el-checkbox v-model="levelForm.preConditions" v-if="(dialogStatus=='create'?(levelData.length+1):levelForm.level)>1">必须获得前一等级后，本等级才会生效</el-checkbox> 
                        
                    </div>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelLevel()">取 消</el-button>
                <el-button type="primary" :loading="saveLevelLoading" @click="submitLevel()">确 定</el-button>
            </div>
        </el-dialog>





    </div>
</template>

<script>
import _ from 'lodash';
import * as api from '@comm/api/evaluationSetting'
import Cookies from 'js-cookie'

export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            isMini:false,
            addLayer:false,
            addLevelLayer:false,
            dialogFormVisible:false,
            metalData: [//勋章数据
            ],
            levelData: [//人物等级数据
            ],
            textMap: {//编辑或创建
                update: '编辑',
                create: '创建'
            },
            dialogStatus:'',//编辑或创建
            wdDialogStatus: '',//维度编辑或创建
            levelForm:{//等级表格
                dimensionDetails:[{type:''}],
            },
            dimensionOptions:[],//维度选项

            options1:[
                {
                    value:"1",
                    label:"每周"
                },{
                    value:"2",
                    label:"每月"
                }
            ],
            options2:[
                {
                    value:"1",
                    label:"本班"
                },{
                    value:"2",
                    label:"本年级"
                },{
                    value:"3",
                    label:"全校"
                }
            ],
            options3:[
                {
                    value:"1",
                    label:"所有维度"
                },{
                    value:"2",
                    label:"各自维度"
                }
            ],
            dialogFormVisible2:false,
            editMetalForm: {
                level: 1,
                name: ''
            },//修改或添加勋章的表格
            dimensionSetting: {
                medalDimensionRuleRankingVO:{number: '',periodType:'',rangeType: '',sortType: '',top: ''},
                medalDimensionRuleReachVO:{number: '',reachScore:''}
            },//维度修改的或添加的表格
            levelNames:[],//等级名称
            upgradeForm:{medalDimensionRuleReachVO:{number: '',reachScore:''}},//升级弹框内容
            saveMetalLoading: false,//保存修改勋章的loading
            saveLevelLoading: false,//保存修改勋章的loading
            dimensionRule:{
                name: [{ required: true,message: '请输入名称',tigger: 'blur'}],
                icon: [{ required:true,message:'请上传图标', trigger: 'change' }],
                dimensionId: [{ required:true,message:'请选择维度', trigger: 'change' }],
            },
            isInspireCard:localStorage.getItem("inspireCardSchool")=='true'?true:false,
            mystyle: '',//右侧弹框样式
        }
    },
    computed: {
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token")}
        },
        // headersV2: function() {
        //     return {Authorization: Cookies.get("Admin-Token")}
        // },
    },
    watch: {

    },
    mounted(){
        console.log(this.isInspireCard,442244)


        this.getDimension();//获取维度供选择
        this.getMedalList();//获取勋章列表
        // this.getAllLevels('1')//获取勋章等级供选择
        // this.init();
    },
    methods: {
        //切换标签页
        changeTab(e){
            this.isMini = this.addLayer = false
            console.log(e);
            if(e.index=='0'){//勋章设置
                this.getMedalList();
                // this.getAllLevels('1')
            } else {//等级设置
                this.getLevelByPage();
                // this.getAllLevels('2');
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

        //获取所有维度供选择
        getDimension(){
            api.getAllDimension().then(res=>{
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
                console.log(arr);
                this.dimensionOptions = arr
                // this.dimensionOptions = res.value;
            })
        },
        //获取所有等级供选择
        getAllLevels(type){
            api.getAllGrade({type}).then(res => {
                this.levelNames = res.value;
                this.levelNames.sort((a,b)=>{//按等级升序
                    return a.level-b.level;
                })
            })
        },
        //上传图片成功
        handleChange(value){
            return (response,file, fileList) => {
                console.log(response);
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
        //取消提交或修改
        cancel(val){
            val = null;//清空
            this.dialogFormVisible = false;//关闭弹框
            this.dialogFormVisible2 = false;//关闭弹框
        },
    //勋章相关
        //获取勋章设置列表
        getMedalList(){
            api.getAllMedal().then(res => {
                var data = res.value;
                this.metalData = data;
                this.metalData.forEach(v=>{
                    v.deltips = false;
                })
                console.log(res)
            })
        },
        //删除勋章
        deleteMedal(val){
            api.deleteMedal(val.medalId).then(res => {
                if(res.resultCode==1){
                    this.dialogFormVisible = false;//关闭弹框
                    this.$notify({
                        type: 'success',
                        message: '操作成功！',
                        time: 1000
                    })
                    //成功之后刷新
                    this.getMedalList();
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage
                    })                        
                }
            })
        },        
        /**
         * 增加修改勋章等级
         * by:
         * time:
         */
        changeMedalList(type,val){//增加或修改的表格名称是editMetalForm
            console.log(val,710);
            if(this.addLayer){
                this.$notify({title:"提示:",message:"请保存勋章设置再重试!",type:"warning"})
                return ;
            } 
            this.dialogStatus = type;   
            if(type=='create'){//增加勋章            
                if(!this.isMini){
                    this.editMetalForm = {
                        level: this.metalData.length+1,
                        medalDimensionDetailsList:[]
                    };
                    if(this.editMetalForm.level>1){//大于1级
                        //获取前一级的勋章icon并展示
                        api.getPreMedalDetails().then(res => {
                            this.editMetalForm.iconList = []
                            var medalDimensionDetailsList = [];
                            res.value.medalDimensionDetailsList.forEach(e=>{
                                this.editMetalForm.iconList.push({icon:e.icon,dimensionName:e.dimensionName})
                                medalDimensionDetailsList.push({
                                    dimensionId: e.dimensionId,
                                    prename: res.value.name,
                                    dimensionName:e.dimensionName
                                });
                            })
                            this.$set(this.editMetalForm,'medalDimensionDetailsList',medalDimensionDetailsList)
                        })                        
                    }
                    console.log(this.editMetalForm,573)
                    //  = $.extend(true,[],prevLevel.iconList);;
                    // this.editMetalForm.iconList.splice(0,1);//把第一张通用的图去掉
                    this.isMini = true;
                    this.addLayer = true;
                }                 
            } else {//编辑勋章
                var that = this;
                if(!this.isMini){
                    api.getMedalDetails(val.medalId ).then(res => {
                        that.editMetalForm = res.value
                        console.log(that.editMetalForm,594);
                        if(val.level==1){//如果等级为1级
                            //啥事不干直接展示
                            this.isMini = true;
                            this.addLayer = true;                            
                        }else{//等级不为一级
                            //要获取前一级的徽章图
                            api.getPreMedalDetails({medalId:val.medalId}).then(res1 => {
                                this.editMetalForm.iconList = []
                                res1.value.medalDimensionDetailsList.forEach((e,ind)=>{
                                    var pinfo = res.value.medalDimensionDetailsList.find(p =>{
                                        return p.dimensionId == e.dimensionId;
                                    })
                                    this.$set(e,'prename',e.name);
                                    this.$set(e,'name',pinfo?pinfo.name:'');
                                    if(that.editMetalForm.medalDimensionDetailsList[ind]){
                                        //e.name=that.editMetalForm.medalDimensionDetailsList[ind].name;
                                    } else {
                                        e.name=''
                                    }                                  
                                    this.editMetalForm.iconList.push({icon:e.preIcon,dimensionName:e.dimensionName})
                                })
                                var medalDimensionDetailsList = res1.value.medalDimensionDetailsList;
                                this.$set(this.editMetalForm,'medalDimensionDetailsList',medalDimensionDetailsList)
                                this.isMini = true;
                                this.addLayer = true;
                            })
                        } 
                    console.log(this.editMetalForm,573) 
                    })  

                }                
            }        
        },        
        //保存勋章设置
        saveMetal(){
            if(this.editMetalForm.name==''||this.editMetalForm.name==undefined||this.editMetalForm.name==null){
                this.$notify({
                    type: 'error',
                    message: '请输入勋章名称'
                })
                return
            }

            if(this.editMetalForm.icon==''||this.editMetalForm.icon==undefined||this.editMetalForm.icon==null){

                this.editMetalForm.icon = 'http://oa.91118.com:8082/theme/skin_default/icon_Lv'+ this.editMetalForm.level + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'')+'.png';
                // this.$notify({
                //     type: 'error',
                //     message: '请上传通用图标'
                // })
                // return

            } 
            for(var item of this.editMetalForm.medalDimensionDetailsList)           {
                if(item.icon==undefined||item.medalDimensionRuleVOList==undefined){
                    this.$notify({
                        type: 'error',
                        message: '请设置全部子勋章升级规则'
                    }) 
                    return                
                }
            }
            //验证通过
            this.saveMetalLoading = true;
            //这里判断是新建还是编辑
            if(this.dialogStatus=='create'){//新建勋章
                if(this.editMetalForm.name==''){
                    this.$notify({
                        type: 'error',
                        message: '请输入勋章名称'
                    })
                    return
                }
                if(this.editMetalForm.icon==''){
                    this.$notify({
                        type: 'error',
                        message: '请上传通用图标'
                    })
                    return
                }
                this.isMini = false;
                this.addLayer = false;
                console.log(this.editMetalForm);
                var medalItemParam = {
                    icon: this.editMetalForm.icon,
                    fileInfoVO: this.editMetalForm.fileInfoVO,
                    level: this.editMetalForm.level,
                    medalDimensionDetailsList:[],
                    name: this.editMetalForm.name
                }
                if(this.editMetalForm.medalDimensionDetailsList){
                    this.editMetalForm.medalDimensionDetailsList.forEach(e=>{
                        var beforepush = {
                            dimensionId:e.dimensionId,
                            icon: e.icon,
                            fileInfoVO: e.fileInfoVO,
                            name: e.name?e.name:'',
                            teacherSwitch: e.teacherSwitch?'1':'0',
                            medalDimensionRuleParamList:[]
                        }
                        if(e.medalDimensionRuleVOList){
                            e.medalDimensionRuleVOList.forEach(ele => {
                                beforepush.medalDimensionRuleParamList.push({
                                    type: ele.type,
                                    medalDimensionRuleReachParam: ele.medalDimensionRuleReachVO ,
                                    medalDimensionRuleRankingParam: ele.medalDimensionRuleRankingVO 
                                })
                            })                            
                        }

                        medalItemParam.medalDimensionDetailsList.push(beforepush);
                    })                     
                }         
                console.log(medalItemParam,659);
                api.addMedal(medalItemParam).then(res => {
                    if(res.resultCode==1){
                        this.isMini = false;
                        this.addLayer = false;//关闭弹框
                        this.$notify({
                            type: 'success',
                            message: '操作成功！',
                            time: 1000
                        })
                        //成功之后刷新
                        this.getMedalList();
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage
                        })                        
                    }
                    this.saveMetalLoading = false;
                }).catch(e=>{
                    this.$notify({
                        type: 'error',
                        message: '网络异常，请检查网络后重试！'
                    })
                    this.saveMetalLoading = false;                      
                })
                console.log(this.editMetalForm,713)
            } else {//保存勋章
                // console.log(this.editMetalForm,713)
                var medalItemParam = {
                    icon: this.editMetalForm.icon,
                    fileInfoVO: this.editMetalForm.fileInfoVO,
                    level: this.editMetalForm.level,
                    medalDimensionDetailsList:[],
                    name: this.editMetalForm.name
                }
                console.log(medalItemParam,773)
                this.editMetalForm.medalDimensionDetailsList.forEach(e=>{
                    var beforepush = {
                        dimensionId:e.dimensionId,
                        icon: e.icon,
                        fileInfoVO: e.fileInfoVO,
                        name: e.name?e.name:'',
                        teacherSwitch: e.teacherSwitch?'1':'0',
                        medalDimensionRuleParamList:[]
                    }
                    if(e.medalDimensionRuleVOList){
                        e.medalDimensionRuleVOList.forEach(ele => {
                            beforepush.medalDimensionRuleParamList.push({
                                type: ele.type,
                                medalDimensionRuleReachParam: ele.medalDimensionRuleReachVO ,
                                medalDimensionRuleRankingParam: ele.medalDimensionRuleRankingVO 
                            })
                        })                            
                    }
                    medalItemParam.medalDimensionDetailsList.push(beforepush);
                })                 
                api.updateMedal(this.editMetalForm.medalId,medalItemParam).then(res => {
                    if(res.resultCode==1){
                        this.isMini = false;
                        this.addLayer = false;//关闭弹框
                        this.$notify({
                            type: 'success',
                            message: '操作成功！',
                            time: 1000
                        })
                        //成功之后刷新
                        this.getMedalList();
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage
                        })                        
                    }
                    this.saveMetalLoading = false;
                }).catch(e=>{
                    this.$notify({
                        type: 'error',
                        message: '网络异常，请检查网络后重试！'
                    })
                    this.saveMetalLoading = false;                      
                })
            }
        },
        /**
         * 增加或修改维度
         * by:
         * time:
         */
        addWd(type,val){
            this.wdDialogStatus = type;
            if(this.wdDialogStatus == 'create'){//增加
                this.dimensionSetting = {
                    level: val,
                    name: '',
                    dimensionName: '',
                    teacherSwitch: true,//一级设置中要默认前两个勾选
                    reachSwitch: true,//一级设置中要默认前两个勾选
                    rankingSwitch: false,
                    medalDimensionRuleRankingVO:{number: '',periodType:'',rangeType: '',sortType: '2',top: ''},
                    medalDimensionRuleReachVO:{number: '',reachScore:''}
                }
            } else {//修改
                var value = this.editMetalForm.medalDimensionDetailsList[val]
                var res = {
                    index: val,
                    icon: value.icon,
                    fileInfoVO: value.fileInfoVO,
                    level: val+1,
                    medalId: value.medalId,
                    name: value.name,
                    dimensionName: value.dimensionName,
                    dimensionId: value.dimensionId,
                    teacherSwitch: value.teacherSwitch=='0'?false:true,
                    reachSwitch: false,
                    rankingSwitch: false,
                    medalDimensionRuleRankingVO:{number: '',periodType:'',rangeType: '',sortType: '2',top: ''},
                    medalDimensionRuleReachVO:{number: '',reachScore:''}                    
                }
                //值format
                if(value.medalDimensionRuleVOList){
                    value.medalDimensionRuleVOList.forEach(e=>{
                        if(e.type==1){
                            res.reachSwitch = true;
                            res.medalDimensionRuleReachVO = e.medalDimensionRuleReachVO;
                        } 
                        if(e.type==2){
                            res.rankingSwitch = true;
                            e.medalDimensionRuleRankingVO.periodType += '';
                            e.medalDimensionRuleRankingVO.rangeType += '';
                            res.medalDimensionRuleRankingVO = e.medalDimensionRuleRankingVO;
                        }
                    })                    
                }
                console.log(res,792);
                this.dimensionSetting = res ;
            }
            this.dialogFormVisible = true;
        },
        //删除维度
        deleteWd(index){
            // var index = this.editMetalForm.medalDimensionDetailsList.findIndex(v=>{
            //     return v.dimensionId == val.dimensionId
            // })
            // if(index>=0){
                this.editMetalForm.medalDimensionDetailsList.splice(index,1);
            // }
        },
        //确定添加或修改维度
        confirmSetting(){
            console.log(this.dimensionSetting);
            if(this.dimensionSetting.dimensionId==undefined||this.dimensionSetting.dimensionId==''){
                this.$notify({
                    type: 'error',
                    message: '请选择维度'
                })    
                return
            }
            if(this.dimensionSetting.icon==undefined||this.dimensionSetting.icon==''){
                this.$notify({
                    type: 'error',
                    message: '请上传图标'
                })    
                return
            }            
            if(this.dimensionSetting.rankingSwitch||this.dimensionSetting.reachSwitch||this.dimensionSetting.teacherSwitch){
                if(this.dimensionSetting.reachSwitch&&(this.dimensionSetting.medalDimensionRuleReachVO.reachScore==''||this.dimensionSetting.medalDimensionRuleReachVO.number=='')){
                    this.$notify({
                        type: 'error',
                        message: '请填写已勾选的获得条件'
                    })    
                    return                     
                } else if(this.dimensionSetting.reachSwitch&&(!/^\d+$/.test(this.dimensionSetting.medalDimensionRuleReachVO.reachScore)||!/^\d+$/.test(this.dimensionSetting.medalDimensionRuleReachVO.number))){
                    this.$notify({
                        type: 'error',
                        message: '请输入数字'
                    })    
                    return                      
                }                
                if(this.dimensionSetting.rankingSwitch&&(this.dimensionSetting.medalDimensionRuleRankingVO.periodType==''||this.dimensionSetting.medalDimensionRuleRankingVO.number==''||this.dimensionSetting.medalDimensionRuleRankingVO.rangeType==''||this.dimensionSetting.medalDimensionRuleRankingVO.top=='')){
                    this.$notify({
                        type: 'error',
                        message: '请填写已勾选的获得条件'
                    })    
                    return                                      
                } else if(this.dimensionSetting.rankingSwitch&&(!/^\d+$/.test(this.dimensionSetting.medalDimensionRuleRankingVO.number)||!/^\d+$/.test(this.dimensionSetting.medalDimensionRuleRankingVO.top))){
                    this.$notify({
                        type: 'error',
                        message: '请输入数字'
                    })    
                    return                      
                }

            } else {
                this.$notify({
                    type: 'error',
                    message: '至少选一个获得条件'
                })    
                return                
            }
            for(var ind = 0;ind<this.editMetalForm.medalDimensionDetailsList.length;ind++){
                var v = this.editMetalForm.medalDimensionDetailsList[ind];
                if(v.dimensionId==this.dimensionSetting.dimensionId&&ind!=this.dimensionSetting.index){
                    this.$notify({
                        type: 'error',
                        message: '该维度下已有勋章'
                    })
                    return                       
                }                
            }
            if(this.wdDialogStatus == 'create'){//添加
                var item = {//待添加数据
                    dimensionId: this.dimensionSetting.dimensionId,
                    dimensionName: this.dimensionSetting.dimensionName,
                    icon: this.dimensionSetting.icon,
                    fileInfoVO: this.dimensionSetting.fileInfoVO,
                    name: this.dimensionSetting.name,
                    teacherSwitch: this.dimensionSetting.teacherSwitch?'1':'0',
                    medalDimensionRuleVOList: []
                }
                if(this.dimensionSetting.reachSwitch){//达到条件勾选
                    item.medalDimensionRuleVOList.push({
                        type: 1,
                        medalDimensionRuleReachVO:this.dimensionSetting.medalDimensionRuleReachVO
                    })                    
                }
                if(this.dimensionSetting.rankingSwitch){//排名条件勾选
                    item.medalDimensionRuleVOList.push({
                        type: 2,
                        medalDimensionRuleRankingVO:this.dimensionSetting.medalDimensionRuleRankingVO
                    })                    
                }     
                if(!this.editMetalForm.medalDimensionDetailsList){
                    this.$set(this.editMetalForm,'medalDimensionDetailsList',[]);
                }           
                this.editMetalForm.medalDimensionDetailsList.push(item);
            } else {//修改
                var item = {
                    dimensionId: this.dimensionSetting.dimensionId,
                    dimensionName: this.dimensionSetting.dimensionName,
                    icon: this.dimensionSetting.icon,
                    fileInfoVO: this.dimensionSetting.fileInfoVO,
                    name: this.dimensionSetting.name,
                    teacherSwitch: this.dimensionSetting.teacherSwitch?'1':'0',
                    medalDimensionRuleVOList: []
                }
                if(this.dimensionSetting.reachSwitch){
                    item.medalDimensionRuleVOList.push({
                        type: 1,
                        medalDimensionRuleReachVO:this.dimensionSetting.medalDimensionRuleReachVO
                    })                    
                }
                if(this.dimensionSetting.rankingSwitch){
                    item.medalDimensionRuleVOList.push({
                        type: 2,
                        medalDimensionRuleRankingVO:this.dimensionSetting.medalDimensionRuleRankingVO
                    })                    
                }
                
                var ind = this.dimensionSetting.index
                if(ind!=undefined){
                    this.editMetalForm.medalDimensionDetailsList[ind] = item;
                }
                this.editMetalForm.medalDimensionDetailsList.push({});
                this.editMetalForm.medalDimensionDetailsList.pop();//强制更新
                // this.$set(this.editMetalForm,'medalDimensionDetailsList',this.editMetalForm.medalDimensionDetailsList)
                console.log(this.editMetalForm.medalDimensionDetailsList[ind],846)
            }
            this.dialogFormVisible = false;
        },
        //改变维度值
        changeDimension(v){
            var value = this.$refs.changeDimension.getCheckedNodes();
            this.dimensionSetting.dimensionName = value[0].label;
        },

        /**
         * 升级勋章弹层
         * by:
         * time:
         */
        updataMedal( val,ind){
            val.ind = ind;
            // this.upgradeForm = $.extend(true,{},val); 
            console.log(val,856)
            this.upgradeForm = {
                ind : ind,
                prename: val.prename,
                name: val.name,
                dimensionName: val.dimensionName,
                dimensionId: val.dimensionId,
                icon: val.icon,
                fileInfoVO: val.fileInfoVO,
                medalDimensionRuleReachVO: val.medalDimensionRuleVOList&&val.medalDimensionRuleVOList.length>0?val.medalDimensionRuleVOList[0].medalDimensionRuleReachVO:''
            }
            if(this.upgradeForm.medalDimensionRuleReachVO==''){
                var medalDimensionRuleReachVO = {
                    reachScore:'',
                    number:''
                }
                this.$set(this.upgradeForm,'medalDimensionRuleReachVO',medalDimensionRuleReachVO)                
            }
            console.log(this.upgradeForm,854)
            this.dialogFormVisible2 = true;
        },
        //确认升级
        confirmUpgrade(){
            console.log(this.editMetalForm.level,11003399)
            if(this.upgradeForm.icon==undefined){
                // this.$notify({
                //     type: 'error',
                //     message: '请上传图标'
                // })    
                // return
                this.upgradeForm.icon = 'http://oa.91118.com:8082/theme/skin_default/icon_Lv'+ this.editMetalForm.level + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'')+'.png';

                console.log(this.upgradeForm.icon,11004488)
                //http://oa.91118.com:8082/theme/skin_default/icon_Lv5.png
            }            
            if(this.upgradeForm.name==undefined||this.upgradeForm.name==''){
                this.$notify({
                    type: 'error',
                    message: '请填写名称'
                })    
                return
            }
            if(this.upgradeForm.medalDimensionRuleReachVO.number==''||this.upgradeForm.medalDimensionRuleReachVO.reachScore==''){
                this.$notify({
                    type: 'error',
                    message: '请填写升级条件'
                })    
                return
            } else if(!/^\d+$/.test(this.upgradeForm.medalDimensionRuleReachVO.number)||!/^\d+$/.test(this.upgradeForm.medalDimensionRuleReachVO.reachScore)){
                console.log(this.upgradeForm.medalDimensionRuleReachVO.reachScore,1004)
                this.$notify({
                    type: 'error',
                    message: '升级条件请输入数字'
                })    
                return                
            }
            var medalDimensionDetail = {
                icon: this.upgradeForm.icon,
                fileInfoVO: this.upgradeForm.fileInfoVO,
                name: this.upgradeForm.name,
                medalDimensionRuleVOList:[{
                    type: 1,
                    medalDimensionRuleReachVO: this.upgradeForm.medalDimensionRuleReachVO
                }],
                teacherSwitch: false,
                dimensionId: this.upgradeForm.dimensionId,
                dimensionName: this.upgradeForm.dimensionName,
            }
            var temp = this.editMetalForm.medalDimensionDetailsList
            var ind = temp.findIndex(e => {
                return e.ind == this.upgradeForm.ind
            })
            // this.$set(this,'dialogFormVisible2',false);     
            this.editMetalForm.medalDimensionDetailsList[ind] = medalDimensionDetail;
            this.editMetalForm.medalDimensionDetailsList.push({});
            this.editMetalForm.medalDimensionDetailsList.pop();
            // //加这一段就能强制更新
            // this.$set(this.editMetalForm.medalDimensionDetailsList[ind],'icon',medalDimensionDetail.icon);  
            // this.$set(this.editMetalForm.medalDimensionDetailsList[ind],'name',medalDimensionDetail.name);  
            // this.$set(this.editMetalForm.medalDimensionDetailsList[ind],'teacherSwitch',medalDimensionDetail.teacherSwitch); 
            // this.$set(this.editMetalForm.medalDimensionDetailsList[ind],'dimensionId',medalDimensionDetail.dimensionId); 
            // this.$set(this.editMetalForm.medalDimensionDetailsList[ind],'dimensionName',medalDimensionDetail.dimensionName);      
            // this.$set(this.editMetalForm.medalDimensionDetailsList[ind],'medalDimensionRuleVOList',medalDimensionDetail.medalDimensionRuleVOList);   
            // console.log(this.editMetalForm.medalDimensionDetailsList[ind],872)         
            // console.log(this.editMetalForm.medalDimensionDetailsList)
            this.dialogFormVisible2 = false;
            
        },
    //人物等级相关      
        /**
         * 增加/修改等级
         * by:
         * time:
         */
        changeLevelList(type,val){
            this.dialogStatus = type;
            if(type=='create'){
                this.addLevelLayer = true;
                this.levelForm = {level:this.levelData.length+1,dimensionDetails:[{type:''}],}             
            } else {
                this.addLevelLayer = true;
                api.getCharacterDetails(val.characterId).then(res => {
                    this.levelForm = res.value;
                    this.levelForm.characterId = val.characterId;
                    this.levelForm.dimensionDetails[0].type += ''
                    this.levelForm.dimensionDetails.forEach(e=>{
                        e.dimensionId += ''
                    })
                })
                // if(val.dimensionDetails==undefined){
                    // this.$set(val,'dimensionDetails',[{type:''}]);
                // }
                // this.levelForm = $.extend(true,{},val);      
            }
        },
        //删除等级
        deleteLevel(row){
            api.deleteCharacter(row.characterId).then(res => {
                console.log(res)
                row.deltips = false;
                //删除之后要刷新页面
                this.getLevelByPage();
            })
        },
        //分页获取人物等级
        getLevelByPage(name){
            var params = {
                name,
                page:1,
                limit: 10,
            }
            api.getCharacterByPage(params).then(res=>{
                var data = res.value.dataList;
                this.levelData=data
                this.levelData.forEach(v=>{
                    v.deltips = false;
                })
            })
        },
        //增加维度
        addDimension(ind,arr){
            arr.splice(ind+1,0,{dimensionId:'',number:'',type: '2'})
        },
        //删除维度
        deleteDimension(ind,arr){
            if(arr.length==1){
                return
            }
            arr.splice(ind,1);
        },
        //取消添加或修改
        cancelLevel(){
            // this.levelForm = [];
            this.addLevelLayer = false;
        },
        //提交添加或修改
        submitLevel(){
            //验证
            console.log(this.levelForm); 
            if(this.levelForm.name==''||this.levelForm.name==undefined||this.levelForm.name==null){//名字为空
                this.$notify({
                    type: 'warning',
                    message: '名称不能为空'
                })    
                return
            }           
            if(this.levelForm.icon==''||this.levelForm.icon==undefined||this.levelForm.icon==null){//名字为空
                this.levelForm.icon = 'http://oa.91118.com:8082/theme/skin_default/icon_Lv'+ this.levelForm.level +'.png';
                // this.$notify({
                //     type: 'error',
                //     message: '请上传图标'
                // })    
                // return
            }   
            for(var e of this.levelForm.dimensionDetails){
                if(e.type==''){//
                    this.$notify({
                        type: 'warning',
                        message: '请选择获得条件'
                    })    
                    return
                }            
                if(e.type==2&&(e.dimensionId==undefined||e.dimensionId==''||e.dimensionId=='-1')){//
                    this.$notify({
                        type: 'warning',
                        message: '请选择维度'
                    })    
                    return
                }             
                if(e.number==undefined||e.number==''){//
                    this.$notify({
                        type: 'warning',
                        message: '请输入勋章数量'
                    })    
                    return
                } else if(!/^\d+$/.test(e.number)) {
                    this.$notify({
                        type: 'warning',
                        message: '勋章数量请输入数字'
                    })    
                    return                
                }
                if(e.type==2&&this.checkRepeat(e.dimensionId)){
                    this.$notify({
                        type: 'warning',
                        message: '获得条件有重复维度，请检查并修改'
                    })        
                    return;            
                }
            }

            //验证通过
            this.saveLevelLoading = true;
            //这里要判断是添加还是修改
            if(this.dialogStatus=='create'){
                console.log(this.levelForm,12301230)
                //这里是添加的请求
                api.addCharacter(this.levelForm).then(res=>{
                    if(res.resultCode==1){
                        this.addLevelLayer = false;//关闭弹框
                        this.$notify({
                            type: 'success',
                            message: '操作成功！',
                            time: 1000
                        })
                        //成功之后刷新
                        this.getLevelByPage();
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage
                        })                        
                    }
                    this.saveLevelLoading = false;
                }).catch(e=>{
                    this.$notify({
                        type: 'error',
                        message: '网络异常，请检查网络后重试！'
                    })
                    this.saveLevelLoading = false;                      
                })                
            } else {
                api.updateCharacter(this.levelForm.characterId,this.levelForm).then(res=>{
                    if(res.resultCode==1){
                        this.addLevelLayer = false;//关闭弹框
                        this.saveLevelLoading = false;     
                        this.$notify({
                            type: 'success',
                            message: '操作成功！',
                            time: 1000
                        })
                        //成功之后刷新
                        this.getLevelByPage();
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage
                        })
                        this.saveLevelLoading = false;                        
                    }
                }).catch(e=>{
                    this.$notify({
                        type: 'error',
                        message: '网络异常，请检查网络后重试！'
                    })
                    this.saveLevelLoading = false;                      
                })     
            }
        },
        //检查维度是否重复
        checkRepeat(e){
            console.log(e,1247)
            var count=-1;
            for(var ind =0;ind<this.levelForm.dimensionDetails.length;ind++){
                var v = this.levelForm.dimensionDetails[ind];
                if(v.dimensionId==e){//如果重复
                    count++;    
                }                
            }
            return count>0;
        }
    }
}
</script>

<style scoped lang="scss">
.sliderRight-enter-active {
    animation-name: fadeInRight;
    animation-duration: .5s;
}
.w100{
    width: 100px;
}
.w200{
    width: 200px;
}
.ml0{
    margin-left: 0;
}
.ml10{
    margin-left: 10px;
}
.sliderRight-leave-active {
    // animation-name: fadeOutRight;
    // animation-duration: .5s;
}
.u_TableMain.columns{
    width: 100%;
    float: left;
}
.u_TableMain.mini{
    width: 50%;
    overflow-x: auto;
    .dimensionTable{
        width: 100%;
        min-width: auto;
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
.addMedal{
    padding-top: 20px;
    width: 100%;
    float: left;
}
/deep/ .el-tabs--border-card{
    border: none;
    box-shadow:none;
}
.m_optbox{
    width:100%;
    padding: 20px 0;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
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
    .dimensionImg.card{
        width: 88px;
        height: 44px;
        border-radius: 0;
        padding: 2px 0;
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
.pr{
    position: relative;
}
.pb72{
    padding-bottom: 72px;
}
.levelLayer{
    display: inline-block;
    width: 50%;
    padding-left: 20px;
    position: absolute;
    top:0;
    .m_tit{
        font-family: 'fz';
        font-size: 16px;
        color:#666;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        border-bottom: 1px dotted #d8d8d8;
    }
    .m_form{
        padding: 20px;
        padding-bottom: 0;
        .m_col{
            padding-left:90px;
            position: relative;
            line-height: 34px;
            font-size: 16px;
            margin-bottom: 10px;
            .m_col_tit{
                display: inline-block;
                height: 34px;
                width: 90px;
                line-height: 34px;
                text-align: right;
                padding-right: 15px;
                font-size: 14px;
                color: #606266;
                font-weight: 700;
                position: absolute;
                top:0;
                left: 0;
            }
            .m_col_tit.required::before{
                content: '*';
                color: #FF0000;
                position: absolute;
                font-size: 16px;
                font-weight: 700;
                position: absolute;
                top: 5px;
                transform: translateX(-200%);
            }
            .ipt{
                width: 50%;
                min-width: 200px;
            }
        }
        
    }
}
.lh50{
    /deep/ .el-form-item__label{
        line-height: 50px;
    }
}
.genImg{
    height: 50px;
    position: relative;
}
.genImg /deep/ .el-upload {
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
.avatar {
    width: 50px;
    height: 50px;
    display: block;
}
.genImg.card .avatar{
    width: 100%;
    height: 100%;
    display: block;
}
.condition_col{
    .el-checkbox{
        margin-right: 10px;
    }
    /deep/ .el-select .el-input__inner{
        padding: 0 5px;
    }
}
.setother{
    padding-top:20px;
}
.levelForm{
    /deep/ .el-form-item{
        margin-bottom: 20px;
    }
}
.condition_tips{
    font-size: 12px;
    color: #AAA;
    line-height: 20px;
    margin-top: -5px;
    padding-bottom: 10px;
}
.condition_tips_sub{
    font-size: 12px;
    color: #AAA;
    line-height: 24px;
    padding-top: 20px;
}
.setupdata{
    color: #409EFF;
}
.inlineImg{
    display: inline-block;
}
.inlineFont{
    line-height: 50px;
    display: inline-block;
    margin: 0 4px;
    overflow: hidden;
}
.wdListSet{
    width: 100%;
}
    

</style>
