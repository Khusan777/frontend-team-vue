export const publicRoutes = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('~/layouts/AuthLayout'),
    children: [
      {
        path: '',
        name: 'auth.login',
        component: () => import('~/pages/auth/AuthPage'),
        meta: { public: true, title: 'Авторизация' },
      },
    ],
  },
  {
    path: '/not-found',
    name: 'object-not-found',
    component: () => import('~/pages/ObjectNotFound'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('~/pages/PageNotFound'),
  },
];
