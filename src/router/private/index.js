export const privateRoutes = [
  {
    path: '/',
    name: 'app',
    component: () => import('~/layouts/AppLayout'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('~/pages/home/index'),
        meta: { title: 'Главная страница' },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('~/pages/profile/ProfileIndex'),
        meta: { title: 'Профиль' },
      },
      {
        path: '/colleagues',
        name: 'colleagues',
        component: () => import('~/pages/colleagues/ColleaguesIndex'),
        meta: { title: 'Все коллеги' },
      },
      {
        path: '/surveys',
        name: 'surveys',
        component: () => import('~/pages/surveys/SurveysIndex'),
        meta: { title: 'Опросники' },
      },
      {
        path: '/survey/:id',
        name: 'survey.detail',
        component: () => import('~/components/survey/SurveyDetail'),
        meta: { title: 'Список вопросов' },
        props: true,
      },
      {
        path: '/colleagues/:id',
        name: 'colleagues.detail',
        component: () => import('~/pages/colleagues/ColleaguesDetail'),
        meta: { title: 'Страница коллег' },
        props: true,
      },
      {
        path: '/not-found',
        name: 'object-not-found',
        component: () => import('~/pages/ObjectNotFound'),
      },
      {
        path: '/:pathMatch(.*)',
        name: 'not-found',
        component: () => import('~/pages/PageNotFound'),
      },
    ],
  },
];
