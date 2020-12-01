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
                component: RouteView,
                meta: { title: '数据统计', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
                children: [
					// {
					// 	path: '/Referral/pull',
					// 	name: 'Referralpull',
					// 	hideChildrenInMenu: true,
					// 	redirect: '/Referral/pull/Home',
					// 	component: RouteView,
					// 	meta: { title: '抽取', keepAlive: true, permission: ['dashboard'] },
					// 	children: [
					// 		{
					// 			path: '/Referral/pull/Home',
					// 			name: 'ReferralHome',
					// 			hidden: true,
					// 			component: () => import('@/views/Referral/pull/Home'),
					// 			meta: { title: '抽取日志', keepAlive: false, permission: ['dashboard'] }
					// 		},
					// 		{
					// 			path: '/Referral/pull/District',
					// 			name: 'ReferralDistrict',
					// 			hidden: true,
					// 			component: () => import('@/views/Referral/pull/District'),
					// 			meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
					// 		}
					// 	]
					// },
					// {
					// 	path: '/Contract/Statistics',
					// 	name: 'ContractStatistics',
					// 	hideChildrenInMenu: true,
					// 	redirect: '/Contract/Statistics/Home',
					// 	component: RouteView,
					// 	meta: { title: '推送', keepAlive: false, permission: ['dashboard'] },
					// 	children: [
					// 		{
					// 			path: '/Contract/Statistics/Home',
					// 			name: 'ContractHome',
					// 			hidden: true,
					// 			component: () => import('@/views/Contract/Statistics/Home'),
					// 			meta: { title: '推送日志', keepAlive: false, permission: ['dashboard'] }
					// 		},
					// 		{
					// 			path: '/Contract/Statistics/District',
					// 			name: 'ContractDistrict',
					// 			hidden: true,
					// 			component: () => import('@/views/Contract/Statistics/District'),
					// 			meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
					// 		}
					// 	]
					// }
					{
						path: '/Summary',
						name: 'Summary',
						hideChildrenInMenu: true,
						component: RouteView,
						redirect: '/Summary/Home',
						meta: { title: '总结', keepAlive: true, permission: ['dashboard'] },
						children: [
							{
								path: '/Summary/Home',
								name: 'Pushlog',
								hidden: true,
								component: () => import('@/views/Summary/Home'),
								meta: { title: '总结日志', keepAlive: false, permission: ['dashboard'] }
							},
							{
								path: '/Summary/District',
								name: 'District',
								hidden: true,
								component: () => import('@/views/Summary/District'),
								meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
							}
						]
					},
					{
						path: '/Contract',
						name: 'Contract',
						component: () => import('@/views/Contract/Statistics/main'),
						// component: RouteView,
						meta: { title: '签约', keepAlive: true, permission: ['dashboard'] },
						children: [
							{
                                path: '/Contract/pull',
								name: 'Contractpull',
								hideChildrenInMenu: true,
								redirect: '/Contract/pull/Home',
								component: RouteView,
								meta: { title: '抽取', keepAlive: true, permission: ['dashboard'] },
								children: [
									{
										path: '/Contract/pull/Home',
										name: 'Pushlog',
										hidden: true,
										component: () => import('@/views/Contract/pull/Home'),
										meta: { title: '抽取日志', keepAlive: false, permission: ['dashboard'] }
									},
									{
										path: '/Contract/pull/District',
										name: 'District',
										hidden: true,
										component: () => import('@/views/Contract/pull/District'),
										meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
									}
								]
							},
							{
                                path: '/Contract/Statistics',
								name: 'ContractStatistics',
								hideChildrenInMenu: true,
								redirect: '/Contract/Statistics/Home',
								component: RouteView,
								meta: { title: '推送', keepAlive: false, permission: ['dashboard'] },
								children: [
									{
										path: '/Contract/Statistics/Home',
										name: 'ContractHome',
										hidden: true,
										component: () => import('@/views/Contract/Statistics/Home'),
										meta: { title: '推送日志', keepAlive: false, permission: ['dashboard'] }
									},
									{
										path: '/Contract/Statistics/District',
										name: 'ContractDistrict',
										hidden: true,
										component: () => import('@/views/Contract/Statistics/District'),
										meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
									}
								]
                            }
						]
					}
					// {
					// 	path: '/Referral',
                    //     name: 'Referral',
                    //     component: () => import('@/views/Referral/Statistics/main'),
					// 	meta: { title: '转诊', keepAlive: true, permission: ['dashboard'] },
					// 	children: [
					// 		{
					// 			path: '/Referral/pull',
					// 			name: 'Referralpull',
					// 			hideChildrenInMenu: true,
					// 			redirect: '/Referral/pull/Home',
					// 			component: RouteView,
					// 			meta: { title: '抽取', keepAlive: true, permission: ['dashboard'] },
					// 			children: [
					// 				{
					// 					path: '/Referral/pull/District',
					// 					name: 'ReferralDistrict',
					// 					hidden: true,
					// 					component: () => import('@/views/Referral/pull/District'),
					// 					meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
					// 				},
					// 				{
					// 					path: '/Referral/pull/Home',
					// 					name: 'ReferralHome',
					// 					hidden: true,
					// 					component: () => import('@/views/Referral/pull/Home'),
					// 					meta: { title: '抽取日志', keepAlive: false, permission: ['dashboard'] }
					// 				}
					// 			]
					// 		},
					// 		{
                    //             path: '/Referral/Statistics',
					// 			name: 'ReferralStatistics',
					// 			hideChildrenInMenu: true,
					// 			redirect: '/Referral/Statistics/Home',
					// 			component: RouteView,
					// 			meta: { title: '推送', keepAlive: false, permission: ['dashboard'] },
					// 			children: [
					// 				{
					// 					path: '/Referral/Statistics/District',
					// 					name: 'ReferralDistrict',
					// 					hidden: true,
					// 					component: () => import('@/views/Referral/Statistics/District'),
					// 					meta: { title: '区县机构', keepAlive: false, permission: ['dashboard'] }
					// 				},
					// 				{
					// 					path: '/Referral/Statistics/Home',
					// 					name: 'ReferralHome',
					// 					hidden: true,
					// 					component: () => import('@/views/Referral/Statistics/Home'),
					// 					meta: { title: '推送日志', keepAlive: false, permission: ['dashboard'] }
					// 				}
					// 			]
					// 		}
					// 	]
					// }
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
			},
			{
				path: '/datacount',
				name: 'datacount',
				component: RouteView,
				meta: { title: '数据统计', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] },
				children: [
					{
						path: '/datacount/sumup',
						name: 'sumup',
						component: () => import('@/views/statistics/sumup/destrict'),
						meta: { title: '总结', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
					},
					{
						path: '/datacount/sumup/:sid',
						name: 'sumup',
						hidden: true,
						component: () => import('@/views/statistics/sumup/mechanism'),
						meta: { title: '总结', keepAlive: false, icon: bxAnaalyse, permission: ['dashboard'] }
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
