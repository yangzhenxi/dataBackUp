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
            {
                path: '/dashboard',
				name: 'dashboard',
				component: () => import('@/views/dashboard'),
				meta: { title: '仪表盘', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
            },
            // Statistics
            {
                path: '/Statistics',
                name: 'Statistics',
				component: () => import('@/views/statistics/Summary'),
                meta: { title: '数据统计', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
                children: [
					{
						path: '/Statistics/Summary',
						name: 'sumup',
						component: () => import('@/views/statistics/Summary/destrict'),
						meta: { title: '数据质控汇总', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
					},
					{
						path: '/Statistics/Summary/:sid',
						name: 'sumupMechanism',
						hidden: true,
						component: () => import('@/views/statistics/Summary/mechanism'),
						meta: { title: '机构', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
					},
					{
						path: '/Statistics/SignUp',
						name: 'ContractSignUp',
						component: RouteView,
						meta: { title: '签约', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
						children: [
							{
								path: '/Statistics/SignUp/upload',
								name: 'signuploadlog',
								component: () => import('@/views/statistics/SignUp/upload/destrict'),
								meta: { title: '推送日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							},
							{
								path: '/Statistics/SignUp/upload/:sid',
								name: 'signuploadmechanism',
								hidden: true,
								component: () => import('@/views/statistics/SignUp/upload/mechanism'),
								meta: { title: '机构日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							},
							{
								path: '/Statistics/SignUp/pull',
								name: 'signpulllog',
								component: () => import('@/views/statistics/SignUp/pull/destrict'),
								meta: { title: '抽取日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							},
							{
								path: '/Statistics/SignUp/pull/:sid',
								name: 'signuppullmechanism',
								hidden: true,
								component: () => import('@/views/statistics/SignUp/pull/mechanism'),
								meta: { title: '机构日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							}
						]
					},
					{
						path: '/Statistics/Referral',
						name: 'ContractReferral',
						component: RouteView,
						meta: { title: '转诊', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
						children: [
							{
								path: '/Statistics/Referral/upload',
								name: 'Referralloadlog',
								component: () => import('@/views/statistics/Referral/upload/destrict'),
								meta: { title: '推送日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							},
							{
								path: '/Statistics/Referral/upload/:sid',
								name: 'Referralloadmechanism',
								hidden: true,
								component: () => import('@/views/statistics/Referral/upload/mechanism'),
								meta: { title: '机构日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							},
							{
								path: '/Statistics/Referral/pull',
								name: 'Referralpulllog',
								component: () => import('@/views/statistics/Referral/pull/destrict'),
								meta: { title: '抽取日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							},
							{
								path: '/Statistics/Referral/pull/:sid',
								name: 'Referralpullmechanism',
								hidden: true,
								component: () => import('@/views/statistics/Referral/pull/mechanism'),
								meta: { title: '机构日志', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
							}
						]
					}
                ]
			},
			// 错误日志
			{
                path: '/errorlog',
				name: 'errorlog',
                component: RouteView,
				meta: { title: '错误日志', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
				children: [
					{
						path: '/error/statisticslog',
						name: 'statisticslog',
						component: () => import('@/views/Errorlog/statistics'),
						meta: { title: '推送日志', keepAlive: true, permission: ['dashboard'] }
					},
					{
						path: '/error/Extractlog',
						name: 'ErrorpullLog',
						component: () => import('@/views/Errorlog/pullLog'),
						meta: { title: '抽取日志', keepAlive: true, permission: ['dashboard'] }
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
