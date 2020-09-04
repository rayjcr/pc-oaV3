<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain block ofhide" type="border-card">
      <div class="filter-container">
        <div class="filterBg">
          <div class="conditionBox">
            <span class="filterTit">时间：</span>
            <el-date-picker size="small" v-model="time" @change="changeDate()" value-format="yyyy-MM-dd" class="dataPicker"
                            type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
          </div>

          <div class="conditionBox">
            <span class="filterTit">端口：</span>
            <el-select v-model="logPort" size="small" @change="filterLog" style="width:100px;" clearable>
              <el-option v-for="item in portList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>

          <div class="conditionBox">
            <span class="filterTit">模块：</span>
            <el-input size="small" v-model="modules" @blur="filterLog" @clear="filterLog" clearable class="iptfilter"></el-input>
          </div>
          <!-- <el-select v-model="modules" size="small" @change="getLogList()" style="width:100px;" clearable>
            <el-option v-for="item in moduleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <div class="conditionBox">
            <span class="filterTit">操作：</span>
            <el-input size="small" v-model="operation" @blur="filterLog" @clear="filterLog" clearable class="iptfilter"></el-input>
          </div>

          <div class="conditionBox">
            <span class="filterTit">关键字：</span>
            <el-input size="small" v-model="userName" @blur="filterLog" @clear="filterLog" clearable class="iptfilter"></el-input>
          </div>

        </div>
        <!-- <el-select v-model="operation" size="small" @change="getLogList()" style="width:100px;" clearable>
          <el-option v-for="item in operationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
        <div class="mt10">
          <el-button slot="reference" type="primary" size="small" icon="el-icon-upload2"  :loading="isLoad" @click="exportLogs">导出</el-button>
        </div>

      </div>

      <div class="m_GenTableBox">
        <el-table class="tableBorder dimensionTable" :data="logData">
          <el-table-column label="账户" prop="userName" width="160"></el-table-column>
          <el-table-column label="账户类型" prop="userType" width="100"></el-table-column>
          <el-table-column label="操作时间" prop="updateTime" width="160"></el-table-column>
          <el-table-column label="端口" prop="requestType" width="120"></el-table-column>
          <el-table-column label="模块" prop="module" width="160"></el-table-column>
          <el-table-column label="操作" prop="operation" width="160"></el-table-column>
          <el-table-column label="描述" prop="desc" :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                  <span>{{ scope.row.desc }}</span>
              </template>
          </el-table-column>
        </el-table>

        <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageLimit" :current-page="curPage" @current-change="handleCurrentChange"></el-pagination>

      </div>
    </div>
  </div>
</template>

<script>
import * as qualityApi from '@comm/api/qualityAppraisal';
export default {
    name: "operationLog",
    data() {
      return {
        time: '',
        portList: [
          {
            value: "0",
            label: "管理后台"
          },
          {
            value: "1",
            label: "移动教师端"
          },
          {
            value: "2",
            label: "移动学生端"
          },
          {
            value: "3",
            label: "电子班牌"
          }
        ],
        moduleList:[],
        operationList:[],
        logData: [],                    //日志数据
        startTime:'',
        endTime:'',
        logPort:'',
        modules:'',
        userName:'',
        userType:'',
        operation:'',
        keywords:'',
        total: 0, // 总条数
        pageLimit: 10, // 每页限制条数
        curPage: 1, // 当前页码
        isLoad:false,
      }
    },
    mounted(){
        this.getLogList();
    },
    methods: {
        /*
        * 获取登录日志列表
        * @param page 当前页码
        * @parma limit 每页显示条数
        * */
        async getLogList() {
            const {startTime,endTime,curPage,pageLimit,logPort,modules,userName,userType,operation} = this;
            var res = await qualityApi.getLogPage({startTime:startTime,endTime:endTime,page:curPage,limit:pageLimit,logPort:logPort,module:modules,operation:operation,userName:userName});
            if(res.resultCode!=1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return false
            }
            this.logData = res.value.dataList;
            this.total = res.value.totalCount;
            // console.log(res,"res"); 
        },
        changeDate(){
            if(this.time){
                this.startTime = this.time[0];
                this.endTime = this.time[1];
            }else{
                this.startTime = '';
                this.endTime = '';
            }
            this.getLogList();
        },
        filterLog(){
            this.curPage = 1;
            this.getLogList();
        },
        async exportLogs(){
            this.isLoad = true;
            const {startTime,endTime,curPage,pageLimit,logPort,modules,userName,userType,operation} = this;
            var res = await qualityApi.exportLog({startTime:startTime,endTime:endTime,page:curPage,limit:pageLimit,logPort:logPort,module:modules,operation:operation});
            // console.log(res);
            try{
                var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
            　　downloadElement.download = '操作日志.xlsx'; //下载后文件名
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象
                this.$notify({title:"提示",message:"导出成功",type:"success"});
                this.isLoad = false
            }catch(e){
                this.$notify({title:"错误",message:"导出失败，请联系管理员",type:"error"});
                this.isLoad = false
            }

        },
        handleCurrentChange(page) {
            this.curPage = page;
            this.getLogList();
            // console.log(page,this.curPage)                                                                                                                
        }
    }   
}
</script>

<style scoped lang='scss'>
.ml30{
    margin-left: 30px;
}
.iptfilter{
    width: 100px;
}
.dataPicker{
    width: 250px;
}
// .m_GenTableBox{
//   /deep/ .el-table .cell{
//       max-height: 46px;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//   }
// }
</style>
<style>
.el-tooltip__popper{
  line-height: 24px !important;
  max-width: 400px !important;
}
</style>
