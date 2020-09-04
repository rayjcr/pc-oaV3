import Vue from 'vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App'

Vue.use(ElementUI);


import VueCookie from 'vue-cookie'
Vue.use(VueCookie);


Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})


router.beforeEach((to,from,next) => {
  // console.log(to,"a");
  // console.log(top.document.referrer,"b");
  var toUrl = {}
  toUrl.path = to.fullPath;
  toUrl.isRouter = true;
  window.parent.postMessage(toUrl,'*');
  // console.log("子项目中路由拦截器")
  next();
})
