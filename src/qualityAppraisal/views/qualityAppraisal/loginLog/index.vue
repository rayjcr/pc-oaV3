<template>
  <div class="app-container calendar-list-container">
    <div class="u_TableMain block ofhide" type="border-card">
      <div class="filter-container">
        <span class="filterTit">时间：</span>
        <el-date-picker style="width:250px;" size="small" v-model="time" @change="changeDate()" value-format="yyyy/MM/dd" class="dataPicker"
                        type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>

        <span class="filterTit ml30">登录类型：</span>
        <el-select v-model="userType" size="small" @change="filterLog" style="width:100px;" clearable>
          <el-option v-for="item in userTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <span class="filterTit ml30">端口：</span>
        <el-select v-model="platform" size="small" @change="filterLog" style="width:100px;" clearable>
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <span class="filterTit ml30">关键字：</span>
        <el-input size="small" v-model="keywords" @blur="filterLog" @clear="filterLog" clearable class="iptfilter"></el-input>
        

        <el-button class="ml30" slot="reference" type="primary" size="small" icon="el-icon-upload2"  @click="exportLogs" :loading="isLoad">导出</el-button>
      </div>

      <div class="m_GenTableBox">
        <el-table class="tableBorder dimensionTable" :data="logData">
          <el-table-column label="账户" prop="userName" ></el-table-column>
          <el-table-column label="登录时间" prop="loginTime" ></el-table-column>
          <el-table-column label="登录类型" prop="userTypeDes" ></el-table-column>
          <el-table-column label="端口" prop="platformDes" ></el-table-column>
          <el-table-column label="IP地址" prop="ip" ></el-table-column>
        </el-table>

        <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageLimit" :current-page="curPage" @current-change="handleCurrentChange"></el-pagination>

      </div>
    </div>
  </div>
</template>

<script>
import * as loginApi from '@comm/api/login.js';
export default {
    name: "loginLog",
    data() {
        return {
        time: '',
        userType: '',
        userTypeList: [
            {
            value: "0",
            label: "未知"
            },
            {
            value: "1",
            label: "系统管理员"
            },
            {
            value: "2",
            label: "学校管理员"
            },
            {
            value: "3",
            label: "老师"
            },
            {
            value: "4",
            label: "学生"
            },
            {
            value: "5",
            label: "教育局"
            },
            {
            value: "6",
            label: "其他用户"
            }
        ],
        platform: '',
        platformList: [
            {
            value: "0",
            label: "未知"
            },
            {
            value: "1",
            label: "PC端管理后台"
            },
            {
            value: "2",
            label: "综合素质移动端"
            },
            {
            value: "3",
            label: "电子班牌"
            },
            {
            value: "4",
            label: "综合素质评价PC版"
            }
        ],
        startTime:'',
        endTime:'',
        keywords:'',
        logData: [],
        total: 0, // 总条数
        pageLimit: 20, // 每页限制条数
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
            const {schoolCode,curPage,pageLimit,userType,platform,startTime,endTime,keywords} = this;
            var param = {};
            param.schoolCode = this.$cookie.get('xxdm');
            param.page = curPage;
            param.limit = pageLimit;
            param.userType = userType;
            param.platform = platform;
            param.keywords = keywords;
            if(startTime){
                param.startTime = startTime;
            }
            if(endTime){
                param.endTime = endTime;
            }
            var res = await loginApi.logPage(param)
            if(res.resultCode!=1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return false
            }
            this.logData = res.value.dataList;
            this.total = res.value.totalCount;
            // console.log(res,"8899")

        },
        changeDate(){
            if(this.time){
                this.startTime = this.time[0].replace(/-/g,"/");
                this.endTime = this.time[1].replace(/-/g,"/");
            }else{
                this.startTime = '';
                this.endTime = '';
            }
            this.getLogList();
        },
        async exportLogs(){
            this.isLoad = true;
            const {schoolCode,curPage,pageLimit,userType,platform,startTime,endTime,keywords} = this;
            var param = {};
            param.schoolCode = this.$cookie.get('xxdm');
            param.userType = userType;
            param.platform = platform;
            param.keywords = keywords;
            if(startTime){
                param.startTime = startTime;
            }
            if(endTime){
                param.endTime = endTime;
            }
            var res = await loginApi.logExport(param);
            console.log(res,"666");
            try{
                var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
            　　downloadElement.download = '登录日志.xlsx'; //下载后文件名
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
        filterLog(){
            this.curPage = 1;
            this.getLogList();
        },
        handleCurrentChange(page) {
            this.curPage = page;
            this.getLogList();
            console.log(page,this.curPage)
        }
    }
}
</script>

<style scoped>
.ml30{
    margin-left: 30px;
}
.iptfilter{
    width: 100px;
}
</style>
