import request from '@/utils/request'

/**
 *  获取服务监控容量
 * @param {data}
 */
export function getServerCapacity () {
    return request.get('/v1/monitor/serverCapacity')
}
/**
 *  获取数据库连接状态
 * @param {data}
 */
export function getdatabaseStatus () {
    return request.get('/v1/monitor/databaseStatus')
}
/**
 *  获取数据库连接状态
 * @param {data}
 */
export function getstatus () {
    return request.post('/v1/status/dashboard')
}
