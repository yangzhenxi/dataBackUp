import storage from 'store'
import { login, logout } from '@/api/login'
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
          const result = response.result
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
// 获取用户信息
    return new Promise((resolve, reject) => {
        const result = {
          'id': '4291d7da9005377ec9aec4a71ea837f',
          'name': '天野远子',
          'username': 'admin',
          'password': '',
          'avatar': '/avatar2.jpg',
          'status': 1,
          'telephone': '',
          'lastLoginIp': '27.154.74.117',
          'lastLoginTime': 1534837621348,
          'creatorId': 'admin',
          'createTime': 1497160610259,
          'merchantCode': 'TLif2btpzg079h15bk',
          'deleted': 0,
          'roleId': 'admin',
          'role': {
              permissionList: ['dashboard']
          }
      }
      commit('SET_ROLES', result.role)
      commit('SET_INFO', result)
      commit('SET_NAME', { name: result.name, welcome: welcome() })
      commit('SET_AVATAR', result.avatar)
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
