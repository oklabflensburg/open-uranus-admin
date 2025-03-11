import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: '/', name: 'Home', component: () => import('@/pages/index.vue'), meta: { middleware: 'auth' }},
      { path: '/signin', name: 'Signin', component: () => import('@/pages/signin.vue')},
      { path: '/signup', name: 'Signup', component: () => import('@/pages/signup.vue')},
      { path: '/dashboard', name: 'Dashboard', component: () => import('@/pages/dashboard.vue'), meta: { middleware: 'auth' }},
      { path: '/organizer', name: 'Organizer', component: () => import('@/pages/organizer.vue'), meta: { middleware: 'auth' }},
      { path: '/venue', name: 'Venue', component: () => import('@/pages/venue.vue'), meta: { middleware: 'auth' }},
      { path: '/event', name: 'Event', component: () => import('@/pages/event.vue'), meta: { middleware: 'auth' }}
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
