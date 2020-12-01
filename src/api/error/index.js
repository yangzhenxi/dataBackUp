import request from '@/utils/request'

/**
 *  获取错误日志
 * @param {data}
 */
export function Getlog (data) {
    return request.post('/v1/upload/log', data)
}
/**
 *  根据县或者机构以及时间获取错误日志
 * @param {data}
 */
export function GetlogErr (data) {
    return request.post('/v1/upload/log/err', data)
}

export function GetPullLog (data) {
    return request.post('/v1/pull/log', data)
}

export function GetPullLogErr (data) {
    return request.post('/v1/pull/log/err', data)
}
