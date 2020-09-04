import fetch from '../script/utils/fetch';

export function dqxnxqObj(query) {   // 获取当前学年学期
    return fetch({
      url: '/api/base/jcXndm/getCurrentXnxq',
      method: 'get',
      params: query
    });
}

// 获取年级List接口
export function getNj(query) {
    return fetch({
      url: '/api/base/jcNjsjlx/page',
      method: 'get',
      params: query
    });
}

// 查询班级List接口
export function getBj(query) {
    return fetch({
      url: '/api/base/jcBjsj/ajaxGetBjList',
      method: 'get',
      params: query
    })
}

export function getMenus(query) {
  return fetch({
      url: '/api/admin/user/front/menus',
      method: 'get',
      params: query
  });
}