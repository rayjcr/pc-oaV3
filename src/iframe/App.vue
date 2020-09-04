<template>
    <div id="app">
        <Main ref='main'></Main>
    </div>
</template>

<script>
  import Main from './views/main/Main';
  const multiConfig = require('../../config/multi.conf')
  export default {
    name: 'App',
    components: {
        Main
    },
    mounted() {
        // let styleSheetPath = "../../static/style/theme/default.css"
        // let themeLink = document.querySelector('link[name="theme"]');
        // // console.log(themeLink,"themeLink")
        // themeLink.setAttribute('href', styleSheetPath);

        // 页面刷新时同步iframe地址
        // const { path } = this.$route;

        // // console.log(path,"path_app.vue_24")

        // var url_arr = path.replace('/Page/','').split('/');

        // // console.log(url_arr,"pathAppvue")
        // if(url_arr.length>1){
            
        //     var LinkObj = multiConfig.modules.find((item) => {
        //         return item.name == url_arr[0]
        //     })
        //     // console.log(url_arr);
        //     // console.log(LinkObj);

        //     this.$nextTick(() => {
        //         // let url_arr = path.split('/Page');
        //         if(url_arr.length > 1 && url_arr[1]) {
        //             this.$refs.main.path = 'http://localhost:'+LinkObj.port+'/' + url_arr[1]
        //         } else {
        //             this.$refs.main.path = ''
        //         }
        //     })
        // } 
    },
  }
</script>
<style lang="scss">
@import '../../static/style/theme/default.css';
@import './assets/style/layout.scss';
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    -moz-user-select: none; 
    -webkit-user-select: none; 
    -ms-user-select: none; 
    -khtml-user-select: none; 
    user-select: none; 
}
ul,li {
    list-style: none;
    margin: 0;
    padding: 0;
}
#app {
    height: 100%;
    display: flex;
    min-width: 980px;
}
</style>
