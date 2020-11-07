import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data} data
 */
export function Getlogo () {
    return request.get('/log')
}
