import { createStore } from 'vuex'
import { REST } from '../API'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    theme: 'light',

    apps: [],
    instances: []
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
      state.apps = apps;
    },
    updateInstances(state, instances) {
      state.instances = instances;
    },
  },
  actions: {
    async getApps(context) {
      try {
        const response = appsData; //await REST.GET(`apps`);
        context.commit('updateApps', response);
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },
    async getInstances(context) {
      try {
        const response = instances; //await REST.GET(`instances`);
        context.commit('updateInstances', response);
      } catch (error) {
        window.apiErrors.value.push(error)
      }
    },

  },
  modules: {},
})



let appsData = [
  {
    id: "123432341ščř",
    name: "Moje prvni pojmenovaní",
    repository: 'biobrejn-1',
    tag: 'latest',
    image_id: '08af2227f359',
    created: '7 weeks ago',
    size: '340 MB',
  },
  {
    id: "123432čř",
    name: "Moje druhe pojmenovaní",
    repository: 'biobrejn-1',
    tag: 'latest',
    image_id: '08af2227f359',
    created: '7 weeks ago',
    size: '340 MB',
  },
]

let instances = [
  {
    id: "62234444", 
    app_id: "123432341ščř",
    container_id: "2cea44557ddfg",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    expiry_date: "20.2.2023",
    name: "deh-martin.air345",
    client: "pepa.novak@seznam.cz",
  },
  {
    id: "12234445",
    app_id: "123432341ščř",
    client: "pepa.novak@seznam.cz",
    expiry_date: "20.2.2023",
    container_id: "2cea44557dcb",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    name: "deh-martin.air345"
  },
  {
    id: "12234445",
    app_id: "123432čř",
    client: "pepa.novak@seznam.cz",
    expiry_date: "20.2.2023",
    container_id: "2cea44557dcb",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    name: "deh-martin.air345"
  },
  {
    id: "12234445",
    app_id: "123432čř",
    container_id: "2cea44557dcb",
    client: "pepa.novak@seznam.cz",
    expiry_date: "20.2.2023",
    tag: "latest",
    image_id: "23452345",
    status: "Up 3 days",
    name: "deh-martin.air345"
  },
]
