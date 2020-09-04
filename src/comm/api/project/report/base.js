import fetch from '../../../script/utils/fetch';

//获取学生具体信息
export function getUserInfo(query) {
    return fetch({
        url: '/api/base/jcXsjbsj/getXsByUserName',
        method: 'get',
        params: query
    })
}


//获取学生具体信息
export function getUserInfoByCode(query) {
    return fetch({
        url: '/user/getUserByUsercode',
        method: 'get',
        params: query
    })
}

//获取所有班级
export function getAllBjList(query) {
    return fetch({
        url: '/api/base/jcBjsj/getCurrentBjList',
        method: 'get',
        params: query
    })
}

//获取班级里的学生
export function getAllStudent(query) {
    return fetch({
        url: '/api/base/jcXsbjgx/studentsBybjid',
        method: 'get',
        params: query
    })
}






