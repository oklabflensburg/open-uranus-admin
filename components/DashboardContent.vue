<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 space-y-12">
    <!-- Organizers -->
    <section>
      <div class="bg-gray-100 p-3 rounded mb-12">
        <h1 class="text-3xl mb-3">{{ $t('dashboard.welcomeMessage') }}</h1>
        <p v-if="organizers.length === 0" class="text-lg">{{ $t('dashboard.welcomeDescription') }}</p>
        <p v-else>Du bist in deinem Dashboard</p>
      </div>
      <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.organizers') }}</h2>
      <div v-if="organizers.length === 0" class="text-gray-500">
        <nuxt-link :to="localePath('organizer')" class="bg-green-600 text-white py-2 px-4 hover:bg-green-800 hover:text-white transition rounded">{{ $t('dashboard.createOrganizer') }}</nuxt-link>
      </div>

      <ul v-else class="grid grid-cols-12 gap-4">
        <li v-for="organizer in organizers" :key="organizer.organizer_id" class="col-span-12 sm:col-span-6 border border-gray-200">
          <div class="flex justify-between items-center font-semibold text-sm text-gray-600 bg-gray-200 p-3">
            <span>{{ organizer.organizer_name }}</span>

            <div v-if="organizer.can_edit" class="flex gap-2">
              <nuxt-link :to="localePath(`/organizer/${organizer.organizer_id}`)">
                <img src="/public/icons/edit.svg" alt="Edit" class="cursor-pointer"/>
              </nuxt-link>
              <img @click="deleteOrganizer(organizer.organizer_id)" src="/public/icons/delete.svg" alt="Delete" class="cursor-pointer"/>
            </div>
          </div>
          <div class="p-3 bg-white text-gray-700">
            <div class="grid grid-cols-3 gap-x-2 w-24">
                <span class="col-span-1 flex items-center justify-center"><img src="/public/icons/venue.svg" alt="Venues"></span>
                <span class="col-span-1 flex items-center justify-center"><img src="/public/icons/space.svg" alt="Spaces"></span>
                <span class="col-span-1 flex items-center justify-center"><img src="/public/icons/event.svg" alt="Events"></span>
                <span class="col-span-1 flex items-center justify-center">{{ organizer.stats.count_venues }}</span>
              <span class="col-span-1 flex items-center justify-center">{{ organizer.stats.count_spaces }}</span>
              <span class="col-span-1 flex items-center justify-center">{{ organizer.stats.count_events }}</span>
            </div>

            <div v-if="organizer.can_edit" class="mt-2 flex gap-2">
              <nuxt-link :to="localePath(`/venue?organizerId=${organizer.organizer_id}`)" class="bg-gray-600 text-white py-1 px-3 hover:bg-gray-800 hover:text-gray-100 transition rounded">{{ $t('dashboard.createVenue') }}</nuxt-link>
            </div>
          </div>
        </li>
        <li class="flex flex-col justify-between col-span-12 sm:col-span-6 border border-gray-200">
          <div class="flex justify-between items-center font-semibold text-sm text-gray-600 bg-gray-200 p-3">
            <span>{{ $t('dashboard.createOrganizer') }}</span>
          </div>
          <div class="flex items-center px-3 py-4 bg-white text-gray-700">
             <nuxt-link :to="localePath('organizer')" class="bg-green-600 text-white py-2 px-4 hover:bg-green-800 hover:text-white transition rounded">{{ $t('dashboard.createOrganizer') }}</nuxt-link>
          </div>
        </li>
      </ul>
    </section>

    <!-- Venues -->
    <section>
      <h2 class="text-2xl font-bold mb-4">{{ $t('dashboard.venues') }}</h2>
      <p v-if="venues.length === 0" class="text-gray-500">{{ $t('dashboard.noVenuesFound') }}</p>

      <ul v-else class="grid grid-cols-12 gap-4">
        <li v-for="venue in venues" :key="venue.venue_id" class="col-span-12 sm:col-span-6 border border-gray-200">
          <div class="flex justify-between items-center font-semibold text-sm text-gray-600 bg-gray-200 p-3">
            <span>{{ venue.venue_name }}</span>

            <div v-if="venue.can_edit_venue" class="flex gap-2">
              <nuxt-link :to="localePath(`/venue/${venue.venue_id}?organizerId=${venue.venue_organizer_id}`)">
                <img src="/public/icons/edit.svg" alt="Edit" class="cursor-pointer"/>
              </nuxt-link>
              <img @click="deleteVenue(venue.venue_id)" src="/public/icons/delete.svg" alt="Delete" class="cursor-pointer">
            </div>
          </div>

          <div class="p-3 bg-white text-gray-700">
            <div class="grid grid-cols-2 gap-x-2 w-16">
                <span class="col-span-1 flex items-center justify-center"><img src="/public/icons/space.svg" alt="Spaces"></span>
                <span class="col-span-1 flex items-center justify-center"><img src="/public/icons/event.svg" alt="Events"></span>
              <span class="col-span-1 flex items-center justify-center">{{ venue.stats.count_spaces }}</span>
              <span class="col-span-1 flex items-center justify-center">{{ venue.stats.count_events }}</span>
            </div>

            <div class="mt-2 flex gap-2">
              <nuxt-link v-if="venue.can_edit_space" :to="localePath({ name: 'space-id', params: { id: venue.venue_id } })" class="bg-gray-600 text-white py-1 px-3 hover:bg-gray-800 hover:text-gray-100 transition rounded">{{ $t('dashboard.createSpace') }}</nuxt-link>
              <nuxt-link v-if="venue.can_edit_event && venue.stats.count_spaces > 0" :to="localePath({ name: 'event', query: { venueId: venue.venue_id } })" class="bg-gray-600 text-white py-1 px-3 hover:bg-gray-800 hover:text-gray-100 transition rounded"> {{ $t('dashboard.createEvent') }}</nuxt-link>
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
              <th class="p-3 border">{{ $t('dashboard.date') }}</th>
              <th class="p-3 border">{{ $t('dashboard.title') }}</th>
              <th class="p-3 border">{{ $t('dashboard.location') }}</th>
              <th class="p-3 border">{{ $t('dashboard.action') }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="event in events" :key="event.event_id" class="border-b hover:bg-gray-100">
              <td class="p-3 border">{{ formatGermanDate(event.event_date_start_first) }}</td>
              <td class="p-3 border">{{ event.event_title }}</td>
              <td class="p-3 border">{{ event.event_venue_name }}</td>
              <td class="p-3 border text-right">
                <nuxt-link v-if="event.can_edit" :to="localePath({ name: 'event-id', params: { id: event.event_date_id }, query: { venueId: 21, update: true }})" class="cursor-pointer">
                  <img src="/public/icons/edit.svg" alt="Edit" class="inline-block">
                </nuxt-link>
              </td>
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
        count_spaces: 0,
        count_events: 0,
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
        count_events: 0,
        count_venues: 0,
        count_spaces: 0
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
    const data = await fetchApi(`/organizer/stats?organizer_id=${organizerId}`)
    return data
  } catch (error) {
    console.error('Error fetching organizer stats:', error)
    return {}
  }
}

const fetchVenueStats = async (venueId) => {
  try {
    const data = await fetchApi(`/venue/${venueId}/stats`)
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
  const userConfirmed = confirm('Are you sure you want to delete this organizer? This action cannot be undone.');
  if (!userConfirmed) return;

  try {
    const password = prompt('Please enter your password to confirm deletion:');
    if (!password) {
      alert('Deletion canceled. Password is required.');
      return;
    }

    await fetchApi(`/organizer/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    organizers.value = organizers.value.filter(organizer => organizer.organizer_id !== id);
    alert('Organizer deleted successfully.');
  } catch (error) {
    console.error('Error deleting organizer:', error);
    alert('Failed to delete organizer. Please try again.');
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