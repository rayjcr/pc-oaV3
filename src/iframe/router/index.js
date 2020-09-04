import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV);


// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '*',
    //   redirect: '/'
    // },
    {
      path: '/',
      name: 'Page',
      component: _import('main/Main'),
      meta: {
        title: '项目框架'
      }
    }
  ]
})

export default router
