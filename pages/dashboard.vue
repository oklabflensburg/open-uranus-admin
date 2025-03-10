<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div>
      <h1>Dashboard</h1>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

import { useAuth } from '@/composables/useAuth'
const { logout } = useAuth()

const handleLogout = () => {
  logout()
  navigateTo('/signin')
}
</script>