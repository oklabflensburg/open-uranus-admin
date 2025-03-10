<template>
  <nav class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
      <div class="flex justify-between h-16">
        <!-- Logo & Title -->
        <div class="flex items-center">
          <nuxt-link to="/" class="text-xl font-semibold">Uranus</nuxt-link>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center sm:hidden">
          <button @click="isOpen = !isOpen" class="focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden sm:flex items-center space-x-4">
          <nuxt-link to="/dashboard" class="px-3 py-2 rounded hover:bg-gray-700" v-if="isAuthenticated">Dashboard</nuxt-link>
          <nuxt-link to="/organizer" class="px-3 py-2 rounded hover:bg-gray-700" v-if="isAuthenticated">Veranstalter</nuxt-link>
          <nuxt-link to="/venue" class="px-3 py-2 rounded hover:bg-gray-700" v-if="isAuthenticated">Veranstaltungsort</nuxt-link>
          <nuxt-link to="/event" class="px-3 py-2 rounded hover:bg-gray-700" v-if="isAuthenticated">Veranstaltung</nuxt-link>
          <nuxt-link to="/signin" class="px-3 py-2 rounded hover:bg-gray-700" v-if="!isAuthenticated">Anmelden</nuxt-link>
          <button @click="handleLogout" class="px-3 py-2 rounded hover:bg-gray-700" v-if="isAuthenticated">Abmelden</button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isOpen" class="sm:hidden bg-gray-800">
      <nuxt-link to="/dashboard" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">Dashboard</nuxt-link>
      <nuxt-link to="/organizer" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">Veranstalter</nuxt-link>
      <nuxt-link to="/venue" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">Veranstaltungsort</nuxt-link>
      <nuxt-link to="/event" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">Veranstaltung</nuxt-link>
      <nuxt-link to="/signin" class="block px-4 py-2 hover:bg-gray-700" v-if="!isAuthenticated">Anmelden</nuxt-link>
      <button @click="handleLogout" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">Abmelden</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue"
import { useAuth } from '@/composables/useAuth'

const isOpen = ref(false)
const { accessToken, logout } = useAuth()
const isAuthenticated = computed(() => !!accessToken.value)

const handleLogout = () => {
  logout()
  navigateTo('/signin')
}
</script>
