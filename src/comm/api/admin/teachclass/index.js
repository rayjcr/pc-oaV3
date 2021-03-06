import fetch from '../../../script/utils/fetch';


export function teachclassAll(query) {
  return fetch({
    url: '/api/base/jcRkjssz/bjkcjs',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcRkjssz',
    method: 'post',
    data: obj
  });
}

export function delObj(obj) {
  return fetch({
    url: '/api/base/jcRkjssz/scrksz',
    method: 'delete',
    data: obj
  })
}

export function delAllObj(query) {
  return fetch({
    url: '/api/base/jcRkjssz/qkrksz',
    method: 'delete',
    params: query
  })
}

/**下载模板**/
export function getTemplateUrl() {
  return fetch({
    url: '/api/base/jcRkjssz/getTemplateUrl',
    method: 'get',
    responseType: 'arraybuffer'
  });
}
