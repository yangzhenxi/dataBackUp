import request from '@/utils/request'

/**
 *  首页
 * @param {data}
 */
export function Getres (data) {
    return request.post('/v1/upload/qy/res', data)
}
/**
 *  根据区县获取所有机构的表
 * @param {data}
 */
export function GetresDetail (data) {
    return request.post('/v1/upload/qy/res/detail', data)
}
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

/**
 *
 * @param {data}
 */
export function GetPullRes (data) {
    return request.post('/v1/pull/qy/res', data)
}

export function GetPullResDetail (data) {
    return request.post('/v1/pull/qy/res/detail', data)
}

export function GetPullLog (data) {
    return request.post('/v1/pull/log', data)
}

export function GetPullLogErr (data) {
    return request.post('/v1/pull/log/err', data)
}
/**
 *获取数据质控汇总
 * @param {data}
 */
export function getAllList (data) {
    return request.post('/v1/all/list', data)
}
/**
 *获取数据质控汇总 机构详情
 * @param {data}
 */
export function getAllDetail (data) {
    return request.post('/v1/all/detail', data)
}
