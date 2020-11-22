import storage from 'store'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          storage.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
            const result = res.data.role
            result.username = res.data.username
            result.avatar = '/avatar2.jpg'
            result.role = {}
            if (result.Id === 1) {
                result.role.permissionList = ['dashboard']
            } else {
                result.role.permissionList = ['dashboard', 'system']
            }
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.Name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            resolve(result)
        })
        })
    //   })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
      })
    }

  }
}

export default user
