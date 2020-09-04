<template>
    <div class="app-container">
        <div class="u_TableMain">
            <div class="jsInfo">欢迎使用综合素质评价系统</div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@comm/api/qualityAppraisal';
export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            // inspireCardSchool:['754','1657','1658','708','1544','90035'],                      //激励卡学校列表
        }
    },
    mounted(){
        // if(_.indexOf(this.inspireCardSchool,this.$cookie.get('xxdm'))!=-1){
        //     //如果学校代码是属于激励卡学校,设置 store 的 isInspireCard 为 true 并存入浏览器缓存
        //     this.$store.dispatch("set_isInspireCard",true);  
        // }
        // localStorage.setItem('inspireCardSchool',this.$store.getters.get_IsInspireCard);
        this.initState();
    },
    methods: {
        async initState(){
            var res = await qualityApi.getConfig();
            if(res.value.cardMode){
                this.$store.dispatch("set_isInspireCard",true);  
            }else{
                this.$store.dispatch("set_isInspireCard",false);
            }
            localStorage.setItem('inspireCardSchool',this.$store.getters.get_IsInspireCard);
        },
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.jsInfo{
    width: 100%;
    height: 400px;
    text-align: center;
    line-height: 400px;
    font-size: 45px;
    color: #444;
    font-family: 'fz';
}
</style>
