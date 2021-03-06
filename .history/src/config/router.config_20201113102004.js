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
                                name: 'District',
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
                    }
                ]
            },
                  // 系统
      {
        path: '/system/organization',
        name: 'system',
        component: RouteView,
        meta: { title: '系统管理', keepAlive: true, icon: icon.system, permission: ['system'] },
        children: [
          {
            path: '/system/role',
            name: 'role',
            component: () => import('@/views/system/role'),
            meta: { title: '角色管理', keepAlive: true, icon: icon.role, permission: ['role'] }
          },
          {
            path: '/system/user',
            name: 'user',
            component: () => import('@/views/system/user'),
            meta: { title: '用户管理', keepAlive: true, icon: icon.user, permission: ['user'] }
          },
          {
            path: '/system/info',
            name: 'info',
            component: () => import('@/views/system/info'),
            meta: { title: '个人信息', keepAlive: false, icon: icon.user, permission: ['info'] },
            redirect: '/system/info/modules/base',
            hideChildrenInMenu: true,
            hidden: true,
            children: [
                {
                  path: '/system/info/modules/base',
                  name: 'BaseSettings',
                  component: () => import('@/views/system/info/modules/base'),
                  meta: { title: '基本设置', hidden: true, permission: [ 'system' ] }
                },
                {
                  path: '/system/info/modules/security',
                  name: 'SecuritySettings',
                  component: () => import('@/views/system/info/modules/Security'),
                  meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'system' ] }
                }
            ]
          },
          // {
          //   path: '/system/Log',
          //   name: 'Log',
          //   component: () => import('@/views/system/Log'),
          //   meta: { title: '用户日志', keepAlive: true, icon: icon.Log, permission: ['log'] }
          // },
          {
            path: '/system/aboutus',
            name: 'aboutus',
            component: () => import('@/views/system/aboutus'),
            meta: { title: '部门管理', keepAlive: true, icon: icon.aboutus, permission: ['dashboard'] }
          },
          {
            path: '/system/task',
            name: 'task',
            component: () => import('@/views/system/task'),
            meta: { title: '任务管理', keepAlive: true, icon: icon.task, permission: ['task'] }
          }
          // {
          //   path: '/system/alarm',
          //   name: 'alarm',
          //   component: () => import('@/views/system/alarm'),
          //   meta: { title: '警报管理', keepAlive: true, icon: icon.alarm, permission: ['alert'] }
          // }
        //   {
        //     path: '/system/Authorization',
        //     name: 'Authorization',
        //     component: () => import('@/views/system/Authorization'),
        //     meta: { title: '授权与服务', keepAlive: true, icon: icon.Authorization, permission: ['dashboard'] }
        //   }
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
