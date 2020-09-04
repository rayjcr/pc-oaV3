<template>
    <div class="app-container calendar-list-container">
        <div class="u_TableMain">
            <div class="filter-container">
                <el-input class="searchIpt" v-model="searchtext" placeholder="请输入内容" clearable></el-input>
                <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button class="filter-item" type="primary" @click="addDimension" icon="el-icon-plus">新建评价维度</el-button>
            </div>

            <div class="m_GenTableBox">
                <el-table class="tableBorder middleTable dimensionTable" ref="dimensionTable" :data="dimensionData" row-key="id" :tree-props="{children: 'dimensionItemVOList'}">
                    <el-table-column prop="name" label="维度名称">
                        <template slot-scope="scope">
                           
                            <div class="inline" v-if="!scope.row.name||scope.row.edit">
                                <el-input v-model="scope.row.name" style="width:150px;" maxlength="10" placeholder="请输维度名称" size="mini"></el-input>
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
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="addSubDimension(scope.row)" :disabled="!(!scope.row.new&&scope.row.level<5)">增加下级维度</el-button>
                            <!-- <i class="el-icon-afsadf" style="width: 116px;height: 14px;margin: 0 8px;" v-else></i>无意义，占位 -->
                            <!-- <span class="addfont">增加下级维度</span> -->
                            <!-- 没有子维度且不在编辑状态才可以删 -->
                            <el-button  type="danger" icon="el-icon-delete" size="mini" :disabled="!((!scope.row.dimensionItemVOList||scope.row.dimensionItemVOList.length==0)&&!scope.row.edit)" @click="deleteDimension(scope.row)">删除</el-button>
                            <!-- <i class="delfont el-icon-delete" v-if="(!scope.row.dimensionItemVOList||scope.row.dimensionItemVOList.length==0)&&!scope.row.edit" @click="deleteDimension(scope.row)"></i> -->
                            <!-- <i class="el-icon-afsadf" style="width: 68px;height: 14px;margin: 0 8px;" v-else></i>无意义，占位 -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import * as api from '@comm/api/evaluationSetting'
export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            dimensionData: [],//维度信息,
            searchtext: '',//搜索内容
            dimensionDataSave: [],//缓存维度信息
            editflg: false,//添加或修改维度的flg---限制只能操作一个维度
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

    },
    mounted(){
        this.getDimension();
        // this.init();
    },
    methods: {
        /**
         * 新增一级维度
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
                level: 1,//一级维度
                pid: '0',
                pids: '0',
                edit:true,
                new: true,
            })
        },
        /**
         * 新增其他维度
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
            if(row.dimensionItemVOList){
                row.dimensionItemVOList.unshift({
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
                this.$set(row,"dimensionItemVOList",[]);
                // row.children = [];
                row.dimensionItemVOList.unshift({
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
        //删除维度
        deleteDimension(row){
            console.log(row)
            //弹框确认
            this.$confirm('此操作将永久删除该维度, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //请求删除
                api.deleteDimension(row.id).then(res=>{
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
        //编辑维度
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
        //取消新建维度
        cancel(row){
            if(row.pids){//是子维度
                var pids = row.pids.split(',');
                var temp = this.dimensionData
                pids.forEach(pid=>{
                    var item = temp.find(d => d.id==pid);
                    if(item){
                        temp=item.dimensionItemVOList
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
        //保存新建/编辑维度
        saveDimension(row){
            if(row.name!=''){
                this.$set(row,"edit",false);
                //这里要提交已保存的维度然后刷新
                var params = {
                    level:row.level,
                    name:row.name,
                    pid:row.pid,
                    pids: row.pids
                }
                console.log(params);
                //这里要做判断是否为新建
                if(row.new){//新建
                    api.addDimension(params).then(res=>{
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
                    api.updateDimension(row.id,params).then(res=>{
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
                    message: '请填写维度名称！',
                    duration: 1000
                });   
            }   
        },
        // 获取所有维度
        getDimension(name){
            api.getAllDimension().then(res=>{
                // console.log(res,"6666")
                // var resdata = res.value;
                // var arr = []
                // resdata.forEach(element => {//循环列表做处理
                //     if(element.pids!=null&&element.pids!="0"){//如果是子维度
                //         var pids = element.pids.split(',');
                //         var temp = arr;
                //         pids.forEach(pid=>{//循环查找创建他的父维度
                //             if(pid=="0"){

                //             } else {
                //                 var item = temp.find(e => e.id==pid);
                //                 if(item){//如果找到父维度
                //                     //继续找    
                //                     if(!item.dimensionItemVOList){
                //                         this.$set(item,'dimensionItemVOList',[]);
                //                     }
                //                     temp = item.dimensionItemVOList;//
                //                 } else {//如果没找到父维度
                //                     //增加这个维度的值
                //                     temp.push({id:Number(pid),dimensionItemVOList:[]});
                //                     temp = temp[temp.length-1].dimensionItemVOList;//一直往下找  
                //                 }
                                                              
                //             }

                //         })
                //         //找到位置后放入该维度
                //         var ind = temp.findIndex(t=>t.id==element.id)
                //         if(ind==-1){//没有新建过
                //             temp.push(element);
                //         } else {
                //             element.dimensionItemVOList = temp[ind].dimensionItemVOList;
                //             temp[ind] = element;
                //         }
                        
                //     }else{//父维度
                //         var ind = arr.findIndex(e=>e.id==element.id);//找这个维度是否已经被创建
                //         if(ind>-1){//创建就更新
                //             element.dimensionItemVOList = arr[ind].dimensionItemVOList;
                //             arr[ind] = element;
                //         } else {//没创建就创建
                //             arr.push(element);
                //         }
                //     }
                // });
                // this.dimensionData = arr;
                // this.dimensionDataSave = arr;
                // console.log(arr);
                this.dimensionData = res.value;
                this.dimensionDataSave = res.value;
            })
        },
        // 根据名称搜索维度
        search(){
            api.getAllDimension({name:this.searchtext}).then(res =>{
                var resdata = res.value;
                // var arr = []
                // resdata.forEach(element => {//循环列表做处理
                //     if(element.pids!=null&&element.pids!="0"){//如果是子维度
                //         var pids = element.pids.split(',');
                //         var temp = arr;
                //         pids.forEach(pid=>{//循环查找创建他的父维度
                //             if(pid=="0"){

                //             } else {
                //                 var item = temp.find(e => e.id==pid);
                //                 if(item){//如果找到父维度
                //                     //继续找    
                //                     if(!item.dimensionItemVOList){
                //                         this.$set(item,'dimensionItemVOList',[]);
                //                     }
                //                     temp = item.dimensionItemVOList;//
                //                 } else {//如果没找到父维度
                //                     //增加这个维度的值
                //                     temp.push({id:Number(pid),dimensionItemVOList:[]});
                //                     temp = temp[temp.length-1].dimensionItemVOList;//一直往下找  
                //                 }
                                                              
                //             }

                //         })
                //         //找到位置后放入该维度
                //         var ind = temp.findIndex(t=>t.id==element.id)
                //         if(ind==-1){//没有新建过
                //             temp.push(element);
                //         } else {
                //             element.dimensionItemVOList = temp[ind].dimensionItemVOList;
                //             temp[ind] = element;
                //         }
                        
                //     }else{//父维度
                //         var ind = arr.findIndex(e=>e.id==element.id);//找这个维度是否已经被创建
                //         if(ind>-1){//创建就更新
                //             element.dimensionItemVOList = arr[ind].dimensionItemVOList;
                //             arr[ind] = element;
                //         } else {//没创建就创建
                //             arr.push(element);
                //         }
                //     }
                // });
                this.dimensionData = res.value;          
            })
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
</style>
