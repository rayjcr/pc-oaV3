<template>
    <div class="app-container calendar-list-container">
        <el-tabs class="u_TableMain columns ofhide" v-model="activeIndex" @tab-click="getEvaluation(1)" type="border-card">
            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-user"></i> 个人评价项</span>

                <div class="filter-container innerTab">
                    <span>类型：</span>
                    <el-select v-model="type" @change="getEvaluation(1)" size="small" class="selMargin" style="width:100px;" clearable>
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>

                    <span>维度：</span>
                    <el-cascader size="small" @change="getEvaluation(1)" class="selMargin" v-model="dimensionId" placeholder="请选择维度" style="width:200px;" :options="dimensionOptions" filterable :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList',disabled:''  }" clearable></el-cascader>

                    <!--
                    <span>创建人：</span>
                    <el-select v-model="createUserNo" size="small" class="selMargin" style="width:100px;" clearable>
                        <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select> -->

                    <span>搜索：</span>
                    <el-input size="small"  @change="getEvaluation(1)" style="width:200px;" placeholder="请输入内容" v-model="keywords" clearable></el-input>

                    <div>
                        <el-button class="cb" size="small" icon="el-icon-plus" type="primary" @click="changeEvaluationList('create')">新增评价项</el-button>
                        <el-button class="cb" size="small" type="primary" @click="bgdInput()">批量导入</el-button>
                    </div>
                </div>

                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable" :data="tableData">
                        <el-table-column label="评价项名称" prop="name" width="120">
                        </el-table-column>
                        <el-table-column label="图标" width="120">
                            <template slot-scope="scope">
                                <div class="dimensionImg" :class="{'card':isInspireCard}">
                                    <img :src="scope.row.icon?scope.row.icon:('http://oa.91118.com:8082/theme/skin_default/per_add_appraisal_score' + (isInspireCard?'_card':'') + '.png')">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="评价类型" prop="type" width="120">
                            <template slot-scope="scope">{{scope.row.type==1?'录入型':'任务型'}}</template>
                        </el-table-column>
                        <el-table-column label="频次" prop="evaluationItemRuleFrequency" width="120">
                            <template slot-scope="scope" v-if="scope.row.evaluationItemRuleFrequency">
                                {{ruleFrequency[scope.row.evaluationItemRuleFrequency.type-1].label}}{{scope.row.evaluationItemRuleFrequency.count}}次
                            </template>
                        </el-table-column>
                        <el-table-column label="奖惩类型" prop="rewardType" width="120">
                            <template slot-scope="scope">{{rewardTypes[scope.row.rewardType-1]}}</template>
                        </el-table-column>
                        <el-table-column label="维度" prop="dimensionName">
                        </el-table-column>
                        <el-table-column label="基准分" prop="evaluationItemRuleBenchmarkLimit" width="80">
                            <template slot-scope="scope">
                                {{scope.row.evaluationItemRuleBenchmarkLimit?scope.row.evaluationItemRuleBenchmarkLimit.benchmark:''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="上限" prop="evaluationItemRuleBenchmarkLimit" width="80">
                            <template slot-scope="scope">
                                {{scope.row.evaluationItemRuleBenchmarkLimit?scope.row.evaluationItemRuleBenchmarkLimit.maxLimit:''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="下限" prop="evaluationItemRuleBenchmarkLimit" width="80">
                            <template slot-scope="scope">
                                {{scope.row.evaluationItemRuleBenchmarkLimit?scope.row.evaluationItemRuleBenchmarkLimit.minLimit:''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="创建人" prop="staffName" width="120">
                        </el-table-column>
                        <el-table-column label="最新修改" prop="updateTime" width="140">
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeEvaluationList('update',scope.row)">编辑</el-button>
                                <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                    <p>是否删除此评价项</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="scope.row.deltips = false">取消</el-button>
                                        <el-button type="primary" size="mini" @click="deleteEvaluation(scope.row)">确定</el-button>
                                    </div>
                                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>


            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-school"></i> 班级评价项</span>

                <div class="filter-container innerTab">

                    <el-button size="small" icon="el-icon-plus" type="primary" @click="editClassPjList('create')">新增评价项</el-button>
                    <!-- <el-button size="small" type="primary" @click="bgdInput()">批量导入</el-button> -->
                </div>

                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable" :data="tableData1">
                        <el-table-column label="评价项名称" prop="name" width="150">
                        </el-table-column>
                        <el-table-column label="图标">
                            <template slot-scope="scope">
                                <div class="dimensionImg" :class="{'card':isInspireCard}">
                                    <img :src="scope.row.icon">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="奖惩类型" prop="rewardType">
                            <template slot-scope="scope">
                                {{rewardTypes[scope.row.rewardType-1]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="维度" prop="dimensionName">
                        </el-table-column>
                        <el-table-column label="最新修改" prop="updateTime" width="140">
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClassPjList('update',scope.row)">编辑</el-button>
                                <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                    <p>是否删除此评价项</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="scope.row.deltips = false">取消</el-button>
                                        <el-button type="primary" size="mini" @click="deleteEvaluation(scope.row)">确定</el-button>
                                    </div>
                                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>

            </el-tab-pane>

            <el-tab-pane v-if="isInspireCard" name="4">
                <span slot="label"><i class="el-icon-document-delete"></i> 惩罚项</span>

                <div class="filter-container innerTab">
                    <span>类型：</span>
                    <el-select v-model="type" @change="getEvaluation(1)" size="small" class="selMargin" style="width:100px;" clearable>
                        <el-option label="禁止兑换商品" :value="7"> </el-option>
                        <!-- <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option> -->
                    </el-select>

                    <span>搜索：</span>
                    <el-input size="small"  @change="getEvaluation(1)" style="width:200px;" placeholder="请输入内容" v-model="keywords" clearable></el-input>

                    <el-button class="cb" size="small" icon="el-icon-plus" type="primary" @click="punishmentEvaluationList('create')">新增惩罚项</el-button>

                </div>

                <div class="m_GenTableBox">
                    <el-table class="tableBorder dimensionTable" :data="tableData2">
                        <el-table-column label="惩罚项名称" prop="name">
                        </el-table-column>
                        <el-table-column label="图标" >
                            <template slot-scope="scope">
                                <div class="dimensionImg" :class="{'card':isInspireCard}">
                                    <img :src="scope.row.icon">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="惩罚类型" prop="rewardType">
                            <template slot-scope="scope">{{scope.row.rewardType==7?'禁止兑换商品':''}}</template>
                        </el-table-column>
                        <el-table-column label="抵消" prop="evaluationItemRuleMedalOffset">
                            <template slot-scope="scope">
                                {{scope.row.evaluationItemRuleMedalOffset==null?'不可抵消':('勋章*'+scope.row.evaluationItemRuleMedalOffset.number)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="最新修改" prop="updateTime">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="punishmentEvaluationList('update',scope.row)">编辑</el-button>
                                <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                    <p>是否删除此惩罚项</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="scope.row.deltips = false">取消</el-button>
                                        <el-button type="primary" size="mini" @click="deleteEvaluation(scope.row)">确定</el-button>
                                    </div>
                                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </el-tab-pane>

            <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="handleCurrentChange">
            </el-pagination>
        </el-tabs>





        <!--添加编辑评价项弹层-->
        <el-dialog :title="textMap[dialogStatus]+'评价项'" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="600px">
            <div class="pjProjectMain">
                <el-form :model="personEaluationForm" ref="form" :rules="personEaluationRule" label-width="100px">
                    <el-form-item label="类型：" prop="type">
                        <el-radio v-model="personEaluationForm.type" label='1'>录入型</el-radio>
                        <el-radio v-model="personEaluationForm.type" label='2'>任务型</el-radio>
                    </el-form-item>

                    <el-form-item v-if="personEaluationForm.type=='2'" label="任务类型：" prop="taskType">
                        <el-radio v-model="personEaluationForm.taskType" :label='1'>常规任务</el-radio>
                        <el-radio v-model="personEaluationForm.taskType" :label='2'>考勤打卡</el-radio>
                    </el-form-item>
                
                    <el-form-item label="名称：" prop="name">
                        <el-input class="w300" size="small" maxlength="20" v-model="personEaluationForm.name"></el-input>
                    </el-form-item>


                    <el-form-item label="图标：" class="lh50" prop="icon"  v-if="personEaluationForm.taskType!==2||personEaluationForm.type==1">
                        <el-upload  class="genImg" :class="{'card':isInspireCard}" action="/api/evaluation/file/upload" accept="image/*" :before-upload="checkSize" :headers="headers" :on-success="handleChange" :on-error="errUpload" name='files' :show-file-list="false">
                            <img v-if="personEaluationForm.icon" :src="personEaluationForm.icon" class="avatar">
                            <i v-else class="el-icon-plus genImg-icon"></i>
                            <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="维度：" prop="dimensionId">
                        <el-cascader class="w300" v-model="personEaluationForm.dimensionId"  size="small" placeholder="请选择或搜索维度" :options="dimensionOptions" filterable :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList' }" clearable></el-cascader>
                    </el-form-item>


                    <transition name="sliderRight" mode="out-in">
                        <!-- 录入型评价项 -->
                        <div v-if="personEaluationForm.type==1" v-bind:key="personEaluationForm.type" class="pjSubCol">
                            <el-form-item label="基准分与上下限：" v-if="personEaluationForm.rewardType=='3'||personEaluationForm.rewardType=='4'" label-width="125px" prop="evaluationItemRuleBenchmarkLimit">
                                <el-button type="primary" size="small" @click="advancedSetting=!advancedSetting">{{advancedSetting?'保存设置':'打开设置'}}</el-button>
                                <span class="tip" v-if="advancedSetting">对任意学生评价后，基准分/上下限不允许更改！</span>
                                <div v-if="advancedSetting">
                                    <div class="greybg" style="display: flex;align-items: center;justify-content:center">
                                        基准分：<el-input v-model="personEaluationForm.evaluationItemRuleBenchmarkLimit.benchmark" maxlength="3" size="small" class="w60" style="margin-right:20px"></el-input>
                                        上限：<el-input v-model="personEaluationForm.evaluationItemRuleBenchmarkLimit.maxLimit" maxlength="3" class="w60" size="small" style="margin-right:20px"></el-input>
                                        下限：<el-input v-model="personEaluationForm.evaluationItemRuleBenchmarkLimit.minLimit" maxlength="4" class="w60" size="small" style="margin-right:20px"></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="奖惩类型：" prop="rewardType" :rules="personType1Rule">
                                    <el-radio v-model="personEaluationForm.rewardType" label="3">加分</el-radio>
                                    <el-radio v-model="personEaluationForm.rewardType" label="4">减分</el-radio>
                                    <el-radio v-model="personEaluationForm.rewardType" label="5">奖励勋章</el-radio>
                                    <el-radio v-model="personEaluationForm.rewardType" label="6">扣除勋章</el-radio>
                            </el-form-item>

                            <el-form-item label="奖惩区间：" class="must" prop="rewardMin" :rules="personType1Range">
                                <el-input class="w100" v-model="personEaluationForm.rewardMin" maxlength="2" size="small"></el-input> - <el-input v-model="personEaluationForm.rewardMax"  ref="rewardMax" class="w100" maxlength="2" size="small"></el-input>
                            </el-form-item>

                            <el-form-item label="配额：" v-if="showQuota" prop="characteristicList">
                                    <el-radio v-model="quota" :label="1">扣除</el-radio>
                                    <el-radio v-model="quota" :label="2">不扣除</el-radio>
                                    <div class="greytip">{{quota==1?"通过本项评价学生时会扣除配额":"使用本项评价学生不会受配额限制"}}</div>
                            </el-form-item>

                            <!-- <el-form-item label="权限组：" class="must must3" prop="orderGroup" :rules="personType1OrderGroup">
                                <el-select class="w300"  size="small" v-model="orderGroup" multiple placeholder="请选择权限组" clearable>
                                    <el-option
                                    v-for="item in options4"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                ---- <el-cascader class="w300"  size="small" v-model="orderGroup" placeholder="请选择权限组" :options="options4" filterable :props="{multiple:true, expandTrigger: 'hover' }" clearable></el-cascader>
                            </el-form-item> -->
                            <el-form-item label="默认评语:" prop="commentList">
                                <div v-for="(commen,index) of personEaluationForm.commentList" v-if="index<50" :key="index">
                                    <el-input size="small" maxlength="50" v-model="commen.content" style="width: 300px;"></el-input>
                                    默认值：
                                    <el-input size="small" maxlength="2" @input="_inputCommnetNum(index,'personEaluationForm')" v-model="commen.defaultReward" style="width: 50px;"></el-input>
                                    <i class="delfont el-icon-close" @click="deleteComment(index,1)" ></i>
                                    <!-- <el-button  type="primary" icon="el-icon-delete" circle></el-button> -->
                                </div>
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addComment(1)"></el-button>
                            </el-form-item>
                        </div>
                        <!-- /录入型评价项 -->
                        <!-- 任务型评价项 -->
                        <div v-if="personEaluationForm.type==2" v-bind:key="personEaluationForm.type" class="pjSubCol">
                            <el-form-item  v-if="personEaluationForm.taskType==1" label="有效期：" class="must must3"  prop="valid" :rules="personType2Valid">
                                <el-date-picker size="small" class="w300" v-model="valid" type="daterange" range-separator="~" value-format="yyyy-MM-dd" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" clearable> </el-date-picker>
                            </el-form-item>
                            <el-form-item label="频次：" class="must must2"  prop="evaluationItemRuleFrequency" :rules="personType2Frequency">
                                <el-select size="small" class="w150" v-model="personEaluationForm.evaluationItemRuleFrequency.type" @change="changeFrequency" placeholder="请选择">
                                    <!-- <div v-if="personEaluationForm.taskType==1">
                                        <el-option v-for="item in ruleFrequency" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </div>
                                    <div v-else> -->
                                        <el-option label="每周" value="3"></el-option>
                                        <el-option label="每月" value="4"></el-option>
                                    <!-- </div> -->
                                </el-select>
                                / <el-input size="small" maxlength="3" class="w150" v-model="personEaluationForm.evaluationItemRuleFrequency.count" :disabled="personEaluationForm.evaluationItemRuleFrequency.type=='1'"></el-input> 次
                            </el-form-item>
                            <el-form-item label="达成标准：" prop="evaluationItemRuleAttendance" class="must" v-if="personEaluationForm.taskType==2">
                                <el-radio v-model="personEaluationForm.evaluationItemRuleAttendance.type" :label='1'>进校打卡</el-radio>
                                <el-radio v-model="personEaluationForm.evaluationItemRuleAttendance.type" :label='2'>进校/出校打卡</el-radio>
                            </el-form-item>

                            <!-- <el-form-item label="奖励类型：" prop="rewardType" :rules="personType2Rule">
                                <el-radio v-model="personEaluationForm.rewardType" label="1">分数</el-radio>
                                <el-radio v-model="personEaluationForm.rewardType" label="2">勋章</el-radio>
                            </el-form-item>

                            <el-form-item label="分值：" class="must must2"  prop="evaluationItemRuleScoreList" :rules="personType2Score">
                                <el-select size="small" class="w150 fl" v-model="scoreType" placeholder="请选择">
                                    <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <div class="displayLine">
                                &nbsp;/ <el-input maxlength="2" size="small" class="w150" placeholder="单次分值" v-model="personEaluationForm.evaluationItemRuleScoreList[0].score"></el-input> {{personEaluationForm.rewardType=='1'?'分':'枚'}}<br>
                                <div v-if="scoreType=='3'">
                                    &nbsp;/ <el-input maxlength="2" size="small" class="w150" placeholder="全部完成分值" v-model="personEaluationForm.evaluationItemRuleScoreList[1].score"></el-input> {{personEaluationForm.rewardType=='1'?'分':'枚'}}
                                </div>
                                </div>
                            </el-form-item> -->
                            <el-form-item label="奖励：" class="must must2" prop="evaluationItemRuleScoreList" :rules="personTypeReward">
                                <div>
                                    <el-checkbox v-model="personEaluationForm.evaluationItemRuleScoreList[0].type" :true-label="1" :false-label="null">
                                        每次完成获得                                
                                    </el-checkbox>
                                    <el-select size="small" class="w100" v-model="personEaluationForm.evaluationItemRuleScoreList[0].rewardType" :disabled="!personEaluationForm.evaluationItemRuleScoreList[0].type">
                                        <el-option :value="1" label="分数"></el-option>
                                        <el-option :value="2" label="勋章"></el-option>
                                    </el-select>
                                    <el-input class="w150" size="small" maxlength="3" placeholder="请输入值" v-model="personEaluationForm.evaluationItemRuleScoreList[0].score"  :disabled="!personEaluationForm.evaluationItemRuleScoreList[0].type"></el-input>      
                                </div>
                                <div>
                                    <el-checkbox v-model="personEaluationForm.evaluationItemRuleScoreList[1].type" :true-label="2" :false-label="null">
                                            全部完成获得                                
                                    </el-checkbox>
                                    <el-select size="small" class="w100" v-model="personEaluationForm.evaluationItemRuleScoreList[1].rewardType"  :disabled="!personEaluationForm.evaluationItemRuleScoreList[1].type">
                                        <el-option :value="1" label="分数"></el-option>
                                        <el-option :value="2" label="勋章"></el-option>
                                    </el-select>
                                    <el-input class="w150" size="small" maxlength="3" placeholder="请输入值" v-model="personEaluationForm.evaluationItemRuleScoreList[1].score" :disabled="!personEaluationForm.evaluationItemRuleScoreList[1].type"></el-input>                                      
                                </div>

                            </el-form-item>
                        </div>
                        <!-- /任务型评价项 -->
                    </transition>


                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel(personEaluationForm,'form')">取 消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--新增班级评价项-->
        <el-dialog :title="textMap[dialogStatus]+'班级评价项'" :close-on-click-modal="false" :visible.sync="dialogFormVisible2" width="500px">
            <el-form :model="classEaluationForm" :rules="classEaluationRule" ref="classform" label-width="100px">

                <el-form-item label="名称：" prop="name">
                    <el-input class="w250" size="small" maxlength="20" v-model="classEaluationForm.name"></el-input>
                </el-form-item>

                <el-form-item label="图标：" class="lh50">
                    <el-upload  class="genImg" :class="{'card':isInspireCard}" action="/api/evaluation/file/upload" accept="image/*" :headers='headers' :before-upload="checkSize" :on-success="classHandleChange" :on-error="errUpload" name='files' :show-file-list="false">
                        <img v-if="classEaluationForm.icon" :src="classEaluationForm.icon" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="维度：" prop="dimensionId" v-if="relationStudent">
                    <el-cascader class="w250"  size="small" v-model="classEaluationForm.dimensionId" placeholder="请选择或搜索维度" :options="dimensionOptions" filterable :props="{ emitPath:false,checkStrictly: true,expandTrigger: 'hover',value: 'id',label: 'name',children:'dimensionItemVOList' }" clearable></el-cascader>
                </el-form-item>

                <el-form-item label="奖惩类型：" prop="rewardType" :rules="[{ required:true,message:'请选择奖惩类型', trigger: 'change' }]">
                    <el-radio v-model="classEaluationForm.rewardType" label="3">加分</el-radio>
                    <el-radio v-model="classEaluationForm.rewardType" label="4">减分</el-radio>
                </el-form-item>

                <el-form-item label="奖惩区间：" class="must" prop="rewardMin" :rules="personType1Range">
                    <el-input class="w100" size="small" maxlength="2" v-model="classEaluationForm.rewardMin"></el-input> - <el-input maxlength="2" ref="classrewardMax" v-model="classEaluationForm.rewardMax" class="w100" size="small"></el-input>
                </el-form-item>

              <el-form-item label="默认评语:" prop="commentList">
                <div v-for="(commen,index) of classEaluationForm.commentList" v-if="index<50" :key="index">
                  <el-input size="small" maxlength="50" v-model="commen.content" style="width: 300px;"></el-input>
                  <i class="delfont el-icon-close" @click="deleteComment(index,2)" ></i>
                  <!-- <el-button  type="primary" icon="el-icon-delete" circle></el-button> -->
                </div>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addComment(2)"></el-button>
              </el-form-item>

                <!-- <el-form-item label="权限组：" class="must must3" prop="classOrderGroup" :rules="personType1OrderGroup">
                    <el-select v-model="classOrderGroup[0]" placeholder="请选择">
                        <el-option label="值周教师" :value="'5'">
                        </el-option>
                    </el-select>
                    <el-select class="w250"  size="small" v-model="classOrderGroup" multiple placeholder="请选择权限组" clearable>
                        <el-option
                        v-for="item in options5"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-cascader class="w250"  size="small" ref="OrderGroup" v-model="classOrderGroup" placeholder="请选择或搜索权限组" :options="options5" filterable :props="{multiple:true, expandTrigger: 'hover' }" clearable></el-cascader>
                </el-form-item> -->

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel(classEaluationForm,'classform')">取 消</el-button>
                <el-button type="primary" :loading="submitClassLoading" @click="submitChange('classform')">确 定</el-button>
            </div>

        </el-dialog>

        <!--添加编辑惩罚项弹层-->
        <el-dialog :title="textMap[dialogStatus]+'惩罚项'" :close-on-click-modal="false" @close="punishClose" :visible.sync="dialogFormVisible3" width="600px">
            <div class="pjProjectMain">
            <el-form :model="punishmentEaluationForm" ref="punishform" :rules="personEaluationRule" label-width="100px">

                <el-form-item label="名称：" prop="name">
                    <el-input class="w300" size="small"  minlength="2" maxlength="10" v-model="punishmentEaluationForm.name"></el-input>
                </el-form-item>


                <el-form-item label="图标：" class="lh50" prop="icon">
                    <el-upload  class="genImg" :class="{'card':isInspireCard}" action="/api/evaluation/file/upload" accept="image/*" :before-upload="checkSize" :headers="headers" :on-success="punishImgHandleChange" :on-error="errUpload" name='files' :show-file-list="false">
                        <img v-if="punishmentEaluationForm.icon" :src="punishmentEaluationForm.icon" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="position: absolute;left: 60px;top: 0px;">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="惩罚类型：" prop="rewardType" :rules="[{ required:true,message:'请选择惩罚类型', trigger: 'change' }]">
                    <el-select v-model="punishmentEaluationForm.rewardType" size="small" class="selMargin" style="width:300px;" clearable>
                        <el-option v-for="item in typePunishment" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="可否抵消：" prop="isOffset" :rules="[{ required:true,message:'请选择可否抵消', trigger: 'change' }]">
                    <el-radio v-model="punishmentEaluationForm.isOffset" label="1">不可抵消</el-radio>
                    <el-radio v-model="punishmentEaluationForm.isOffset" label="2">可抵消</el-radio>
                </el-form-item>

                <el-form-item v-if="punishmentEaluationForm.isOffset=='2'" label="勋章数量：" prop="offsetNum" :rules="[{ required:true,min:1,max:999, type: 'number',message:'请输入1-999的数字', trigger: 'change' }]">
                   <el-input v-model.number="punishmentEaluationForm.offsetNum" size="small" style="width:300px;" maxlength="3"></el-input>
                </el-form-item>


                <!-- <el-form-item label="持续时间：" prop="durationType" >
                    <el-select v-model="punishmentEaluationForm.durationType" size="small" class="selMargin" style="width:120px;" clearable>
                        <el-option v-for="item in durationList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                    <el-input v-model="punishmentEaluationForm.durationTime" size="small" style="width:120px;" maxlength="2"></el-input> {{punishmentEaluationForm.durationType=='1'?'周':punishmentEaluationForm.durationType=='2'?'天':punishmentEaluationForm.durationType=='4'?'月':'年'}}
                </el-form-item> -->
                <el-form-item label="持续时间：" required>
                    <el-col :span="7">
                    <el-form-item prop="durationType">
                        <el-select v-model="punishmentEaluationForm.durationType" size="small" class="selMargin" style="width:120px;" clearable>
                            <el-option v-for="item in durationList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item prop="durationTime">
                        <el-input v-model="punishmentEaluationForm.durationTime" size="small" style="width:120px;" maxlength="2"></el-input> {{punishmentEaluationForm.durationType=='1'?'周':punishmentEaluationForm.durationType=='2'?'天':punishmentEaluationForm.durationType=='4'?'月':'年'}}
                    </el-form-item>
                    </el-col>
                </el-form-item>





            </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="cancel(personEaluationForm,'punishform')">取 消</el-button> -->
                <el-button @click="punishClose">取 消</el-button>
                <el-button type="primary" :loading="punishLoading" @click="punishSubmit('punishform')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 批量创建评价项弹层 -->
        <el-dialog title="导入数据" :close-on-click-modal="false" @close="chancelUpload" :visible.sync="dialogFormVisible4">
            <el-form :model="wdform" ref="form" label-width="100px">

                <el-form-item label="选择文件：">
                    <el-upload
                        ref="elupload"
                        :limit="1"
                        accept=".xls"
                        action="/api/evaluation/evaluationItem/enterImport"
                        :file-list="fileList"
                        :on-change="beforeAvatarUpload"
                        :before-remove="beforeRemove"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" :disabled="uploadFile!==null" type="primary">本地上传</el-button>
                    </el-upload>
                    <!-- <upload-excel-component @on-selected-file='getExcelData'></upload-excel-component> -->
                </el-form-item>

            </el-form>

           <el-row>
                导入失败数据详情：
                <el-table
                :data="errData"
                style="width: 100%;max-height: 200px;
                                    overflow-y: scroll;"
                >
                    <el-table-column prop="row" label="行号"></el-table-column>
                    <el-table-column prop="name" label="评价项名称"></el-table-column>
                    <el-table-column prop="message" label="错误信息"></el-table-column>
                </el-table>
            </el-row>

            <div class="importTips">
                <b>注意事项：</b><br>
                1.目前仅支持录入型评价项导入；<br>
                2.评价名称不能超过20个字符；<br>
                3.维度需要完整路径，如需要在乐学少年下的自主少年中设置评价项，则需要将路径“乐学少年-自主少年”填写完整；<br>
                4.奖惩类型只有四个：加分、减分、奖励勋章、扣除勋章，每个单元格内只能存在一种类型；<br>
                5.奖惩区间：最小值≤最大值，数值范围为1~99，且不支持小数点；<br>
                6.权限组：评价项支持多个权限组时，不同权限组之间使用中英文“，”隔开；<br>
                7.默认评语：非必填，存在多条时中间使用中英文“|”隔开；
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click="downloadTemplate">下载模版</el-button>
                <el-button @click="chancelUpload">取 消</el-button>
                <el-button type="primary" :loading="uploadLoading" @click="submitTemplate">提 交</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
import * as api from '@comm/api/evaluationSetting'
import * as qualityApi from '@comm/api/qualityAppraisal';
import Cookies from 'js-cookie'
import UploadExcelComponent from '@comm/components/UploadExcel/index'

export default {
    name: "setReport",
    components: {
        UploadExcelComponent
    },
    data() {
        var isvalidateInteger= (rule, value, callback) => {
            if(value != null && value != "") {
                if(!integer(value)) {
                    callback(new Error('请输入正整数!'))
                } else {
                    callback()
                }
            }
            else{
                callback();
            }
        }
        var isrewardType1= (rule, value, callback) => {
            console.log(value,295)
            if(value != null && value != "") {
                if(value!=='3'&&value!=='4'&&value!=='5'&&value!=='6'){
                    callback('请选择奖惩类型')
                } else {
                    callback();
                }
            }
            else{
                callback();
            }
        }
        var isrewardType2= (rule, value, callback) => {
            console.log(value,307)
            if(value != null && value != "") {
                if(value!=='1'&&value!=='2'){
                    callback('请选择奖惩类型')
                } else {
                    callback();
                }
            }
            else{
                callback();
            }
        }
        var isrewardRange= (rule, value, callback) => {
            var rewardMax = this.activeIndex=='1'?this.$refs.rewardMax.value:this.$refs.classrewardMax.value;
            // console.log(rewardMax)
            if(value != null && value != ""||rewardMax != null && rewardMax != "") {
                var reg =  /^[1-9]\d*$/;
                if (!reg.test(value) || !reg.test(rewardMax)) {
                    callback('请输入1-99之间的数字');
                } else if(Number(value)>Number(rewardMax)){
                    callback('奖惩区间后输入框必须大于等于前输入框');
                } else {
                    var base,max,min;
                    var pdata = this.personEaluationForm.evaluationItemRuleBenchmarkLimit
                    if(pdata.benchmark==''&&pdata.maxLimit==''&&pdata.minLimit==''){
                      callback();
                    }
                    base = pdata.benchmark!==''?parseInt(pdata.benchmark,10):0;
                    max = pdata.maxLimit!==''?parseInt(pdata.maxLimit,10):999;
                    min = pdata.minLimit!==''?parseInt(pdata.minLimit,10):-999;
                    var curmax = parseInt(rewardMax,10);
                    var curmin = parseInt(value,10);
                    if(this.personEaluationForm.rewardType=='3'||this.personEaluationForm.rewardType=='5'){
                    // 加分/奖励勋章：奖惩区间最大值<=（上限-基准分）；
                    // 没有基准分-加分/奖励勋章：奖惩区间最大值<=上限；
                        if(curmax>(max-base)||curmin>(base-min)){
                            callback('奖惩区间与基准分、上、下限有冲突')
                        }                        
                    } else if(this.personEaluationForm.rewardType=='4'||this.personEaluationForm.rewardType=='6') {
                    // 减分/扣除勋章：奖惩区间最小值<=(基准分-下限)；
                    // 没有基准分-减分/扣除勋章：奖惩区间最大值<=下限；
                        if(pdata.benchmark==''){
                            if(curmin>min){
                                callback('奖惩区间与基准分、上、下限有冲突')
                            }
                        } else if(curmin>(base-min)){
                            callback('奖惩区间与基准分、上、下限有冲突')
                        }                          
                    }
                    callback();
                }
            }
            else{
                callback('请输入奖惩区间');
            }
        }
        var isrewardFrequency= (rule, value, callback) => {
            console.log(value)
            if(value != null && value != "") {
                if(this.personEaluationForm.taskType==2){//考勤打卡只能选每周每月
                    if(value.type != '3' && value.type != '4'){
                        callback('请选择正确的频次')
                    }
                }
                if(value.count==undefined||value.type==undefined||value.count==''||value.type==''){
                    callback('请填写完整频次')
                } else {
                    var reg =  /^[1-9]\d*$/;
                    if(!reg.test(value.count)){
                        callback('请输入1-999的数字');
                    } else {
                        callback();
                    }
                }
            }
            else{
                callback('请填写完整频次');
            }
        }
        var isrewardScore= (rule, value, callback) => {
            console.log(value)
            if(value != null && value.length != 0) {
                value.forEach(v=>{
                    if(v.score==''||v.type==''){
                        callback('请填写完整分值');
                    } else {
                        var reg =  /^[1-9]\d*$/;
                        if(!reg.test(v.score)){
                            callback('请输入1-99的数字');
                        }
                    }
                })
                callback();
            }
            else{
                callback('请填写完整分值');
            }
        }
        var isrewardValid= (rule, value, callback) => {
            console.log(this.valid)
            if(this.valid != null && this.valid.length != 0) {
                callback();
            }
            else{
                callback('请选择有效期');
            }
        }
        var isrewardType= (rule, value, callback) => {
            console.log(value,672)
            if(value[0].type==1){
                if(value[0].rewardType==''){
                    callback("请选择奖励类型");
                } else if(value[0].score==''){
                    callback("请填写奖励值");
                } else {
                    var reg =  /^[1-9]\d*$/;
                    if(!reg.test(value[0].score)){
                        callback('请输入1-999的数字');
                    }
                }
            } 
            if(value[1].type==2){
                if(value[1].rewardType==''){
                    callback("请选择奖励类型");
                } else if(value[1].score==''){
                    callback("请填写奖励值");
                } else {
                    var reg =  /^[1-9]\d*$/;
                    if(!reg.test(value[1].score)){
                        callback('请输入1-999的数字');
                    }
                }                
            } 
            if(value[0].type!==1&&value[1].type!==2) {
                callback('请至少选一种奖励');
            }
            callback();
            // if(this.valid != null && this.valid.length != 0) {
                // callback();
            // }
            // else{
            //     callback('请选择有效期');
            // }
        }
        var isevaluationItem = (rule, value, callback) => {
            if(value.type==''){
                callback('请选择达成标准');
            }
            callback();
        }
        // var OrderGroup= (rule, value, callback) => {
        //     var OrderGroup =  this.activeIndex=='1'?this.orderGroup:this.classOrderGroup;
        //     console.log(OrderGroup)
        //     if(OrderGroup != null && OrderGroup.length > 0) {
        //         callback();
        //     }
        //     else{
        //         callback('请选择权限组');
        //     }
        // }
        var punishLastTime= (rule, value, callback) => {
            console.log(value,529)
            var lasttime = this.punishmentEaluationForm.durationType;
            if(lasttime != null && lasttime != '' && lasttime != undefined) {
                if(lasttime=='3'){
                    var reg =  /^[1-9]$/;
                    if(!reg.test(value)){
                        callback('请输入1-9的数字');
                    }
                } else if(lasttime == '4') {
                    var reg =  /^[1-9]$/;
                    var reg1 = /^1[0-2]$/;
                    if(!reg.test(value)&&!reg1.test(value)){
                        callback('请输入1-12的数字');
                    }
                } else {
                    var reg =  /^[1-9]\d*$/;
                    if(!reg.test(value)){
                        callback('请输入1-99的数字');
                    }
                }
                callback();
            }
            else{
                callback('请先选择持续时间');
            }
        }
        var benchmarkCheck = (rule, value, callback) => {
            var base,max,min;
            if(value.benchmark!=''){
                var reg =  /^[1-9]\d*$|^0$/;
                if(!reg.test(value.benchmark)){
                    this.advancedSetting = true;
                    callback('基准分请输入0～999的数字');
                } else {
                    base = parseInt(value.benchmark,10);
                }
            } else {
                base = 0;
            }
            if(value.maxLimit!=''){
                var reg =  /^[1-9]\d*$|^0$/;
                if(!reg.test(value.maxLimit)){
                    this.advancedSetting = true;
                    callback('上限请输入0～999的数字');
                } else {
                    max = parseInt(value.maxLimit,10);
                }
            } else {
                max = 999;
            }
            if(value.minLimit!=''){
                var reg =  /^(-)?[0-9]([0-9]{1,2})?$/;
                if(!reg.test(value.minLimit)){
                    this.advancedSetting = true;
                    callback('基准分请输入-999～999的数字');
                } else {
                    min = parseInt(value.minLimit,10);
                }
            } else {
                min = -999;
            }
            if(value.benchmark==''){
                if(min>=max){
                    this.advancedSetting = true;
                    callback('应遵守 下限<基准分<上限 的规则');
                }                
            }
            else if(!(base>min&&base<max)){
                this.advancedSetting = true;
                callback('应遵守 下限<基准分<上限 的规则');
            }
            callback();
        }
        return {
            textMap: {
                update: '编辑',
                create: '创建'
            },
            rewardTypes:['分数','勋章','加分','减分','奖励勋章','扣除勋章'],
            isInspireCard:localStorage.getItem("inspireCardSchool")=='true'?true:false,             //是否是激励卡
            dialogStatus:'',
            dialogFormVisible:false,
            type:'',//筛选类型选项
            typeOptions:[//类型选项
                {
                    value:"1",
                    label:"录入型"
                },{
                    value:"2",
                    label:"任务型"
                }
            ],
            typePunishment:[//类型选项
                {
                    value:"7",
                    label:"禁止兑换商品"
                }
            ],
            dimensionId:'',//筛选维度id
            dimensionOptions: [],//维度选项
            createUserNo:'',//筛选创建人id
            keywords: '',//筛选关键字
            activeIndex: '1',//当前选择
            options4: [{value:"4",label:"任课教师",},{value:"5",label:"值周教师",},{value:"6",label:"班主任",}],
            options5: [{value:"5",label:"值周教师",}],
            tableData: [],
            tableData1: [],
            tableData2: [],
            classEaluationForm:{},
            icon:'',
            ruleFrequency: [{value:"1",label:"仅一次"},{value:"2",label:"每天"},{value:"3",label:"每周"},{value:"4",label:"每月"},{value:'5',label:'每学期'}],
            options6: [{value:"1",label:"每次"},{value:"2",label:"全部完成"},{value:"3",label:"每次/全部完成"}],
            dialogFormVisible2:false,               //班级评价项弹层
            dialogFormVisible3:false,               //惩罚项弹层
            dialogFormVisible4:false,               //批量创建评价项弹层
            punishmentEaluationForm:{name:'',isOffset:'1',evaluationItemRuleDuration:{type:'1'}},             //惩罚项表单
            personEaluationForm: {type:'1',taskType:1},//个人评价项弹框表格
            personEaluationRule:{
                name: [{ required: true,message: '请输入评价项名称',tigger: 'blur'},{max:20,min:1,message:'请输入1-20个字符'}],
                type: [{ required:true,message:'请选择类型', trigger: 'change' }],
                taskType: [{ required:true,message:'请选择类型', trigger: 'change' }],
                dimensionId: [{ required:true,message:'请选择维度', trigger: 'change' }],
                rewardType: [{ required:true,message:'请选择奖惩类型', trigger: 'change' }],
                durationType: [{required:true,message: '请选择持续时间',tigger: 'blur'}],
                durationTime: [{required:true,validator:punishLastTime,tigger: 'change'}],
                evaluationItemRuleAttendance: [{ validator:isevaluationItem ,trigger: 'change' }],
                evaluationItemRuleBenchmarkLimit: [{ validator:benchmarkCheck ,trigger: 'change' }],
            },
            personType1Rule:[{ required:true,message:'请选择奖惩类型', trigger: 'change' },{ validator:isrewardType1 ,trigger:'change'}],
            personType1Range: [{ validator:isrewardRange ,trigger:'blur'}],
            // personType1OrderGroup: [{ validator:OrderGroup ,trigger:'blur'}],
            personType2Rule:[{ required:true,message:'请选择奖惩类型', trigger: 'change' },{ validator:isrewardType2 ,trigger:'change'}],
            personType2Frequency:[{ validator:isrewardFrequency ,trigger:'blur'}],
            personType2Score:[{ validator:isrewardScore ,trigger:'blur'}],
            personType2Valid:[{ validator:isrewardValid ,trigger:'blur'}],
            personTypeReward:[{ validator:isrewardType ,tigger:'blur'}],
            classEaluationRule:{
                name: [{ required: true,message: '请输入名称',tigger: 'blur'}],
                type: [{ required:true,message:'请选择类型', trigger: 'change' }],
                // dimensionId: [{ required:true,message:'请选择维度', trigger: 'change' }],
                rewardType: [{ required:true,message:'请选择奖惩类型', trigger: 'change' }],
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            submitLoading: false,//提交个人评价项loading
            submitClassLoading: false,//提交班级评价项loading
            punishLoading: false,//提交班级评价项loading
            relationStudent: false,//班级评价结果可以关联到学生评价中
            durationList:[{value:"1",label:"按周",},{value:"2",label:"按天",},{value:"3",label:"按年",},{value:"4",label:"按月",}],
            wdform:{},
            excelData:[],
            downloadLoading: false,//下载模板loading
            uploadLoading: false,//上传模板loading
            fileList: [],
            uploadFile: null,//要上传的文件
            errData:[],//部分数据导入失败
            advancedSetting: false, //高级设置
            quotaSetting:null,  //是否开启对应分数/勋章配额设置
            // quota: 1,
        }
    },
    computed: {
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token")}
        },
        quota:{
            get(){
                if(this.personEaluationForm.characteristicList==undefined||this.personEaluationForm.characteristicList==null){
                    return 1;
                }
                var ind = this.personEaluationForm.characteristicList.indexOf(2);
                console.log(ind,926);
                return ind>=0?2:1;
            },
            set(val){
                if(this.personEaluationForm.characteristicList==undefined||this.personEaluationForm.characteristicList==null){
                    this.$set(this.personEaluationForm,'characteristicList',[]);
                }
                var ind = this.personEaluationForm.characteristicList.indexOf(2);
                if(val==2){
                    if(ind<0){
                        this.personEaluationForm.characteristicList.push(2);
                    }
                } else {
                    if(ind>=0){
                        this.personEaluationForm.characteristicList.splice(ind,1);
                    }
                }
            }
        },
        showQuota:function() {
            // .开启条件：
            //   1.1.奖惩类型选择加分/奖励勋章时；
            //   1.2.开启对应分数/勋章配额时；
            if(this.quotaSetting==null){
                return false;
            }
            if(this.quotaSetting.medalLimit && this.personEaluationForm.rewardType=='5'){
                return true;
            }
            if(this.quotaSetting.scoreLimit && this.personEaluationForm.rewardType=='3'){
                return true;
            }
            return false;
        },
        // headersV2: function() {
        //     return {Authorization: Cookies.get("Admin-Token")}
        // },
        //有效期的计算
        valid:{
            get(){
                if(this.personEaluationForm.startTime){
                    return [this.personEaluationForm.startTime, this.personEaluationForm.endTime]
                } else {
                    return '';
                }
            },
            set(val){
                if(val!=null){
                    this.$set(this.personEaluationForm,'startTime',val[0]);
                    this.$set(this.personEaluationForm,'endTime',val[1]);
                } else {
                    this.$set(this.personEaluationForm,'startTime','');
                    this.$set(this.personEaluationForm,'endTime','');
                }
            }
        },
        //分值类型计算
        // scoreType:{
        //     get(){
        //         var len = this.personEaluationForm.evaluationItemRuleScoreList.length
        //         if(len>0){
        //             if(len>1){
        //                 return '3'
        //             } else {
        //                 return this.personEaluationForm.evaluationItemRuleScoreList[0].type+'';
        //             }
        //         } else {
        //             return '';
        //         }
        //     },
        //     set(val){
        //         if(val!='3'){
        //             this.personEaluationForm.evaluationItemRuleScoreList.splice(1);
        //             this.$set(this.personEaluationForm.evaluationItemRuleScoreList[0],'type',val);
        //         } else {
        //             if(this.personEaluationForm.evaluationItemRuleScoreList.length==1){
        //                 this.$set(this.personEaluationForm.evaluationItemRuleScoreList[0],'type','1');
        //                 this.personEaluationForm.evaluationItemRuleScoreList.push({type:'2',score:''});
        //             }
        //         }
        //     }
        // },
        //权限组计算
        orderGroup:{
            get(){
                var res = []
                if(this.personEaluationForm.evaluationItemJurisdictionList){
                    this.personEaluationForm.evaluationItemJurisdictionList.forEach((e,i) => {
                        res.push(e.type+'');
                    })
                }
                return res;
            },
            set(val){
                if(val==[]||val==null){
                    this.$set(this.personEaluationForm,'evaluationItemJurisdictionList',[])
                } else {
                    this.$set(this.personEaluationForm,'evaluationItemJurisdictionList',[])
                    val.forEach((e,i) => {
                        if(this.personEaluationForm.evaluationItemJurisdictionList[i]){
                            this.$set(this.personEaluationForm.evaluationItemJurisdictionList[i],'type',e)
                        } else {
                            this.personEaluationForm.evaluationItemJurisdictionList.push({type:e});
                        }
                    })
                }
            }
        },
        classOrderGroup:{
            get(){
                var res = []
                if(this.classEaluationForm.evaluationItemJurisdictionList){
                    this.classEaluationForm.evaluationItemJurisdictionList.forEach((e,i) => {
                        res.push(e.type+'');
                    })
                }
                return res;
            },
            set(val){
                if(val==[]||val==null){
                    this.$set(this.classEaluationForm,'evaluationItemJurisdictionList',[])
                } else {
                    this.$set(this.classEaluationForm,'evaluationItemJurisdictionList',[])
                    val.forEach((e,i) => {
                        if(this.classEaluationForm.evaluationItemJurisdictionList[i]){
                            this.$set(this.classEaluationForm.evaluationItemJurisdictionList[i],'type',e[0])
                        } else {
                            this.classEaluationForm.evaluationItemJurisdictionList.push({type:e[0]});
                        }
                    })
                }
            }
        },
    },
    watch: {
    },
    mounted(){
        this.getDimension();
        this.getEvaluation();
        this.getConfig();
        // this.init();
    },
    methods: {
    //通用
        //获取所有维度供选择
        getDimension(){
            api.getAllDimension().then(res=>{
                // var resdata = [];
                var arr = res.value
                this.checkDisable(arr);
                console.log(arr);
                this.dimensionOptions = arr
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
        //分页获取评价项
        getEvaluation(page,limit){

            var params = {
                page: page?page:this.currentPage,
                limit: limit?limit:this.pageSize,
                scope: this.type!='2'?this.activeIndex:'3',//任务型  scope 也要相应的改为3 教师布置
                type:this.type,
                dimensionId:this.dimensionId,
                createUserNo:this.createUserNo,
                keywords:this.keywords,
            }
            // if(this.activeIndex=='4'){//惩罚项列表

            // }
            this.currentPage = params.page;
            console.log(params)
            if(this.activeIndex=='2'){
                this.getSetting();
            }
            api.getEvaluationByPage(params).then(res => {
                console.log(res);
                this.total = res.value.totalCount;
                if(this.activeIndex == '1'){
                    this.tableData = res.value.dataList;
                } else if(this.activeIndex == '2'){
                    this.tableData1 = res.value.dataList;
                } else {
                    this.tableData2 = res.value.dataList;
                }

            })
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
        cancel(val,formName){
            val = {};//清空
            this.dialogFormVisible = false;//关闭弹框
            this.dialogFormVisible2 = false;//关闭弹框
            this.dialogFormVisible3 = false;//关闭弹框
            this.$refs[formName].clearValidate();//移除校验结果
            // val = {};//清空
        },
        //删除评价项
        deleteEvaluation(row){
            console.log(row)
            api.deleteEvaluation(row.id).then(res => {
                if(res.resultCode==1){
                    this.dialogFormVisible = false;//关闭弹框
                    this.$notify({
                        type: 'success',
                        message: '操作成功！',
                        time: 1000
                    })
                    //成功之后刷新
                    this.getEvaluation(1);
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage
                    })
                }
            })
        },
        //分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.currentPage  = 1;
            this.getEvaluation();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getEvaluation();
        },
        //批量导入
        bgdInput(){
            this.excelData = [];
            this.errData = [];
            this.dialogFormVisible4 = true;
        },
        //下载模板
        downloadTemplate(){
            this.downloadLoading = true;
            api.evaluationImportTemplate().then(res=>{
                const blob = new Blob([res], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                const downloadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = '录入型评价项导入模板.xls'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
                this.downloadLoading = false;
            }).catch(err => {
                this.$notify({
                    type: 'error',
                    message: "获取模板失败，请稍后重试",
                    time: 1000
                })
                this.downloadLoading = false;
            })
        },
        //上传文件
        beforeAvatarUpload(file){
            console.log(file,994)
            if(this.uploadFile==null){
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                if(testmsg!=='xls'){
                    this.$notify({
                        type: 'error',
                        message: '只能上传xls格式的文件!',
                        time: 1000
                    })
                    this.$refs['elupload'].clearFiles();
                    return false
                }
                this.uploadFile = file.raw;
            } else {
                if(file.status=='success'){
                    if (file.response.resultCode == 1) {
                        var errData = []
                        for(var v of file.response.value){
                            if(!v.success){
                                errData.push(v);
                            }
                        }
                        if ( errData.length==0 ) {
                            this.$notify({
                                type: 'success',
                                message: '导入成功！'
                            });
                            this.dialogFormVisible4 = false;
                        } else {
                            this.$notify({
                                type: 'error',
                                message: '部分数据导入失败'
                            });
                            this.errData = errData;
                        }
                        this.$refs['elupload'].clearFiles();
                        this.fileList = [];
                        this.uploadFile = null;
                        this.uploadLoading = false;
                        this.getEvaluation();
                    } else {
                        this.$notify({
                            type: 'error',
                            message: file.response.resultMessage
                        });
                        this.uploadLoading = false;
                    }
                } else if(file.status=='fail'){
                    this.$notify({
                        type: 'error',
                        message: "批量导入失败，请重试",
                        time: 1000
                    })
                    this.uploadLoading = false;
                }
                this.uploadFile = null;
            }

        },
        //删除文件
        beforeRemove(file){
            console.log(file,1002)
            this.uploadFile = null;
        },
        //取消上传
        chancelUpload(){
            this.dialogFormVisible4 = false;
            this.$refs['elupload'].clearFiles();
            this.uploadFile = null;
        },
        //提交
        submitTemplate(){
            if(this.uploadFile!=null){
                this.uploadLoading = true;
                this.$refs['elupload'].submit();
            } else {
                this.$notify({
                    type: 'error',
                    message: "请上传文件",
                    time: 1000
                })
            }
        },
    //个人评价项
        //增加或修改个人评价项
        changeEvaluationList(type,val){
            this.dialogStatus = type;
            //这里要判断是增加还是修改
            if(type=='create'){
                if(this.$refs.form){
                    this.$refs.form.clearValidate();
                }
                //基准分上下限默认关闭
                this.advancedSetting = false;
                //新增--弹框里的内容要清空
                this.personEaluationForm = {
                    type:'1',
                    scope:'1',
                    defaultReward :'2',
                    evaluationItemRuleFrequency:{type: '3'},
                    evaluationItemRuleScoreList:[{rewardType:1,score:'',type:null},{rewardType:1,score:'',type:null}],
                    evaluationItemJurisdictionList: [],
                    evaluationItemRuleAttendance: {type: 1},
                    evaluationItemRuleBenchmarkLimit: {benchmark: '',maxLimit: '',minLimit: ''},
                    commentList: [],
                    rewardType:'0',
                    taskType: 1,
                }
            } else {
                //基准分上下限默认关闭
                this.advancedSetting = false;
                //修改--要先获取详细的评价项然后再显示
                api.getEvaluation(val.id).then(res => {
                    console.log(res);
                    this.personEaluationForm = res.value;
                    this.personEaluationForm.dimensionId += '';
                    this.personEaluationForm.type += '';
                    this.personEaluationForm.rewardType += '';
                    if(this.personEaluationForm.commentList==undefined||this.personEaluationForm.commentList==[]){
                        this.$set(this.personEaluationForm,'commentList',[{content: ''}])
                    }
                    if(!this.personEaluationForm.evaluationItemRuleFrequency){
                        this.personEaluationForm.evaluationItemRuleFrequency = {type: ''}
                    } else {
                        this.personEaluationForm.evaluationItemRuleFrequency.type+=''
                    }
                    if(!this.personEaluationForm.evaluationItemRuleBenchmarkLimit){
                        this.$set(this.personEaluationForm,'evaluationItemRuleBenchmarkLimit',{benchmark: '',maxLimit: '',minLimit: ''});
                    }
         
                    // if(!this.personEaluationForm.evaluationItemRuleScoreList||this.personEaluationForm.evaluationItemRuleScoreList.length==0){
                    //     this.personEaluationForm.evaluationItemRuleScoreList = [{type:'',score:''}]
                    // } else {
                    //     this.personEaluationForm.evaluationItemRuleScoreList.type+=''
                    // }
                    if(this.personEaluationForm.type==1){
                        this.personEaluationForm.evaluationItemRuleScoreList.push({rewardType:'',score:'',type:null});
                        this.personEaluationForm.evaluationItemRuleScoreList.push({rewardType:'',score:'',type:null});
                    }
                    if(this.personEaluationForm.evaluationItemRuleScoreList.length<2){
                        if(this.personEaluationForm.evaluationItemRuleScoreList[0].type==1){
                            this.personEaluationForm.evaluationItemRuleScoreList.push({rewardType:'',score:'',type:null});
                        } else {
                            this.personEaluationForm.evaluationItemRuleScoreList.unshift({rewardType:'',score:'',type:null});
                        }
                    }       })
            }
            this.dialogFormVisible = true;

        },
        //上传图片成功
        handleChange(response,file, fileList){
            console.log(response);
            this.$set(this.personEaluationForm,'icon',response.value[0].absolutePath);
            this.$set(this.personEaluationForm,'iconFileInfo',response.value[0]);
        },
        //提交添加或者修改个人评价项
        submit(formName){

            if(this.personEaluationForm.icon==''||this.personEaluationForm.icon==undefined||this.personEaluationForm.icon==null || this.personEaluationForm.icon.indexOf('theme')!=-1){
                console.log(this.personEaluationForm.rewardType,883322)
                if(this.personEaluationForm.rewardType=='1'||this.personEaluationForm.rewardType=='3'){
                    this.personEaluationForm.icon = 'http://oa.91118.com:8082/theme/skin_default/per_add_appraisal_score' + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'') + '.png'
                }
                if(this.personEaluationForm.rewardType=='2'||this.personEaluationForm.rewardType=='5'){
                    this.personEaluationForm.icon = 'http://oa.91118.com:8082/theme/skin_default/per_add_appraisal_coin' + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'') + '.png'
                }

                if(this.personEaluationForm.rewardType=='4'){
                    this.personEaluationForm.icon = 'http://oa.91118.com:8082/theme/skin_default/per_minus_appraisal_score' + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'') + '.png'
                }
                if(this.personEaluationForm.rewardType=='6'){
                    this.personEaluationForm.icon = 'http://oa.91118.com:8082/theme/skin_default/per_minus_appraisal_coin' + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'') + '.png'
                }



                // this.editMetalForm.icon = 'http://oa.91118.com:8082/theme/skin_default/icon_Lv'+ this.editMetalForm.level + ((localStorage.getItem("inspireCardSchool")=='true')?'_card':'')+'.png';
                // this.$notify({
                //     type: 'error',
                //     message: '请上传通用图标'
                // })
                // return

            }


            //这里应该判断是否有必填项未填
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证通过
                    this.submitLoading = true;
                    var evaluationItemPost = JSON.parse(JSON.stringify(this.personEaluationForm))//评价项提交内容副本
                    //这里应该判断是添加还是修改
                    console.log(this.personEaluationForm,472)
                    if(this.dialogStatus=='create'){

                        if(evaluationItemPost.type == '2'){//任务型评价项奖惩类型为99;
                            // this.personEaluationForm.rewardMin =0;
                            // this.personEaluationForm.rewardMax =0;
                            evaluationItemPost.rewardType= 99;
                            //预处理任务型评价项的奖励
                            if(!evaluationItemPost.evaluationItemRuleScoreList[0].type){
                                evaluationItemPost.evaluationItemRuleScoreList.shift();
                            } else if(!evaluationItemPost.evaluationItemRuleScoreList[1].type){
                                evaluationItemPost.evaluationItemRuleScoreList.pop();
                            }
                            //考勤任务没有图片
                            if(evaluationItemPost.taskType==2){
                              evaluationItemPost.icon = null;
                              evaluationItemPost.iconFileInfo = null;
                            }
                            
                            evaluationItemPost.evaluationItemRuleBenchmarkLimit = null;
                        }else {
                            evaluationItemPost.evaluationItemRuleFrequency = null;
                            evaluationItemPost.evaluationItemRuleScoreList = null;
                            evaluationItemPost.evaluationItemRuleAttendance = null;
                            // 提交时验证评语默认值是否为奖惩区间内数值
                            let commentList = evaluationItemPost.commentList,
                                rewardMin = parseInt(evaluationItemPost.rewardMin),
                                rewardMax = parseInt(evaluationItemPost.rewardMax);

                            if(commentList.length > 0) {
                              for(let i=0;i<commentList.length;i++){
                                let defaultReward = parseInt(commentList[i].defaultReward);
                                if(defaultReward < rewardMin || defaultReward > rewardMax) {
                                  this.$notify({
                                    type: 'error',
                                    message: `第${i+1}个评语的默认值不在奖惩区间内`
                                  })
                                  this.submitLoading = false;
                                  return;
                                }
                              }
                            }
                            let checkNull = evaluationItemPost.evaluationItemRuleBenchmarkLimit
                            if(checkNull.benchmark==''&&checkNull.maxLimit==''&&checkNull.minLimit==''){
                                evaluationItemPost.evaluationItemRuleBenchmarkLimit = null;
                            } else {
                              evaluationItemPost.evaluationItemRuleBenchmarkLimit.benchmark = parseInt(checkNull.benchmark,10);
                              evaluationItemPost.evaluationItemRuleBenchmarkLimit.maxLimit = parseInt(checkNull.maxLimit,10);
                              evaluationItemPost.evaluationItemRuleBenchmarkLimit.minLimit = parseInt(checkNull.minLimit,10);
                            }
                        }
                        //提交添加
                        api.addEvaluation(evaluationItemPost).then(res => {
                            if(res.resultCode==1){
                                this.dialogFormVisible = false;//关闭弹框
                                this.$notify({
                                    type: 'success',
                                    message: '操作成功！',
                                    time: 1000
                                })
                                //成功之后刷新
                                this.getEvaluation();
                                this.submitLoading = false;
                            } else {
                                this.$notify({
                                    type: 'error',
                                    message: res.resultMessage
                                })
                                // if(this.personEaluationForm.type == '1'){
                                //     this.personEaluationForm.evaluationItemRuleFrequency = {type:''}
                                //     this.personEaluationForm.evaluationItemRuleScoreList = [{rewardType:'',score:'',type:null},{rewardType:'',score:'',type:null}]
                                // }
                                this.submitLoading = false;
                            }
                        }).catch(e=>{
                            this.$notify({
                                type: 'error',
                                message: '网络异常，请检查网络后重试'
                            })
                            // if(this.personEaluationForm.type == '1'){
                            //     this.personEaluationForm.evaluationItemRuleFrequency = {type:''}
                            //     this.personEaluationForm.evaluationItemRuleScoreList = JSON.parse(JSON.stringify(evaluationItemRuleScoreList))
                            // }
                            this.submitLoading = false;
                        })
                    } else {
                        if(evaluationItemPost.type == '1'){//录入型评价项
                            evaluationItemPost.evaluationItemRuleFrequency = null;
                            evaluationItemPost.evaluationItemRuleScoreList = null;
                            evaluationItemPost.evaluationItemRuleAttendance = null;
                            let checkNull = evaluationItemPost.evaluationItemRuleBenchmarkLimit
                            if(!checkNull.id&&checkNull.benchmark==''&&checkNull.maxLimit==''&&checkNull.minLimit==''){
                                evaluationItemPost.evaluationItemRuleBenchmarkLimit = null;
                            } else {
                              evaluationItemPost.evaluationItemRuleBenchmarkLimit.benchmark = parseInt(checkNull.benchmark,10);
                              evaluationItemPost.evaluationItemRuleBenchmarkLimit.maxLimit = parseInt(checkNull.maxLimit,10);
                              evaluationItemPost.evaluationItemRuleBenchmarkLimit.minLimit = parseInt(checkNull.minLimit,10);
                            }
                        } else {
                            //预处理任务型评价项的奖励
                            if(!evaluationItemPost.evaluationItemRuleScoreList[0].type){
                                evaluationItemPost.evaluationItemRuleScoreList.shift();
                            } else if(!evaluationItemPost.evaluationItemRuleScoreList[1].type){
                                evaluationItemPost.evaluationItemRuleScoreList.pop();
                            }
                            //考勤任务没有图片
                            if(evaluationItemPost.taskType==2){
                              evaluationItemPost.icon = null;
                              evaluationItemPost.iconFileInfo = null;
                            }
                            evaluationItemPost.evaluationItemRuleBenchmarkLimit = null;
                        }
                        api.updateEvaluation(evaluationItemPost).then(res => {
                            if(res.resultCode==1){
                                this.dialogFormVisible = false;//关闭弹框
                                this.$notify({
                                    type: 'success',
                                    message: '操作成功！',
                                    time: 1000
                                })
                                //成功之后刷新
                                this.getEvaluation();
                                this.submitLoading = false;
                            } else {
                                this.$notify({
                                    type: 'error',
                                    message: res.resultMessage
                                })
                                // if(this.personEaluationForm.type == '1'){
                                //     this.personEaluationForm.evaluationItemRuleFrequency = {type:''}
                                //     this.personEaluationForm.evaluationItemRuleScoreList = [{rewardType:'',score:'',type:null},{rewardType:'',score:'',type:null}]
                                // }
                                this.submitLoading = false;
                            }
                        }).catch(e=>{
                            this.$notify({
                                type: 'error',
                                message: '网络异常，请检查网络后重试'
                            })
                            // if(this.personEaluationForm.type == '1'){
                            //     this.personEaluationForm.evaluationItemRuleFrequency = {type:''}
                            //     this.personEaluationForm.evaluationItemRuleScoreList = JSON.parse(JSON.stringify(evaluationItemRuleScoreList))
                            // }
                            this.submitLoading = false;
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        //修改频次
        changeFrequency(val){
            if(val == 1){
                this.$set(this.personEaluationForm.evaluationItemRuleFrequency,'count',1)
            }
        },
        //增加评语 type 1,个人评价项，2,班级评价项
        addComment(type){
            if(type == 1) {
              this.personEaluationForm.commentList.push({content: '',defaultReward: ''});
            }else {
              this.classEaluationForm.commentList.push({content: '',defaultReward: ''});
            }
        },
        //删除评语type 1,个人评价项，2,班级评价项
        deleteComment(ind,type){
            if(type == 1) {
              this.personEaluationForm.commentList.splice(ind,1);
            } else {
              this.classEaluationForm.commentList.splice(ind,1);
            }
        },
        // 设置评语默认值 form='personEaluationForm',个人评价项，form='classEaluationForm',班级评价项
      _inputCommnetNum(key,form) {
          let _target = this[form];
          // 限制输入数字
          _target.commentList[key].defaultReward = _target.commentList[key].defaultReward.replace(/[^\d]/g,'');

          // 默认值为奖惩区间内数值
          let defaultReward = _target.commentList[key].defaultReward,
              rewardMin = _target.rewardMin,
              rewardMax = _target.rewardMax;

          if(defaultReward) {
            if(parseInt(defaultReward) < parseInt(rewardMin)) {
              _target.commentList[key].defaultReward = _target.rewardMin;
            }
            if(parseInt(defaultReward) > parseInt(rewardMax)) {
              _target.commentList[key].defaultReward = _target.rewardMax;
            }
          }
        },
        //获取全局配置
        async getConfig(){
            var res = await qualityApi.getConfig()
            var allConfig = res.value;
            this.quotaSetting = {
                medalLimit: allConfig.medalLimit,
                scoreLimit: allConfig.scoreLimit
            }
        },
    //班级评价项
        //提交新增或修改班级评价项
        submitChange(formName){

            if(this.classEaluationForm.icon==''||this.classEaluationForm.icon==undefined||this.classEaluationForm.icon==null || this.classEaluationForm.icon.indexOf('theme')!=-1){
                console.log(this.classEaluationForm.rewardType,997744)
                if(this.classEaluationForm.rewardType=='3'){
                    this.classEaluationForm.icon = 'http://oa.91118.com:8082/theme/skin_default/class_add_appraisal_score.png'
                }
                if(this.classEaluationForm.rewardType=='4'){
                    this.classEaluationForm.icon = 'http://oa.91118.com:8082/theme/skin_default/class_minus_appraisal_score.png'
                }
            }


            //这里应该判断是否有必填项未填
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证通过
                    this.submitClassLoading = true;
                    //这里应该判断是添加还是修改
                    console.log(this.classEaluationForm,472)
                    if(this.dialogStatus=='create'){

                        //提交添加
                        api.addEvaluation(this.classEaluationForm).then(res => {
                            if(res.resultCode==1){
                                this.dialogFormVisible2 = false;//关闭弹框
                                this.$notify({
                                    type: 'success',
                                    message: '操作成功！',
                                    time: 1000
                                })
                                //成功之后刷新
                                this.getEvaluation();
                                this.submitClassLoading = false;
                            } else {
                                this.$notify({
                                    type: 'error',
                                    message: res.resultMessage
                                })
                                this.submitClassLoading = false;
                            }
                        }).catch(e=>{
                            this.$notify({
                                type: 'error',
                                message: '网络异常，请检查网络后重试'
                            })
                            this.submitClassLoading = false;
                        })
                    } else {
                        console.log(this.classEaluationForm,88888)
                        api.updateEvaluation(this.classEaluationForm).then(res => {
                            if(res.resultCode==1){
                                this.dialogFormVisible2 = false;//关闭弹框
                                this.$notify({
                                    type: 'success',
                                    message: '操作成功！',
                                    time: 1000
                                })
                                //成功之后刷新
                                this.getEvaluation();
                                this.submitClassLoading = false;
                            } else {
                                this.$notify({
                                    type: 'error',
                                    message: res.resultMessage
                                })
                                this.submitClassLoading = false;
                            }
                        }).catch(e=>{
                            this.$notify({
                                type: 'error',
                                message: '网络异常，请检查网络后重试'
                            })
                            this.submitClassLoading = false;
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            }).catch(err=>{
                console.log(err,1516);
            });

        },
        classHandleChange(response,file, fileList){
            console.log(response);
            this.$set(this.classEaluationForm,'icon',response.value[0].absolutePath);
            this.$set(this.classEaluationForm,'iconFileInfo',response.value[0]);
        },
        //增加、修改班级评价项
        editClassPjList(type,val){
            this.dialogStatus = type;
            if(type=='create'){
                if(this.$refs.classform){
                    this.$refs.classform.clearValidate();
                }
                this.classEaluationForm = {
                    scope:'2',
                    type: '1',
                    defaultReward : '1',
                    evaluationItemJurisdictionList: [],
                    commentList: []
                }
            } else {
                //修改--要先获取详细的评价项然后再显示
                api.getEvaluation(val.id).then(res => {
                    console.log(res);
                    this.classEaluationForm = res.value;
                    this.classEaluationForm.dimensionId?(this.classEaluationForm.dimensionId += ''):null;
                    // this.classEaluationForm.dimensionId += '';
                    this.classEaluationForm.type += '';
                    this.classEaluationForm.rewardType += '';

                })
            }
            this.dialogFormVisible2 = true;

        },
        //获取全局配置
        getSetting(){
            api.getConfig().then(res=>{
                this.relationStudent= res.value.relationStudent
            })
        },
    //惩罚项
        /**
         * 新增惩罚项
         * by:RayJ
         * time:2019-09-11
         */
        punishmentEvaluationList(type,val){
            this.dialogStatus = type;
            if(type=='create'){
                if(this.$refs.punishform){
                    this.$refs.punishform.clearValidate();
                }
                //新增--弹框里的内容要清空
                this.punishmentEaluationForm = {name:'',isOffset:'1',evaluationItemRuleDuration:{type:'1'},durationType: '4'}//默认按月
            } else {
                //修改--
                this.$set(this.punishmentEaluationForm,'scope','4');
                this.$set(this.punishmentEaluationForm,'type','3');
                this.$set(this.punishmentEaluationForm,'name',val.name);
                this.$set(this.punishmentEaluationForm,'icon',val.icon);
                this.$set(this.punishmentEaluationForm,'id',val.id);
                this.$set(this.punishmentEaluationForm,'iconFileInfo',val.iconFileInfo);
                this.$set(this.punishmentEaluationForm,'rewardType',val.rewardType+'');
                this.$set(this.punishmentEaluationForm,'durationType',val.evaluationItemRuleDuration.type+'');
                this.$set(this.punishmentEaluationForm,'durationTime',val.evaluationItemRuleDuration.duration);
                this.$set(this.punishmentEaluationForm,'evaluationItemRuleDuration',val.evaluationItemRuleDuration);
                this.$set(this.punishmentEaluationForm,'evaluationItemRuleMedalOffset',val.evaluationItemRuleMedalOffset);
                this.$set(this.punishmentEaluationForm,'isOffset',val.evaluationItemRuleMedalOffset==null?'1':'2');
                if(this.punishmentEaluationForm.isOffset=='2'){
                    this.$set(this.punishmentEaluationForm,'offsetNum',val.evaluationItemRuleMedalOffset.number);
                }
            }
            this.dialogFormVisible3 = true;
        },
        //惩罚项图片
        punishImgHandleChange(response,file, fileList){
            console.log(response);
            this.$set(this.punishmentEaluationForm,'icon',response.value[0].absolutePath);
            this.$set(this.punishmentEaluationForm,'iconFileInfo',response.value[0]);
        },
        //提交惩罚项
        punishSubmit(formName){
            //这里应该判断是否有必填项未填
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.punishmentEaluationForm.icon==''||this.punishmentEaluationForm.icon==null){
                        this.$notify({
                            type: 'error',
                            message: '请上传惩罚项图标！'
                        })
                        return
                    }
                    //验证通过
                    this.punishLoading = true;
                    //这里应该判断是添加还是修改
                    // console.log(this.personEaluationForm,472)
                    if(this.dialogStatus=='create'){

                        if(this.punishmentEaluationForm.isOffset == '1'){//不可抵消
                            this.punishmentEaluationForm.evaluationItemRuleMedalOffset = null;
                        }else { //可用勋章抵消
                            this.punishmentEaluationForm.evaluationItemRuleMedalOffset = {number:this.punishmentEaluationForm.offsetNum};//设置勋章数量
                        }
                        //设置持续时间
                        this.$set(this.punishmentEaluationForm,'evaluationItemRuleDuration',{type:this.punishmentEaluationForm.durationType,duration:this.punishmentEaluationForm.durationTime})
                        //设置类型为惩罚项
                        this.$set(this.punishmentEaluationForm,'scope','4');
                        this.$set(this.punishmentEaluationForm,'type','3');
                        //提交添加
                        api.addEvaluation(this.punishmentEaluationForm).then(res => {
                            if(res.resultCode==1){
                                this.dialogFormVisible3 = false;//关闭弹框
                                this.$notify({
                                    type: 'success',
                                    message: '操作成功！',
                                    time: 1000
                                })
                                //成功之后刷新
                                this.getEvaluation();
                                this.punishLoading = false;
                            } else {
                                this.$notify({
                                    type: 'error',
                                    message: res.resultMessage
                                })
                                this.punishLoading = false;
                            }
                        }).catch(e=>{
                            this.$notify({
                                type: 'error',
                                message: '网络异常，请检查网络后重试'
                            })
                            this.punishLoading = false;
                        })
                    } else {
                        if(this.punishmentEaluationForm.isOffset == '1'){//不可抵消
                            this.punishmentEaluationForm.evaluationItemRuleMedalOffset = null;
                        }else { //可用勋章抵消
                            if(this.punishmentEaluationForm.evaluationItemRuleMedalOffset==null){
                                this.punishmentEaluationForm.evaluationItemRuleMedalOffset = {}
                            }
                            this.$set(this.punishmentEaluationForm.evaluationItemRuleMedalOffset,'number',this.punishmentEaluationForm.offsetNum);//设置勋章数量
                        }
                        //设置持续时间
                        this.$set(this.punishmentEaluationForm,'evaluationItemRuleDuration',{type:this.punishmentEaluationForm.durationType,duration:this.punishmentEaluationForm.durationTime})
                        console.log(this.punishmentEaluationForm,1198);
                        api.updateEvaluation(this.punishmentEaluationForm).then(res => {
                            if(res.resultCode==1){
                                this.dialogFormVisible3 = false;//关闭弹框
                                this.$notify({
                                    type: 'success',
                                    message: '操作成功！',
                                    time: 1000
                                })
                                //成功之后刷新
                                this.getEvaluation();
                                this.punishLoading = false;
                            } else {
                                this.$notify({
                                    type: 'error',
                                    message: res.resultMessage
                                })
                                this.punishLoading = false;
                            }
                        }).catch(e=>{
                            this.$notify({
                                type: 'error',
                                message: '网络异常，请检查网络后重试'
                            })
                            this.punishLoading = false;
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //取消惩罚项
        punishClose(){
            this.dialogFormVisible3 = false;
            this.punishmentEaluationForm = {name:'',isOffset:'1',evaluationItemRuleDuration:{type:'1'},durationType: '4'}//默认按月
            this.$refs.punishform.clearValidate();
        }
        // //当惩罚时间修改时验证输入的时间
        // checkdurationTime(){
        //     // this.$refs.punishform.validateField('durationTime')
        // }
    }
}
</script>

<style scoped lang="scss">

.sliderRight-enter-active {
    animation-name: fadeInRight;
    animation-duration: .5s;
}

// .sliderRight-leave-active {
//     animation-name: fadeOutRight;
//     animation-duration: .5s;
// }
.cb{
    clear: both;
    display: inline-block;
    margin-top: 15px;
}
.fl{
    float: left;
}
.displayLine{
    display: inline-block;
}
.lh50{
    /deep/ .el-form-item__label{
        line-height: 50px;
    }
}
.genImg{
    height: 50px;
}
.genImg /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 25px;
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
    border-radius: inherit;
}
.genImg.card .avatar{
    width: 100%;
    height: 100%;
    display: block;
}
.greybg{
    background: #eee;
    padding: 10px 0;    
    width: 400px;
}
.w60{
    width: 60px;
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
.selMargin{
    margin-right: 15px;
}
.filter-container.innerTab{
    line-height: 0px;
    padding: 0 20px;
    padding-bottom: 15px;
    min-height: auto;
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
        border-radius: 0;
        padding: 2px 0;
    }
}
.pjProjectMain{
    // height: 490px;
    position: relative;
    .pjSubCol{
        position: relative;
        top: 0;
    }
}

.delfont{
    color: #E33939;
    margin: 0 8px;
    cursor: pointer;
}
.must{
    position: relative;
}
.must::before{
    content: '*';
    color: #E33939;
    position: absolute;
    left: 8px;
    top: 10px;
}
.must2::before{
    left: 36px;
}
.must3::before{
    left: 24px;
}

.importTips{
    padding-top: 10px;
    border-top: 1px dotted #d8d8d8;
    color: #888;
    line-height: 24px;
    font-size: 12px;
}
.tip{
    color: red;
}
.greytip{
    line-height: 20px;
    color: gray;
}
</style>
<style>
.greybg .el-input .el-input__inner{
    background: #fff;
}
</style>