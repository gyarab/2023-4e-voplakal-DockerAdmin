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
        console.log(savedUser)
        const response = await REST.GET('session', { userID: savedUser?.id })
        context.commit('setSession', response)
        console.log(response)
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
        await new Promise((resolve) => setTimeout(resolve, 700))
        const response = await REST.GET(`app/getAll`);
        context.commit('updateApps', response)
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async createApp(context, imageRepo) {
      try {
        let appID = '123432341ščř' //from api call (imageRepo: "Biobrein") /await REST.POST(`app/create`);
        await console.log('create app', imageRepo)
        context.dispatch('getApps')
        window.showToast('Created')
        return appID
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async deleteApp(context, id) {
      try {
        await console.log('appDelete', id)
        context.dispatch('getApps')
        window.showToast('Deleted')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async saveApp(context, data) {
      try {
        await console.log('saveApp', data)
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
        await new Promise((resolve) => setTimeout(resolve, 700))
        const response = instances //await REST.GET(`instances`);
        context.commit('updateInstances', response)
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesUpgrade(ctx, { ids, tag }) {
      try {
        console.log('upgrade', ids, tag)
        ctx.dispatch('getInstances')
        window.showToast('Upgraded')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesDelete(ctx, ids) {
      try {
        console.log('delete', ids)
        ctx.dispatch('getInstances')
        window.showToast('Deleted')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceSave(ctx, data) {
      try {
        console.log('save', data.id)
        console.log(data)
        ctx.dispatch('getInstances')
        window.showToast('Saved')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceStart(ctx, id) {
      try {
        console.log('start', id)
        ctx.dispatch('getInstances')
        window.showToast('Started')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instancesStop(ctx, id) {
      try {
        console.log('stop', id)
        ctx.dispatch('getInstances')
        window.showToast('Stopped')
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async instanceCreate(ctx, instance) {
      try {
        console.log('create instance', instance)
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

let instances = [
  {
    id: '62234444',
    app_id: '123432341ščř',
    status: 'Up 3 days',
    image_id: '23452345',
    expiry_date: '2023-11-22',
    created_on: '2023-01-16',
    name: 'deh-martin.air345',
    client: 'pepa.novak@seznam.cz',
    limits: {
      cpu: 60,
      ram: 2000,
      swap: 444,
      disk: 46666,
    },
  },
  {
    id: '12234445',
    app_id: '123432341ščř',
    client: 'pepa.novak@seznam.cz',
    expiry_date: '2023-11-22',
    created_on: '2023-01-16',
    container_id: '2cea44557dcb',
    tag: 'latest',
    image_id: '23452345',
    status: 'Up 3 days',
    name: 'deh-martin.air345',
  },
  {
    id: '12234445',
    app_id: '123432čř',
    client: 'pepa.novak@seznam.cz',
    created_on: '2023-01-16',
    expiry_date: '2023-11-22',
    container_id: '2cea44557dcb',
    tag: 'latest',
    image_id: '23452345',
    status: 'Up 3 days',
    name: 'deh-martin.air345',
  },
  {
    id: '12234445',
    app_id: '123432čř',
    container_id: '2cea44557dcb',
    client: 'pepa.novak@seznam.cz',
    expiry_date: '2023-11-22',
    tag: 'latest',
    image_id: '23452345',
    created_on: '2023-01-16',
    status: 'Up 3 days',
    name: 'deh-martin.air345',
  },
]
