import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data} params
 */
export function Getlog (params) {
    return request.get('/v1/upload/log', { params })
}
/**
 *  获取统计表格
 * @param {data} params
 */
export function Getres (params) {
    return request.post('/v1/upload/res', data)
}
