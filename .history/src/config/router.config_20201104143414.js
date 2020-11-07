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
                meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] }
            },

            // Statistics
            {
                path: '/Statistics/Home',
                name: 'Statistics',
                component: RouteView,
                meta: { title: '数据统计', keepAlive: true, icon: icon.CloudDesktop, permission: ['dashboard'] },
                children: [
                    {
                        path: '/Statistics/Home',
                        name: 'Home',
                        component: () => import('@/views/Statistics/Home'),
                        meta: { title: '首页', keepAlive: false, permission: ['dashboard'] }
                    },
                    {
                        path: '/Statistics/District',
                        name: 'District',
                        component: () => import('@/views/Statistics/District'),
                        meta: { title: '区县机构', keepAlive: true, permission: ['dashboard'] }
                    },
                    {
                        path: '/Statistics/ErrorLog',
                        name: 'ErrorLog',
                        component: () => import('@/views/Statistics/ErrorLog'),
                        meta: { title: '错误日志', keepAlive: true, permission: ['dashboard'] }
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
