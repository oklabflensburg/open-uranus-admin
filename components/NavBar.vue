<template>
  <nav class="bg-gray-900 text-white" role="navigation" aria-label="Main Navigation">
    <div class="max-w-7xl mx-auto sm:px-4 sm:px-6 lg:px-4">
      <div class="flex justify-between px-4 sm:px-0 h-16 items-center">
        <!-- Logo & Title -->
        <div class="flex items-center">
          <nuxt-link :to="localePath('/')" class="text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white" aria-label="Home">{{ $t('menu.appName') }}</nuxt-link>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center sm:hidden">
          <button 
            @click="toggleMobileMenu" 
            class="focus:outline-none focus:ring-2 focus:ring-white p-2"
            :aria-expanded="isOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden sm:flex items-center space-x-4 z-50" role="menubar">
          <nuxt-link :to="localePath('/dashboard')" @click="isOpen = false" class="px-3 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white" :class="{ 'bg-gray-700': isActive('/dashboard') }" :aria-current="isActive('/dashboard') ? 'page' : null" role="menuitem" v-if="isAuthenticated">{{ $t('menu.dashboard') }}</nuxt-link>
          <nuxt-link :to="localePath('/signin')" @click="isOpen = false" class="px-3 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white" :class="{ 'bg-gray-700': isActive('/signin') }" :aria-current="isActive('/signin') ? 'page' : null" role="menuitem" v-if="!isAuthenticated">{{ $t('menu.signin') }}</nuxt-link>

          <div v-if="isAuthenticated" class="relative" role="menuitem">
            <button 
              @click="toggleInfoMenu" 
              @keydown.escape="infoMenuOpen = false"
              class="flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              :aria-expanded="infoMenuOpen"
              aria-haspopup="true"
              aria-controls="info-menu"
            >
              <span>{{ $t('menu.structure') }}</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              id="info-menu"
              class="w-auto absolute bg-gray-800 rounded shadow-lg" 
              :class="{ 'hidden': !infoMenuOpen }"
              role="menu"
              @keydown.escape="infoMenuOpen = false"
            >
            <nuxt-link :to="localePath('/admin/organization')" class="block w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" :class="{ 'bg-gray-700': isActive('/admin/organization') }" :aria-current="isActive('/admin/organization') ? 'page' : null" @click="closeAllMenus" role="menuitem">{{ $t('menu.organizations') }}</nuxt-link>
            <nuxt-link :to="localePath('/admin/organization/roles')" class="block w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" :class="{ 'bg-gray-700': isActive('/admin/organization/roles') }" :aria-current="isActive('/admin/organization') ? 'page' : null" @click="closeAllMenus" role="menuitem">Organisationsbenutzerrollen</nuxt-link>
          </div>
          </div>

          <div v-if="isAuthenticated" class="relative" role="menuitem">
            <button 
              @click="toggleProfileMenu" 
              @keydown.escape="profileMenuOpen = false"
              class="flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              :aria-expanded="profileMenuOpen"
              aria-haspopup="true"
              aria-controls="profile-menu"
            >

              <span>{{ $t('menu.settings') }}</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div 
              id="profile-menu"
              class="w-auto absolute right-0 bg-gray-800 rounded shadow-lg" 
              :class="{ 'hidden': !profileMenuOpen }"
              role="menu"
              @keydown.escape="profileMenuOpen = false"
            >
              <nuxt-link :to="localePath('/profile')" class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" :class="{ 'bg-gray-700': isActive('/profile') }" :aria-current="isActive('/profile') ? 'page' : null" @click="closeAllMenus" role="menuitem">
                <div class="w-6 h-6 flex items-center rounded-full justify-center bg-gray-200 text-gray-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>{{ $t('menu.myProfile') }}</span>
              </nuxt-link>
              <nuxt-link :to="localePath('/locale')" class="block w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" :class="{ 'bg-gray-700': isActive('/locale') }" :aria-current="isActive('/locale') ? 'page' : null" @click="closeAllMenus" role="menuitem">{{ $t('menu.locale') }}</nuxt-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-700" role="menuitem">
                {{ $t('menu.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile List Menu -->
      <div 
        v-show="isOpen" 
        id="mobile-menu"
        class="sm:hidden transition-all duration-300 ease-in-out"
        role="menu"
      >
        <ul class="flex flex-col space-y-1 py-1">
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/profile')" @click="isOpen = false" class="flex items-center px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" :class="{ 'bg-gray-700': isActive('/profile') }" :aria-current="isActive('/profile') ? 'page' : null" role="menuitem">
              <div class="w-6 h-6 flex items-center rounded-full justify-center bg-gray-200 text-gray-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>{{ $t('menu.myProfile') }}</span>
            </nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/admin/organization')" @click="isOpen = false" class="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" :class="{ 'bg-gray-700': isActive('/admin/organization') }" :aria-current="isActive('/admin/organization') ? 'page' : null" role="menuitem">{{ $t('menu.organizations') }}</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/admin/organization/roles')" @click="isOpen = false" class="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" :class="{ 'bg-gray-700': isActive('/admin/organization/roles') }" :aria-current="isActive('/admin/organization/roles') ? 'page' : null" role="menuitem">Organisationsbenutzerrollen</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/dashboard')" @click="isOpen = false" class="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" :class="{ 'bg-gray-700': isActive('/dashboard') }" :aria-current="isActive('/dashboard') ? 'page' : null" role="menuitem">{{ $t('menu.dashboard') }}</nuxt-link>
          </li>
          <li v-if="!isAuthenticated">
            <nuxt-link :to="localePath('/signin')" @click="isOpen = false" class="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" :class="{ 'bg-gray-700': isActive('/signin') }" :aria-current="isActive('/signin') ? 'page' : null" role="menuitem">{{ $t('menu.signin') }}</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/locale')" class="block px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" :class="{ 'bg-gray-700': isActive('/locale') }" :aria-current="isActive('/locale') ? 'page' : null" @click="isOpen = false" role="menuitem">{{ $t('menu.locale') }}</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-600" role="menuitem">
              {{ $t('menu.logout') }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useAuth } from '@/composables/useAuth'
import { useRoute } from 'vue-router'
import { navigateTo } from '#app'
import { useLocalePath } from '#i18n'

const { logout, isAuthenticated } = useAuth()
const route = useRoute()
const isOpen = ref(false)
const infoMenuOpen = ref(false)
const profileMenuOpen = ref(false)

const localePath = useLocalePath()
const isActive = (path) => {
  return route.path === localePath(path)
}

const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value
  // Close other menus when mobile menu is toggled
  infoMenuOpen.value = false
  profileMenuOpen.value = false
}

const toggleInfoMenu = () => {
  infoMenuOpen.value = !infoMenuOpen.value
  // Close other menus
  profileMenuOpen.value = false
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
  // Close other menus
  infoMenuOpen.value = false
}

const closeAllMenus = () => {
  isOpen.value = false
  infoMenuOpen.value = false
  profileMenuOpen.value = false
}

const handleLogout = () => {
  logout()
  closeAllMenus()
  navigateTo(localePath('/signin'))
}

// Handle outside clicks to close menus
const handleOutsideClick = (event) => {
  const isOutsideInfoMenu = !event.target.closest('#info-menu') && !event.target.closest('button[aria-controls="info-menu"]')
  const isOutsideProfileMenu = !event.target.closest('#profile-menu') && !event.target.closest('button[aria-controls="profile-menu"]')
  
  if (infoMenuOpen.value && isOutsideInfoMenu) {
    infoMenuOpen.value = false
  }
  
  if (profileMenuOpen.value && isOutsideProfileMenu) {
    profileMenuOpen.value = false
  }
}

// Handle escape key press
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeAllMenus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>
