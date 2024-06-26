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
    console.log('remove')
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
    async login({ commit, dispatch }, user) {
      try {
        let resUser = await AuthService.login(user)
        commit('loginSuccess', resUser)
        dispatch('getSession', null, { root: true })

        return resUser
      } catch (error) {
        commit('loginFailure')
        window.apiErrors.value.push(error)
        throw error
      }
    },
    logout({ commit }) {
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
    async forgottenPasswd(ctx, email) {
      let res = await REST.POST('auth/forgotten-passwd', {
        email,
      })
      window.showToast(res.message)
    },
    async createNewPass(ctx, { newPass, token }) {
      let res = await REST.POST('auth/create-passwd', {
        token,
        newPass,
      })
      console.log(res);
      window.showToast({
        content: "" + res.message,
        color: "primary"
      })
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true
      state.user = user
      // throw user;
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
