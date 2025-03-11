<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <OrganizerForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import OrganizerForm from '~/components/OrganizerForm.vue'

useHead({
  title: 'Organizer - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your event organizers.'
    }
  ]
})
</script>