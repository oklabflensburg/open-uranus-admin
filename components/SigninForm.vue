<template>
  <div class="w-full space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">
        Uranus Admin Panel
      </h2>
    </div>

    <!-- Toggle between sign-up and sign-in -->
    <div class="text-center space-x-4">
      <nuxt-link :to="'/signup'" class="text-blue-500">Noch kein Nutzerkonto? Registrieren</nuxt-link>
    </div>

    <!-- Sign-In Form -->
    <form @submit.prevent="handleSignIn" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm space-y-4">
        <div>
          <label for="emailAddress" class="sr-only">Email</label>
          <input v-model="signin.emailAddress" id="emailAddress" name="emailAddress" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address">
        </div>
        <div class="mt-4">
          <label for="password" class="sr-only">Password</label>
          <input v-model="signin.password" id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password">
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input v-model="signin.rememberMe" id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label for="remember_me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <button type="submit" class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Anmelden
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, isAuthenticated } = useAuth() // Ensure isAuthenticated is imported

const signin = ref({
  emailAddress: '',
  password: '',
  rememberMe: false
})

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard') // Redirect if already logged in
  }
})

const handleSignIn = async () => {
  const success = await login(signin.value.emailAddress, signin.value.password, signin.value.rememberMe)
  if (success) {
    router.push('/dashboard') // Redirect after login
  } else {
    alert('Login failed! Check your credentials.')
  }
}
</script>
