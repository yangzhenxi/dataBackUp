import request from '@/utils/request'

/**
 *  用户列表
 * @param {data}
 */
export function GetUserList () {
    return request.post('/v1/upload/user/list')
}
/**
 *  重置密码
 * @param {data}
 */
export function ResetPass () {
    return request.post('/v1/upload/user/password')
}
