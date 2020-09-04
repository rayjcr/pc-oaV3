<template>
    <div class="app-wrapper">
        <div class="sideBox" :class="[isSideShow?'open':'close']">
            <div class="sideBar" :class="[isSideShow?'open':'close']" @click="sideSwap">
            </div>
            <vue-scroll>
                <el-menu mode="vertical" unique-opened :default-openeds="activeIndex" :collapse="isCollapse">
                    <sidebar-item :routes='rootMenuList' :curPath='curPath'></sidebar-item>
                </el-menu>
            </vue-scroll>
        </div>
        <div class="main-container">
            <!-- <sidebar class="sidebar-container"></sidebar> -->
            <navbar ref="navbar"></navbar>
            <transition name="sliderRight">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import '../../script/font/font.css'
import Vue from 'vue'
import _ from 'lodash';
import SidebarItem from './SidebarItem';
import {getMenus} from '@comm/api/base';
import vuescroll from 'vuescroll';
import navbar from '../../../iframe/views/navbar/index';
import animated from 'animate.css';
Vue.use(vuescroll);
export default {
    data(){
        return{
            // menuList:[],
            activeIndex:[],
            rootMenuList:[],
            curPath:[],
            isSideShow:true,
        }
    },
    watch: {
        $route(to,from) {
            this.$refs.navbar.setNav(this.$route.path.split('/'),this.rootMenuList)
            // console.log(to,from,"to,from")
        }
    },
    components: { 
        SidebarItem,
        navbar
    },
    computed: {
        isCollapse() {
            return false
        }
    },
    mounted(){
        let styleSheetPath = "/static/style/theme/default.css"
        let themeLink = document.querySelector('link[name="theme"]');
        themeLink.setAttribute('href', styleSheetPath);


        this.curPath = this.$route.path.split('/');
        // console.log(this.curPath,"this.curPath")
        this.getMenusList();
    },
    methods:{
        getMenusList(){
            getMenus({token: this.$cookie.get("token")}).then(response => {
                // this.menuList = response;
                this.rootMenuList =  this.getCurRootMeun(response);
                // console.log(this.rootMenuList,"rootMenuList")
                // console.log(this.$route.path.split('/'),"this.$route.path.split('/')")
                this.$nextTick(() => {
                    this.$refs.navbar.setNav(this.$route.path.split('/'),this.rootMenuList)
                    this.openItemMenu(this.rootMenuList);
                })
            }) 
        },
        getCurRootMeun(menuList){
            return _.find(menuList,{code:this.curPath[1]}).children;
        },
        openItemMenu(menulist){
            for(let i=0;i<menulist.length;i++){
                if(menulist[i].children){
                    let listObj = _.find(menulist[i].children,{code:this.curPath[2]})
                    if(listObj){
                        this.activeIndex.push(listObj.parentId);
                        return true;
                    } 
                }
            }
        },
        sideSwap(){
            this.isSideShow = !this.isSideShow;
        }
        
    }
}
</script>

<style lang='scss' scoped>
.app-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row; 
}
.sideBox.close{
    margin-left: -280px;
}
.sideBox{
    width: 280px;
    height:100%;
    position: relative;
    background: #2a2f55;
    transition: .2s all;
    margin-left: 0px;
    .sideBar{
        width: 15px;
        height: 150px;
        background: #2a2f55;
        position: absolute;
        right: -14px;
        text-align: center;
        top: 50%;
        margin-top: -75px;
        z-index: 50;
        border-radius: 0 20px 20px 0;
        cursor: pointer;
        color: #ebedf1;
        transition: .2s all;
    }
    .sideBar:hover{
        color:#409EFF;
        transform: scale(1.05);
    }
    .sideBar.open::after{
        font-family: element-icons!important;
        // content: "\e6e0";
        content: "\e6de";
        left: -5px;
        font-size: 16px;
        position: absolute;
        line-height: 150px;
    }
    .sideBar.close::after{
        font-family: element-icons!important;
        content: "\e6e0";
        left: 0;
        font-size: 16px;
        position: absolute;
        line-height: 150px;
    }
}
.sideBox /deep/ .el-menu{
    border-right: none !important;
}
.main-container{
    overflow: hidden;
    position: relative;
    flex: 1;
    background: #ebedf1;
}
.sliderRight-enter-active {
    animation-name: fadeInRight;
    animation-duration: .5s;
}

.sliderRight-leave-active {
    animation-name: fadeOutRight;
    animation-duration: .5s;
}
</style>