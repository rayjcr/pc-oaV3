<template>
    <div class="app-container calendar-list-container">

        <transition name="sliderLeft">
            <div class="u_TableMain block goodsType" v-if="typeEdit">
                <div class="filter-container goodsTypeTit">
                    商品类型管理
                    <i class="closeType el-icon-circle-close" @click="editGoodsType"></i>
                </div>
                <div class="m_GenTableBox">
                    <el-button size="small" icon="el-icon-plus" type="primary" style="margin-bottom:20px;" @click="addGoodsType">新增分类</el-button>
                    <el-table class="tableBorder dimensionTable" :data="goodsTypeList">
                        <el-table-column label="名称" prop="name">
                            <template slot-scope="scope">
                                <div v-if="!scope.row.name||scope.row.isedit">
                                    <el-input size="small" v-model="scope.row.name" class="w150" maxlength="20" placeholder="请输入类别名称" @blur="saveGoodsType(scope)"></el-input>
                                </div>
                                <div v-else>
                                    {{scope.row.name}} <i class="dimensionEdit el-icon-edit" @click="editType(scope)"></i>
                                </div>
                            </template>

                        </el-table-column>
                        <el-table-column label="操作" align="center" width="100">
                            <template slot-scope="scope">
                                <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                    <p>是否删除此商品分类</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="delClose(scope.row)">取消</el-button>
                                        <el-button type="primary" size="mini" @click="deleteGoodsType(scope)">确定</el-button>
                                    </div>
                                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </transition>

        <el-tabs class="u_TableMain block ofhide" type="border-card">
            <!--商品列表-->
            <el-tab-pane>
                <span slot="label"><i class="el-icon-goods"></i> 商品列表</span>
                <div class="filter-container innerTab">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="addGoods">新增商品</el-button>
                    <el-button type="primary" size="small" icon="el-icon-s-grid" @click="editGoodsType">商品分类</el-button>
                </div>
                <div class="m_GenTableBox" v-loading="isLoading">

                    <div class="goodsBox" v-for="(item,index) in goodsList">

                        <el-popover placement="top" width="160" v-model="item.deltips">
                        <p>确定要删除此商品么？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="delClose(item)">取消</el-button>
                            <el-button type="primary" size="mini" @click="deleteGoods(item,index)">确定</el-button>
                        </div>
                        <div slot="reference" class="delGoods el-icon-delete"></div>
                        </el-popover>


                        <div class="goodsImg">
                            <img :src="item.picture?item.picture:'/static/quality/theme/skin_default/shop_img_default.png'">
                        </div>
                        <div class="goodsCont">
                            <div class="contcol goodsName">{{item.name}}</div>
                            <div class="contcol goodsPrice"><span>价格：</span> {{item.price}} 个勋章</div>
                            <div class="contcol goodsNum"><span>库存：</span> {{item.reserve}} 个</div>
                            <div class="contcol goodsTime"><span>更新时间：</span> {{item.updateTime.split(" ")[0]}}</div>
                            <div class="contcol tc mt5">
                                <el-button size="small" :type="item.top?'danger':'primary'" @click="setTop(item)">{{item.top?'取消首页展示':'设为首页展示'}}</el-button>
                                <el-button size="small" type="primary" @click="updataGoods(item)">修改商品</el-button>

                            </div>
                        </div>
                    </div>

                    <el-pagination class="pagination" background layout="prev, pager, next" :total="goodsSum" :page-size="goodsLimit" :current-page="goodsCurPage" @current-change="goodsPageChange"></el-pagination>

                </div>
            </el-tab-pane>

            <!--订单列表-->
            <el-tab-pane>
                <span slot="label"><i class="el-icon-tickets"></i> 订单列表</span>


                <div class="filter-container innerTab">

                    <el-popover placement="right" width="400" trigger="click">
                        <div class="filterPopBox">
                            <div class="filterCol">
                                <span class="filterTit">班级：</span>

                                <el-cascader class="w250 selClass" v-model="targetClass" size="small" placeholder="请选择班级或年级" :options="GradeClassList" filterable :props="{children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>
                            </div>

                            <div class="filterCol">
                                <span class="filterTit">时间：</span>
                                <el-date-picker size="small" v-model="filterDate" class="dataPicker w250" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">关键词：</span>
                                <el-input class="w250" size="small" suffix-icon="el-icon-search" clearable v-model="filterKey" placeholder="请输入需要查找的学生姓名"></el-input>
                            </div>
                            <div class="filterCol">
                                <el-button size="small" type="primary" icon="el-icon-search" @click="getGoodsOrder">筛选</el-button>
                            </div>
                        </div>
                    <el-button slot="reference" type="primary" size="small" icon="el-icon-search"  @click="initFilter">筛选条件</el-button>
                      <el-button slot="reference" type="primary" size="small" icon="el-icon-upload2" @click="exportOrderRecord">导出订单</el-button>
                    </el-popover>
                    <!-- 一个高级查询 （按班级，维度，时间，关键词） -->
                </div>

                <div class="m_GenTableBox" v-loading="isLoading">
                    <el-table class="tableBorder dimensionTable receivingTable" :data="orderList">
                        <el-table-column label="兑换时间" prop="createTime" width="150">
                            <template slot-scope="scope">
                                {{scope.row.createTime.split(":")[0]+':'+scope.row.createTime.split(":")[1]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="学生姓名" prop="userName" width="120">
                        </el-table-column>
                        <el-table-column label="学号" prop="userId" width="180">
                        </el-table-column>
                        <el-table-column label="商品名称" prop="goodsName">
                        </el-table-column>
                        <el-table-column label="勋章数" prop="price" width="150">
                        </el-table-column>

                        <el-table-column label="状态" width="150">
                            <template slot-scope="scope">
                                <span class="status" :class="scope.row.status==0?'':scope.row.status==1?'green':'red'">{{scope.row.status==0?'待领取':scope.row.status==1?'已领取':'已退单'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="220" align="center">
                            <template slot-scope="scope">
                                <div v-show="scope.row.status==0">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeOrderStatus(scope,1)">学生领取</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="changeOrderStatus(scope,-1)">退单</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination class="pagination" background layout="prev, pager, next" :total="orderSum" :page-size="orderLimit" :current-page="orderCurpage" @current-change="orderPageChange"></el-pagination>

                </div>




            </el-tab-pane>
        </el-tabs>





        <!--新增商品的弹层-->
        <el-dialog :title="textMap[dialogStatus]+'商品'" :close-on-click-modal="false" :visible.sync="addGoodsLayer" width="430px">
            <el-form :model="goodsform" ref="form" class="addGoodsForm" label-width="100px" :rules="rules">

                <el-form-item required label="名称" prop="name">
                    <el-input size='small' style="width:250px" maxlength="20" v-model="goodsform.name"></el-input>
                </el-form-item>

                <el-form-item required label="选择分类" prop="typeId">
                    <el-select  v-model="goodsform.typeId" placeholder="请选择商品分类" size='small' style="width:250px;">
                        <el-option v-for="item in goodsTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                    <!-- <el-input size='smaill' style="width:250px"></el-input> -->
                </el-form-item>

                <el-form-item label="图标：" class="lh50">
                    <el-upload :file-list="goodsFile"  class="genImg" name="files"
                    accept="image/*"
                    action="/api/evaluation/file/upload"
                    :headers= "headers"
                    :onError="uploadError"
                    :onSuccess="(res,file,fileList)=>{return uploadSuccess(res,file,fileList,'xm')}"
                    :before-upload="beforeUpload"
                    :show-file-list="false">
                        <img v-if="goodsFile[0]" :src="goodsFile[0].absolutePath" class="avatar">
                        <img v-if="goodsform.picture&&!goodsFile[0]" :src="goodsform.picture" class="avatar">
                        <i v-else class="el-icon-plus genImg-icon"></i>
                        <div slot="tip" class="el-upload__tip" style="display: inline-block;margin-left: 10px;margin-top:0">请上传5M以内的图片</div>
                    </el-upload>
                </el-form-item>

                <el-form-item required label="库存" prop="reserve">
                    <el-input v-model.number="goodsform.reserve" maxlength="10" size='small' style="width:250px" placeholder="请输入数量"></el-input>
                </el-form-item>

                <el-form-item required label="价格" prop="price">
                    <el-input v-model.number="goodsform.price" maxlength="10" size='small' style="width:250px" placeholder="请输入所需勋章数量"></el-input>
                </el-form-item>


                <!-- <el-form-item label="选择维度：">
                    <el-cascader placeholder="请选择或搜索维度":options="wdoptions" filterable :props="{ expandTrigger: 'hover' }" clearable></el-cascader>
                </el-form-item> -->


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearGoodsForm">取 消</el-button>
                <el-button type="primary" @click="goodsSubmit('form')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import * as qualityApi from '@comm/api/qualityAppraisal';
import * as baseClassApi from '@comm/api/admin/class';
import * as baseXnxqApi from '@comm/api/admin/division';
export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            dialogStatus:'',                        //区分新增还是修改的文字提示
            isLoading:false,                        //是否读取数据中
            modGoodsName:"",                        //修改之出商品名称
            goodsList:[],                           //商品列表
            goodsSum:0,                             //商品总数
            goodsCurPage:1,                         //商品当前页码
            goodsLimit:20,                          //商品每页的限制数量
            goodsTypeList:[],                       //商品类别列表
            goodsFile:[],                           //商品图片列表(仅限一张)
            GradeClassList:[],                      //年级班级级联菜单
            targetClass:[],                         //目标班级

            orderList:[],                           //订单列表
            orderSum:0,                             //订单总数
            orderCurpage:1,                         //订单当前页码
            orderLimit:20,                          //订单每页的限制数量
            editTypeName:'',                        //原修改的类别名称

            rules:{                                 //新增修改商品表单的验证规则
                name:[
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {required: true, message: '请输入商品名称', trigger: 'change'},
                    {min: 1, max: 20, message: '长度不得超过20个字符', trigger: 'blur' }
                ],
                typeId:[
                    {required: true, message: '请选择商品分类', trigger: 'blur'},
                ],
                reserve:[
                    {required: true, message: '请输入库存数量', trigger: 'blur'},
                    {type: 'number', message: '库存请填入数字'}
                ],
                price:[
                    {required: true, message: '请输入勋章数量', trigger: 'blur'},
                    {type: 'number', message: '勋章数量请填入数字'}
                ]
            },
            goodsform:{},                           //新增修改商品的表单对象
            textMap: {update: '编辑',create: '新增'},       //新增||更新的文字状态
            typeEdit:false,                         //是否显示商品分类模块
            addGoodsLayer:false,                    //是否显示新增修改商品弹层
            filterKey:'',                           //关键词搜索（订单列表）
            filterDate:[],                          //日期选取（订单列表）


        }
    },
    computed: {
        // headers: function() {
        //     return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        // },
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
        async init(){
            //获取商品列表
            this.getGoodsList();
            this.getGoodsTypeList();
            this.getGoodsOrder();
        },
        /**
         * 获取商品列表
         * by:RayJ
         * time:2019-07-19
         */
        async getGoodsList(){
            var param = {};
            param.goodsType = 0;
            param.limit = this.goodsLimit;
            param.name = '';
            param.page = this.goodsCurPage;
            this.isLoading = true;
            var res = await qualityApi.getGoodsListPage(param);
            this.goodsList = res.value.dataList;
            this.goodsSum = res.value.totalCount;
            this.isLoading = false;
        },

        /**
         * 获取商品列表 - 翻页
         * by:RayJ
         * time:2019-07-20
         */
        goodsPageChange(curpage){
            this.goodsCurPage = curpage;
            this.getGoodsList();
        },

        /**
         * 获取商品订单 - 翻页
         * by:RayJ
         * time:2019-07-22
         */
        orderPageChange(curpage){
            this.orderCurpage = curpage;
            this.getGoodsOrder();
        },

        /**
         * 新增或保存商品
         * by:RayJ
         * time:2019-07-20
         */
        async goodsSubmit(formName){
            var that = this;
            this.$refs[formName].validate(async (valid) => {
                if (valid) {

                    if(that.goodsFile.length>0){
                        that.goodsform.meteData = that.goodsFile[0];
                    }
                    if(that.modGoodsName == that.goodsform.name){
                         delete that.goodsform.name;
                    }

                    var res = await qualityApi.saveGoods(that.goodsform);
                    if(res.resultCode != 1){
                        that.$notify({title:"错误",message:res.resultMessage,type:"error"});
                        return;
                    }else{
                        that.$notify({title:"成功",message:res.resultMessage,type:"success"});
                        //新增后更新第一页商品列表,并关闭清理弹层和验证信息
                        if(this.dialogStatus=="create"){
                            that.goodsCurPage = 1;
                        }
                        that.getGoodsList();
                        that.clearGoodsForm();
                    }
                } else {
                    that.$notify({title:"提示",message:"请完整填写信息",type:"warning"});
                    return false;
                }
            });
        },

        /**
         * 关闭新增修改商品弹层
         * by:RayJ
         * time:2019-07-20
         */
        clearGoodsForm(){
            this.addGoodsLayer =  false;
            //重置验证规范
            this.$refs.form.resetFields();
            this.goodsform = {};
            this.goodsFile = [];
        },

        /**
         * 获取商品分类列表
         * by:RayJ
         * time:2019-07-19
         */
        async getGoodsTypeList(){
            var res = await qualityApi.getGoodsTypeList({schoolCode:this.$cookie.get('xxdm')});
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:"读取商品类型失败",type:"error"});
                return;
            }else{
                this.goodsTypeList = res.value;
            }
        },

        /**
         * 新增商品分类
         * by:RayJ
         * time:2019-07-19
         */
        addGoodsType(){
            this.goodsTypeList.unshift({name:"",isedit:true})
        },

        /**
         * 保存商品分类
         * by:RayJ
         * time:2019-07-19
         */
        async saveGoodsType(scope){
            if(!scope.row.name||!scope.row.name.replace(/(^\s*)|(\s*$)/g, "")){
                this.$notify({title:"提示",message:"请输入商品类别名称!",type:"warning"})
                return;
            }

            if(this.editTypeName != scope.row.name){
                var param = {};
                param.name = scope.row.name;
                if(scope.row.id){
                    param.id = scope.row.id
                }
                var res = await qualityApi.saveGoodsType(param);
                if(res.resultCode != 1){
                    this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                    this.$set(scope.row,'isedit',true);
                    return;
                }else{
                    this.$set(scope.row,'isedit',false);
                    this.$set(scope.row,'id',res.value.id);
                    this.$notify({title:"成功",message:res.resultMessage,type:"success"});
                }
            }else{
                this.$set(scope.row,'isedit',false);
            }

        },

        /**
         * 删除商品分类
         * by:RayJ
         * time:2019-07-19
         */
        async deleteGoodsType(scope){
            console.log(scope,441199)
            if(scope.row.id){
                var res = await qualityApi.deleteGoodsType(scope.row.id);
                if(res.resultCode != 1){
                    this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                    return;
                }else{
                    this.goodsTypeList.splice(scope.$index,1);
                    this.$notify({title:"成功",message:"删除成功",type:"success"});
                }
            }else{
                this.goodsTypeList.splice(scope.$index,1);
            }
        },

        /**
         * 编辑商品分类名称
         * by:RayJ
         * time:2019-07-19
         */
        editType(scope){
            //当前正在编辑的分类的index
            var curIndex = _.findIndex(this.goodsTypeList,{'isedit':true});
            if(curIndex!=-1){
                this.goodsTypeList[curIndex].name = this.editTypeName;
                this.$set(this.goodsTypeList[curIndex],'isedit',false);
            }
            this.editTypeName = scope.row.name;
            this.$set(scope.row,'isedit',true);
        },

        /**
         * 关闭删除记录的tips
         * by:
         * time:
         */
        delClose(row){
            this.$set(row,'deltips',false);
        },

        /**
         * 打开新商品弹层
         * by:RayJ
         * time:2019-07-19
         */
        addGoods(){
            this.dialogStatus = 'create';
            this.goodsform = {};
            this.addGoodsLayer = true;
        },

        /**
         * 确认删除商品
         * by:RayJ
         * time:2019-07-20
         */
        async deleteGoods(item,index){
            var res = await qualityApi.deleteGoods(item.id);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.getGoodsList();
                this.$notify({title:"成功",message:"删除成功",type:"success"});
            }
        },

        /**
         * 更新商品弹层
         * by:RayJ
         * time:2019-07-20
         */
        updataGoods(item){
            this.dialogStatus = 'update';
            this.addGoodsLayer = true;
            this.goodsform = {};
            this.goodsform = $.extend(true,{},item);
            this.modGoodsName = item.name;
            this.goodsform.goodsId = item.id;
        },

        /**
         * 获取订单列表
         * by:RayJ
         * time:2019-07-20
         */
        async getGoodsOrder(){


            // {
            // "classCode": "string",
            // "endTime": "2018-10-10",
            // "goodsType": 0,
            // "gradeCode": "string",
            // "limit": 0,
            // "page": 0,
            // "startTime": "2018-10-10",
            // "stuName": "string"
            // }

            console.log(this.targetClass,1)
            console.log(this.filterDate,2)
            // console.log(this.filterKey,3)



            var param = {};
            param.limit = this.orderLimit;
            param.page = this.orderCurpage;
            param.classCode = this.targetClass.length==2?[this.targetClass[1]]:[];
            if(this.filterDate&&this.filterDate.length==2){
                param.startTime = moment(this.filterDate[0]).format('YYYY-MM-DD');
                param.endTime = moment(this.filterDate[1]).format('YYYY-MM-DD');
            }
            param.stuName = this.filterKey;

            console.log(param,660055)
            this.isLoading = true;
            var res = await qualityApi.getGoodsOrder(param);
            this.orderList = res.value.dataList;
            this.orderSum = res.value.totalCount;
            this.isLoading = false;
        },

        /**
         * 修改订单状态
         * by:RayJ
         * time:2019-07-20
         */
        async changeOrderStatus(scope,status){
            var param = {};
            param.orderNo = scope.row.orderNo;
            param.status = status;
            console.log(scope,662299)
            var res = await qualityApi.changeGoodsStatus(param);
            if(res.resultCode != 1){
                this.$notify({title:"错误",message:res.resultMessage,type:"error"});
                return;
            }else{
                this.$set(scope.row,"status",status);
                this.$notify({title:"成功",message:"修改成功",type:"success"});
            }
        },

        /**
         * 打开或者关闭商品类别显示框
         * by:RayJ
         * time:2019-07-20
         */
        editGoodsType(){
            this.typeEdit = !this.typeEdit;
        },

        /**
         * 上传成功后的回调
         * by:RayJ
         * time:2019-07-22
         */
        uploadSuccess(response, file, fileList, type){
            this.goodsFile = [];
            if(response.resultCode==1){
                this.goodsFile = response.value;
                console.log(this.goodsFile,663388)
                this.$notify({title:'成功',message:response.resultMessage,type:'success'});
            }else{
                this.$notify({title:'失败',message:response.resultMessage,type:'error'});
            }

            console.log(response,663355)
        },

        /**
         * 上传图片失败
         * by:RayJ
         * time:2019-07-22
         */
        uploadError(response, file, fileList){
            this.$notify({title:'失败',message:response,type:'error'});
        },

        /**
         * 上传前对文件的大小的判断
         * by:RayJ
         * time:2019-07-22
         */
        beforeUpload (file) {
            let isLt2M = file.size / 1024 / 1024 < 5
            if(!isLt2M){
                this.$notify({title:'提示',message:"图片容量不能大于5MB!",type:'warning'});
            }
            return isLt2M
        },

        /**
         * 设置商品为首页显示或者取消首页显示
         * by:RayJ
         * time:2019-08-06
         */
        async setTop(item){
            var param = {};
            console.log(item)
            param.goodsId = item.id;
            param.isTop = !item.top;
            var res = await qualityApi.setTop(param);
            if(res.resultCode==1){
                this.$notify({title:'成功',message:res.resultMessage,type:'success'});
                this.getGoodsList();
            }else{
                this.$notify({title:'失败',message:res.resultMessage,type:'error'});
            }
        },

        /**
         * 初始化筛选条件的数据
         * by:RayJ
         * time:2019-07-24
         */
        initFilter(){
            if(this.GradeClassList.length==0){
                this.getAllGradeClass();
            }
        },

        /*
        * 导出订单数据
        *
        * */
        exportOrderRecord() {
          var param = {};
          param.limit = this.orderLimit;
          param.page = this.orderCurpage;
          param.classCode = this.targetClass.length==2?[this.targetClass[1]]:[];
          if(this.filterDate&&this.filterDate.length==2){
            param.startTime = moment(this.filterDate[0]).format('YYYY-MM-DD');
            param.endTime = moment(this.filterDate[1]).format('YYYY-MM-DD');
          }
          param.stuName = this.filterKey;

          var exportfunc = qualityApi.exportOrderRecord;

          exportfunc(param).then((res)=>{
            const blob = new Blob([res], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            });
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '订单信息.xls'; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
          })
        },

        /**
         * 获取年级班级信息做一个级联菜单
         * by:RayJ
         * time:2019-07-24
         */
        async getAllGradeClass(){
            var xnxqObj = await baseXnxqApi.Getxndm({xxdm:this.$cookie.get('xxdm')})
            var res = await baseClassApi.GetNjBjList({xxdm:this.$cookie.get('xxdm'),xndm:xnxqObj.data.xn});
            this.GradeClassList = res.data;
            for(var i=0;i<this.GradeClassList.length;i++){
                this.GradeClassList[i].label = this.GradeClassList[i].njmc;
                this.GradeClassList[i].value = this.GradeClassList[i].njdm;
                for(var j=0;j<this.GradeClassList[i].bjList.length;j++){
                    this.GradeClassList[i].bjList[j].value = this.GradeClassList[i].bjList[j].uuid;
                    this.GradeClassList[i].bjList[j].label = this.GradeClassList[i].bjList[j].bj;
                }
            }
        },


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
.fl{
    float: left;
}
.mt5{
    margin-top: 5px;
}
.tc{
    text-align: center;
}
.ml30{
    margin-left: 30px;
}
.addGoodsForm{
    width: 350px;
}
.pagination{
    width: 100%;
    display: inline-block;
}
.filterTit{
    font-weight: 700;
    font-size: 14px;
    color: #666;
}
.filter-container.innerTab{
    line-height: 0px;
    padding: 0 20px;
    padding-bottom: 15px;
    min-height: auto;
}
.filterPopBox{
    padding:5px;
    .filterCol{
        width: 100%;
        position: relative;
        padding: 5px 0;
        padding-left: 70px;
        .filterTit{
            position: absolute;
            width:60px;
            left: 0;
            height: 32px;
            line-height: 32px;
            text-align: right;
        }
    }
}
.goodsType{
    width: 350px;
    float: left;
    margin-right: 20px;
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
}
.dataPicker{
    /deep/ .el-range-separator{
        padding: 0;
    }
}
.receivingTable .green{
    font-weight: 700;
    color: #208900;
}
.receivingTable .red{
    font-weight: 700;
    color: #ff334b;
}
.goodsBox{
    width: 250px;
    height: 290px;
    float: left;
    margin:10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #f8f8f8;
    border-radius: 10px;
    box-shadow: 0 0 2px 1px rgba($color: #666, $alpha: .2);
    transition: .3s all;
    .delGoods{
        width: 25px;
        height: 25px;
        position: absolute;
        top: 0px;
        right: 0px;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1;
        border-radius: 0 10px;
        line-height: 25px;
        text-align: center;
        color: #FFF;
        cursor: pointer;
        transition: .2s all;
    }
    .delGoods:hover{
        color: #409EFF;
        background: rgba(0, 0, 0, 0.2);
    }
    .goodsImg{
        width:250px;
        height: 100px;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid #e8e8e8;
        box-shadow: 1px 0 1px 1px rgba($color: #666, $alpha: .2);
        img{
            height: auto;
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
    .goodsCont{
        flex: 1;
        width: 100%;
        padding-top: 10px;
        .contcol{
            padding: 2px 10px;
            font-size: 14px;
            line-height: 24px;
            position: relative;
            color: #333;
            span{
                font-weight: bolder
            }
        }
        .contcol.goodsName{
            font-size: 16px;
            font-weight: bold;
            padding: 10px
        }
    }
}
.goodsBox:hover{
    box-shadow: 0 0 5px 2px rgba($color: #666, $alpha: .4);
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
    cursor: pointer;
    position: relative;
    width: 50px;
    height: 50px;
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
    position: absolute;
    width: 100%;
    height: auto;
    top: 50%;
    left:0;
    transform: translateY(-50%);
}
.filter-container.goodsTypeTit{
    min-height: auto;
    text-indent: 10px;
    font-size: 16px;
    padding: 10px;
}
.closeType{
    font-size: 24px;
    text-indent: 0;
    overflow: hidden;
    float: right;
    color: #666;
    transition: .2s all;
    cursor: pointer;
}
.closeType:hover{
    color: #409EFF;
    // transform-origin: center center;
    transform:rotate(-90deg);
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
}

</style>
