import fetch from '../../../script/utils/fetch';

export function classpage(query) {
  return fetch({
    url: '/api/base/jcBjsj/page',
    method: 'get',
    params: query
  });
}
export function classBjpage(query) {
  return fetch({
    url: '/api/base/jcBjsj/bjpage',
    method: 'get',
    params: query
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcBjsj/' + id,
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcBjsj',
    method: 'post',
    data: obj
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcBjsj/' + id,
    method: 'delete'
  })
}
export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcBjsj/' + id,
    method: 'put',
    data: obj
  })
}

// 根据建班学年查询班级列表
export function Getbjlist(params) {
  return fetch({
    url: '/api/base/jcBjsj/selectBjListByJbxn',
    method: 'get',
    params: params
  });
}

/**
 * 说明:获取当前人有权限的班级
 * 作者:RayJ
 * 更新时间:2019-6-10
 */
export function Getjurisdiction(params) {
  return fetch({
    url: '/api/base/jcBjsj/listGrantedClass',
    method: 'get',
    params: params
  })
}

/**
 * 说明:获取当前学年班级年级列表
 * 作者:RayJ
 * 更新时间:2019-6-10
 */
export function GetNjBjList(params) {
  return fetch({
    url: '/api/base/jcBjsj/getNjBjList',
    method: 'get',
    params: params
  })
}
