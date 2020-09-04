<template>
    <div class="menu-item-box">
        <template v-for="(item,index) in menuList">
            <li @click="gotoApp(item)" class="sideItem" :key="index" :index="item.code">{{item.title}}</li>

            <!-- <el-menu-item :key="index" :index="item.code">{{item.title}}</el-menu-item> -->
        </template>
    </div>
</template>

<script>
export default {
    name: 'SideItem',
    props: {
        menuList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    methods: {
        gotoApp(item){
            console.log(item,"5566") 
        }, 
    }
 }
</script>
<style lang="scss" scoped>
.sideItem{
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding-left: 75px;
    position: relative;
    cursor: pointer;
}

</style>
