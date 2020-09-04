<template>
  <el-container>
    <el-header>
      <Header @changeMenuShow="changeMenuShow"></Header>
    </el-header>
    <el-container>
      <transition name="sliderLeft">
        <div class="aside" v-show="isMenuShow">
          <div class="sideBar" :class="[isMenuShow?'open':'close']" @click="changeMenuShow">
      </div>
          <Aside :menuList="menuList" @getPath="getPath" ref="aside"></Aside>
        </div>
      </transition>
      <el-main>
        <div class="act-form">
            <div class="load" v-show="isLoad">
                <span class="loadTips">应用正在加载中</span>
                
            </div>
            
            <transition name="sliderLeft"> 
                <div class="mainflex">
                    <div class="blank" :class="{open:isMenuShow}" v-if="path==''">
                        <blank></blank>
                    </div>
                    <iframe id="myiframe" :src="path" frameborder="0"></iframe>
                </div>
            </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { getMenus } from '../../api/api.js';
  const multiConfig = require('../../../../config/multi.conf')
  import Header from '../head/Head';
  import Aside from '../aside/Aside';
  import blank from './blank.vue';
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  export default {
    name: 'Main',
    components: {
      Header,
      Aside,
      blank
    },
    data() {
      return {
        path: '',
        menuList: [],
        isMenuShow:false,
        isLoad:false,
      }
    },
    mounted() {
        var _this = this;

        window.addEventListener('message', function(e) {
            if(e.data.isRouter){
                var pathObj = (e.data.path.substr(0,1)=='/')?e.data.path.substr(1):e.data.path;
                // console.log(pathObj,"pathObj");
                history.pushState('', '', `/iframe/#`+pathObj)
            }
        });
        this.getMenusList();
        this.initPath();
        // this.refreshPath();  
    },
    methods: {

      // 监听iframe是否加载完成
      iframeOnLoad() {
        this.isLoad = true;
        // console.log(4)
        var that = this;
        // 进度条加载显示
        // console.log("ooopppp")
        NProgress.start();

        if(!this.path) NProgress.done();

        const iframe = document.querySelector('#myiframe');
        // 处理兼容行问题
        if (iframe.attachEvent) {
          iframe.attachEvent('onload', function () {
            // iframe加载完毕以后执行操作
            // console.log("加载完成1")
            NProgress.done();
          })
        } else {
          iframe.onload = function () {
            // iframe加载完毕以后执行操作
            // console.log("iframe加载完毕")
            that.isLoad = false;
            that.isMenuShow = false;
            NProgress.done();
          }
        }
      },

      initPath(){
        //获取#号后面的地址
        // console.log(window.location.hash.split("#")[1])
        var pathArr = window.location.hash.split("#");

        //有值代表没有进入某一个项目中 ///这里需要完整复制地址下来
        if(pathArr[1]){
          var appPathArr = pathArr[1].split("/");
          // console.log(pathArr,"pathArr")
          //获取配置文件中应用配置信息
          var LinkObj = multiConfig.modules.find((item) => {
            return item.name == appPathArr[0]
          })
          // console.log(LinkObj,"LinkObj");
          if(LinkObj){
            // console.log(process.env,"666666")
            if(process.env.NODE_ENV == "development"){
              setTimeout(() => {
                this.path = 'http://localhost:'+LinkObj.port+'/#/'+pathArr[1]+"/"+'?u='+ new Date().getTime();
                this.iframeOnLoad();
              },50)
            }else{
              setTimeout(() => {
                this.path = '/'+LinkObj.name+"/#/"+pathArr[1]+"/"+'?u='+ new Date().getTime();
                this.iframeOnLoad();
              },50)
            }
          }else{
            //没有找到对应应用返回主框架
            this.gotoIframe();
          }
        }else{
          //没有#号代表没有进入应用中直接返回localhost:8091/iframe
          this.gotoIframe();
        }
        // console.log(multiConfig.modules,"multiConfig.modules")
        // console.log(LinkObj,"LinkObj");
        // console.log(pathArr[1],"pathArr");
      },
      gotoIframe(){
        this.iframeOnLoad();
        history.pushState('','','/iframe')
        this.isMenuShow = true;
        this.isLoad = false;
        // console.log(2)
        //初始化页面后续需添加
        this.path = '';
      },

      getPath(path,query = {}) {
        this.isLoad = true;
        var that = this;
        NProgress.start();
        // this.path = '';
        // console.log(path,"path");
        var LinkObj = multiConfig.modules.find((item) => {
          return item.name == path
        })
        // console.log(LinkObj,"LinkObj21");
        if(process.env.NODE_ENV == "development"){
          setTimeout(() => {
              that.isMenuShow = false;
              this.path = 'http://localhost:'+LinkObj.port+'/'+LinkObj.name+"/"+LinkObj.path+'?u='+ new Date().getTime();
          },50)
        }else{
          setTimeout(() => {
              that.isMenuShow = false;
              this.path = '/'+LinkObj.name+"/#/"+'?u='+ new Date().getTime();
              // this.path = '/'+LinkObj.name+"/"+LinkObj.path+'?u='+ new Date().getTime();
          },50)
        }
        // history.pushState('', '', `/iframe/#${path}/${LinkObj.path}`)
        history.pushState('', '', `/iframe/#${path}`)
      },
      // 获取导航菜单数据
      getMenusList() {
        // console.log(this.$cookie.get("token"))
        getMenus({token: this.$cookie.get("token")}).then(response => {
          console.log(response,"这里是主菜单")
          this.menuList = this.checkMenuList(response);
          
        })
      },
      // 根据multiConfig的配置来显示已配置的菜单
      checkMenuList(menuList){
        console.log(multiConfig.modules,"multiConfig.modules")
        let selArr = [];
        for(let i=0;i<multiConfig.modules.length;i++){
          let findMenu = _.find(menuList,{code:multiConfig.modules[i].name})
          if(findMenu){
            selArr.push(findMenu)
          }
        }
        return selArr
      },
      changeMenuShow(){
        this.isMenuShow = !this.isMenuShow;
        if(this.isMenuShow){
          this.$refs.aside.activeMenu();
        }
      },
      cancelMenu(){
        this.isMenuShow = false;
      },

     
     

      // refreshPath(){
      //   var pathArr = window.location.pathname.split("/")


      //   NProgress.start();
      //   // 触发iframe的onload事件
      //   // console.log(pathArr[1],"path,path")
      //   if(!pathArr[1]||pathArr[1].indexOf("Page")==-1){
      //       // console.log("112233")
      //       this.iframeOnLoad();
      //       this.path = '';
      //       // history.pushState('', '', '/')
      //       this.isMenuShow = true;
      //       this.isLoad = false;
      //       return false;
      //   }

      //   // var pathArr = path.split('/');
      //   // console.log(pathArr,"pathArr");

      //   var LinkObj = multiConfig.modules.find((item) => {
      //       return item.name == pathArr[2]
      //   })
        
      //   // console.log(LinkObj,"Main_117")
        
      //   if(LinkObj){
      //       console.log(process.env,"666666")
      //       setTimeout(() => {
      //       this.path = 'http://localhost:'+LinkObj.port+'/#'+LinkObj.name+"/"+(pathArr[3]?pathArr[3]:'')+'?u='+ new Date().getTime();
      //       this.iframeOnLoad();
      //       },50)
            
      //   }else{
      //       this.iframeOnLoad();
      //       history.pushState('', '', '/')
      //       this.isMenuShow = true;
      //       this.isLoad = false;
      //       this.path = '';
      //   }
      // },


      // queryString(query) {
      //   return Object.keys(query)
      //     .filter(key => key !== 'u')
      //     .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
      //     .join('&')
      // },
      // 导航菜单切换
      // getPath(path,query = {},isRefresh) {
      //   this.isLoad = true;
      //     // console.log(path,"path")
      //   var that = this;
      //   // console.log(path,"path_Main_94")

      //   //判断url是否更新
      //   if(!isRefresh){
      //       if(window.location.pathname == '/Page/'+path) {
      //       return;
      //       }
      //   }
        
      //   NProgress.start();

      //   // 触发iframe的onload事件
      //   this.path = '';

      //   var LinkObj = multiConfig.modules.find((item) => {
      //       return item.name == path
      //   })
        
      //   // console.log(LinkObj,"Main_110")
      //   console.log(process.env,"666666")

      //   if(process.env.NODE_ENV == "development"){
      //       setTimeout(() => {
      //           that.isMenuShow = true;
      //           this.path = 'http://localhost:'+LinkObj.port+'/#'+LinkObj.name+"/"+LinkObj.path+'?u='+ new Date().getTime();
      //           // this.path = 'http://oa.91118.com:8082/szxy#' + path + '?u='+ new Date().getTime();
      //       },50)
      //   }else{
      //       setTimeout(() => {
      //           that.isMenuShow = true;
      //           this.path = 'iframe/#'+LinkObj.name+"/"+LinkObj.path+'?u='+ new Date().getTime();
      //           // this.path = 'http://oa.91118.com:8082/szxy#' + path + '?u='+ new Date().getTime();
      //       },50)
      //   }
        

      //   // 跨模块跳转，无页面刷新
        
      //   // query = {
      //   //   id: 1,
      //   //   name: '1'
      //   // }
      //   // const queryString = this.queryString(query) ? '?' + this.queryString(query) : ''
      //   // console.log("queryString----",queryString)

      //   // console.log(path,"path_Main_126");

      //   //变更url地址栏
      //   // history.pushState('', '', `/Page/${path}/${LinkObj.path}${queryString}`)
      //   history.pushState('', '', `/iframe/#${path}/${LinkObj.path}`)

      //   // this.isMenuShow = false;

      // },

      
    }
  }
</script>

<style lang="scss" scoped>
  .act-form, iframe {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .aside{
    width: 280px;
    height: calc(100vh - 60px);
    position: absolute;
    z-index: 2;
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
  .mainflex{
      flex: 1;
      position: relative;
  }
  .el-header {
    padding: 0;
    z-index: 5;
    background-color: #ffffff;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
  }
  .el-aside {
    width: 280px !important;
    height: 100%;
    position: fixed;
    left: 0;
    top: 60px;
  }
  .load{
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: .5);
    color: #000;
    position: fixed;
    top: 0;
    left: 0;
    .loadTips{
      display: inline-block;
      width: 300px;
      height: 100px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #FFF;
      line-height: 100px;
      text-align: center;
      border-radius: 20px;
      color: #000;
    }
  }
  .blank{
    background: #ebedf1;
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    z-index: 1;
  }
  .blank.open{
    padding-left: 280px;
  }
</style>
