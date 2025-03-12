<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Venues</h2>
    <div v-if="venues.length === 0" class="text-gray-500">No venues available.</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="venue in venues" :key="venue.venue_id" class="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">{{ venue.venue_name }}</h3>
        <p class="text-gray-700">Darf bearbeiten: {{ venue.can_edit }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'
import { useAuth } from '@/composables/useAuth'
import { useApi } from '@/composables/useApi'

useHead({
  title: 'Dashboard - Uranus',
  meta: [
    {
      name: 'description',
      content: 'Manage your events and venues from the dashboard.'
    }
  ]
})

const { logout } = useAuth()
const { fetchApi } = useApi()
const venues = ref([])

const handleLogout = () => {
  logout()
  navigateTo('/signin')
}

const fetchVenues = async () => {
  try {
    const data = await fetchApi('https://api.uranus.oklabflensburg.de/user/venue')
    venues.value = data
  } catch (error) {
    console.error('Error fetching venues:', error)
  }
}

onMounted(() => {
  fetchVenues()
})
</script>