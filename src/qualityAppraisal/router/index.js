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
      redirect: '/qualityAppraisal'
    },
    {
      name: '综合素质评价',
      path: '/qualityAppraisal',
      redirect: '/qualityAppraisal/situation',
      component: Layout,
      icon: 'setting',
      children: [
        {
          path: 'situation',
          component: _import(
              'qualityAppraisal/situation/index'
            ),
          name: '概况',
        },{
          path: 'weekset',
          component: _import(
              'qualityAppraisal/weekset/index'
            ),
          name: '值周维护',
        },{
          path: 'dimension',
          component: _import(
              'qualityAppraisal/dimension/index'
            ),
          name: '评价维度设置',
        },{
          path: 'levelSetting',
          component: _import(
              'qualityAppraisal/levelSetting/index'
            ),
          name: '勋章等级设置',
        },{
          path: 'appraisalSetting',
          component: _import(
              'qualityAppraisal/appraisalSetting/index'
            ),
          name: '评价项设置',
        },{
          path: 'collectSetting',
          component: _import(
              'qualityAppraisal/collectSetting/index'
            ),
          name: '采集规则设置',
        },{
          path: 'teacherAppraisal',
          component: _import(
              'qualityAppraisal/teacherAppraisal/index'
            ),
          name: '评价记录',
        },{
          path: 'mallManagement',
          component: _import(
              'qualityAppraisal/mallManagement/index'
            ),
          name: '商场管理',
        },{
          path: 'appraisalReview',
          component: _import(
              'qualityAppraisal/appraisalReview/index'
            ),
          name: '评价审核',
        },{
          path: 'statistics',
          component: _import(
              'qualityAppraisal/statistics/index'
            ),
          name: '统计',
        },{
          path: 'qrcodeExchange',
          component: _import(
              'qualityAppraisal/QRcodeExchange/index'
            ),
          name: '二维码兑换分数/勋章',
        },{
          path: 'eventRegistration',
          component: _import(
              'qualityAppraisal/signUp/index'
            ),
          name: '活动报名',
        },{
          path: 'configure',
          component: _import(
              'qualityAppraisal/configure/index'
            ),
          name: '全局配置',
        },{
          path: 'teamMaintenance',
          component: _import(
              'qualityAppraisal/team/index'
            ),
          name: '团体设置',
        },{
          path: 'typeMaintenance',
          component: _import(
              'qualityAppraisal/typeMaintenance/index'
            ),
          name: '类型维护',
        },{
          path: 'customRoles',
          component: _import(
              'qualityAppraisal/customRoles/index'
            ),
          name: '自定义角色',
        },
        {
          path: 'operationLog',
          component: _import(
            'qualityAppraisal/operationLog/index'
          ),
          name: '操作日志',
        },
        {
          path: 'reportImport',
          component: _import(
            'qualityAppraisal/reportImport/index'
          ),
          name: '报告单导入',
        }
      ]
    }
  ]
})

