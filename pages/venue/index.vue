<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <VenueForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import VenueForm from '~/components/VenueForm.vue'

definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Venue - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your event venues.'
    }
  ]
})

definePageMeta({
  auth: true
})
</script>