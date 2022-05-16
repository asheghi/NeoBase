export const routes = [
  {
    path: "/",
    component: () => import('./views/HomePage.vue'),
  },
  {
    path:'/login',
    component: () => import('./views/auth/LoginPage.vue')
  },
  {
    path: '/dash',
    component: () => import('./views/dash/DashboardPage.vue'),
    children: [
      {
        path: '',
        component:() => import('./views/dash/components/DashHomePage.vue')
      }
    ]
  }
]
