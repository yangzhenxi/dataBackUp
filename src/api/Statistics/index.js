import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data} data
 */
export function Getlog () {
    return request.get('/v1/upload/log')
}
/**
 *  获取统计表格
 * @param {data} data
 */
export function Getres () {
    return request.get('/v1/upload/res')
}
