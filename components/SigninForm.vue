<template>
  <div class="w-full space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-extrabold text-gray-900">
        {{ $t('uranusAdminPanel') }}
      </h1>
    </div>

    <h2 class="text-2xl font-medium" id="signinHeading">{{ $t('signIn') }}</h2>

    <!-- Sign-In Form -->
    <form @submit.prevent="handleSignIn" class="mt-8 space-y-6" aria-labelledby="signinHeading">
      <div class="rounded-md shadow-sm space-y-4">
        <div>
          <label for="emailAddress" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('email') }}</label>
          <input 
            v-model="signin.emailAddress" 
            id="emailAddress" 
            name="emailAddress" 
            type="email" 
            autocomplete="email"
            required 
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 sm:text-sm rounded" 
            :class="{'border-red-500': errorMessage}" 
            :placeholder="$t('emailAddress')"
            :aria-invalid="errorMessage ? 'true' : 'false'"
            aria-describedby="email-error"
          >
        </div>
        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ $t('password') }}</label>
          <div class="relative">
            <input 
              v-model="signin.password" 
              :type="passwordVisible ? 'text' : 'password'" 
              id="password" 
              name="password" 
              autocomplete="current-password"
              required 
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 sm:text-sm rounded" 
              :class="{'border-red-500': errorMessage}" 
              :placeholder="$t('password')"
              :aria-invalid="errorMessage ? 'true' : 'false'"
              aria-describedby="password-error"
            >
            <button 
              type="button" 
              @click="togglePasswordVisibility" 
              class="absolute inset-y-0 right-0 p-3 flex items-center text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :aria-label="passwordVisible ? $t('hidePassword') : $t('showPassword')"
              :aria-pressed="passwordVisible"
            >
              <svg v-if="passwordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm font-medium" role="alert" aria-live="assertive" id="email-error password-error">{{ errorMessage }}</div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input 
            v-model="signin.rememberMe" 
            id="remember_me" 
            name="remember_me" 
            type="checkbox" 
            autocomplete="off"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded focus:ring-2"
          >
          <label for="remember_me" class="ml-2 block text-sm text-gray-900">
            {{ $t('rememberMe') }}
          </label>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <button 
          type="submit" 
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Sign in to your account"
        >
          {{ $t('signIn') }}
        </button>
      </div>

      <div class="text-right space-x-4">
        <nuxt-link :to="'/signup'" class="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1">{{ $t('noAccount') }}</nuxt-link>
        <nuxt-link :to="'/forgot'" class="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1">{{ $t('forgotPassword') }}</nuxt-link>
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
