<template>
  <div class="w-full space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">
        Uranus Admin Panel
      </h2>
    </div>

    <!-- Toggle between sign-up and sign-in -->
    <div class="text-center space-x-4">
      <nuxt-link :to="'/signin'" class="text-blue-500">Bereits ein Konto? Anmelden</nuxt-link>
    </div>

    <!-- Sign-Up Form -->
    <form @submit.prevent="handleSignUp" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm space-y-4">
        <div class="mt-4">
          <label for="username" class="sr-only">Username</label>
          <input v-model="signupData.username" id="username" name="username" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username">
        </div>
        <div class="mt-4">
          <label for="emailAddress" class="sr-only">Email</label>
          <input v-model="signupData.emailAddress" id="emailAddress" name="emailAddress" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address">
        </div>
        <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="firstName" class="sr-only">First Name</label>
          <input v-model="signupData.firstName" id="firstName" name="firstName" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="First Name">
        </div>
        <div class="col-span-6">
          <label for="lastName" class="sr-only">Last Name</label>
          <input v-model="signupData.lastName" id="lastName" name="lastName" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Last Name">
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="password" class="sr-only">Password</label>
          <input v-model="signupData.password" id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password">
        </div>
        <div class="col-span-6">
          <label for="confirmPassword" class="sr-only">Confirm Password</label>
          <input v-model="signupData.confirmPassword" id="confirmPassword" name="confirmPassword" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Confirm Password">
        </div>
      </div>
      </div>

      <div class="flex items-center justify-end">
        <button type="submit" class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Registrieren
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signup } = useAuth()

const signupData = ref({
  firstName: '',
  lastName: '',
  username: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
  i18nLocaleId: 1
})

const handleSignUp = async () => {
  if (signupData.value.password !== signupData.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  const success = await signup(signupData.value)
  if (success) {
    router.push('/dashboard') // Redirect after signup
  } else {
    alert('Signup failed! Check your credentials.')
  }
}
</script>
