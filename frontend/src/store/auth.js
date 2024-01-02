import { REST } from '../API'

const AuthService = {
  async login(user) {
    const response = await REST.POST('auth/signin', {
      username: user.username,
      password: user.password,
    })
    if (response.accessToken) {
      localStorage.setItem('user', JSON.stringify(response))
    }
    return response
  },

  logout() {
    localStorage.removeItem('user')
  },

  async register(user) {
    const { username, email, password } = user
    return await REST.POST('auth/signup', {
      username,
      email,
      password,
    })
  },
}

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null }

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async login({ commit }, user) {
      console.log('login', user)
      try {
        let resUser = await AuthService.login(user)
        commit('loginSuccess', resUser)
        console.log(resUser)
        return resUser
      } catch (error) {
        commit('loginFailure')
        window.apiErrors.value.push(error)
        throw error
      }
    },
    logout({ commit }) {
      console.log('logout')
      AuthService.logout()
      commit('logout')
    },
    async register({ commit }, user) {
      try {
        let response = await AuthService.register(user)
        commit('registerSuccess')
        window.showToast('Registred.')
        return response.data
      } catch (error) {
        commit('registerFailure')
        window.apiErrors.value.push(error)
        throw error
      }
    },
  },
  mutations: {
    loginSuccess(state, user) {
      console.log('sucess')
      state.status.loggedIn = true
      state.user = user
    },
    loginFailure(state) {
      console.log('fail')
      state.status.loggedIn = false
      state.user = null
    },
    logout(state) {
      state.status.loggedIn = false
      state.user = null
    },
    registerSuccess(state) {
      state.status.loggedIn = false
    },
    registerFailure(state) {
      state.status.loggedIn = false
    },
  },
}
