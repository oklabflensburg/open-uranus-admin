<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Veranstalter</h2>
      <div v-if="organizers.length === 0" class="text-gray-500">Keine Veranstalter gefunden.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="organizer in organizers" :key="organizer.organizer_id" class="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold">{{ organizer.organizer_name }}</h3>
          <p class="text-gray-700">Darf bearbeiten: {{ organizer.can_edit }}</p>
          <button @click="deleteOrganizer(organizer.organizer_id)" class="hidden mt-2 bg-red-500 text-white py-1 px-3 rounded">Delete</button>
        </div>
      </div>
    </div>

    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Veranstaltungsorte</h2>
      <div v-if="venues.length === 0" class="text-gray-500">Keine Veranstaltungsorte gefunden.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="venue in venues" :key="venue.venue_id" class="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold">{{ venue.venue_name }}</h3>
          <p class="text-gray-700">Darf bearbeiten: {{ venue.can_edit }}</p>
          <button @click="deleteVenue(venue.venue_id)" class="hidden mt-2 bg-red-500 text-white py-1 px-3 rounded">Delete</button>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Veranstaltungen</h2>
      <div v-if="events.length === 0" class="text-gray-500">Keine Veranstaltungen gefunden.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="event in events" :key="event.event_id" class="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold">{{ event.event_title }}</h3>
          <p class="text-gray-700">Darf bearbeiten: {{ event.can_edit }}</p>
          <button @click="deleteEvent(event.event_id)" class="hidden mt-2 bg-red-500 text-white py-1 px-3 rounded">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const { fetchApi } = useApi()
const venues = ref([])
const organizers = ref([])
const events = ref([])

const fetchVenues = async () => {
  try {
    const data = await fetchApi('/user/venue')
    venues.value = data
  } catch (error) {
    console.error('Error fetching venues:', error)
  }
}

const fetchOrganizers = async () => {
  try {
    const data = await fetchApi('/user/organizer')
    organizers.value = data
  } catch (error) {
    console.error('Error fetching organizers:', error)
  }
}

const fetchEvents = async () => {
  try {
    const data = await fetchApi('/user/event')
    events.value = data
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

const deleteOrganizer = async (id) => {
  try {
    await fetchApi(`/organizer/${id}`, { method: 'DELETE' })
    organizers.value = organizers.value.filter(organizer => organizer.organizer_id !== id)
  } catch (error) {
    console.error('Error deleting organizer:', error)
  }
}

const deleteEvent = async (id) => {
  try {
    await fetchApi(`/event/${id}`, { method: 'DELETE' })
    events.value = events.value.filter(event => event.event_id !== id)
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}

const deleteVenue = async (id) => {
  try {
    await fetchApi(`/venue/${id}`, { method: 'DELETE' })
    venues.value = venues.value.filter(venue => venue.venue_id !== id)
  } catch (error) {
    console.error('Error deleting venue:', error)
  }
}

onMounted(() => {
  fetchVenues()
  fetchOrganizers()
  fetchEvents()
})
</script>
