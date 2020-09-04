import fetch from '../script/utils/fetch';

export function loginByEmailadmin (username, password, userId, kaptcha, platform) {
  const data = {
    username,
    password,
    kaptcha,
    userId,
    platform
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}
export function loginByEmail(adminusercode, adminpassword, usercode) {
  const data = {
    adminusercode,
    adminpassword,
    usercode,
  };
  return fetch({
    url: '/api/auth/jwt/adminToanyToken',
    method: 'post',
    data
  });
}
export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });
}


export function lga(data) {
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function getvalidateYzm(params) {
  return fetch({
    url: '/api/auth/jwt/vrifyKaptcha',
    method: 'get',
    params
  })
}

//授权日志分页列表 
export function logPage(params) {
  return fetch({
    url: '/api/auth/jwt/logPage',
    method: 'get',
    params
  })
}

//GET 导出授权日志

export function logExport(params) {
  return fetch({
    url: '/api/auth/jwt/logExport',
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}



// export function getvalidateYzm(params) {
//   return fetch({
//     url: '/api/auth/jwt/vrifyKaptcha',
//     method: 'get',
//     params
//   })
// }

