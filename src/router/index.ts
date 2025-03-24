import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SaveUrl',
      component: () => import('../views/SaveUrlView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { subtitle: 'subtitle.login' }
    },
    {
      path: '/urls',
      name: 'ListUrl',
      component: () => import('../views/ListUrlView.vue'),
      meta: { subtitle: 'subtitle.listUrl' }
    },
    {
      path: '/jump',
      name: 'ManualClickUrl',
      component: () => import('../views/ManualClickUrlView.vue'),
      meta: { subtitle: 'subtitle.manual' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: { subtitle: 'subtitle.notfound' }
    },
  ],
})

export default router
