<template>
    <div class="component-container">
        <div class="screenCol">
            <div class="evaluationMain">

                <div class="evaluationSearchHeader">
                    <el-checkbox class="checkAll" v-model="isAllCheck" @change="checkAllEval">全选</el-checkbox>

                    <div class="searchIpt" >
                        <el-input size="small" v-model="teamSearch" placeholder="搜索团队名称"></el-input>
                        <i class="el-icon-search"></i>
                    </div>
                </div>


                <div class="pjxList cusMiniScroll" v-if="isReShow">
                    <div class="pjxItem" :class="{'check':item.check}" @click="checkTeamFun(item)" :label="item.groupId" :key="index" v-for="(item,index) in teamList">
                        <div class="pjxImg">
                            <el-image fit="cover"  :src="item.fileInfoVO?item.fileInfoVO.absolutePath:''"    >
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
                        <div class="pjxName">{{item.groupName}}</div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api/qualityAppraisal'
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
            allTeamList:[],                             //所有评价项列表
            checkTeamList:[],           
            teamList:[],                                //显示评价项列表
            isAllCheck:false,
            defineImgSrc:"/static/quality/noimage.png",     //默认图片地址
            teamSearch:'',
        }
    },
    computed: {

    },
    props: {
        role:{
            type:Object,
            required:true
        }
    },
    watch: {
        teamSearch(newstr,oldstr) {
            this.teamList = _.filter(this.allTeamList,function(o){return o.groupName.indexOf(newstr)!=-1});
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        async init(){
            await this.getTeamAll();
            await this.getCheckTeam();
            this.compose();
        },
        async getTeamAll(){
            var res = await api.getGroupList();
            this.allTeamList = res.value;
            this.teamList = _.cloneDeep(this.allTeamList);
        },
        async getCheckTeam(){
            var res = await qualityApi.getRuleTeam(this.role.roleId);
            if(res.value){
                this.checkTeamList = res.value;
            }
            // console.log(this.checkTeamList,'选中的团队列表')
        },
        async compose(){
            this.isReShow = false;
            for(var i=0;i<this.checkTeamList.length;i++){
                var evaluate = _.find(this.allTeamList,{"groupId":this.checkTeamList[i].groupId});
                if(evaluate){
                    await this.$nextTick()
                    this.$set(evaluate,"check",true);
                }
            }
            this.teamList = _.cloneDeep(this.allTeamList);
            this.isReShow = true;
        },
        checkTeamFun(item){
            if(item.check){
                this.$set(item,"check",false)
                this.$set(_.find(this.allTeamList,{'groupId':item.groupId}),"check",false);
                // item.check = false;
            }else{
                this.$set(item,"check",true)
                this.$set(_.find(this.allTeamList,{'groupId':item.groupId}),"check",true);
                // item.check = true;
            }
        },
        checkAllEval(){
            if(this.isAllCheck){
                for(var i=0;i<this.teamList.length;i++){
                    this.$set(this.teamList[i],"check",true);
                }
            }else{
                for(var i=0;i<this.teamList.length;i++){
                    this.$set(this.teamList[i],"check",false);
                }
            }
            this.updataEval();
            //this.EvaluateList = _.cloneDeep(this.allEvaluateList);
        },
        updataEval(){
            for(var i=0;i<this.teamList.length;i++){
                this.$set(_.find(this.allTeamList,{'groupId':this.teamList[i].groupId}),"check",this.teamList[i].check);
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
