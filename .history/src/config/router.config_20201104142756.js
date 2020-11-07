// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

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
                children: [
                    {
                        path: '/Statistics/Home',
                        name: 'Home',
                        component: () => import('@/views/Statistics/Home'),
                        meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] }
                    },
                    {
                        path: '/dashboard/workplace',
                        name: 'Workplace',
                        component: () => import('@/views/dashboard/Workplace'),
                        meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] }
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
