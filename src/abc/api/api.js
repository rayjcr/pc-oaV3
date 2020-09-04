import fetch from '../../comm/script/utils/fetch';

const PATH_HEAD = '/api';

export function login(data) {
    return fetch({
        url: `${PATH_HEAD}/auth/jwt/token`,
        method: 'post',
        data: data
    });
}

// 模拟登录
export function adminToanyToken(data) {
    return fetch({
        url: `${PATH_HEAD}/auth/jwt/adminToanyToken`,
        method: 'post',
        data: data
    });
}