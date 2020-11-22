import request from '@/utils/request'

/**
 *  用户列表
 * @param {data}
 */
export function GetUserList () {
    return request.post('/v1/upload/user/list')
}
/**
 *  用户列表
 * @param {data}
 */
export function ResetPass () {
    return request.post('/v1/upload/user/password')
}
/**
 *  用户列表
 * @param {data}
 */
export function Getres () {
    return request.post('/v1/upload/user/list')
}
