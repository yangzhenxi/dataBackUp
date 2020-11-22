import request from '@/utils/request'

/**
 *  首页
 * @param {data}
 */
export function Getres () {
    return request.post('/v1/upload/user/list')
}
