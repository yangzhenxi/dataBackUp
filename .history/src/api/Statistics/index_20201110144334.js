import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data} data
 */
export function Getlog (data) {
    return request.get('/v1/upload/log', { data })
}
/**
 *  获取统计表格
 * @param {data} params
 */
export function Getres (data) {
    return request.get('/v1/upload/res', { data })
}
