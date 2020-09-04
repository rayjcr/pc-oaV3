<template>
  <div class="aside-box">
      <vue-scroll>
        <!-- <el-menu 
          mode="vertical" 
          unique-opened 
          :default-active="activePath" 
          background-color="#2a2f55" 
          text-color="#c0c5eb" 
          @select="handleSelect"
        > -->
        <ul>
            <li v-for="(item,index) in realMenuList" @click="handleSelect(index,item.code)" class="sideItem" :key="index" :index="item.code" :class="{active:item.isActive}"><i class="iconfont" :class="item.icon"></i>{{item.title}}</li>
          <!-- <side-item :menuList='menuList'></side-item> -->
        </ul>
        <!-- <el-menu></el-menu> -->
        <!-- </el-menu> -->
      </vue-scroll>
  </div>
</template>

<script>
//   import SideItem from './SideItem'
  import _ from 'lodash';
  export default {
    name: 'Aside',
    props: {
      menuList: {
        type: Array,
        default: function () {
            return []
        }
      },
    },
    watch: {
      menuList: function () {
          this.init();
      }
    },
    components: {
    //   SideItem
    },
    data() {
      return {
        activePath: '',
        realMenuList:[],
        rootMenuList:[],
        // subMenuList:[],
        // isMainAppMenu:true,
      }
    },
    mounted() {
        
        // 页面刷新时同步iframe地址
        this.init();

        // console.log(this.menuList,'menuList_aside_56')
    },
    methods: {
        init(){
            this.realMenuList = _.cloneDeep(this.menuList);
            this.rootMenuList = _.cloneDeep(this.menuList);
            // console.log(this.menuList,"this.menuList")
            // console.log(this.realMenuList,"this.realMenuList");
            const { path } = this.$route;
            this.$nextTick(() => {
                let url_arr = path.split('/Page');
                if(url_arr.length > 1) {
                    let _arr = url_arr[1].split('/');
                    this.activePath = _arr[_arr.length - 1]
                } else {
                    this.activePath = ''
                }
            })
        },
        handleSelect(key, keyPath) {
            console.log(key,"key")
            console.log(keyPath,"keyPath")
            // let path = '';
            // if(keyPath.length >1){
            //     let new_arr = keyPath.slice(-2);
            //     path = '/'+new_arr[0]+'/'+new_arr[1];
            // }
            
            // this.subMenuList = _.find(this.menuList,{'code':keyPath}).children;
            // console.log(this.subMenuList,"subMenuList_Aside_71");

            this.$emit('getPath',keyPath);
        },
        activeMenu(){
          let pathArr = window.location.hash.split("#");
          if(pathArr[1]){
              // console.log(this.menuList,"this.menuList")
              // console.log(this.rootMenuList,"this.rootMenuList");
              let appRootPath = pathArr[1].split("/")[0];
              this.realMenuList = _.cloneDeep(this.menuList);
              let findMenu = _.find(this.realMenuList,{code:appRootPath});
              console.log(findMenu,"findMenu")
              this.$set(findMenu,'isActive',true)
              
          }
        },
        // gotoApp(item){
        //     console.log(item,"5566") 
        // }, 
    }
  }
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "iconfont";
  src:  url('../../../assets/img/fonticon/iconfont.woff') format('woff'), /* chrome, firefox */
  url('../../../assets/img/fonticon/iconfont.woff2') format('woff2')
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.aside-box {
    position: absolute;
    width: 280px;
    height: calc(100vh - 60px);
    background-color: #2a2f55;
}
.sideItem{
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding-left: 75px;
    position: relative;
    cursor: pointer;
    i{
      position: absolute;
      left: 40px;
    }
    .navico_1::after {
      content: '\e621';
    }
    .navico_2::after {
      content: '\e62c';
    }
    .navico_3::after {
      content: '\e62a';
    }
    .navico_4::after {
      content: '\e61d';
    }
    .navico_5::after {
      content: '\e625';
    }
    .navico_6::after {
      content: '\e61e';
    }
    .navico_7::after {
      content: '\e61c';
    }
    .navico_8::after {
      content: '\e628';
    }
    .navico_9::after {
      content: '\e629';
    }
    .navico_10::after {
      content: '\e623';
    }
    .navico_11::after {
      content: '\e622';
    }
    .navico_12::after {
      content: '\e62b';
    }
    .navico_13::after {
      content: '\e62d';
    }
    .navico_14::after {
      content: '\e624';
    }
    .navico_15::after {
      content: '\e62e';
    }
    .navico_jlk::after {
      content: '\e620';
    }
    .setting::after{
      content: '\e61b';
    }
}
</style>