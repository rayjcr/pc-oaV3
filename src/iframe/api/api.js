import fetch from '../../comm/script/utils/fetch';

const PATH_HEAD = '/api';

export function getMenus(query) {
    return fetch({
        url: `${PATH_HEAD}/admin/user/front/menus`,
        method: 'get',
        params: query
    });
}