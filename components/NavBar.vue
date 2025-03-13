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
          <nuxt-link to="/dashboard" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/dashboard') }" v-if="isAuthenticated">{{ $t('menu.dashboard') }}</nuxt-link>
          <nuxt-link to="/organizer" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/organizer') }" v-if="isAuthenticated">{{ $t('menu.organizer') }}</nuxt-link>
          <nuxt-link to="/venue" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/venue') }" v-if="isAuthenticated">{{ $t('menu.venue') }}</nuxt-link>
          <nuxt-link to="/event" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/event') }" v-if="isAuthenticated">{{ $t('menu.event') }}</nuxt-link>
          <div v-if="isAuthenticated" class="relative group">
            <button class="px-3 py-2 rounded hover:bg-gray-700 focus:outline-none">{{ $t('menu.typeSettings') }}</button>
            <div class="w-64 absolute hidden group-hover:block bg-gray-800 rounded shadow-lg">
              <nuxt-link to="/venue/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.venueTypes') }}</nuxt-link>
              <nuxt-link to="/space/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.spaceTypes') }}</nuxt-link>
              <nuxt-link to="/event/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.eventTypes') }}</nuxt-link>
              <nuxt-link to="/genre/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.genreTypes') }}</nuxt-link>
              <nuxt-link to="/licence/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.licenceTypes') }}</nuxt-link>
              <nuxt-link to="/image/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.imageTypes') }}</nuxt-link>
            </div>
          </div>
          <nuxt-link to="/signin" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/signin') }" v-if="!isAuthenticated">{{ $t('menu.signin') }}</nuxt-link>
          <div v-if="isAuthenticated" class="relative group">
            <button class="flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none">
              <img src="https://i.pravatar.cc/40" alt="Profile" class="w-8 h-8 rounded-full mr-2">
              <span class="fi fis fi-de w-8 h-8 rounded-full mr-2"></span>
              <span>{{ $t('menu.profile') }}</span>
            </button>
            <div class="w-full absolute hidden group-hover:block bg-gray-800 rounded shadow-lg">
              <nuxt-link to="/settings" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.settings') }}</nuxt-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-700">{{ $t('menu.logout') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isOpen" class="sm:hidden bg-gray-800">
      <nuxt-link to="/dashboard" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/dashboard') }" v-if="isAuthenticated">{{ $t('menu.dashboard') }}</nuxt-link>
      <nuxt-link to="/organizer" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/organizer') }" v-if="isAuthenticated">{{ $t('menu.organizer') }}</nuxt-link>
      <nuxt-link to="/venue" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/venue') }" v-if="isAuthenticated">{{ $t('menu.venue') }}</nuxt-link>
      <nuxt-link to="/event" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/event') }" v-if="isAuthenticated">{{ $t('menu.event') }}</nuxt-link>
      <div v-if="isAuthenticated" class="relative group">
        <button class="block px-4 py-2 hover:bg-gray-700 focus:outline-none">{{ $t('menu.typeSettings') }}</button>
        <div class="bg-gray-800 rounded shadow-lg">
          <nuxt-link to="/venue/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.venueTypes') }}</nuxt-link>
          <nuxt-link to="/space/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.spaceTypes') }}</nuxt-link>
          <nuxt-link to="/event/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.eventTypes') }}</nuxt-link>
          <nuxt-link to="/genre/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.genreTypes') }}</nuxt-link>
          <nuxt-link to="/licence/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.licenceTypes') }}</nuxt-link>
          <nuxt-link to="/image/types" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.imageTypes') }}</nuxt-link>
        </div>
      </div>
      <nuxt-link to="/signin" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/signin') }" v-if="!isAuthenticated">{{ $t('menu.signin') }}</nuxt-link>
      <button @click="handleLogout" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">{{ $t('menu.logout') }}</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuth } from '@/composables/useAuth'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const { logout, isAuthenticated } = useAuth()
const route = useRoute()

const isActive = (path) => {
  return route.path === path
}

const handleLogout = () => {
  logout()
  navigateTo('/signin')
}

onMounted(() => {
  console.log('NavBar mounted')
});
</script>
