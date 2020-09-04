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
      redirect: '/safeCampus/workBench'
    },
    {
      path: '/safeCampus',
      redirect: '/safeCampus/workBench',
      component: Layout,
      name: '校园安全',
      children:[
        {
          path:'workBench',
          component: _import('workBench/index'),
          meta: {
            title: '工作台'
          }
        },{
          path:'teacherAddress',
          component: _import('basicManage/teacherAddress'),
          meta: {
            title: '教师通讯录'
          }
        },{
          path:'studentAddress',
          component: _import('basicManage/studentAddress'),
          meta: {
            title: '学生通讯录'
          } 
        },{
          path:'deviceManage',
          component: _import('basicManage/deviceManage'),
          meta: {
            title: '设备管理'
          } 
        },{
          path:'jurisdictionSetting',
          component: _import('basicManage/jurisdictionSetting'),
          meta: {
            title: '权限设置'
          } 
        },{
          path:'attendanceSetting',
          component: _import('basicManage/attendanceSetting'),
          meta: {
            title: '考勤设置'
          } 
        },{
          path:'attendanceManage',
          component: _import('safeManage/attendanceManage'),
          meta: {
            title: '考勤管理'
          } 
        },{
          path:'temperatureTest',
          component: _import('safeManage/temperatureTest'),
          meta: {
            title: '体温检测'
          } 
        },{
          path:'housemaster',
          component: _import('safeManage/housemaster'),
          meta: {
            title: '宿管系统'
          } 
        },{
          path:'carManage',
          component: _import('safeManage/carManage'),
          meta: {
            title: '车辆管理'
          } 
        },{
          path:'patrolSys',
          component: _import('safeManage/patrolSys'),
          meta: {
            title: '巡更系统'
          } 
        },{
          path:'security',
          component: _import('earlywarnManage/security'),
          meta: {
            title: '安防预警'
          } 
        },{
          path:'warningMsg',
          component: _import('earlywarnManage/warningMsg'),
          meta: {
            title: '预警消息记录'
          } 
        },{
          path:'campusMonitoring',
          component: _import('earlywarnManage/campusMonitoring'),
          meta: {
            title: '鹰眼监控'
          } 
        },{
          path:'featuresSys',
          component: _import('IOTManage/featuresSys'),
          meta: {
            title: '特征采集系统'
          } 
        },{
          path:'RFIDSys',
          component: _import('IOTManage/RFIDSys'),
          meta: {
            title: 'RFID采集系统'
          } 
        },{
          path:'equipmentDistribution',
          component: _import('IOTManage/equipmentDistribution'),
          meta: {
            title: '学校设备分布'
          } 
        },{
          path:'visitorSys',
          component: _import('IOTManage/visitorSys'),
          meta: {
            title: '智能访客'
          } 
        },{
          path:'videoMonitorSys',
          component: _import('IOTManage/videoMonitorSys'),
          meta: {
            title: '视频监控系统'
          } 
        },{
          path:'faceCaptureSys',
          component: _import('IOTManage/faceCaptureSys'),
          meta: {
            title: '人脸抓拍系统'
          } 
        },

        

        

        

        

        
        
      ]
    },
    // {
    //   path: '/basicManage',
    //   component: Layout,
    //   name: 'abc',
    //   children:[
    //     {
    //       path:'deviceManage',
    //       component: _import('home/index2'),
    //       meta: {
    //         title: '设备管理'
    //       }
    //     },
    //   ]
    // },



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

