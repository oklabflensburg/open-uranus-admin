<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg space-y-12">
    <!-- Organizers -->
    <section>
      <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.organizers') }}</h2>
      <p v-if="organizers.length === 0" class="text-gray-500">{{ $t('dashboard.noOrganizersFound') }}</p>
      
      <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li v-for="organizer in organizers" :key="organizer.organizer_id" class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ organizer.organizer_name }}</h3>
          <p class="text-gray-700">{{ $t('dashboard.canEdit') }}: <span class="font-medium">{{ organizer.can_edit }}</span></p>
          <button 
            @click="deleteOrganizer(organizer.organizer_id)" 
            class="mt-3 bg-gray-100 text-gray-900 py-1 px-3 rounded hover:bg-gray-700 hover:text-gray-100 transition"
          >
            {{ $t('dashboard.delete') }}
          </button>
        </li>
      </ul>
    </section>

    <!-- Venues -->
    <section>
      <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.venues') }}</h2>
      <p v-if="venues.length === 0" class="text-gray-500">{{ $t('dashboard.noVenuesFound') }}</p>
      
      <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li v-for="venue in venues" :key="venue.venue_id" class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ venue.venue_name }}</h3>
          <p class="text-gray-700">{{ $t('dashboard.canEdit') }}: <span class="font-medium">{{ venue.can_edit }}</span></p>
          
          <div class="mt-4 flex gap-2">
            <button class="bg-gray-100 text-gray-900 py-1 px-3 rounded hover:bg-gray-700 hover:text-gray-100 transition">
              Raum hinzufügen
            </button>
            <button class="bg-gray-100 text-gray-900 py-1 px-3 rounded hover:bg-gray-700 hover:text-gray-100 transition">
              Bearbeiten
            </button>
            <button 
              @click="deleteVenue(venue.venue_id)" 
              class="bg-gray-100 text-gray-900 py-1 px-3 rounded hover:bg-gray-700 hover:text-gray-100 transition"
            >
              {{ $t('dashboard.delete') }}
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Events -->
    <section>
      <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.events') }}</h2>
      <p v-if="events.length === 0" class="text-gray-500">{{ $t('dashboard.noEventsFound') }}</p>

      <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li v-for="event in events" :key="event.event_id" class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ event.event_title }}</h3>
          <p class="text-gray-700">{{ $t('dashboard.canEdit') }}: <span class="font-medium">{{ event.can_edit }}</span></p>
          
          <button 
            @click="deleteEvent(event.event_id)" 
            class="mt-3 bg-gray-100 text-gray-900 py-1 px-3 rounded hover:bg-gray-700 hover:text-gray-100 transition"
          >
            {{ $t('dashboard.delete') }}
          </button>
        </li>
      </ul>
    </section>
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
