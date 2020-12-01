import request from '@/utils/request'

/**
 *  首页
 * @param {data}
 */
export function GetReferralres (data) {
    return request.post('/v1/upload/zz/res', data)
}
/**
 *  根据区县获取所有机构的表
 * @param {data}
 */
export function GetReferralresDetail (data) {
    return request.post('/v1/upload/zz/res/detail', data)
}
/**
 *
 * @param {data}
 */
export function GetReferralPullRes (data) {
    return request.post('/v1/pull/zz/res', data)
}

export function GetReferralPullResDetail (data) {
    return request.post('/v1/pull/zz/res/detail', data)
}
