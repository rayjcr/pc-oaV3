import fetch from '../../../script/utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/base/jcXndm/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcXndm',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcXndm/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcXndm/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcXndm/' + id,
    method: 'put',
    data: obj
  })
}


export function dqxnxqObj(query) {   // 获取当前学年学期
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq',
    method: 'get',
    params: query
  });
}
export function getCurrentXnxq(query) {   // 获取当前学年学期
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq',
    method: 'get',
    params: query
  });
}

