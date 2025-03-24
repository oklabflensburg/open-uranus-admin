<template>
  <nav class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto sm:px-4 sm:px-6 lg:px-4">
      <div class="flex justify-between px-4 sm:px-0 h-16 items-center">
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
          <nuxt-link :to="localePath('/dashboard')" @click="isOpen = false" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/dashboard') }" v-if="isAuthenticated">{{ $t('menu.dashboard') }}</nuxt-link>
          <nuxt-link :to="localePath('/signin')" @click="isOpen = false" class="px-3 py-2 rounded hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/signin') }" v-if="!isAuthenticated">{{ $t('menu.signin') }}</nuxt-link>

          <div v-if="isAuthenticated" class="relative group">
            <button class="flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none">
              <span>Info</span>
            </button>
            <div class="w-48 absolute hidden group-hover:block bg-gray-800 rounded shadow-lg">
              <nuxt-link :to="localePath('/admin/organization')" class="block w-full text-left px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/settings') }"@click="isOpen = false">Organtionen</nuxt-link>
            </div>
          </div>

          <div v-if="isAuthenticated" class="relative group">
            <button class="flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none">
              <img src="https://i.pravatar.cc/40" alt="Profile" class="w-8 h-8 rounded-full mr-2">
              <span class="fi fis fi-de w-8 h-8 rounded-full mr-2"></span>
              <nuxt-link :to="localePath('/profile')">{{ $t('menu.profile') }}</nuxt-link>
            </button>
            <div class="w-full absolute hidden group-hover:block bg-gray-800 rounded shadow-lg" style="z-index:999;">
              <nuxt-link :to="localePath('/settings')" class="block w-full text-left px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/settings') }"@click="isOpen = false">{{ $t('menu.settings') }}</nuxt-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-700">
                {{ $t('menu.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile List Menu -->
      <div v-show="isOpen" class="sm:hidden transition-all duration-300 ease-in-out">
        <ul class="flex flex-col space-y-1 py-1">
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/dashboard')" @click="isOpen = false" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/dashboard') }">{{ $t('menu.dashboard') }}</nuxt-link>
          </li>
          <li v-if="!isAuthenticated">
            <nuxt-link :to="localePath('/signin')" @click="isOpen = false" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/signin') }">{{ $t('menu.signin') }}</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <nuxt-link :to="localePath('/settings')" class="block px-4 py-2 hover:bg-gray-700" :class="{ 'bg-gray-700': isActive('/settings') }"@click="isOpen = false">{{ $t('menu.settings') }}</nuxt-link>
          </li>
          <li v-if="isAuthenticated">
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-700">
              {{ $t('menu.logout') }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue"
import { useAuth } from '@/composables/useAuth'
import { useRoute } from 'vue-router'
import { navigateTo } from '#app'
import { useLocalePath } from '#i18n'

const { logout, isAuthenticated } = useAuth()
const route = useRoute()
const isOpen = ref(false)

const localePath = useLocalePath()
const isActive = (path) => {
  return route.path === localePath(path)
}

const handleLogout = () => {
  logout()
  isOpen.value = false
  navigateTo(localePath('/signin'))
}
</script>
