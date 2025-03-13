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
          <nuxt-link :to="localePath('/dashboard')" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/dashboard') }" v-if="isAuthenticated">{{ $t('menu.dashboard') }}</nuxt-link>
          <nuxt-link :to="localePath('/organizer')" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/organizer') }" v-if="isAuthenticated">{{ $t('menu.organizer') }}</nuxt-link>
          <nuxt-link :to="localePath('/venue')" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/venue') }" v-if="isAuthenticated">{{ $t('menu.venue') }}</nuxt-link>
          <nuxt-link :to="localePath('/event')" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/event') }" v-if="isAuthenticated">{{ $t('menu.event') }}</nuxt-link>
          <div v-if="isAuthenticated" class="relative group">
            <button class="px-3 py-2 rounded hover:bg-gray-700 focus:outline-none">{{ $t('menu.typeSettings') }}</button>
            <div class="w-64 absolute hidden group-hover:block bg-gray-800 rounded shadow-lg">
              <nuxt-link :to="localePath('/venue/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.venueTypes') }}</nuxt-link>
              <nuxt-link :to="localePath('/space/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.spaceTypes') }}</nuxt-link>
              <nuxt-link :to="localePath('/event/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.eventTypes') }}</nuxt-link>
              <nuxt-link :to="localePath('/genre/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.genreTypes') }}</nuxt-link>
              <nuxt-link :to="localePath('/licence/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.licenceTypes') }}</nuxt-link>
              <nuxt-link :to="localePath('/image/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.imageTypes') }}</nuxt-link>
            </div>
          </div>
          <nuxt-link :to="localePath('/signin')" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/signin') }" v-if="!isAuthenticated">{{ $t('menu.signin') }}</nuxt-link>
          <div v-if="isAuthenticated" class="relative group">
            <button class="flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none">
              <img src="https://i.pravatar.cc/40" alt="Profile" class="w-8 h-8 rounded-full mr-2">
              <span class="fi fis fi-de w-8 h-8 rounded-full mr-2"></span>
              <span>{{ $t('menu.profile') }}</span>
            </button>
            <div class="w-full absolute hidden group-hover:block bg-gray-800 rounded shadow-lg">
              <nuxt-link :to="localePath('/settings')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.settings') }}</nuxt-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-700">{{ $t('menu.logout') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isOpen" class="sm:hidden bg-gray-800">
      <nuxt-link :to="localePath('/dashboard')" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/dashboard') }" v-if="isAuthenticated">{{ $t('menu.dashboard') }}</nuxt-link>
      <nuxt-link :to="localePath('/organizer')" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/organizer') }" v-if="isAuthenticated">{{ $t('menu.organizer') }}</nuxt-link>
      <nuxt-link :to="localePath('/venue')" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/venue') }" v-if="isAuthenticated">{{ $t('menu.venue') }}</nuxt-link>
      <nuxt-link :to="localePath('/event')" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/event') }" v-if="isAuthenticated">{{ $t('menu.event') }}</nuxt-link>
      <div v-if="isAuthenticated" class="relative group">
        <button class="block px-4 py-2 hover:bg-gray-700 focus:outline-none">{{ $t('menu.typeSettings') }}</button>
        <div class="bg-gray-800 rounded shadow-lg">
          <nuxt-link :to="localePath('/venue/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.venueTypes') }}</nuxt-link>
          <nuxt-link :to="localePath('/space/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.spaceTypes') }}</nuxt-link>
          <nuxt-link :to="localePath('/event/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.eventTypes') }}</nuxt-link>
          <nuxt-link :to="localePath('/genre/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.genreTypes') }}</nuxt-link>
          <nuxt-link :to="localePath('/licence/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.licenceTypes') }}</nuxt-link>
          <nuxt-link :to="localePath('/image/types')" class="block px-4 py-2 hover:bg-gray-700">{{ $t('menu.imageTypes') }}</nuxt-link>
        </div>
      </div>
      <nuxt-link :to="localePath('/signin')" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/signin') }" v-if="!isAuthenticated">{{ $t('menu.signin') }}</nuxt-link>
      <button @click="handleLogout" class="block px-4 py-2 hover:bg-gray-700" v-if="isAuthenticated">{{ $t('menu.logout') }}</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useAuth } from '@/composables/useAuth'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#app'

const isOpen = ref(false)
const { logout, isAuthenticated } = useAuth()
const route = useRoute()
import { useLocalePath } from '#i18n'

const { t, locale } = useI18n();
const localePath = useLocalePath() // ✅ Correctly define localePath
const isActive = (path) => {
  return route.path === localePath(path) // Handle localized routes
}

const handleLogout = () => {
  logout()
  navigateTo(localePath('/signin')) // Ensure locale-aware navigation
}

watch(locale, (newLocale) => {
  // This will trigger reactivity when locale changes
  console.log('Locale changed to:', newLocale);
});

onMounted(() => {
  console.log('NavBar mounted')
});
</script>
