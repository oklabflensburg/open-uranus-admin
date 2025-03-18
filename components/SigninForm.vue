<template>
  <div class="w-full space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">
        {{ $t('uranusAdminPanel') }}
      </h2>
    </div>

    <h2 class="text-2xl font-medium">{{ $t('signIn') }}</h2>

    <!-- Sign-In Form -->
    <form @submit.prevent="handleSignIn" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm space-y-4">
        <div>
          <label for="emailAddress" class="sr-only">{{ $t('email') }}</label>
          <input v-model="signin.emailAddress" id="emailAddress" name="emailAddress" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :class="{'border-red-500': errorMessage}" :placeholder="$t('emailAddress')">
        </div>
        <div class="mt-4 relative">
          <label for="password" class="sr-only">{{ $t('password') }}</label>
          <input v-model="signin.password" :type="passwordVisible ? 'text' : 'password'" id="password" name="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :class="{'border-red-500': errorMessage}" :placeholder="$t('password')">
          <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">
            {{ passwordVisible ? $t('hide') : $t('show') }}
          </button>
        </div>
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input v-model="signin.rememberMe" id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label for="remember_me" class="ml-2 block text-sm text-gray-900">
            {{ $t('rememberMe') }}
          </label>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <button type="submit" class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {{ $t('signIn') }}
        </button>
      </div>
  <!-- Toggle between sign-up and sign-in -->
  <div class="text-right space-x-4">
      <nuxt-link :to="'/signup'" class="text-blue-500">{{ $t('noAccount') }}</nuxt-link>
    </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, isAuthenticated } = useAuth()
const errorMessage = ref('')

const signin = ref({
  emailAddress: '',
  password: '',
  rememberMe: false
})

const passwordVisible = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})

const handleSignIn = async () => {
  try {
    const response = await login(signin.value.emailAddress, signin.value.password, signin.value.rememberMe)

    if (response === true) {
      router.push('/dashboard')
    } else {
      errorMessage.value = response
    }
  } catch (error) {
    errorMessage.value = error
  }
}
</script>
