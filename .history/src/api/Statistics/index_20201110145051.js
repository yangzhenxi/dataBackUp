import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data}
 */
export function Getlog (data) {
    return request.get('/v1/upload/log', data)
}
/**
 *  首页
 * @param {data}
 */
export function Getres (data) {
    return request.post('/v1/upload/res', data)
}
/**
 *  根据区县获取所有机构的表
 * @param {data}
 */
export function Getres (data) {
    return request.post('/v1/upload/res/detail', data)
}
/**
 *  首页
 * @param {data}
 */
export function Getres (data) {
    return request.post('/v1/upload/res', data)
}
/**
 *  首页
 * @param {data}
 */
export function Getres (data) {
    return request.post('/v1/upload/res', data)
}
