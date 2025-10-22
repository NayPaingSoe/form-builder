import { createRouter, createWebHistory } from 'vue-router'
import FormBuilder from '../views/FormBuilder.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FormBuilder,
    },
    {
      path: '/renderer',
      name: 'renderer',
      component: () => import('../views/FormRender.vue'),
    },
  ],
})

export default router
