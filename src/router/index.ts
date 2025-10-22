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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FormRender.vue'),
    },
  ],
})

export default router
