<template>
  <DashboardContent />
</template>

<script setup>
import { useHead } from '#imports'
import DashboardContent from '@/components/DashboardContent.vue'

useHead({
  title: 'Dashboard - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your events and venues from the dashboard.'
    }
  ]
})
</script>