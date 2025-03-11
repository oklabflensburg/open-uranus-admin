<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <EventForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import EventForm from '~/components/EventForm.vue'

useHead({
  title: 'Event - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your events.'
    }
  ]
})
</script>