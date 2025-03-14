<template>
<div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 space-y-12">
  <!-- Organizers -->
  <section>
    <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.organizers') }}</h2>
    <p v-if="organizers.length === 0" class="text-gray-500">{{ $t('dashboard.noOrganizersFound') }}</p>

    <ul v-else class="grid grid-cols-12 gap-4">
      <li v-for="organizer in organizers" :key="organizer.organizer_id" class="col-span-6 border border-gray-200">
        <div class="flex justify-between items-center font-semibold text-sm text-gray-600 bg-gray-200 p-3">
          <span>{{ organizer.organizer_name }}</span>
        </div>
        <div class="p-3 bg-white text-gray-700">
          <p>{{ $t('dashboard.countVenues') }}: {{ organizer.stats.count_venue }}</p>
          <p>{{ $t('dashboard.countSpaces') }}: {{ organizer.stats.count_space }}</p>
          <p>{{ $t('dashboard.countEvents') }}: {{ organizer.stats.count_event }}</p>
          <p>{{ $t('dashboard.canEdit') }}: {{ organizer.can_edit }}</p>
          <button
            @click="deleteOrganizer(organizer.organizer_id)"
            class="mt-2 bg-gray-100 text-gray-900 py-1 px-3 hover:bg-gray-700 hover:text-white transition rounded"
          >
            {{ $t('dashboard.delete') }}
          </button>
        </div>
      </li>
    </ul>
  </section>

  <!-- Venues -->
  <section>
    <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.venues') }}</h2>
    <p v-if="venues.length === 0" class="text-gray-500">{{ $t('dashboard.noVenuesFound') }}</p>

    <ul v-else class="grid grid-cols-12 gap-4">
      <li v-for="venue in venues" :key="venue.venue_id" class="col-span-6 border border-gray-200">
        <div class="flex justify-between items-center font-semibold text-sm text-gray-600 bg-gray-200 p-3">
          <span>{{ venue.venue_name }}</span>
          <div class="flex gap-2">
            <img
              src="/public/icons/edit.svg"
              alt="Edit"
              class="cursor-pointer"
            />
            <img
              @click="deleteVenue(venue.venue_id)"
              src="/public/icons/delete.svg"
              alt="Delete"
              class="cursor-pointer"
            />
            </div>
        </div>
        <div class="p-3 bg-white text-gray-700">
          <p>{{ $t('dashboard.countSpaces') }}: {{ venue.stats.count_space }}</p>
          <p>{{ $t('dashboard.countEvents') }}: {{ venue.stats.count_event }}</p>
          <p>{{ $t('dashboard.canEdit') }}: {{ venue.can_edit }}</p>
          <div class="mt-2 flex gap-2">
            <nuxt-link :to="localePath('event')"
                       class="bg-gray-100 text-gray-900 py-1 px-3 hover:bg-gray-700 hover:text-white transition rounded">
              Event anlegen
            </nuxt-link>
            <nuxt-link :to="localePath({ name: 'space-id', params: { id: venue.venue_id } })"
                       class="bg-gray-100 text-gray-900 py-1 px-3 hover:bg-gray-700 hover:text-white transition rounded">
              Raum anlegen
            </nuxt-link>
          </div>
        </div>
      </li>
    </ul>
  </section>

  <!-- Events Table (No changes needed) -->
  <section>
    <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.events') }}</h2>
    <p v-if="events.length === 0" class="text-gray-500">{{ $t('dashboard.noEventsFound') }}</p>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-600 text-sm">
            <th class="p-3 border">Datum</th>
            <th class="p-3 border">Titel</th>
            <th class="p-3 border">Ort</th>
            <th class="p-3 border">Verantwortlich</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="event in events" :key="event.event_id" class="border-b hover:bg-gray-100">
            <td class="p-3 border">{{ formatGermanDate(event.event_date_start_first) }}</td>
            <td class="p-3 border">{{ event.event_title }}</td>
            <td class="p-3 border">{{ event.event_venue_name }}</td>
            <td class="p-3 border">{{ event.can_edit === true ? 'Ja' : 'Nein' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useLocalePath } from "#i18n";
const localePath = useLocalePath()

const { fetchApi } = useApi()
const venues = ref([])
const organizers = ref([])
const events = ref([])

const formatGermanDate = (isoString) => {
  if (!isoString) return '';
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

const fetchVenues = async () => {
  try {
    const data = await fetchApi('/user/venue')
    venues.value = data.map(venue => ({
      ...venue,
      stats: {
        count_space: 0,
        count_event: 0,
      }
    }))

    for (const venue of venues.value) {
      const stats = await fetchVenueStats(venue.venue_id)
      venue.stats = stats || venue.stats
    }
  } catch (error) {
    console.error('Error fetching venues:', error)
  }
}

const fetchOrganizers = async () => {
  try {
    const data = await fetchApi('/user/organizer')
    organizers.value = data.map(organizer => ({
      ...organizer,
      stats: {
        count_event: 0,
        count_venue: 0,
        count_space: 0
      }
    }))

    for (const organizer of organizers.value) {
      const stats = await fetchOrganizerStats(organizer.organizer_id)
      organizer.stats = stats || organizer.stats
    }
  } catch (error) {
    console.error('Error fetching organizers:', error)
  }
}

const fetchOrganizerStats = async (organizerId) => {
  try {
    const data = await fetchApi(`/organizer/stats/?organizer_id=${organizerId}`)
    return data
  } catch (error) {
    console.error('Error fetching organizer stats:', error)
    return {}
  }
}

const fetchVenueStats = async (venueId) => {
  try {
    const data = await fetchApi(`/venue/stats/?venue_id=${venueId}`)
    return data
  } catch (error) {
    console.error('Error fetching venue stats:', error)
    return {}
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