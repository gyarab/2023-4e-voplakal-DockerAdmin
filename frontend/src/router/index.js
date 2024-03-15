import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import _nav from '../_nav'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'),
      },
      {
        path: 'app-edit/:id',
        props: true,
        name: 'AppEdit',
        component: () => import('@/views/apps/AppEdit.vue'),
      },
      {
        path: 'apps',
        name: 'Apps',
        component: () => import('@/views/apps/Apps.vue'),
      },
      {
        path: 'instances',
        name: 'Instances',
        component: () => import('@/views/instances/Instances.vue'),
      },
      {
        path: 'my-instances',
        name: 'MyInstances',
        component: () => import('@/views/instances/MyInstances.vue'),
      },
      {
        path: 'instance-edit/:id',
        props: true,
        name: 'Edit Instance',
        component: () => import('@/views/instances/InstanceEdit.vue'),
      },
      {
        path: 'instance-create/:appId',
        props: true,
        name: 'Create Instance',
        component: () => import('@/views/instances/InstanceCreate.vue'),
      },
    ],
  },
  {
    path: '/',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login/:token?',
        props: true,
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
      {
        path: 'public/instance-create/:appId',
        props: true,
        name: 'Public Create Instance',
        component: () => import('@/views/instances/InstanceCreate.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

const publicPages = ['/login', '/404', '/500', '/register', '/public/instance-create']

router.beforeEach((to, from, next) => {
  const authRequired = !publicPages.some((e) => to.path.startsWith(e))
  const auth = !!localStorage.getItem('user')

  if (authRequired && !auth) {
    console.log('Auth error and redirect')
    next({ name: 'Login' })
  } else {
    next()
  }
})

router.handleUnauthorized = function () {
  if (publicPages.some((e) => router.currentRoute.value.path.startsWith(e) || window.location.hash.startsWith(`#${e}`))) return
  else router.push('/login')
}

export default router
