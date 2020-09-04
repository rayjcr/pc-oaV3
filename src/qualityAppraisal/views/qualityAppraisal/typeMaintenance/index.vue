<template>
    <div class="app-container calendar-list-container">
        <div class="u_TableMain">
            <div class="filter-container">
                <el-input class="searchIpt" v-model="searchtext" placeholder="请输入内容" clearable></el-input>
                <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button class="filter-item" type="primary" @click="addDimension" >新增类型</el-button>
            </div>

            <div class="m_GenTableBox">
                <el-table class="tableBorder middleTable dimensionTable" ref="dimensionTable" :data="dimensionData" row-key="id">
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
                    <el-table-column prop="updateTime" label="最新修改" width="150" align="center"></el-table-column>
                    <el-table-column label="操作" width="250" align="center">
                        <template slot-scope="scope">
                            <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="addSubDimension(scope.row)" :disabled="!(!scope.row.new&&scope.row.level<5)">增加下级类型</el-button> -->
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
        </div>
</div>
  <!-- <el-dialog title="类型维护" :visible.sync="dialogFormVisible"> -->

    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog> -->
</template>

<script>
import _ from 'lodash';
import * as api from '@comm/api/evaluationSetting'
export default {
  name: 'typeMaintenance',
  data(){
    return {
    //   dialogFormVisible: true,
      dimensionData: [],//类型信息,
      searchtext: '',//搜索内容
      dimensionDataSave: [],//缓存类型信息
      editflg: false,//添加或修改类型的flg---限制只能操作一个类型
    }
  },
  mounted(){
      this.getDimension();
      // this.init();
  },
  methods:{
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
  }
}
</script>

<style  scoped lang="scss">

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