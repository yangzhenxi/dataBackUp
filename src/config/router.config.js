// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
    name: 'RouteView',
    render: (h) => h('router-view')
}
export const asyncRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: 'menu.home' },
        redirect: '/dashboard',
        children: [
            // dashboard
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard'),
                meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] }
            },

            // Statistics
            {
                path: '/Statistics',
                name: 'Statistics',
                component: RouteView,
                meta: { title: '数据统计', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
                children: [
                    {
                        path: '/Statistics/HomeMain',
                        name: 'Home',
                        hideChildrenInMenu: true,
                        redirect: '/Statistics/HomeMain/Home',
                        component: () => import('@/views/Statistics/HomeMain/main'),
                        meta: { title: '推送', keepAlive: false, permission: ['dashboard'] },
                        children: [
                            {
                                path: '/Statistics/HomeMain/Home',
                                name: 'Pushlog',
                                hidden: true,
                                component: () => import('@/views/Statistics/HomeMain/Home'),
                                meta: { title: '推送日志', keepAlive: false, permission: ['dashboard'] }
                            },
                            {
                                path: '/Statistics/HomeMain/District',
                                name: 'District',
                                hidden: true,
                                component: () => import('@/views/Statistics/HomeMain/District'),
                                meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
                            },
                            {
                                path: '/Statistics/HomeMain/Errorlog',
                                name: 'ErrorLog',
                                hidden: true,
                                component: () => import('@/views/Statistics/HomeMain/Errorlog'),
                                meta: { title: '错误日志', keepAlive: true, permission: ['dashboard'] }
                            }
                        ]
                    },
                    {
                        path: '/Extract/Extract',
                        name: 'pull',
                        hideChildrenInMenu: true,
                        redirect: '/pull/Extract/Home',
                        component: () => import('@/views/Statistics/Extract/main'),
                        meta: { title: '抽取', keepAlive: false, permission: ['dashboard'] },
                        children: [
                            {
                                path: '/pull/Extract/Home',
                                name: 'Pulllog',
                                hidden: true,
                                component: () => import('@/views/Statistics/Extract/Home'),
                                meta: { title: '抽取日志', keepAlive: false, permission: ['dashboard'] }
                            },
                            {
                                path: '/pull/Extract/District',
                                name: 'Extract',
                                hidden: true,
                                component: () => import('@/views/Statistics/Extract/District'),
                                meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
                            },
                            {
                                path: '/pull/Extract/Errorlog',
                                name: 'ErrorLog',
                                hidden: true,
                                component: () => import('@/views/Statistics/Extract/Errorlog'),
                                meta: { title: '错误日志', keepAlive: true, permission: ['dashboard'] }
                            }
                        ]
                    }
                ]
            },
            // 系统
            {
                path: '/system',
                name: 'system',
                component: RouteView,
                meta: { title: '系统管理', keepAlive: true, icon: bxAnaalyse, permission: ['system'] },
                children: [
                // {
                //     path: '/system/role',
                //     name: 'role',
                //     component: () => import('@/views/system/role'),
                //     meta: { title: '角色管理', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] }
                // },
                    {
                        path: '/system/user',
                        name: 'user',
                        component: () => import('@/views/system/user'),
                        meta: { title: '用户管理', keepAlive: true, icon: bxAnaalyse, permission: ['system'] }
                    }
                ]
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: '/user',
        component: UserLayout,
        redirect: '/user/login',
        hidden: true,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
            },
            {
                path: 'register',
                name: 'register',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
            },
            {
                path: 'register-result',
                name: 'registerResult',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
            },
            {
                path: 'recover',
                name: 'recover',
                component: undefined
            }
        ]
    }

    // {
    // path: '/404',
    // component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
    // }

]
