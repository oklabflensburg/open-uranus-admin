<template>
  <div class="w-full space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900">
        {{ $t('uranusAdminPanel') }}
      </h2>
    </div>

    <h2 class="text-2xl font-medium">{{ $t('forgotPassword') }}</h2>

    <!-- Forgot Password Form -->
    <form @submit.prevent="handleForgotPasswordForm" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm space-y-4">
        <div>
          <label for="emailAddress" class="sr-only">{{ $t('email') }}</label>
          <input 
            v-model="emailAddress" 
            id="emailAddress" 
            name="emailAddress" 
            type="email" 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            :class="{'border-red-500': errorMessage}" 
            :placeholder="$t('emailAddress')"
          >
        </div>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500 text-sm">{{ successMessage }}</p>

      <div class="flex items-center justify-end">
        <button 
          type="submit" 
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ $t('resetPassword') }}
        </button>
      </div>

      <!-- Link to Sign-In -->
      <div class="text-right space-x-4">
        <nuxt-link :to="'/signin'" class="text-blue-500">{{ $t('backToSignIn') }}</nuxt-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'

const { t } = useI18n()
const { handleForgotPassword } = useAuth()

const emailAddress = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleForgotPasswordForm = async () => {
  if (!emailAddress.value) {
    errorMessage.value = t('emailAddress') + ' ' + t('isRequired')
    successMessage.value = ''
    return
  }

  if (!validateEmail(emailAddress.value)) {
    errorMessage.value = t('emailAddress') + ' ' + t('isInvalid')
    successMessage.value = ''
    return
  }

  try {
    const response = await handleForgotPassword(emailAddress.value)
    errorMessage.value = response
  } catch (error) {
    errorMessage.value = error
  }
}
</script>
