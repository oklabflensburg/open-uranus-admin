<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <AddVenueForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import AddVenueForm from '~/components/VenueForm.vue'

useHead({
  title: 'Venue - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your event venues.'
    }
  ]
})
</script>