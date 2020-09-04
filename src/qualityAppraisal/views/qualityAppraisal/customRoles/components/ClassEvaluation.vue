<template>
    <div class="component-container">
        <div class="screenCol">
            <span class="screenTit">奖惩类型:</span>
            <el-radio-group v-model="rewardType" size="small" @change="filterEvaluateList">
                <el-radio-button label="0" >全部</el-radio-button>
                <el-radio-button v-for="item in rewardTypeList" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="screenCol">
            <div class="evaluationMain">

                <div class="evaluationSearchHeader">
                    <el-checkbox class="checkAll" v-model="isAllCheck" @change="checkAllEval">全选</el-checkbox>

                    <div class="searchIpt" >
                        <el-input size="small" v-model="evaluationSearch" placeholder="搜索评价项名称"></el-input>
                        <i class="el-icon-search"></i>
                    </div>
                </div>


                <div class="pjxList cusMiniScroll" v-if="isReShow">
                    <div class="pjxItem" :class="{'check':item.check}" @click="checkEvaluateFun(item)" :label="item.uuid" :key="index" v-for="(item,index) in EvaluateList">
                        <div class="pjxImg">
                            <el-image fit="cover"  :src="item.icon"    >
                                <div slot="error"  >
                                    <el-image fit="cover" :src="defineImgSrc">
                                    </el-image>
                                </div>
                                <div slot="placeholder"  >
                                        未加载是显示的内容
                                </div>
                            </el-image>
                            <!-- <img :src="item.icon"> -->
                        </div>
                        <div class="pjxName">{{item.name}}</div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api/qualityAppraisal';
import * as api from '@comm/api/evaluationSetting'
export default {
    name: "setReport",
    components: {
    },
    data() {
        return {
            isReShow:true,
            rewardType:'0',
            rewardTypeList:[{value:3,label:"加分"},         //奖惩类型列表
            {value:4,label:"减分"},],
            allEvaluateList:[],                             //所有评价项列表
            EvaluateList:[],                                //显示评价项列表
            isAllCheck:false,
            defineImgSrc:"/static/quality/noimage.png",     //默认图片地址
            evaluationSearch:'',
            checkEvaluate:[],
        }
    },
    props: {
        role:{
            type:Object,
            required:true
        }
    },
    watch: {
        evaluationSearch(newstr,oldstr) {
            this.filterEvaluateList();
            this.EvaluateList = _.filter(this.EvaluateList,function(o){return o.name.indexOf(newstr)!=-1});
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        async init(){
            await this.getCheckEvaluation();
            await this.getEvaluation();
            this.compose();
        },
        async getEvaluation(){
            var param = {};
            param.schoolCode = this.$cookie.get('xxdm');
            param.scope = "2";
            param.rewardType = this.rewardType;
            
            var res = await api.getEvaluationList(param);
            this.allEvaluateList = res.value;
            this.EvaluateList = _.cloneDeep(this.allEvaluateList);
            // console.log(this.EvaluateList,"aaaaaaa")
        },
        async getCheckEvaluation(){
            var param = {};
            param.schoolCode = this.$cookie.get('xxdm');
            param.scope = "2";
            param.jurisdictionType = this.role.type;
            if(this.role.type==1){
                param.customRoleId = this.role.roleId;
            }
            var res = await qualityApi.getEvaluation(param);
            this.checkEvaluate = res.value;
            // console.log(res,"获取的已选中的评价项")
        },
        async compose(){
            this.isReShow = false;
            for(var i=0;i<this.checkEvaluate.length;i++){
                var evaluate = _.find(this.allEvaluateList,{"id":this.checkEvaluate[i].id});
                if(evaluate){
                    await this.$nextTick()
                    this.$set(evaluate,"check",true);
                }
            }
            this.EvaluateList = _.cloneDeep(this.allEvaluateList);
            this.isReShow = true;
        },
        filterEvaluateList(){
            if(this.rewardType==0){
                this.EvaluateList = _.cloneDeep(this.allEvaluateList);
            }else{
                this.EvaluateList = _.filter(this.allEvaluateList,{"rewardType":this.rewardType});
            }
        },
        checkEvaluateFun(item){
            if(item.check){
                this.$set(item,"check",false)
                this.$set(_.find(this.allEvaluateList,{'id':item.id}),"check",false);
            }else{
                this.$set(item,"check",true)
                this.$set(_.find(this.allEvaluateList,{'id':item.id}),"check",true);
            }
        },
        checkAllEval(){
            if(this.isAllCheck){
                for(var i=0;i<this.EvaluateList.length;i++){
                    this.$set(this.EvaluateList[i],"check",true);
                }
            }else{
                for(var i=0;i<this.EvaluateList.length;i++){
                    this.$set(this.EvaluateList[i],"check",false);
                }
            }
            this.updataEval();
            //this.EvaluateList = _.cloneDeep(this.allEvaluateList);
        },
        updataEval(){
            for(var i=0;i<this.EvaluateList.length;i++){
                this.$set(_.find(this.allEvaluateList,{'id':this.EvaluateList[i].id}),"check",this.EvaluateList[i].check);
            }
        },

    }
}
</script>

<style scoped lang="scss">
.screenCol{
    .screenTit{
        float: left;
        padding-right: 5px;
        height: 32px;
        line-height: 32px;
    }
    .evaluationMain{
        padding:10px 15px;
        width: 100%;
        margin: 10px 0;
        margin-bottom: 25px;
        height: 400px;
        border: 1px solid #e2e2e2;
        display: flex;
        flex-direction: column;
        .pjxList{
            flex: 1;
        }
        .evaluationSearchHeader{
            padding-bottom: 10px;
        }
        .checkAll{
            float: left;
            padding: 6px 0;
            padding-right: 10px;
        }
        .searchIpt{
            float: left;
            display: inline;
            width: 300px;
            position: relative;
            .el-icon-search{
                position: absolute;
                top: 9px;
                right: 10px;
            }
        }
    }
}
.pjxItem{
    display: inline-block;
    text-align: center;
    margin: 10px;
    width: 90px;
    height: 90px;
    padding-top: 10px;
    transition: .2s all;
    cursor: pointer;
    /deep/ .el-checkbox__label{
        width: 75px;
        padding-left: 5px;
    }
    /deep/ .el-checkbox__input{
        transform: translateY(-5px);
    }
}
.pjxItem.check{
    background: #95c9ff;
    border-radius: 5px;
}
.pjxItem:hover{
    background: #DCDFE6;
    border-radius: 5px;
    transform: scale(1.05);
}
.pjxItem.check:hover{
    background: #95c9ff;
    border-radius: 5px;
    transform: scale(1.05);
}
.pjxList{
    width: 100%;
    flex: 1;
    overflow: auto;
}
.pjxImg{
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border-radius: 25px;
    overflow: hidden;
    .el-image{
        width: 100%;
        height: 100%;
    }
    img{
        width: 100%;
        height: 100%;
    }
}
.pjxItem.check .pjxName{
    color: #FFF;
}
.pjxName{
    // margin-top: 10px;
    width: 100%;
    font-size: 12px;
    line-height: 14px;
    padding-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
