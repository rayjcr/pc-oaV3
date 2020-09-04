<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route(to,from) {
      let obj = {
        path: to.path,
        query: to.query
      }
      let domain = window.location.origin
      window.postMessage(obj,domain);
    }
  }
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
  }
</style>