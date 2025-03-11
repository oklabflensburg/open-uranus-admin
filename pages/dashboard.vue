<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div>
      <h1>Dashboard</h1>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import { useAuth } from '@/composables/useAuth'

useHead({
  title: 'Dashboard - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your events and venues from the dashboard.'
    }
  ]
})

const { logout } = useAuth()

const handleLogout = () => {
  logout()
  navigateTo('/signin')
}
</script>