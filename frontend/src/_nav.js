export default [
  // {
  //   component: 'CNavItem',
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: 'cil-speedometer',
  //   badge: {
  //     color: 'primary',
  //     text: 'NEW',
  //   },
  // },
  {
    component: 'CNavItem',
    name: 'Apps',
    to: '/apps',
    icon: 'cil-apps',
    role: "ADMIN"
  },
  {
    component: 'CNavItem',
    name: 'Instances',
    to: '/instances',
    icon: 'cil-bolt',
    role: "ADMIN"
  },
  {
    component: 'CNavTitle',
    name: 'Your account',
  },
  {
    component: 'CNavItem',
    name: 'My Instances',
    to: '/my-instances',
    icon: 'cil-bolt',
    // role: "ADMIN"
  },

  // {
  //   component: 'CNavTitle',
  //   name: 'Extras',
  // },

  // {
  //   component: 'CNavItem',
  //   name: 'Login',
  //   to: '/login',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Register',
  //   to: '/register',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Error 404',
  //   to: '/404',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Error 500',
  //   to: '/500',
  // },

]
