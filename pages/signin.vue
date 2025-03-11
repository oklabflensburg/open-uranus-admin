<template>
  <div class="max-w-screen-sm mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <SigninForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import SigninForm from '~/components/SigninForm.vue'

useHead({
  title: 'Sign In - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Sign in to access your Uranus account.'
    }
  ]
})
</script>