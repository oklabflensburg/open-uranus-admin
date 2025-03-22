<template>
  <div class="w-full space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">
        {{ $t('uranusAdminPanel') }}
      </h2>
    </div>

    <h2 class="text-2xl font-medium">{{ $t('register') }}</h2>

    <!-- Sign-Up Form -->
    <form @submit.prevent="handleSignUp" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm space-y-4">
        <div class="mt-4">
          <label for="username" class="sr-only">{{ $t('email') }}</label>
          <input v-model="signupData.username" id="username" name="username" type="email" required :class="{'border-red-500': errorMessage}" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :placeholder="$t('emailAddress')">
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 relative">
            <label for="password" class="sr-only">{{ $t('password') }}</label>
            <input v-model="signupData.password" :type="passwordVisible ? 'text' : 'password'" id="password" name="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :placeholder="$t('password')">
            <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">
              {{ passwordVisible ? $t('hide') : $t('show') }}
            </button>
          </div>
          <div class="col-span-6 relative">
            <label for="confirmPassword" class="sr-only">{{ $t('confirmPassword') }}</label>
            <input v-model="signupData.confirmPassword" :type="confirmPasswordVisible ? 'text' : 'password'" id="confirmPassword" name="confirmPassword" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :placeholder="$t('confirmPassword')">
            <button type="button" @click="toggleConfirmPasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">
              {{ confirmPasswordVisible ? $t('hide') : $t('show') }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>

      <div class="flex items-center justify-end">
        <button type="submit" class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {{ $t('register') }}
        </button>
      </div>

      <div class="text-right space-x-4">
        <nuxt-link :to="'/signin'" class="text-blue-500 hover:underline">{{ $t('alreadyHaveAccount') }}</nuxt-link>
        <nuxt-link :to="'/forgot'" class="text-blue-500 hover:underline">{{ $t('forgotPassword') }}</nuxt-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n' // Add this line

const { t: $t } = useI18n() // Add this line

const router = useRouter()
const { signup } = useAuth()

const signupData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')

const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
}

const handleSignUp = async () => {
  if (signupData.value.password !== signupData.value.confirmPassword) {
    errorMessage.value = $t('passwordsDoNotMatch')
    return
  }

  const postData = {
    username: signupData.value.username,
    password: signupData.value.password
  }

  try {
    const response = await signup(postData)

    if (response === true) {
      router.push('/signin')
    } else {
      errorMessage.value = response
    }
  } catch (error) {
    errorMessage.value = error
  }
}
</script>