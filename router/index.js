import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { middleware: 'auth' }},
      { path: '/signin', name: 'Signin', component: () => import('@/views/Signin.vue')},
      { path: "dashboard", component: () => import('@/views/Dashboard.vue'), meta: { middleware: 'auth' }},
      { path: "organizer", component: () => import('@/views/Organizer.vue'), meta: { middleware: 'auth' }},
      { path: "venue", component: () => import('@/views/Venue.vue'), meta: { middleware: 'auth' }},
      { path: "event", component: () => import('@/views/Event.vue'), meta: { middleware: 'auth' }}
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { accessToken } = useAuth()

  if (to.matched.some(record => record.meta.middleware === 'auth') && !accessToken.value) {
    if (to.path !== '/signin') {
      return next('/signin')
    }
  }

  next()
})

export default router
