import { createStore } from 'vuex'
import { REST } from '../API'
import { auth } from './auth'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    theme: 'light',

    apps: [],
    instances: [],
    session: null,
    error: null,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    updateApps(state, apps) {
      state.apps = apps
    },
    updateInstances(state, instances) {
      state.instances = instances
    },

    setSession(state, data) {
      state.session = data
    },
    logout(state, data) {
      state.session = null
      state.error = true
    },
    setSessionError(state, data) {
      state.error = data
    },
  },
  actions: {
    /*
     * SESSION
     */
    async getSession(context) {
      try {
        let savedUser = context.state.auth.user
        const response = await REST.GET('session', { id: savedUser?.id })
        context.commit('setSession', response)
        let user = response.user
        if (!user) return window.router.push('login')
        context.commit('auth/loginSuccess', user)
      } catch (error) {
        window.apiErrors.value.push(error)
        throw error
      }
    },

    /*
     * APPS
     */
    async getApps(context) {
      try {
        const response = await REST.GET(`app/getAll`)
        context.commit('updateApps', response)
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async createApp(context, imageRepo) {
      try {
        const { appID } = await REST.POST(`app/create`, { imageRepo })
        console.log(appID)
        context.dispatch('getApps')
        window.showToast('Created')
        return appID
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async getRepos(context) {
      try {
        const { repos } = await REST.GET('app/availableRepos')
        return repos
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async deleteApp(context, id) {
      try {
        await REST.DELETE('app/' + id)
        context.dispatch('getApps')
        window.showToast('Deleted')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async saveApp(context, data) {
      try {
        console.log('saveApp', data)
        await REST.PUT('app/save', data)
        context.dispatch('getApps')
        window.showToast('Saved')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },

    /*
     *  INSTANCES
     */

    async getInstances(context) {
      try {
        const response = await REST.GET(`instance/getAll`)
        context.commit('updateInstances', response)
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesUpgrade(ctx, { ids, tag }) {
      //todo route
      try {
        console.log('upgrade', ids, tag)
        await REST.POST('instances/upgrade', { ids, tag })
        ctx.dispatch('getInstances')
        window.showToast('Upgraded')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesDelete(ctx, ids) {
      try {
        console.log('delete', ids)
        await REST.DELETE('instances', { ids })
        window.showToast('Deleted')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceSave(ctx, data) {
      try {
        console.log('save', data.id)
        await REST.POST('instance/save', data)
        ctx.dispatch('getInstances')
        window.showToast('Saved')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceStart(ctx, id) {
      try {
        console.log('start', id)
        await REST.POST('instance/start', { id })
        ctx.dispatch('getInstances')
        window.showToast('Started')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesStop(ctx, id) {
      try {
        console.log('stop', id)
        await REST.POST('instance/stop', { id })
        ctx.dispatch('getInstances')
        window.showToast('Stopped')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceCreate(ctx, instance) {
      try {
        console.log('create instance', instance)
        await REST.POST('instance/create', instance);
        ctx.dispatch('getInstances')
        window.showToast('Created')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
  },
  modules: {
    auth,
  },
})
