export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Theme',
  },
  {
    component: 'CNavItem',
    name: 'Apps',
    to: '/apps',
    icon: 'cil-apps',
  },
  {
    component: 'CNavItem',
    name: 'Instances',
    to: '/instances',
    icon: 'cil-bolt',
  },

  {
    component: 'CNavTitle',
    name: 'Extras',
  },

  {
    component: 'CNavItem',
    name: 'Login',
    to: '/login',
  },
  {
    component: 'CNavItem',
    name: 'Register',
    to: '/register',
  },
  {
    component: 'CNavItem',
    name: 'Error 404',
    to: '/404',
  },
  {
    component: 'CNavItem',
    name: 'Error 500',
    to: '/500',
  },

]
