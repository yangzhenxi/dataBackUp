import request from '@/utils/request'

/**
 *  用户列表
 * @param {data}
 */
export function GetUserList () {
    return request.post('/v1/user/list')
}
/**
 *  重置密码
 * @param {data}
 */
export function ResetPass () {
    return request.post('/v1/user/password')
}
/**
 *  新建用户
 * @param {data}
 */
export function Register () {
    return request.post('/v1/user/register')
}
