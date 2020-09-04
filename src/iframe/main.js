import Vue from 'vue'
import router from './router'
// import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animated from 'animate.css' // npm install animate.css --save安装，在引入

import App from './App'
Vue.use(animated)
Vue.use(ElementUI);

import VueCookie from 'vue-cookie'
Vue.use(VueCookie);

import vuescroll from 'vuescroll';
Vue.use(vuescroll);

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  // store,
  router,
  template: '<App/>',
  components: { App }
})
