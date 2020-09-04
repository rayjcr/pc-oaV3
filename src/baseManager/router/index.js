import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../../comm/components/layout/layout';
const _import = require('./_import_' + process.env.NODE_ENV);


Vue.use(Router)

export default new Router({
  // mode: 'history',
  mode:'hash',
  routes: [
    {
      path: '/',
      redirect: '/baseManager'
    },
    {
      path: '/baseManager',
      redirect: '/baseManager/specialRaw',
      component: Layout,
      name: '基础信息',
      children:[
        {
          path:'specialRaw',
          name: '特长生维护',
          component: _import('admin/specialRaw/index'),
          meta: {
            title: '特长生维护'
          }
        },
        {
          path:'specialTypeManager',
          name: '特长生类型',
          component: _import('admin/specialType/index'),
          meta: {
            title: '特长生类型'
          }
        },



        
      ]
    },
  ]
})

