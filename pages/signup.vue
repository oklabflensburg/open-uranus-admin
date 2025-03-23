<template>
  <div class="max-w-screen-sm mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <SignupForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'

useHead({
  title: 'Sign Up - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Sign up to create your Uranus account.'
    }
  ]
})

definePageMeta({
  auth: false
})
</script>