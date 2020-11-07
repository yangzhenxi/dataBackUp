import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data} data
 */
export function Getlogo () {
    return request.get('api.v1/log')
}
/**
 *  获取统计表格
 * @param {data} data
 */
export function Getres () {
    return request.get('/res')
}
