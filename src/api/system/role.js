import request from '@/utils/request'

/**
 *  首页
 * @param {data}
 */
export function GetRoleres () {
    return request.post('/v1/role/list')
}
