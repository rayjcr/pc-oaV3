import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../../comm/components/layout/layout';
const _import = require('./_import_' + process.env.NODE_ENV);


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/abc/aaa'
    },
    {
      path: '/abc',
      redirect: '/abc/aaa',
      component: Layout,
      name: 'abc',
      children:[
        {
          path:'aaa',
          component: _import('home/index'),
          meta: {
            title: '测试地址'
          }
        },
        {
          path:'bbb',
          component: _import('home/index2'),
          meta: {
            title: '测试地址2'
          }
        },
      ]
    },
    // {
    //   path: '/bbb',
    //   name: 'bbb',
    //   component: _import('home/index2'),
    //   meta: {
    //     title: '测试地址2'
    //   }
    // }
  ]
})

