import request from '@/utils/request'

/**
 *  首页
 * @param {data}
 */
export function Getres (data) {
    return request.post('/v1/upload/role/list', data)
}
