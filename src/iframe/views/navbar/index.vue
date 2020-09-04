<template>
    <div class="navbar">
        <div class="levelName">{{appName}} - {{levelName}}</div>

    </div>
</template>

<script>
const multiConfig = require('../../../../config/multi.conf')
import _ from 'lodash';
export default {
    data(){
        return{
            appName:'',
            levelName:''
        }
    },
    mounted(){
        // console.log(this.curPath,"子组件里的curPath");
        // console.log(this.rootMenuList,"子组件里的rootMenuList");
    },
    methods:{
        setNav(curPath,rootMenuList){
            // console.log("设置一下菜单",curPath,rootMenuList)
            var LinkObj = multiConfig.modules.find((item) => {
                return item.name == curPath[1]
            })
            this.appName = LinkObj.title;
            // console.log(LinkObj,"LinkObj")
            // this.levelName = _.find(rootMenuList,{code:curPath[2]}).title;
            // console.log(rootMenuList.length,"rootMenuList.length")
            for(let i=0;i<rootMenuList.length;i++){
                
                if(rootMenuList[i].children&&rootMenuList[i].children.length>0){
                    
                    // 因为二级菜单都挂在主应用的菜单下..所以如果这一级菜单找不到就继续跳过找下一个《同名》的一级菜单
                    if(_.find(rootMenuList[i].children,{code:curPath[2]})){
                        this.levelName = _.find(rootMenuList[i].children,{code:curPath[2]}).title;
                        return true
                    }
                }else{
                    if(rootMenuList[i].code == curPath[2]){
                        this.levelName = rootMenuList[i].title;
                        return true
                    }
                }
            }

            
            
        }
    },
    props:{
        curPath:{
            type: Array
        },
        rootMenuList:{
            type: Array
        }
    }
}
</script>

<style lang='scss' scoped>
.navbar {
    width: 100%;
    height: 100px;
    padding-top: 20px;
    line-height: 50px;
    background: transparent !important;
    .levelName{
        font-family: 'fz';
        float: left;
        height: 54px;
        line-height: 54px !important;
        color: #666;
        padding: 0 25px;
        font-size: 24px;
        margin-top: 8px;
    }
}
</style>