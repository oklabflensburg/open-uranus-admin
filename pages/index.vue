<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <Search />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import Search from '~/components/Search.vue'

useHead({
  title: 'Home - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Welcome to Uranus. Find and manage events easily.'
    }
  ]
})
</script>