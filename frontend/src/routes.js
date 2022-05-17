export const routes = [
  {
    path: "/",
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path:'/login',
    component: () => import('./pages/auth/LoginPage.vue')
  },
  {
    path:'/register',
    component: () => import('./pages/auth/RegisterPage.vue')
  },
  {
    path: '/dash',
    component: () => import('./pages/dash/DashboardPage.vue'),
    children: [
      {
        path: '',
        component:() => import('./pages/dash/views/ManageProjects.vue')
      },
      {
        name:"manage-collections",
        path:':project',
        component: () => import('./pages/dash/views/FireStore.vue'),
        children:[
          {
            name:"documents",
            path:':collection',
            component: () => import('./pages/dash/views/Documents.vue'),
            children:[
              {
                name:"documents",
                path:':_id',
                component: () => import('./pages/dash/views/ViewEditDocument.vue')
              },
            ]
          },

        ]
      },

    ]
  }
]
