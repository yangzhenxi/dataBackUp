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
export function ResetPass (data) {
    return request.post('/v1/user/password', data)
}
/**
 *  重置密码
 * @param {data}
 */
export function ResetPass (data) {
    return request.post('/v1/user/password', data)
}
/**
 *  新建用户
 * @param {data}
 */
export function Register (data) {
    return request.post('/v1/user/register', data)
}
/**
 *  删除用户
 * @param {data}
 */
export function DeleteUser (data) {
    return request.post('/v1/user/delete', data)
}
