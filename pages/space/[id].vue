<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <SpaceForm />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import SpaceForm from '~/components/SpaceForm.vue'

useHead({
  title: 'Space - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your venue space.'
    }
  ]
})
</script>