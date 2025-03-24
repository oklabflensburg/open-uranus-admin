<template>
  <UserProfile />
</template>

<script setup>
import { useHead } from '#imports'

useHead({
  title: 'Profile - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your events and venues from the dashboard.'
    }
  ]
})

definePageMeta({
  auth: true
})
</script>