<template>
  <div class="app-container calendar-list-container">

    <div class="u_TableMain block ofhide" type="border-card">
      <div class="filter-container">

        <span class="filterTit">时间：</span>
        <el-date-picker size="small" @change="getList(1)" v-model="searchTime" value-format="yyyy-MM-dd"
                        class="dataPicker" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>

        <span class="filterTit ml30">选择维度：</span>
        <el-cascader size="small" @change="getList(1)" class="selMargin" v-model="searchDimensionId" placeholder="请选择维度"
                     style="width:200px;" :options="dimensionOptions" filterable
                     :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList',disabled:'' }"
                     clearable></el-cascader>

        <span class="filterTit ml30">奖励类型：</span>
        <el-select v-model="rewardType" @change="getList(1)" size="small" clearable>
          <el-option label="勋章" :value="2"></el-option>
          <el-option label="分数" :value="1"></el-option>
        </el-select>

        <span class="filterTit ml30">状态：</span>
        <el-select v-model="status" @change="getList(1)" size="small" clearable>
          <el-option label="正常" :value="1"></el-option>
          <el-option label="锁定" :value="2"></el-option>
        </el-select>

        <div class="mt10">
          <el-button type="primary" size="medium" @click="createQRcode">生成二维码</el-button>
        </div>
      </div>
      <div class="m_GenTableBox">

        <el-table class="tableBorder dimensionTable" :v-loading="tbLoading" :data="tableData">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column label="生成时间" prop="createTime" width="150">
            <template slot-scope="scope">
              {{scope.row.createTime.split(':')[0]+':'+scope.row.createTime.split(':')[1]}}
            </template>
          </el-table-column>
          <el-table-column label="关联维度" prop="dimensionName" width="150">
          </el-table-column>
          <el-table-column label="奖励类型" prop="rewardType">
            <template slot-scope="scope">
              {{scope.row.rewardType==1?'分数':'勋章'}}
            </template>
          </el-table-column>
          <el-table-column label="奖励数量" prop="rewardNum">
          </el-table-column>
          <el-table-column label="关联教师" prop="teacherList">
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="light" :content="getNames(scope.row.teacherList)" placement="bottom">
                <div class="textOverflow">{{getNames(scope.row.teacherList)}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="兑换有效期">
            <template slot-scope="scope">
              <div v-if="scope.row.effectiveStatus == 1">不限</div>
              <div v-else>{{scope.row.effectiveStartTime}} 至 {{scope.row.effectiveEndTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="已使用/总生成">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="300"
                trigger="hover"
                v-if="scope.row.teacherList">
                <el-table :data="scope.row.teacherList">
                  <!-- <el-table-column width="150" property="date" label="日期"></el-table-column> -->
                  <el-table-column property="teacherName" label="姓名"></el-table-column>
                  <el-table-column property="used" label="已使用">
                    <template slot-scope="scope">
                      {{scope.row.used?scope.row.used:0}}
                    </template>
                  </el-table-column>
                  <el-table-column property="number" label="总生成"></el-table-column>
                </el-table>
                <div slot="reference">{{scope.row.usedNum}}/{{scope.row.number}}</div>
              </el-popover>
              <div v-else>{{scope.row.usedNum}}/{{scope.row.number}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.status==1?'正常':'锁定'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="showDownload(scope.row)">下载</el-button>
                <el-button type="text" @click="setStatus(scope.row)">{{scope.row.status==1?'锁定':'解锁'}}</el-button>
                <el-button type="text" @click="deleteQRcode(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next" :total="ruleItemSum"
                       :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination>

      </div>
    </div>

    <!-- 下载二维码弹框 -->
    <el-dialog title="下载二维码" :close-on-click-modal="false" :close-on-press-escape="false" @close="downloading=false"
               :visible.sync="dialogVisible" width="400px">
      <div>
        <el-form ref="downloadform" :rules="downloadRules" :model="downloadInfo">
          <el-form-item label="下载类型：" prop="QRcodeType">
            <template>
              <el-radio v-model="downloadInfo.QRcodeType" label="1">基础二维码</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="尺寸：" prop="QRcodeSize">
            <el-input v-model="downloadInfo.QRcodeSize" maxlength="4" class="w200"
                      placeholder="请输入100-1000的数字"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="downloading" @click="download(nowSelect)">下载</el-button>
                <el-button @click="dialogVisible = false;downloading = false">取消</el-button>
            </span>
    </el-dialog>

    <!-- 生成二维码弹框 -->
    <el-dialog title="生成二维码" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel"
               :visible.sync="dialogCreateQRcodeVisible" width="400px">
      <div>
        <el-form ref="form" :model="QRdata" :rules="rules" label-width="100px">
          <el-form-item label="选择维度：" prop="dimensionId">
            <el-cascader size="small" separator='-' class="selMargin" ref="cascaderAddr" v-model="QRdata.dimensionId"
                         placeholder="请选择维度" style="width:200px;" :options="dimensionOptions" filterable
                         :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList' }"
                         clearable></el-cascader>
          </el-form-item>
          <el-form-item label="奖励类型：" prop="rewardType">
            <el-radio-group v-model="QRdata.rewardType">
              <el-radio label="1">分数</el-radio>
              <el-radio label="2">勋章</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="奖励数量：" prop="rewardNumber">
            <el-input v-model="QRdata.rewardNumber" size="small" class="w200" maxlength="2"
                      placeholder="请输入1-99数字"></el-input>
          </el-form-item>

          <el-form-item label="兑换有效期：" prop="effectiveStatus">
            <el-radio-group v-model="QRdata.effectiveStatus">
              <el-radio label="1">不限</el-radio>
              <el-radio label="2">限制</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-show="QRdata.effectiveStatus == 2">
            <el-date-picker
              size="small"
              :picker-options="pickerOptions"
              v-model="QRdata.time"
              value-format="yyyy-MM-dd"
              class="dataPicker"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <p style="margin-top: 10px;color: #F56C6C;font-size: 13px;">此次生成的二维码，只能在有效期内才能兑换成功</p>
          </div>

          <el-form-item label="发卡人：" prop="person">
            <el-radio-group v-model="QRdata.person" @change="QRdata.createNumber=''">
              <el-radio label="1">不限</el-radio>
              <el-radio label="2">指定教师</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生成数量：" prop="createNumber" v-if="QRdata.person==1">
            <el-input v-model="QRdata.createNumber" size="small" class="w200" maxlength="3"
                      placeholder="请输入1-999数字"></el-input>
          </el-form-item>


          <div v-if="QRdata.person==2">
            <el-table
              :data="QRdata.teachers"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="教师姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="number"
                label="生成数量"
                width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.number" size="small" class="w60" maxlength="3"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="text" @click="selectTeacher">+选择教师</el-button>
          </div>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submiting" @click="submit">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </span>
    </el-dialog>

    <!-- 选择教师 -->
    <multipleselect ref="selectTeacher" v-bind:teacherList="teacherList" :checkTeacher="checkteacher"
                    v-bind:multipleLimit='100' @handleChangeSel="handleChangeSel"></multipleselect>
  </div>
</template>

<script>
  import _ from 'lodash';
  import * as qualityApi from '@comm/api/qualityAppraisal';
  import * as api from '@comm/api/evaluationSetting';
  import multipleselect from '@comm/components/multipleSelect/index';
  import {teachclassAll} from '@comm/api/admin/teachclass/index';

  export default {
    name: "QRcodeExchange",
    components: {
      multipleselect,
    },
    data() {
      const oneto99 = (rule, value, callback) => {
        var reg = /^[1-9]\d*$/;
        if (!reg.test(value)) {
          callback('请输入1-99之间的数字');
        } else {
          callback();
        }
      };
      const oneto999 = (rule, value, callback) => {
        var reg = /^[1-9]\d*$/;
        if (!reg.test(value)) {
          callback('请输入1-999之间的数字');
        } else {
          callback();
        }
      };
      const one100to1000 = (rule, value, callback) => {
        var reg = /^[1-9]{1}\d{2}$/;
        console.log(value == '1000', 187)
        if (!reg.test(value)) {
          if (value != '1000') {
            callback('请输入100-1000之间的数字');
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

      return {
        schoolCode: this.$cookie.get('xxdm'),       //学校代码
        textMap: {
          update: '编辑',
          create: '新增'
        },
        searchTime: [],                                  //搜索的时间
        searchDimensionId: '',                          //搜索的维度
        rewardType: '',                                 //搜索的奖励类型
        status: '',                                     //搜索的状态
        dialogCreateQRcodeVisible: false,               //生成二维码弹框
        tableData: [],                                             //表格
        dialogVisible: false,                           //下载二维码弹框
        ruleItemSum: 0,                                  //总条数
        curPage: 1,                                      //当前页码
        pageLimit: 10,                                   //每页限制记录条数
        downloading: false,                             //下载二维码loading
        QRdata: {                                        //生成二维码表格
          dimensionId: '',                            //选择维度
          dimensionName: '',                          //维度名称
          rewardType: '1',                             //奖励类型
          rewardNumber: '',                           //奖励数量
          effectiveStatus: '1',                       //兑换有效期设置 0,不限 1，限制
          time: [],                                   //兑换有效期时间
          person: '1',                                //发卡人设置
          createNumber: '',                           //生成数量
          teachers: [],                               //各个老师和数量
        },
        pickerOptions: {                                // 限制兑换有效期不能选择当前时间一天之前的时间
          disabledDate: (time) => {
            let nowData = new Date()
            nowData = new Date(nowData.setDate(nowData.getDate() - 1))
            return time < nowData
          }
        },
        submiting: false,                                //提交loading
        dimensionOptions: [],                            //可选择的维度
        rules: {
          dimensionId: [{required: true, message: '请选择维度', tigger: 'blur'}],
          rewardType: [{required: true, message: '请选择奖励类型', tigger: 'blur'}],
          rewardNumber: [
            {required: true, message: '请输入奖励数量', tigger: 'blur'},
            {validator: oneto99, trigger: 'blur'}
          ],
          person: [{required: true, message: '请选择发卡人', tigger: 'blur'}],
          createNumber: [{validator: oneto999, tigger: 'blur'}],
        },
        nowSelect: {},                                   //当前选择的内容
        teacherList: [],                                 //所有教师列表
        checkteacher: [],                                //选中的教师列表
        tbLoading: false,                               //表格loading
        downloadRules: {
          QRcodeType: [{required: true, message: '请选择下载类型', tigger: 'blur'}],
          QRcodeSize: [{required: true, message: '尺寸请输入100-1000的数字', tigger: 'blur'},
            {validator: one100to1000, tigger: 'blur'}]
        },                                              //下载验证
        downloadInfo: {
          QRcodeType: '1',                                //下载类型--基础二维码
          QRcodeSize: '300',                                //二维码大小--默认300
        }
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
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getDimension();
        this.getTeacherList();
        this.getList();
      },
      //页面切换
      rulePageChange(curPage) {
        // console.log(curPage,245)
        // this.curPage = curPage;
        this.getList(curPage);
      },
      //生成二维码
      createQRcode() {
        this.dialogCreateQRcodeVisible = true;
        this.QRdata.teachers = [];
        this.QRdata.time = [];
      },
      //下载二维码
      download(row) {
        this.$refs.downloadform.validate((valid) => {
          if (valid) {
            this.downloading = true;
            var params = {
              schoolCode: this.schoolCode,
              size: this.downloadInfo.QRcodeSize,
              qrId: row.id,
            }
            qualityApi.downloadQRcode(params).then(res => {
              const blob = new Blob([res], {
                type:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
              });
              const downloadElement = document.createElement('a');
              const href = window.URL.createObjectURL(blob); // 创建下载的链接
              console.log(blob, 245)
              downloadElement.href = href;
              downloadElement.download = row.createTime + '兑换二维码.zip'; // 下载后文件名
              document.body.appendChild(downloadElement);
              downloadElement.click(); // 点击下载
              document.body.removeChild(downloadElement); // 下载完成移除元素
              window.URL.revokeObjectURL(href); // 释放掉blob对象
              this.dialogVisible = false;
              this.downloading = false;
              // this.exportLoading = false;
            }).catch(err => {
              this.downloading = false;
              console.log(err, 328)
              this.$notify({
                title: '错误',
                message: '下载二维码失败，请重新下载！',
                type: 'error'
              });
            })
          } else {
            console.log('error submit!!');
            this.downloading = false;
            return false;
          }
        });

      },
      //获取所有维度供选择
      getDimension() {
        api.getAllDimension().then(res => {
          // var resdata = [];
          var arr = res.value
          this.checkDisable(arr);
          console.log(arr);
          this.dimensionOptions = arr
          // this.dimensionOptions = res.value;
        })
      },
      //根据hasMedal来检查是否可选
      checkDisable(arr) {
        // ,disabled: 'hasMedal'
        for (var i of arr) {
          i.disabled = !i.hasMedal;
          if (i.dimensionItemVOList && i.dimensionItemVOList.length > 0) {
            this.checkDisable(i.dimensionItemVOList);
          }
        }
      },
      //提交表格
      submit() {
        this.submiting = true;
        //验证教师
        if (this.QRdata.person == 2) {
          if (this.QRdata.teachers.length == 0) {
            this.$notify({
              title: '错误',
              message: '请选择教师',
              type: 'error'
            });
            this.submiting = false;
            return;
          }
          for (var ind = 0; ind < this.QRdata.teachers.length; ind++) {
            var t = this.QRdata.teachers[ind]
            var reg = /^[1-9]\d*$/;
            if (!reg.test(t.number)) {
              this.$notify({
                title: '错误',
                message: '生成数量为1-999的数字',
                type: 'error'
              });
              this.submiting = false;
              return;
            }

          }
        }
        //验证兑换二维码有效期是否填写
        if(this.QRdata.effectiveStatus == 2 && !this.QRdata.time[0]) {
          this.$notify({
            title: '错误',
            message: '缺少有效起止时间',
            type: 'error'
          });
          this.submiting = false;
          return;
        }
        //验证
        this.$refs.form.validate((valid) => {
          if (valid) {
            var params = {
              dimensionId: this.QRdata.dimensionId,
              dimensionName: this.$refs['cascaderAddr'].inputValue,
              rewardNum: this.QRdata.rewardNumber,
              number: this.QRdata.createNumber,
              rewardType: this.QRdata.rewardType,
              schoolCode: this.$cookie.get('xxdm'),
              teachers: this.QRdata.teachers,
              effectiveStatus: this.QRdata.effectiveStatus,
              effectiveStartTime: this.QRdata.time[0],
              effectiveEndTime: this.QRdata.time[1]
            }
            qualityApi.createQRcode(params).then(res => {
              console.log(res)
              if (res.resultCode == 1) {
                this.dialogCreateQRcodeVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建二维码成功！',
                  type: 'success'
                });
                this.$refs.form.resetFields();
                this.QRdata.teachers = [];
                this.submiting = false;
                this.getList();
              } else {
                this.$notify({
                  title: '错误',
                  message: res.resultMessage,
                  type: 'error'
                });
                this.submiting = false;
              }
            }).catch(err => {
              this.submiting = false;
            })
          } else {
            console.log('error submit!!');
            this.submiting = false;
            return false;
          }
        });
      },
      //取消提交表格
      cancel() {
        this.dialogCreateQRcodeVisible = false;
        this.$refs.form.resetFields();
      },
      //获取列表
      getList(page = this.curPage, limit = this.pageLimit) {
        this.tbLoading = true;
        var params = {
          page, limit,
          dimensionId: this.searchDimensionId,
          startTime: this.searchTime ? this.searchTime[0] : null,
          endTime: this.searchTime ? this.searchTime[1] : null,
          rewardType: this.rewardType,
          schoolCode: this.schoolCode,
          status: this.status,
        }
        qualityApi.getQRcodeList(params).then(res => {
          if (res.resultCode == 1) {
            this.tableData = res.value.dataList;
            this.ruleItemSum = res.value.totalCount;
            this.tbLoading = false;
            this.curPage = page;
          } else {
            this.$notify({
              title: '错误',
              message: res.message,
              type: 'error'
            });
            this.tbLoading = false;
          }
        }).catch(err => {
          this.tbLoading = false;
        })
      },
      //点击下载按钮弹框
      showDownload(row) {
        this.dialogVisible = true;
        this.nowSelect = row;
        this.downloadInfo.QRcodeSize = '300';
      },
      //修改状态
      setStatus(row) {
        var msg = row.status == 1 ? '锁定' : '解锁'
        this.$confirm('是否确认' + msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = row.status == 1 ? 2 : 1;
          qualityApi.changeQRcodeStatus(row).then(res => {
            //提示
            if (res.resultCode == 1) {
              this.$notify({
                title: '成功',
                message: '修改状态成功！',
                type: 'success'
              });
              this.getList();
            } else {
              this.$notify({
                title: '错误',
                message: res.message,
                type: 'error'
              });
            }
          }).catch(err => {
            this.$notify({
              title: '错误',
              message: '网络异常，请检查网络后重试！',
              type: 'error'
            });
          })
        }).catch(() => {
        });
      },
      //删除
      deleteQRcode(row) {
        this.$confirm('确定要删除该二维码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          qualityApi.deleteQRcode(row.id).then(res => {
            //提示
            if (res.resultCode == 1) {
              this.$notify({
                title: '成功',
                message: '删除二维码成功！',
                type: 'success'
              });
              this.getList();
            } else {
              this.$notify({
                title: '错误',
                message: res.message,
                type: 'error'
              });
            }
          }).catch(err => {
            // this.$notify({
            //   title: '错误',
            //   message: '网络异常，请检查网络后重试！',
            //   type: 'error'
            // });
          })
        }).catch(() => {
        });
      },
      /**
       * 获取所有教师列表
       * by:RayJ
       * time:2019-07-23
       */
      async getTeacherList() {
        var res = await teachclassAll({xxdm: this.$cookie.get('xxdm')});
        this.teacherList = res.data.jsList;
      },
      //点击选择教师
      selectTeacher() {
        this.checkteacher = [];
        var checkTeacherTemp = $.extend(true, [], this.QRdata.teachers);
        checkTeacherTemp = JSON.parse(JSON.stringify(checkTeacherTemp).replace(/zgh/g, "gh"));
        checkTeacherTemp = JSON.parse(JSON.stringify(checkTeacherTemp).replace(/name/g, "xm"));
        //设置当前选中的教师的列表
        this.checkteacher = checkTeacherTemp;
        this.$nextTick(() => {
          //唤醒选择教师的弹层组件
          this.$refs.selectTeacher.showSelect();
        })
      },
      //确定选择的老师
      handleChangeSel(val) {
        console.log(val, 460)
        this.QRdata.teachers = [];
        for (var teacher of val) {
          this.QRdata.teachers.push({
            name: teacher.xm,
            zgh: teacher.gh,
            number: 0,
            checked: true,
          })
        }
        this.$refs.selectTeacher.cancal();
      },
      //获取教师姓名列表
      getNames(teachers) {
        var names = ''
        if (teachers == null) {
          return names;
        }
        for (var ind = 0; ind < teachers.length; ind++) {
          var t = teachers[ind];
          names += t.teacherName
          if (ind != teachers.length - 1) {
            names += ','
          }
        }
        return names;
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

  .w60 {
    width: 60px;
  }

  .w100 {
    width: 100px;
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

  .mt10 {
    margin-top: 10px;
  }

  .filterTit {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  .filter-container.innerTab {
    line-height: 0px;
    padding: 0 20px;
    padding-bottom: 15px;
    min-height: auto;
  }

  .filterPopBox {
    padding: 5px;
    .filterCol {
      width: 100%;
      position: relative;
      padding: 5px 0;
      padding-left: 70px;
      .filterTit {
        position: absolute;
        width: 60px;
        left: 0;
        height: 32px;
        line-height: 32px;
        text-align: right;
      }
    }
  }

  .goodsType {
    width: 350px;
    float: left;
    margin-right: 20px;
  }

  .dimensionTable {

    /deep/ .inline {
      display: inline;
    }
    /deep/ .cell {
      line-height: 28px;
    }
    .dimensionImg {
      width: 40px;
      height: 40px;
      display: inline-block;
      float: left;
      margin-right: 4px;
      border-radius: 20px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .dataPicker {
    /deep/ .el-range-separator {
      padding: 0;
    }
  }

  .dimensionTable .green {
    font-weight: 700;
    color: #208900;
    line-height: 40px;
  }

  .dimensionTable .red {
    font-weight: 700;
    color: #ff334b;
    line-height: 40px;
  }

  .textOverflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

</style>
