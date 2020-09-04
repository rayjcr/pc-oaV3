<template>
  <div class="app-container calendar-list-container">

    <div class="u_TableMain block ofhide">

      <div class="configureTit">
        评价结果设置
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch v-model="relationClass" @change="changeStatus('relationClass')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">学生评价结果汇总到班级评价中（仅限分数）</div>
        </div>
        <div class="configCol">
          <el-switch v-model="relationStudent" @change="changeStatus('relationStudent')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">班级评价结果可以关联到学生评价中</div>
        </div>
        <div class="configCol">
          <el-switch v-model="sendSms" @change="changeStatus('sendSms')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">产生班级评价时短信提醒班主任</div>
        </div>
        <div class="configCol">
          <el-switch v-model="audit" @change="changeStatus('audit')" active-color="#13ce66" inactive-color="#909399">
          </el-switch>
          <div class="configSet">教师评价后直接审核通过</div>
        </div>
      </div>

      <div class="configureTit">
        消息推送
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch
            active-color="#13ce66"
            inactive-color="#909399"
            v-if="dictConfig"
            v-model="dictConfig.pushResultToParents.enable"
            @change="changePushResultToParents"
          ></el-switch>
          <div class="configSet">
            评价结果和提醒推送到家长端
            <el-button
              type="primary"
              class="ml10"
              size="small"
              v-if="dictConfig && dictConfig.pushResultToParents.enable"
              @click="saveDictConfig('pushResultToParents')"
            >保存设置
            </el-button>
          </div>
          <div class="configContent" v-if="dictConfig && dictConfig.pushResultToParents.enable">
            <div class="configCol subCfg">
              <div class="configSet">推送方式</div>
            </div>
            <div class="configCol subCfg">
              <div class="configSet" v-if="dictConfig">
                <el-checkbox
                  v-for="(item,index) in dictConfig.pushResultToParents.channelList"
                  :key="index"
                  v-model="item.checked"
                  :disabled="item.disable"
                >{{item.lable}}
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="configureTit">
        教师评价设置
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch v-model="notifyClassTeacher" @change="changeStatus('notifyClassTeacher');" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">
            教师
            <el-select class="w90" size="small" v-model="classTeacherNotifyConfig.period" placeholder="请选择">
              <el-option v-if="item.value!='3'&&item.value!='4'" v-for="item in period" :key="item.value"
                         :label="item.label" :value="item.value"></el-option>
            </el-select>
            进行最低评价次数考核，未达到的在
            <el-cascader class="w150" size="small" v-model="classTeacherNotifyConfig.selTime" placeholder="请选择时间"
                         :options="classTeacherNotifyConfig.period==1?weekCasCader:dayCasCader"
                         :props="{expandTrigger: 'hover'}" clearable></el-cascader>
            进行短信提醒。
            <el-button type="primary" class="ml10" size="small" @click="saveNotifyConfig(1)">保存设置</el-button>
          </div>
          <div class="configContent">
            <div class="configCol subCfg" v-if="notifyClassTeacher">
              <div class="configSet">
                班主任评价次数需达到
                <el-input size="small" v-model="classTeacherNotifyConfig.count" class="w90 bgwhite" placeholder="请输入"
                          maxlength="2"></el-input>
                次
              </div>
            </div>
            <div class="configCol subCfg" v-if="notifyClassTeacher">
              <div class="configSet">
                任课教师评价次数需达到
                <el-input size="small" v-model="CourseTeacherNotifyConfig.count" class="w90 bgwhite" placeholder="请输入"
                          maxlength="2"></el-input>
                次
              </div>
            </div>
          </div>

        </div>
        <!-- <div class="configCol">
            <el-switch v-model="notifyCourseTeacher" @change="changeStatus('notifyCourseTeacher')" active-color="#13ce66" inactive-color="#909399">
            </el-switch> <div class="configSet">
                任课教师
                <el-select class="w90"  size="small" v-model="CourseTeacherNotifyConfig.period" placeholder="请选择">
                    <el-option v-if="item.value!='3'" v-for="item in period" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                评价次数需达到
                <el-input size="small" v-model="CourseTeacherNotifyConfig.count" class="w90" placeholder="请输入" maxlength="2"></el-input>
                次，未达到的在
                <el-cascader class="w150" size="small" v-model="CourseTeacherNotifyConfig.selTime" placeholder="请选择时间" :options="CourseTeacherNotifyConfig.period==1?weekCasCader:dayCasCader" :props="{expandTrigger: 'hover'}" clearable></el-cascader>
                进行短信提醒。
                <el-button type="primary" class="ml10" size="small" @click="saveNotifyConfig(2)">保存设置</el-button>
            </div>
        </div> -->
        <div class="configCol">
          每个班级
          <el-select class="w90" size="small" v-model="medalTeacherData.validityPeriod" placeholder="请选择">
            <el-option label="学年" :value="1"></el-option>
            <el-option label="学期" :value="2"></el-option>
          </el-select>
          <!--设置班主任和任课教师发放一级勋章数量。-->
          设置班主任和任课教师分数/勋章发放。
          <el-button type="primary" class="ml10" size="small" v-if="!numConfig" @click="setMedalConfig(1)">打开设置
          </el-button>
          <!-- <el-button class="ml10" size="small" type="primary" v-else @click="saveMedalSet">保存设置</el-button> -->

        </div>
        <div class="configCol" v-if="numConfig">
          <div class="numConfigMain configContent">
            <!--@tab-click="handleClickTab"-->
            <el-tabs v-model="medalAllotScope" type="card" >
              <el-tab-pane label="勋章" name="1">
                <div class="configSet">
                  <el-switch v-model="medalLimit" @change="changeStatus('medalLimit')" active-color="#13ce66"
                             inactive-color="#909399"></el-switch>
                  开启后未设置数量的教师将无法发放勋章
                  <el-button type="text"  @click="showLast">查看剩余额度</el-button>
                </div>
                <div class="configureTit">
                  基础设置
                </div>
                <div class="configCol subCfg">
                  <div class="configSet">
                    学年/学期内
                    <el-select v-model="medalTeacherData.triggerPeriod" class="w90 bgwhite" size="small"
                               placeholder="请选择">
                      <el-option v-for="item in period" :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                    配置发放数量
                  </div>
                </div>
                <div class="configCol subCfg">
                  <div class="configSet">
                    <el-switch v-model="medalTeacherData.additivity" active-color="#13ce66"
                               inactive-color="#909399"></el-switch>
                    未使用完的勋章累计到下个周期
                  </div>
                </div>
                <div class="configCol subCfg">
                  <div class="configSet">
                    <el-switch v-model="medalTeacherData.teacherScoreLimit" active-color="#13ce66"
                               inactive-color="#909399"></el-switch>
                    教师评分扣除勋章配额
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="分数" name="2">
                <div class="configSet">
                  <el-switch v-model="scoreLimit" @change="changeStatus('scoreLimit')" active-color="#13ce66"
                             inactive-color="#909399"></el-switch>
                  开启后未设置数量的教师将无法发放分数
                  <el-button type="text" @click="showLast">查看剩余额度</el-button>
                </div>
                <div class="configureTit">
                  基础设置
                </div>
                <div class="configCol subCfg">
                  <div class="configSet">
                    学年/学期内
                    <el-select v-model="medalTeacherData.triggerPeriod" class="w90 bgwhite" size="small"
                               placeholder="请选择">
                      <el-option v-for="item in period" :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                    配置发放数量
                  </div>
                </div>
                <div class="configCol subCfg">
                  <div class="configSet">
                    <el-switch v-model="medalTeacherData.additivity" active-color="#13ce66"
                               inactive-color="#909399"></el-switch>
                    未使用完的分数累计到下个周期
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>

            <div class="configureTit">
              发放设置
            </div>
            <div class="configCol subCfg">
              <div class="configSet">
                <el-radio-group @change="batNum=0" v-model="medalTeacherData.type">
                  <el-radio :label="1">设置统一数量</el-radio>
                  <el-radio :label="2">按教师设置数量</el-radio>
                  <el-radio :label="3">按维度设置数量</el-radio>
                </el-radio-group>
              </div>
            </div>
            <!-- 设置统一数量 -->
            <div class="configCol subCfg" v-if="medalTeacherData.type==1">
              <div class="configSet">
                统一设置为
                <el-input size="small" v-model="medalTeacherData.allTypeList.count" class="w90 bgwhite"
                          placeholder="请输入" maxlength="3"></el-input>
                {{medalAllotScope == 1 ? '枚' : '分'}}
              </div>
            </div>
            <!-- 按教师设置数量 -->
            <div class="configCol subCfg" v-if="medalTeacherData.type==2">
              <div class="batConfig">
                批量设置为
                <el-input size="small" class="w90 bgwhite"
                          onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));" v-model="batNum" maxlength="3"
                          @blur="changeBatNum"></el-input>
                {{medalAllotScope == 1 ? '枚' : '分'}}
              </div>
              <el-table class="tableBorder" style="margin-left:20px;width:98%"
                        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                        :data="medalTeacherData.teacherTypeList ">
                <el-table-column label="教师" prop="subjectName">
                </el-table-column>
                <el-table-column :label="medalAllotScope == 1 ? '勋章' : '分数'" prop="cardList">
                  <template slot-scope="scope">
                    <el-input class="w90 bgwhite" onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));"
                              v-model="scope.row.cardList[0].count" maxlength="3" size="small"></el-input>
                    {{medalAllotScope == 1 ? '枚' : '分'}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 按勋章设置数量 -->
            <div class="configCol subCfg" v-if="medalTeacherData.type==3">
              <div class="batConfig">
                批量设置为
                <el-input size="small" class="w90 bgwhite"
                          onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));" v-model="batNum" maxlength="3"
                          @blur="changeBatNum"></el-input>
                {{medalAllotScope == 1 ? '枚' : '分'}}
              </div>
              <el-table class="tableBorder" style="margin-left:20px;width:98%"
                        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                        :data="medalTeacherData.medalTypeList">
                <el-table-column label="教师" prop="subjectName">
                </el-table-column>

                <el-table-column v-for="(medal,index) of medalTeacherData.medalTypeList[0].cardList" :key="index"
                                 :label="medal.medalDimensionName " prop="cardList">
                  <template slot-scope="scope">
                    <el-input class="w90 bgwhite" onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));"
                              v-model="scope.row.cardList[index].count" maxlength="3" size="small"></el-input>
                    {{medalAllotScope == 1 ? '枚' : '分'}}
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- <div class="batConfig">
                批量设置为 <el-input size="small" class="w90" onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));" v-model="batNum" maxlength="3" @blur="changeBatNum"></el-input> 枚</div>
            <el-table class="tableBorder" :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="medalTeacherData">
                <el-table-column label="教师" prop="subjectName">
                </el-table-column>
                <el-table-column label="勋章" prop="count">
                    <template slot-scope="scope">
                        <el-input class="w90" onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));" v-model="scope.row.count" maxlength="3" size="small"></el-input> 枚
                    </template>
                </el-table-column>
            </el-table>     -->


            <div style="padding: 20px 10px">
              <el-button class="ml10" size="small" type="primary" @click="saveMedalSet">保存设置</el-button>
            </div>
          </div>
        </div>


        <div class="configCol">
          <el-switch v-model="stuEvaluteNum" @change="changeStatus('stuEvaluteNum')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">
            每个教师
            <el-select class="w90 bgwhite" size="small" v-model="medalLimitConfig.detail[0].period" placeholder="请选择">
              <el-option v-for="item in period" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            以单一角色评价同一学生次数上限为
            <el-button type="primary" class="ml10" size="small" @click="saveNotifyConfig(2)">保存设置</el-button>
          </div>
          <div class="configContent">
            <div class="configCol subCfg" v-if="stuEvaluteNum">
              <div class="configSet">
                班主任
                <el-input size="small" v-model.number="medalLimitConfig.detail[0].count" class="w90 bgwhite"
                          placeholder="请输入" maxlength="3"></el-input>
                次
              </div>
            </div>
            <div class="configCol subCfg" v-if="stuEvaluteNum">
              <div class="configSet">
                任课教师
                <el-input size="small" v-model.number="medalLimitConfig.detail[1].count" class="w90 bgwhite"
                          placeholder="请输入" maxlength="3"></el-input>
                次
              </div>
            </div>
            <div class="configCol subCfg" v-if="stuEvaluteNum">
              <div class="configSet">
                值周老师
                <el-input size="small" v-model.number="medalLimitConfig.detail[2].count" class="w90 bgwhite"
                          placeholder="请输入" maxlength="3"></el-input>
                次
              </div>
            </div>
          </div>
        </div>
        <div class="configCol">
          <el-switch
            v-if="dictConfig"
            v-model="dictConfig.supportRecall.enable"
            active-color="#13ce66"
            inactive-color="#909399"
            @change="changeSupportRecall"
          ></el-switch>
          <div class="configSet">
            教师评价支持
            <el-input
              size="small"
              v-if="dictConfig"
              v-model="dictConfig.supportRecall.duration"
              :disabled="!dictConfig.supportRecall.enable"
              class="w90 bgwhite" placeholder="请输入" maxlength="3"
            ></el-input>
            天内撤回，期间内评价结果不会生效。
            <el-button type="primary" class="ml10" size="small" v-if="dictConfig && dictConfig.supportRecall.enable" @click="saveDictConfig('supportRecall')">保存设置
            </el-button>
          </div>

        </div>        
        <div class="configCol">
          <el-switch v-if="dictConfig" @change="saveDictConfig('courseTeacherGroup')" v-model="dictConfig.courseTeacherGroup.enable" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">任课老师可以在关联班级创建小组</div>
        </div>
		
        <div class="configCol">
          <el-switch v-if="dictConfig" @change="saveDictConfig('residualGiving')" v-model="dictConfig.residualGiving.enable" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">打开后同班教师间可相互赠与余额</div>
			<el-button type="primary" class="ml10" size="small" @click="(giftSettingShow?saveDictConfig('residualGiving'):null);giftSettingShow = !giftSettingShow">{{giftSettingShow?"保存设置":"打开设置"}}
			</el-button>
			<div class="configContent" v-if="giftSettingShow">
				<div class="confogSet ">
					<div class="configCol subCfg configSet">
						<el-radio v-model="dictConfig.residualGiving.type" :label="1">只有班主任可赠与余额</el-radio>
						<el-radio v-model="dictConfig.residualGiving.type" :label="2">所有教师之间都可相互赠与余额</el-radio>
					</div>				
				</div>
			</div>		  
        </div>
				
        <div class="configCol">
          <el-switch v-if="dictConfig" @change="saveDictConfig('return2ClassTeacher')" v-model="dictConfig.return2ClassTeacher.enable" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">打开后教师扣除学生的分数/勋章回到该学生班级的班主任账户中</div>
					<el-button type="primary" class="ml10" size="small" @click="(backTypeShow?saveDictConfig('return2ClassTeacher'):null);backTypeShow = !backTypeShow">{{backTypeShow?"保存设置":"打开设置"}}
					</el-button>
					<div class="configContent" v-if="backTypeShow">
						<div class="confogSet ">
							<div class="configCol subCfg configSet">
								<el-checkbox-group 
									v-model="dictConfig.return2ClassTeacher.type">
									<el-checkbox :label="1">扣除的分数回到班主任账户</el-checkbox>
									<el-checkbox :label="2">扣除的勋章回到班主任账户</el-checkbox>
								</el-checkbox-group>
							</div>				
						</div>

					</div>		  
        </div>
<!-- 		<div class="configCol">

		</div> -->
      </div>

      <div class="configureTit">
        任务相关设置
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch v-if="dictConfig" v-model="dictConfig.stuTaskAudit.enable"  @change="saveDictConfig('stuTaskAudit')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">学生任务提交后直接审核通过</div>
        </div>
        <div class="configCol">
          <el-switch v-if="dictConfig" v-model="dictConfig.uploadImg.enable" @change="saveDictConfig('uploadImg')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
          <div class="configSet">学生任务提交时默认需上传图片</div>
        </div>
      </div>

      <div class="configureTit">
        班级荣誉设置
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch v-model="classHonor" @change="switchClassHonor" active-color="#13ce66" inactive-color="#909399">
          </el-switch>
          <div class="configSet" v-if="classHonor">
            奖励方式
            <el-select class="w100" size="small" @change="initClassHonorList" v-model="honorType" placeholder="请选择">
              <el-option v-for="item in honorTypeList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>

            <div class="inlineblock" v-if="honorType==1">
              各年级
              <el-select class="w100" size="small" v-model="honorCycle" placeholder="请选择">
                <el-option v-for="item in periodCH" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              总分排名前
              <el-input size="small" class="w90" v-model.number="honorTop" maxlength="1" placeholder="请输入"></el-input>
              的班级获得流动红旗
            </div>
            <div class="inlineblock" v-if="honorType==2">
              &nbsp;&nbsp;周期:
              <el-select class="w100" size="small" v-model="honorCycle" placeholder="请选择">
                <el-option v-for="item in periodCH" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              &nbsp;&nbsp;荣誉:
              <el-tag :key="index" v-for="(tag,index) in dynamicTags" closable :disable-transitions="false"
                      @close="delTag(tag,index)">
                {{tag.name}}
              </el-tag>
              <el-input class="w90" v-if="inputVisible" v-model="dynamicValue" ref="saveTagInput" maxlength="20"
                        size="small" @keyup.enter.native="addTag" @blur="addTag"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
            </div>
            <el-button type="primary" class="ml10" size="small" @click="saveClassHonorSetting">保存设置</el-button>

          </div>

          <div class="configSet" v-else>不奖励</div>

        </div>

      </div>

      <div class="configureTit">
        激励卡学校(是否是激励卡学校)
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch v-model="cardMode" @change="changeStatus('cardMode')" active-color="#13ce66"
                     inactive-color="#909399">
          </el-switch>
        </div>
      </div>

      <div class="configureTit" v-if="cardMode">
        提醒在电子班牌中显示姓名设置
      </div>
      <div class="configureCont" v-if="cardMode">
        <div class="configCol">
          发布的“提醒”在电子班牌展示时学生姓名显示：
          <el-radio-group v-model="studentNameStyle" @change="changeStatus('studentNameStyle')">
            <el-radio :label="1">完整姓名</el-radio>
            <el-radio :label="2">只显示姓氏，名字用*替代</el-radio>
            <el-radio :label="3">姓名都用*替代</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="configureTit">
        二维码兑换配置
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch active-color="#13ce66" inactive-color="#909399" v-model="studentQrcodeLimit"
                     @change="changeStatus('studentQrcodeLimit')">
          </el-switch>
          <div class="configSet">学生不能兑换和本班无关教师的二维码</div>
        </div>
      </div>

      <div class="configureTit">
        综合素质报告单
      </div>
      <div class="configureCont">
        <div class="configCol">
          <el-switch active-color="#13ce66" inactive-color="#909399" v-model="reportCard"
                     @change="changeStatus('reportCard')">
          </el-switch>
          <div class="configSet">学生移动端录入、查看综合素质报告单</div>
        </div>
      </div>

    </div>


    <el-dialog title="剩余额度" :visible.sync="showLastDialog">
      <div style="margin-bottom:20px">搜索：<el-input class="w200" clearable suffix-icon="el-icon-search" size="small" v-model="searchTeacherName" @change="searchByTeacherName" placeholder="请输入教师名称搜索"></el-input></div>
      <!-- 统一设置数量/按教师设置数量 -->
      <div style="display:flex;" v-if="medalTeacherData.type!==3">
        <el-table class="tableBorder" style="border-radius:10px;flex:1;margin:0 5px;padding:10px"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  :data="teacherMedalList"
                  max-height="500px">
          <el-table-column label="教师姓名" prop="teacherName">
          </el-table-column>
          <el-table-column label="总余额" prop="medalTotalNum">
            <!-- <template slot-scope="scope">
              {{scope.row.cardList[0].count}} -->
              <!-- <el-input class="w90 bgwhite" onkeyup="this.value=Number(this.value.replace(/[^\d.]/g,''));"
                        v-model="scope.row.cardList[0].count" maxlength="3" size="small"></el-input>
              {{medalAllotScope == 1 ? '枚' : '分'}} -->
            <!-- </template> -->
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="showTeacherMedalDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>  
        <div v-if="teacherLastDetail" class="tableBorder" style="border-radius:10px;padding:10px;flex:1;margin:0 5px;">
          <div style="line-height: 40px;"><strong>教师姓名：</strong>{{curTeacher.name}}</div>
          <el-table ref="selectionTable" :data="curTeacher.teacherClassList" v-if="teacherLastDetail"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" v-if="editTeacherDetail"></el-table-column>
            <el-table-column label="班级" prop="className"></el-table-column>
            <el-table-column label="余额" prop="classMedalNum"></el-table-column>
          </el-table>
          <div style="line-height: 50px;display: flex;align-items: center;justify-content: space-around;" v-if="editTeacherDetail">
            <strong>调整：</strong>
            <el-radio style="margin:0" v-model="medalAllotAdjustParams.rewardType" :label="0">奖励</el-radio>
            <el-radio style="margin:0" v-model="medalAllotAdjustParams.rewardType" :label="1">扣除</el-radio>
            <el-input class="w100" size="small" v-model="medalAllotAdjustParams.rewardNum" placeholder="请输入数量" maxlength="3"></el-input>
            <el-button type="primary" size="small" @click="confirmMedalAllot">确认</el-button>
          </div>
          <div style="margin-top:20px;display: flex;justify-content: flex-end;">
            <el-button size="small" type="primary" v-if="!editTeacherDetail" @click="adjustMedalAllot">调整</el-button>
            <el-button size="small" v-if="editTeacherDetail" @click="editTeacherDetail=false">返回</el-button>
            <el-button size="small" v-else @click="teacherLastDetail=false;editTeacherDetail=false">关闭</el-button>
          </div>
        </div>              
      </div>
      <!-- 按维度设置数量 -->
      <div style="display:flex;" v-else>
        <el-table class="tableBorder" style="border-radius:10px;flex:1;margin:0 5px;padding:10px"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  :data="teacherMedalList"
                  max-height="500px">
          <el-table-column label="教师姓名" prop="teacherName"></el-table-column>
          <div v-if="!teacherMedalList">

          </div>
          <el-table-column v-else v-for="(medal,index) of teacherMedalList[0].dimensionTeacherMedalNumList" :key="index"
                            :label="medal.dimensionName " prop="medalTotalNum">
            <template slot-scope="scope">
              {{scope.row.dimensionTeacherMedalNumList[index].dimensionMedalNum}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="showTeacherMedalDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>   
        <div v-if="teacherLastDetail" class="tableBorder" style="border-radius: 10px;padding: 10px;flex: 1 1 0%;margin: 0px 5px;width: 50%;">
          <div style="line-height: 40px;"><strong>教师姓名：</strong>{{curTeacher.name}}</div>
          <el-table ref="selectionTable" :data="curTeacher.teacherClassList" v-if="teacherLastDetail"
                  @select="handleSelectionChange" @cell-click="handleCellClick" @select-all="handleSelectAll" max-height="500px">
            <el-table-column type="selection" width="55" v-if="editTeacherDetail"></el-table-column>
            <el-table-column label="班级" prop="className">
            </el-table-column>
            <el-table-column v-for="(medal,index) of curTeacher.dimensionTeacherMedalNumList" :key="index" :index="index">  
              <template slot="header" slot-scope="scope">
                <el-checkbox v-if="editTeacherDetail" @change="selectDimension($event,medal)">{{medal.dimensionName}}</el-checkbox>
                <span v-else>{{medal.dimensionName}}</span>
              </template>
              <template slot-scope="scope">
                <div>
                  <i class="el-icon-check" v-if="editTeacherDetail&&checkExist(medal,scope.$index)"></i>
                  <span>{{medal.dimensionClassMedalNumList[scope.$index].classMedalNum}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="line-height: 50px;display: flex;align-items: center;justify-content: space-around;" v-if="editTeacherDetail">
            <strong>调整：</strong>
            <el-radio style="margin:0" v-model="medalAllotAdjustParams.rewardType" :label="0">奖励</el-radio>
            <el-radio style="margin:0" v-model="medalAllotAdjustParams.rewardType" :label="1">扣除</el-radio>
            <el-input class="w100" size="small" v-model="medalAllotAdjustParams.rewardNum" placeholder="请输入数量" maxlength="3"></el-input>
            <el-button type="primary" size="small" @click="confirmMedalAllot">确认</el-button>
          </div>
          <div style="margin-top:20px;display: flex;justify-content: flex-end;">
            <el-button size="small" type="primary" v-if="!editTeacherDetail" @click="adjustMedalAllot">调整</el-button>
            <el-button size="small" v-if="editTeacherDetail" @click="editTeacherDetail=false">返回</el-button>
            <el-button size="small" v-else @click="teacherLastDetail=false;editTeacherDetail=false">关闭</el-button>
          </div>
        </div>       
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import _ from 'lodash';
  import * as qualityApi from '@comm/api/qualityAppraisal';

  export default {
    name: "config",
    components: {},
    data() {
      return {
        configId: '',                            //配置项的ID
        relationStudent: false,                  //班级评价结果关联到学生评价中
        relationClass: false,                   //学生评价结果汇总到班级评价中
        sendSms: false,                          //是否开启短信提醒
        audit: false,                            //教师评价后直接审核通过
        notifyClassTeacher: false,               //是否开启班主任评价提醒
        notifyCourseTeacher: false,              //是否开启任课教师评价提醒
        medalLimit: false,                       //是否开启勋章数量配比
        scoreLimit: false,                       //是否开启分数数量配比
        classHonor: false,                       //是否开启班级荣誉设置
        stuEvaluteNum: false,                    //是否开启数量限制
        cardMode: false,                         //是否是激励卡学校

        classTeacherNotifyConfig: {period: 1, count: 0, selTime: []},            //班主任提醒配置项
        CourseTeacherNotifyConfig: {period: 1, count: 0, selTime: []},           //任课教师提醒配置项
        medalRatioConfig: {period: 2},                    //勋章分组配比
        medalLimitConfig: {period: 1, detail: [{count: 0, role: 1}, {count: 0, role: 2}, {count: 0, role: 3}]},                    //勋章设置配置项
        CourseTeacherNotifyConfig: {period: 1, count: 0, selTime: []},           //任课教师提醒配置项

        period: [{value: 1, label: "每周"}, {value: 2, label: "每月"}, {value: 4, label: "每天"}, {value: 3, label: "每学期"}],        //周期选择数据
        periodCH: [{value: 1, label: "每周"}, {value: 2, label: "每月"}],        //周期选择数据(班级荣誉适用)
        // classTeacherPeriod:'',
        dayCasCader: [],
        weekCasCader: [],
        numConfig: false,                        //勋章数量配比开关按钮
        giftSettingShow: false,					 				//互赠余额详情
				backTypeShow: false,					 				//教师扣除的配额回到班主任账户详情
		medalTeacherData: [],                    //勋章配比的详细列表
        batNum: 0,                               //批量设置的数量

        classHonorSetting: {},                   //班级荣誉设置
        honorType: 1,                           //奖励方式
        honorTypeList: [{value: 1, label: "自动奖励"}, {value: 2, label: "手动奖励"}],      //奖励方式列表
        honorCycle: 1,                           //周期设置
        honorTop: 0,                             //排名前几可以获得

        dynamicTags: [],                        //动态荣誉自定义标签
        inputVisible: false,
        dynamicValue: '',


        value8: false,
        aabb: [],
        optValue1: "",
        optValue2: "",
        optValue3: "",
        optValue4: "",
        optValue5: "",
        optValue6: "",
        dayMax: 28,
        timeSection: [8, 24],

        numtoword: new Map([[1, '星期日'], [2, '星期一'], [3, '星期二'], [4, '星期三'], [5, '星期四'], [6, '星期五'], [7, '星期六']]),

        studentNameStyle: 2,                         //学生姓名显示
        studentQrcodeLimit: false,                 //学生不能兑换和本班无关教师的二维码
        reportCard:false,                            //学生端报告单录入填写。

        dictConfig: null,                            // 评价消息推送和评价撤回配置
        medalAllotScope: '1',                            // 作用域：1.勋章配额设置 2.分数配额设置 ,
        showLastDialog: false,                        //查看剩余额度
        teacherLastDetail: false,                     //查看教师余额详细
        editTeacherDetail: false,                     //编辑教师余额详细
        teacherMedalList: [{
          classTeacherMedalNumList: [],
          dimensionTeacherMedalNumList: [],
          medalTotalNum: '',
          teacherCode: '',
          teacherName: ''
        }],                         //教师余额
        teacherMedalList1: [],                        //副本
        curTeacher: {
          name: '张三',
          teacherClassList:[],
          dimensionTeacherMedalNumList:[]     
        },
        sendByTeacher: false,
        searchTeacherName: '',                        //教师名称搜索
        medalAllotAdjustParams:{
          medalAllotAdjustClassParamList: [],//班级列表
          medalAllotAdjustDimensionParams: [],//维度列表
          medalType: '',//勋章类型 
          rewardType: 0,//奖惩类型 0 ： 奖励 ，1：扣除 ,
          teacherCode: '',
          rewardNum: '',
          scope: ''
        },
        checked: false,
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
      medalAllotScope(nVal) {
        this.setMedalConfig(nVal)
      }
    },
    mounted() {
      //初始化数据
      this.init();
    },
    methods: {
      /**
       * 初始化方法(包括数据的初始化,和基础接口的调用)
       * by:RayJ
       * time:2019-07-18
       */
      async init() {
        var that = this;
        var allConfig = {};         //全局的配置文件
        var NotifyConfig = [];      //提醒设置的全部设置项
        //初始化联动菜单 按照日期
        for (var i = 0, k = 0; i <= (this.dayMax - 1); i++, k++) {
          this.dayCasCader.push({value: (i + 1), label: "当月" + (i + 1) + "号", children: []});
          for (var j = this.timeSection[0]; j <= this.timeSection[1]; j++) {
            this.dayCasCader[k].children.push({value: (i + 1) + "|" + j + ":00", label: j + ":00"})
          }
        }
        //初始化联动菜单 按照星期
        for (var i = 1; i <= 7; i++) {
          this.weekCasCader.push({value: i, label: this.numtoword.get(i), children: []});
          // console.log(this.weekCasCader,226622)
          for (var j = this.timeSection[0]; j <= this.timeSection[1]; j++) {
            this.weekCasCader[i - 1].children.push({value: i + "|" + j + ":00", label: j + ":00"})
          }
        }

        await Promise.all([
          //ajax获取全局配置
          qualityApi.getConfig(),
          qualityApi.getNotifyConfig(),
          qualityApi.getClassHonorSetting(),
          qualityApi.getDictConfig(),
        ]).then(result => {
          // console.log(result,225511);
          allConfig = result[0].value;
          NotifyConfig = result[1].value;
          that.classHonorSetting = result[2].value;
          that.dictConfig = result[3].value
          that.dictConfig.stuTaskAudit = that.dictConfig.stuTaskAudit ? that.dictConfig.stuTaskAudit : {enable:false};
          that.dictConfig.uploadImg = that.dictConfig.uploadImg ? that.dictConfig.uploadImg : {enable:false};
          that.dictConfig.courseTeacherGroup = that.dictConfig.courseTeacherGroup ? that.dictConfig.courseTeacherGroup : {enable:false};
          that.dictConfig.residualGiving = {
			  enable: (that.dictConfig.residualGiving.enable|false),
			  id: that.dictConfig.residualGiving.id,
			  type: (that.dictConfig.residualGiving.type|1)
		  };
          var return2ClassTeacher = {
			  enable: (that.dictConfig.return2ClassTeacherConfig.enable|false),
			  id: that.dictConfig.return2ClassTeacherConfig.id,
			  type: []
		  };
		  let type = that.dictConfig.return2ClassTeacherConfig.type;
          return2ClassTeacher.type = type?type==3?[1,2]:type==2?[2]:[1]:[];
		  that.$set(that.dictConfig,'return2ClassTeacher',return2ClassTeacher);
        }).catch(error => {
          that.$notify({title: '错误', message: '数据初始化出错,刷新后再试', type: 'error'});
        });
        
        //初始化开关的值
        this.cardMode = allConfig.cardMode;
        this.configId = allConfig.id;
        this.relationStudent = allConfig.relationStudent;
        this.relationClass = allConfig.relationClass;
        this.sendSms = allConfig.sendSms;
        this.audit = allConfig.audit;
        this.notifyClassTeacher = allConfig.notifyClassTeacher;
        this.notifyCourseTeacher = allConfig.notifyCourseTeacher;
        this.medalLimit = allConfig.medalLimit;
        this.scoreLimit = allConfig.scoreLimit;
        this.stuEvaluteNum = allConfig.stuEvaluteNum;
        this.studentNameStyle = allConfig.studentNameStyle ? allConfig.studentNameStyle : 2;
        this.studentQrcodeLimit = allConfig.studentQrcodeLimit ? allConfig.studentQrcodeLimit : false;
        this.reportCard = this.dictConfig.reportCard.enable ? this.dictConfig.reportCard.enable : false;
        

        //2个提醒 1个勋章总数设置
        if (_.find(NotifyConfig, {"type": 1, "role": 1})) {
          this.classTeacherNotifyConfig = _.find(NotifyConfig, {"type": 1, "role": 1});
          //初始化班主任的时间选择
          this.classTeacherNotifyConfig.selTime = [];
          this.classTeacherNotifyConfig.selTime[0] = this.classTeacherNotifyConfig.triggerDate;
          this.classTeacherNotifyConfig.selTime[1] = this.classTeacherNotifyConfig.triggerDate + "|" + parseInt(this.classTeacherNotifyConfig.triggerTime.split(":")[0]) + ":00";
        }
        if (_.find(NotifyConfig, {"type": 1, "role": 2})) {
          this.CourseTeacherNotifyConfig = _.find(NotifyConfig, {"type": 1, "role": 2});
          //初始化任课老师的时间选择
          this.CourseTeacherNotifyConfig.selTime = [];
          this.CourseTeacherNotifyConfig.selTime[0] = this.CourseTeacherNotifyConfig.triggerDate;
          this.CourseTeacherNotifyConfig.selTime[1] = this.CourseTeacherNotifyConfig.triggerDate + "|" + parseInt(this.CourseTeacherNotifyConfig.triggerTime.split(":")[0]) + ":00";
        }
        // if(_.find(NotifyConfig,{"type":3})){
        //     this.medalRatioConfig = _.find(NotifyConfig,{"type":3});
        // }
        this.medalLimitConfig.detail = [{count: 0, role: 1}, {count: 0, role: 2}, {count: 0, role: 3}]
        if (_.find(NotifyConfig, {"type": 2, "role": 1})) {
          //学生评价次数配置---班主任
          let res = _.find(NotifyConfig, {"type": 2, "role": 1});
          this.$set(this.medalLimitConfig.detail[0], 'count', res.count);
          this.$set(this.medalLimitConfig.detail[0], 'id', res.id);
          this.$set(this.medalLimitConfig.detail[0], 'isEnable', res.isEnable);
          this.$set(this.medalLimitConfig.detail[0], 'period', res.period);
          this.$set(this.medalLimitConfig.detail[0], 'role', res.role);
          this.$set(this.medalLimitConfig.detail[0], 'schoolCode', res.schoolCode);
          this.$set(this.medalLimitConfig.detail[0], 'triggerDate', res.triggerDate);
          this.$set(this.medalLimitConfig.detail[0], 'triggerTime', res.triggerTime);
          this.$set(this.medalLimitConfig.detail[0], 'type', res.type);
        }
        if (_.find(NotifyConfig, {"type": 2, "role": 2})) {
          //学生评价次数配置---任课教师
          let res = _.find(NotifyConfig, {"type": 2, "role": 2});
          this.$set(this.medalLimitConfig.detail[1], 'count', res.count);
          this.$set(this.medalLimitConfig.detail[1], 'id', res.id);
          this.$set(this.medalLimitConfig.detail[1], 'isEnable', res.isEnable);
          this.$set(this.medalLimitConfig.detail[1], 'period', res.period);
          this.$set(this.medalLimitConfig.detail[1], 'role', res.role);
          this.$set(this.medalLimitConfig.detail[1], 'schoolCode', res.schoolCode);
          this.$set(this.medalLimitConfig.detail[1], 'triggerDate', res.triggerDate);
          this.$set(this.medalLimitConfig.detail[1], 'triggerTime', res.triggerTime);
          this.$set(this.medalLimitConfig.detail[1], 'type', res.type);
        }
        if (_.find(NotifyConfig, {"type": 2, "role": 3})) {
          //学生评价次数配置---值周老师
          let res = _.find(NotifyConfig, {"type": 2, "role": 3});
          this.$set(this.medalLimitConfig.detail[2], 'count', res.count);
          this.$set(this.medalLimitConfig.detail[2], 'id', res.id);
          this.$set(this.medalLimitConfig.detail[2], 'isEnable', res.isEnable);
          this.$set(this.medalLimitConfig.detail[2], 'period', res.period);
          this.$set(this.medalLimitConfig.detail[2], 'role', res.role);
          this.$set(this.medalLimitConfig.detail[2], 'schoolCode', res.schoolCode);
          this.$set(this.medalLimitConfig.detail[2], 'triggerDate', res.triggerDate);
          this.$set(this.medalLimitConfig.detail[2], 'triggerTime', res.triggerTime);
          this.$set(this.medalLimitConfig.detail[2], 'type', res.type);
        }
        // console.log(this.medalLimitConfig.detail,443)

        //班级荣誉设置初始化
        if (!this.classHonorSetting.type) {
          this.classHonor = false;
        } else {
          this.classHonor = true;
          this.honorType = this.classHonorSetting.type
          this.honorCycle = this.classHonorSetting.cycle
          this.honorTop = this.classHonorSetting.top
          if (this.honorType == 2) {
            for (var i = 0; i < this.classHonorSetting.classHonorVOList.length; i++) {
              this.dynamicTags.push(this.classHonorSetting.classHonorVOList[i]);
            }
            this.dynamicTags = _.filter(this.dynamicTags, {type: 2});
            // console.log(this.dynamicTags);
          }
        }
        //
        var res = await qualityApi.getMedalAll({scope:1});
        this.medalTeacherData = res.value;
        this.medalAllotScope = '1';
      },

      /*
      * 保存设置
      * @param type 'pushResultToParents' 评价消息推送 'supportRecall' 评价撤回 ''
      * */
      async saveDictConfig(type) {
        let _data = {
          enable: this.dictConfig[type].enable,
		  type: this.dictConfig[type].type
        };

        if (type == 'pushResultToParents') {
          let _arr = this.dictConfig['pushResultToParents'].channelList.filter(v => v.checked);
          if (_arr.length == 0 && this.dictConfig[type].enable) {
            this.$notify({title: "错误", message: "请选择推送方式", type: "error"});
            return;
          }
          _data['channelList'] = _arr;
        } else if(type == 'supportRecall') {
          if (this.dictConfig[type].enable && !this.dictConfig['supportRecall'].duration) {
            this.$notify({title: "错误", message: "请输入天数", type: "error"});
            return;
          }
          _data['duration'] = this.dictConfig[type].enable ? this.dictConfig['supportRecall'].duration : '';
        } else if(type == 'return2ClassTeacher') {
			_data.type = _data.type.length==2?3:_data.type.length==1?_data.type[0]:null
			if(_data.enable&&_data.type==null){
				this.$notify({title: "错误", message: "至少选择一个设置", type: "error"});
				this.dictConfig[type].enable = false
				// _data.enable = false
				return;
			}
		}

        let params = {
          configType: type,
          data: _data
        };
        const res = await qualityApi.saveDictConfig(params);
        if (res.resultCode != 1) {
          this.$notify({title: "错误", message: "保存失败", type: "error"});
        } else {
          this.$notify({title: "成功", message: "设置成功", type: "success"});
        }
      },

      /*
      * 评价撤回开关
      * */
      changeSupportRecall(val) {
        if(!val) {
          this.saveDictConfig('supportRecall')
        }
      },

      /*
      * 评价消息推送开关
      * */
      changePushResultToParents(val) {
        if (!val) {
          this.saveDictConfig('pushResultToParents')
        }
      },

      /**
       * 保存勋章数量设置
       * by:RayJ
       * time:2019-07-30
       */
      async saveMedalSet() {
        var param = {}
        param = this.medalRatioConfig;
        param.type = 3;
        // var resa = await qualityApi.saveNotifyConfig([param]);
        if (this.medalTeacherData.type == 1) {//统一设置
          if (this.medalTeacherData.allTypeList.count < 0) {
            this.$notify({title: "错误", message: "请输入0-999的勋章数量", type: "error"});
            return;
          }
        } else if (this.medalTeacherData.type == 2) {//按教师设置
          for (var i = 0; i < this.medalTeacherData.teacherTypeList.length; i++) {
            if (this.medalTeacherData.teacherTypeList[i].cardList[0].count < 0) {
              this.$notify({title: "错误", message: "请输入0-999的勋章数量", type: "error"});
              return;
            }
          }
        } else if (this.medalTeacherData.type == 3) {//按勋章设置
          for (var i = 0; i < this.medalTeacherData.teacherTypeList.length; i++) {
            for (var j = 0; j < this.medalTeacherData.medalTypeList[i].cardList.length; j++) {
              if (this.medalTeacherData.medalTypeList[i].cardList[j].count < 0) {
                this.$notify({title: "错误", message: "请输入0-999的勋章数量", type: "error"});
                return;
              }
            }
          }
        }


        // console.log(resa,334400);
        this.medalTeacherData['scope'] = this.medalAllotScope; // 1，勋章，2，分数
        var res = await qualityApi.saveMedalAll(this.medalTeacherData);
        if (res.resultCode != 1) {
          this.$notify({title: "错误", message: "保存失败", type: "error"});
          return;
        } else {
          this.$notify({title: "成功", message: "设置成功", type: "success"});
          this.numConfig = false;
        }
      },

      /**
       * 批量设置勋章数量
       * by:RayJ
       * time:2019-07-30
       */
      changeBatNum() {
        // if(this.batNum==''){
        //     return
        // }
        console.log(this.batNum, 487)
        if (this.medalTeacherData.type == 2) {
          var num = Number(this.batNum.replace(/[^\d.]/g, ''));
          for (var i = 0; i < this.medalTeacherData.teacherTypeList.length; i++) {
            this.$set(this.medalTeacherData.teacherTypeList[i].cardList[0], "count", num);
          }
          this.batNum = num
        }
        if (this.medalTeacherData.type == 3) {
          var num = Number(this.batNum.replace(/[^\d.]/g, ''));
          for (var i = 0; i < this.medalTeacherData.medalTypeList.length; i++) {
            for (var j = 0; j < this.medalTeacherData.medalTypeList[i].cardList.length; j++) {
              this.$set(this.medalTeacherData.medalTypeList[i].cardList[j], "count", num);
            }
          }
          this.batNum = num
        }
      },

      /**
       * 设置勋章配比
       * by:RayJ
       * time:2019-07-30
       */
      async setMedalConfig(scope) {
        this.numConfig = true;
        let params = { scope };
        var res = await qualityApi.getMedalAll(params);
        this.medalTeacherData = res.value;
        // el-tab-pane组件name接收string
        this.medalAllotScope = typeof res.value.scope == 'string' ? res.value.scope : String(res.value.scope);
      },

      /**
       * 初始化班级荣誉设置
       * by:RayJ
       * time:2019-07-26
       */
      initClassHonorList() {

        if (this.honorType == 2) {
          this.dynamicTags = [];
          for (var i = 0; i < this.classHonorSetting.classHonorVOList.length; i++) {
            this.dynamicTags.push(this.classHonorSetting.classHonorVOList[i]);
          }
          this.dynamicTags = _.filter(this.dynamicTags, {type: 2});
          console.log(this.dynamicTags);
        }
      },

      /**
       * 开关事件
       * by:RayJ
       * time:2019-07-18
       */
      async changeStatus(item) {

        if (item == 'notifyClassTeacher') {//如果是第一个---一个当两个用（任课教师和班主任一起）
          //拼装参数
          var param = {};
          param['notifyCourseTeacher'] = this['notifyClassTeacher'];
          param.id = this.configId;
          var res = await qualityApi.saveConfig(param);
          if (res.resultCode != 1) {
            this.$notify({title: "错误", message: "保存失败", type: "error"});
            setTimeout(() => {
              this['notifyCourseTeacher'] = !this['notifyCourseTeacher'];
            }, 200);
            return;
          } else {

          }
        }

        if(item == 'reportCard'){
          var param = {};
          param.configType = item;
          param.data = {};
          param.data.enable = this[item]
          var res = await qualityApi.saveDictConfig(param);
          if (res.resultCode != 1) {
            this.$notify({title: "错误", message: "保存失败", type: "error"});
            setTimeout(() => {
              this['notifyCourseTeacher'] = !this['notifyCourseTeacher'];
            }, 200);
            return;
          } else {
            this.$notify({title: "成功", message: res.resultMessage, type: "success"});
            return
          }

        }

        //拼装参数
        var param = {};
        param[item] = this[item];
        param.id = this.configId;
        var res = await qualityApi.saveConfig(param);
        if (res.resultCode != 1) {
          this.$notify({title: "错误", message: "保存失败", type: "error"});
          setTimeout(() => {
            this[item] = !this[item];
          }, 200);
          return;
        } else {
          if (item == 'cardMode') {
            this.$store.dispatch("set_isInspireCard", this.cardMode);
            localStorage.setItem('inspireCardSchool', this.$store.getters.get_IsInspireCard);
          }
          this.$notify({title: "成功", message: res.resultMessage, type: "success"});
        }
      },

      /**
       * 保存教师评价提醒设置
       * by:RayJ
       * time:2019-07-18
       */
      async saveNotifyConfig(type) {
        var params = [];
        if (type == 1) {
          //教师提醒设置
          var param = {}
          param = this.classTeacherNotifyConfig;
          param.type = type;
          param.role = 1;
          this.CourseTeacherNotifyConfig.period = this.classTeacherNotifyConfig.period
          this.CourseTeacherNotifyConfig.selTime = this.classTeacherNotifyConfig.selTime
          //统一时间
          param.triggerDate = this.classTeacherNotifyConfig.selTime[0];
          param.triggerTime = this.classTeacherNotifyConfig.selTime[1].split('|')[1] + ':00';
          param.count = parseInt(param.count);
          //验证班主任评价次数
          if (param.count == 0 || !param.count) {
            this.classTeacherNotifyConfig.count = 0;
            this.$notify({title: "提示", message: "请输入大于0的数字", type: "warning"});
            return
          }
          params.push(param);

          param = this.CourseTeacherNotifyConfig;
          param.triggerDate = this.classTeacherNotifyConfig.selTime[0];
          param.triggerTime = this.classTeacherNotifyConfig.selTime[1].split('|')[1] + ':00';
          param.type = type;
          param.role = 2;
          param.count = parseInt(param.count);
          //验证任课教师评价次数
          if (param.count == 0 || !param.count) {
            this.CourseTeacherNotifyConfig.count = 0;
            this.$notify({title: "提示", message: "请输入大于0的数字", type: "warning"});
            return
          }
          params.push(param);
        } else if (type == 2) {
          //学生评价次数设置
          for (var element of this.medalLimitConfig.detail) {
            if (element.count == 0 || !element.count) {
              this.$notify({title: "提示", message: "请输入大于0的数字", type: "warning"});
              return
            }
            params.push({
              count: element.count,
              id: element.id,
              isEnable: element.isEnable,
              period: this.medalLimitConfig.detail[0].period,
              role: element.role,
              type: 2
            })
          }
        } else if (type == 4) {
          param = this.medalLimitConfig;
          // param.schoolCode = this.$cookie.get('xxdm');
          param.type = 4
        }

        //(勋章限制设置不需要拼接时间参数)
        // if(type!=4){
        //     if(param.selTime.length==0){
        //         this.$notify({title:"提示",message:"请选择时间",type:"warning"});
        //         return
        //     }
        //     param.triggerDate = param.selTime[0];
        //     param.triggerTime = param.selTime[1].split("|")[1].split(":")[0]+":00:00";
        // }

        var res = await qualityApi.saveNotifyConfig(params);
        if (res.resultCode != 1) {
          this.$notify({title: "错误", message: "保存失败", type: "error"});
          return;
        } else {
          this.$notify({title: "成功", message: res.resultMessage, type: "success"});
        }
      },

      /**
       * 保存勋章数量分配设置
       * by:RayJ
       * time:2019-07-18
       */
      async saveMedalAllotConfig() {
        var param = this.medalRatioConfig;
        param.count = parseInt(param.count);
        var res = await qualityApi.saveMedalAllotConfig(param);
        if (res.resultCode != 1) {
          this.$notify({title: "错误", message: res.resultMessage, type: "error"});
          return;
        } else {
          this.$notify({title: "成功", message: res.resultMessage, type: "success"});
        }
      },

      /**
       * 设置班级荣誉设置
       * by:RayJ
       * time:2019-07-25
       */
      async saveClassHonorSetting() {
        var param = this.classHonorSetting;
        param.cycle = this.honorCycle;
        param.top = this.honorTop;
        param.type = this.honorType;
        if (this.honorType == 2) {
          var tags = [];
          for (var i = 0; i < this.dynamicTags.length; i++) {
            tags.push(this.dynamicTags[i])
          }
          param.classHonorParamList = tags;
          console.log(param, 336644)
        } else {
          param.classHonorParamList = [{id: null, name: "流动红旗"}]
        }
        var res = await qualityApi.classHonorSetting(param);
        if (res.resultCode != 1) {
          this.$notify({title: "错误", message: res.resultMessage, type: "error"});
          return;
        } else {
          this.$notify({title: "成功", message: "保存设置成功", type: "success"});
        }
      },

      /**
       * 开启或者关闭班级荣誉设置,开启无用开启后需点击保存设置才启用
       * by:RayJ
       * time:2019-07-25
       */
      async switchClassHonor(status) {
        // console.log(status,336600)
        if (!status) {
          var param = {};
          param.type = 0;
          var res = await qualityApi.classHonorSetting(param);
          if (res.resultCode != 1) {
            this.$notify({title: "错误", message: res.resultMessage, type: "error"});
            return;
          } else {
            this.$notify({title: "成功", message: "设置成功", type: "success"});
          }
        } else {

          // var res  = await qualityApi.getClassHonorSetting();
          // this.classHonorSetting = res.value;
          console.log(this.classHonorSetting, 405);
          this.classHonorSetting.type = 1;
          this.initClassHonorList();
        }
      },

      /**
       * 验证输入的数字是否合理
       * by:RayJ
       * time:2019-08-14
       */
      checkNumber(val, limit) {
        console.log(val, limit);
      },


      /**
       * 删除手动奖励中的班级荣誉项
       * by:RayJ
       * time:2019-07-26
       */
      async delTag(tag, index) {
        if (tag.id) {
          var res = await qualityApi.delClassHonor(tag.id);
          if (res.resultCode != 1) {
            this.$notify({title: "错误", message: res.resultMessage, type: "error"});
            return;
          } else {
            this.$notify({title: "成功", message: "删除成功", type: "success"});
            this.dynamicTags.splice(index, 1);
          }
        } else {
          this.dynamicTags.splice(index, 1);
        }
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      addTag() {
        let dynamicValue = this.dynamicValue;
        if (dynamicValue) {
          this.dynamicTags.push({name: dynamicValue});
        }
        this.inputVisible = false;
        this.dynamicValue = '';
      },

      // 查看剩余额度
      async showLast(type){
        //scope: 1是勋章 2是分数 
        var res = await qualityApi.getTeacherMedalNum({scope:this.medalAllotScope,medalType:this.medalTeacherData.type!=3?1:2});
        if(res.resultCode == 1){
          this.teacherMedalList = res.value;
          this.teacherMedalList1 = JSON.parse(JSON.stringify(this.teacherMedalList));
          this.searchByTeacherName();
        }
        if(type!='reflash'){
          this.editTeacherDetail = false;
          this.teacherLastDetail = false;
          this.showLastDialog = true;
        } else {
          var row = this.teacherMedalList.find(e=>e.teacherCode == this.curTeacher.teacherCode);
          this.showTeacherMedalDetail(row,type);
        }
      },

      // 查看教师剩余额度详细
      showTeacherMedalDetail(row,type){
        if(this.medalTeacherData.type!==3){
          this.curTeacher.teacherClassList = JSON.parse(JSON.stringify(row.classTeacherMedalNumList))
          this.curTeacher.name = row.teacherName;
          this.curTeacher.teacherCode = row.teacherCode;
        } else {
          this.curTeacher.dimensionTeacherMedalNumList = JSON.parse(JSON.stringify(row.dimensionTeacherMedalNumList))
          this.curTeacher.teacherClassList = JSON.parse(JSON.stringify(row.dimensionTeacherMedalNumList[0].dimensionClassMedalNumList));
          this.curTeacher.name = row.teacherName;
          this.curTeacher.teacherCode = row.teacherCode;
        }
        if(type!='reflash'){
          this.editTeacherDetail = false;
          this.teacherLastDetail = true;
        }
      },

      //安名称搜索教师
      searchByTeacherName(){
        if(this.searchTeacherName!=""){
          this.teacherMedalList = _.filter(this.teacherMedalList1,item=>{
            var flg = item.teacherName.indexOf(this.searchTeacherName);
            return flg>=0;
          });
        } else {
          this.teacherMedalList = JSON.parse(JSON.stringify(this.teacherMedalList1));
        }
      },
      //调整勋章分数额度
      adjustMedalAllot(){
        this.editTeacherDetail = false;
        //清空选择
        this.$refs.selectionTable.clearSelection();
        this.medalAllotAdjustParams = {
          medalAllotAdjustClassParamList: [],//班级列表
          medalAllotAdjustDimensionParams: [],//维度列表
          medalType: this.medalTeacherData.type!=3?1:2,//勋章类型 
          rewardType: 0,//奖惩类型 0 ： 奖励 ，1：扣除 ,
          teacherCode: this.curTeacher.teacherCode,
          rewardNum: '',
          scope: this.medalAllotScope
        }
        this.$nextTick(()=>{
          this.editTeacherDetail = true;

        })
      },
      //选中修改行
      handleSelectionChange(e,row){
        if(this.medalTeacherData.type!=3){
          this.medalAllotAdjustParams.medalAllotAdjustClassParamList = e;
        } else {//按维度选中班级--要把所有维度都加入，然后维度下面加入该班级
            var add = e.find(item=>item.classCode==row.classCode);
            if(add){//选中
              var dimensions = JSON.parse(JSON.stringify(this.curTeacher.dimensionTeacherMedalNumList))
              dimensions.forEach(d=>{//循环所有维度
                var addDimension = this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.find(ad=>ad.dimension==d.dimensionCode)
                if(addDimension){//如果存在该维度
                  var addClass = addDimension.medalAllotAdjustClassParamList.find(c=>c.classCode==row.classCode);
                  if(!addClass){//如果不存在班级就添加
                    addDimension.medalAllotAdjustClassParamList.push(JSON.parse(JSON.stringify(row)));
                  }
                } else {//不存在该维度
                  var p = {
                    dimension: d.dimensionCode,
                    medalAllotAdjustClassParamList: []
                  }
                  p.medalAllotAdjustClassParamList.push(JSON.parse(JSON.stringify(row)));
                  this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.push(p)
                }
              })
            } else {//取消
              var temp = JSON.parse(JSON.stringify(this.medalAllotAdjustParams.medalAllotAdjustDimensionParams))
              temp.forEach(d=>{//循环所有维度把该班级移除
                var delClass = d.medalAllotAdjustClassParamList.findIndex(c=>c.classCode==row.classCode);
                if(delClass>=0){
                  d.medalAllotAdjustClassParamList.splice(delClass,1);
                }
              })
              this.$set(this.medalAllotAdjustParams,'medalAllotAdjustDimensionParams',temp);
            }
          // this.medalAllotAdjustParams.medalAllotAdjustDimensionParam.forEach(m=>{
            // if(this.curTeach)
          
          // })

        }
        console.log(e,1311);
      },
      //全选取消
      handleSelectAll(select){
        this.curTeacher.teacherClassList.forEach(e=>{
          this.handleSelectionChange(select,e)
        })
      },
      //选中修改列
      selectDimension(event,dimension){
        var res = this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.find(e => e.dimension==dimension.dimensionCode);
        if(res){
          console.log(event,1343);
          if(event){
            res.medalAllotAdjustClassParamList = dimension.dimensionClassMedalNumList
          } else {
            res.medalAllotAdjustClassParamList = [];
          }
        } else {
          if(event){
            this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.push({
                dimension: dimension.dimensionCode,
                medalAllotAdjustClassParamList: JSON.parse(JSON.stringify(dimension.dimensionClassMedalNumList))
            })
          } else {
            res.medalAllotAdjustClassParamList = [];
          }
        }
      },
      //选中修改单元格
      handleCellClick(row, column, cell, event){
        if(this.medalTeacherData.type!=3){//不是按维度不处理
          return;
        }
        var dimension = this.curTeacher.dimensionTeacherMedalNumList[column.index];
        var find = dimension.dimensionClassMedalNumList.findIndex(e=>e.classCode==row.classCode);
        //找到单元格位置
        if(find>=0){
          //检查是否选中
          var fres = this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.find(e => e.dimension==dimension.dimensionCode);
          if(fres){//已有维度在维度下添加删除班级
            var findC = fres.medalAllotAdjustClassParamList.findIndex(e=>e.classCode == row.classCode);
            if(findC>=0){//找到班级就删除
              // console.log(fres.medalAllotAdjustClassParamList[findC],1372);
              fres.medalAllotAdjustClassParamList.splice(findC,1);
            } else {
              //否则就添加
              fres.medalAllotAdjustClassParamList.push(row);
            }
          } else {//没有维度直接添加一个维度
            this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.push({
                dimension: dimension.dimensionCode,
                medalAllotAdjustClassParamList: [row]
            })
          }
        }
        // console.log(row,column,cell,1362)
      },
      //确认修改
      async confirmMedalAllot(){
        //验证数字
        var reg = /^[1-9]\d*$|^0$/;
        if(!reg.test(this.medalAllotAdjustParams.rewardNum)){
          this.$notify({type:'error',message:"调整数量请输入0-999的数字"})
          return ;
        } else {
          var num = parseInt(this.medalAllotAdjustParams.rewardNum,10)
          //区分类型
          if(this.medalTeacherData.type!=3){
            //处理数据
            this.medalAllotAdjustParams.medalAllotAdjustClassParamList.forEach(e => e.rewardNum = num);
          } else {
            this.medalAllotAdjustParams.medalAllotAdjustClassParamList=[];
            var tempcount = 0;
            this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.forEach(d => {
              d.medalAllotAdjustClassParamList.forEach(c => c.rewardNum = num);
              if(d.medalAllotAdjustClassParamList.length==0){
                tempcount++;
              }
            })
            if(this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.length==tempcount){
              this.medalAllotAdjustParams.medalAllotAdjustDimensionParams = [];
            }
          }

          if(this.medalAllotAdjustParams.medalAllotAdjustClassParamList.length==0&&this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.length==0){
            this.$notify({type:'error',message:"请选择要修改的数据"})
            return;
          }
          //提交
          console.log(this.medalAllotAdjustParams,1410);
          // setTeacherMedalNum
          var res = await qualityApi.setTeacherMedalNum(this.medalAllotAdjustParams);
          if (res.resultCode != 1) {
            this.$notify({title: "错误", message: res.resultMessage, type: "error"});
            return;
          } else {
            this.$notify({title: "成功", message: "设置成功", type: "success"});
            //刷新数据
            this.showLast('reflash');
            //清空选择
            this.adjustMedalAllot();
          }
          // this.editTeacherDetail = false;          
        }
      },

      //检查是否存在
      checkExist(item,index){
        if(this.medalTeacherData.type!=3){
          var fres = this.medalAllotAdjustParams.medalAllotAdjustClassParamList.find(e => e.classCode==item.classCode);
          return fres!=null;
        } else {
          // console.log(item,1362)
          var fres = this.medalAllotAdjustParams.medalAllotAdjustDimensionParams.find(e => e.dimension==item.dimensionCode);
          if(fres){
            var fres1 = fres.medalAllotAdjustClassParamList.find(e=>e.classCode == item.dimensionClassMedalNumList[index].classCode);
            if(fres1){
              return true;
            }
          }
        }
        return false;
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

  .inlineblock {
    display: inline-block;
  }

  .fl {
    float: left;
  }

  .ml10 {
    margin-left: 10px;
  }

  .w50 {
    width: 50px;
  }

  .w90 {
    width: 90px;
  }

  .w100 {
    width: 100px;
  }

  .w150 {
    width: 150px;
  }

  .w200 {
    width: 200px;
  }

  .w250 {
    width: 250px;
  }

  .w300 {
    width: 300px;
  }

  .fl {
    float: left;
  }

  .ml30 {
    margin-left: 30px;
  }

  .ml0 {
    margin-left: 0px;
  }

  .configureTit {
    padding: 20px 20px 0 20px;
    font-size: 20px;
  }

  .configureCont {
    padding: 20px 40px;
    border-bottom: 1px dotted #d8d8d8;
    .configCol {
      width: 100%;
      padding: 10px 0;
      .configSet {
        display: inline-block;
        padding-left: 20px;
        font-size: 14px;
        .detailSet {
          cursor: pointer;
          color: #66b1ff;
        }
      }
    }
    .configCol.subCfg {
      font-size: 12px;
      color: #666;
    }
  }

  .numConfigMain {
    //max-width: 800px;
    .batConfig {
      float: right;
      width: 100%;
      text-align: right;
      padding-bottom: 5px;
    }
  }

  .configContent {
    background: whitesmoke;
    width: auto;
    margin-top: 10px;
  }

  .bgwhite {
    background: #fff;
  }

</style>
