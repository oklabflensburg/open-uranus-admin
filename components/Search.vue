<template>
  <div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 md:col-span-8 lg:col-span-9">
        <!-- Map container - replaced with EventMap component -->
        <EventMap 
          :events="events" 
          :event-city="eventCity" 
          ref="eventMapRef"
          class="mb-4"
        />

        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <li v-if="events.length === 0" class="col-span-full text-center text-gray-500">
            {{ $t('search.event.no_events') }}
          </li>
          <li v-for="event in events"
              :key="`${event.event_id}-${event.event_date_id}`"
              class="border border-gray-100 bg-gray-200 rounded-md shadow-md h-full flex flex-col"
              role="listitem">

            <!-- Image -->
            <div>
              <img :src="event.image_url" :alt="event.image_alt_name || $t('search.event.image_alt')"
                  class="w-full h-48 object-cover rounded-t-md">
            </div>

            <!-- Content -->
            <div class="p-3 flex flex-col flex-grow">
              <span class="mb-1">{{ formatDate(event.event_date_start) }}</span>
              <h1 class="text-xl font-semibold">{{ event.event_title }}</h1>

              <p class="text-gray-700 mb-6">{{ truncateription(event.event_description) }}</p>
              <address class="flex-grow not-italic">
                <span class="font-bold">{{ event.venue_name }}</span><br>
                {{ event.venue_postcode }} {{ event.venue_city }}
              </address>

              <!-- Tags Section (sticks to bottom) -->
              <div class="flex flex-wrap gap-2 mt-auto pt-2">
                <span v-if="event.venue_type" v-for="type in event.venue_type.split(',').map(t => t.trim())"
                      :key="type"
                      class="text-xs font-medium px-2.5 py-1 rounded bg-orange-100 text-orange-800 hover:bg-orange-500 hover:text-white cursor-pointer"
                      @click="handleTypeClick(type, 'venue_type')"
                      role="button" :aria-label="$t('search.filter.venue_type', { type })">
                  {{ type }}
                </span>

                <span v-if="event.space_type" v-for="type in event.space_type.split(',').map(t => t.trim())" :key="type" class="text-xs font-medium px-2.5 py-1 rounded bg-pink-100 text-pink-800 hover:bg-pink-500 hover:text-white cursor-pointer" @click="handleTypeClick(type, 'space_type')" role="button" :aria-label="$t('search.filter.space_type', { type })">
                  {{ type }}
                </span>

                <span v-if="event.event_type" v-for="type in event.event_type.split(',').map(t => t.trim())"
                      :key="type"
                      class="text-xs font-medium px-2.5 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white cursor-pointer"
                      @click="handleTypeClick(type, 'event_type')"
                      role="button" :aria-label="$t('search.filter.event_type', { type })">
                  {{ type }}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mt-auto p-3">
              <button @click="downloadCalendar(event.event_date_id)" class="text-xs font-medium px-2.5 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-500 hover:text-white cursor-pointer">
                {{ $t('search.event.add_to_calendar') }}
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div id="sidebarSearch" class="col-span-12 sm:col-span-5 md:col-span-4 lg:col-span-3 space-y-4 bg-gray-100 p-3 rounded-md md:sticky md:top-4 md:self-start overflow-auto z-0">
        <h1 class="text-2xl" id="searchFormTitle">{{ $t('search.title') }}</h1>
        
        <form aria-labelledby="searchFormTitle" @submit.prevent="applyFilters" role="search">
          <div class="space-y-4">

            <div>
              <!-- Event City Input -->
              <label for="eventCity" class="block mb-1">{{ $t('search.filter.event_city') }}</label>
              <input 
                type="text" 
                id="eventCity" 
                v-model="eventCity" 
                class="bg-white mt-1 p-3 w-full border rounded-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                :placeholder="$t('search.filter.enter_city')" 
                :aria-label="$t('search.filter.enter_event_city')"
              >
            </div>

            <div>
              <!-- Venues Dropdown -->
              <label for="venueSelect" class="block mb-1">{{ $t('search.filter.venues') }}</label>
              <select 
                class="bg-white mt-1 p-3 w-full border rounded-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                id="venueSelect" 
                v-model="selectedVenue" 
                :aria-label="$t('search.filter.select_venue')"
              >
                <option selected value="">{{ $t('search.filter.select_option') }}</option>
                <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
                  {{ venue.venue_name }}
                </option>
              </select>
            </div>

            <div>
              <!-- Venue Type Dropdown -->
              <label for="venueTypeSelect" class="block mb-1">{{ $t('search.filter.venue_type') }}</label>
              <select 
                class="bg-white mt-1 p-3 w-full border rounded-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                id="venueTypeSelect" 
                v-model="selectedVenueType" 
                :aria-label="$t('search.filter.select_venue_type')"
              >
                <option selected value="">{{ $t('search.filter.select_option') }}</option>
                <option v-for="venueType in venueTypes" :key="venueType.venue_type_id" :value="venueType.venue_type_id">
                  {{ venueType.venue_type_name }}
                </option>
              </select>
            </div>

            <div>
              <!-- Event Type Dropdown -->
              <label for="eventTypeSelect" class="block mb-1">{{ $t('search.filter.event_type') }}</label>
              <select 
                class="bg-white mt-1 p-3 w-full border rounded-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                id="eventTypeSelect" 
                v-model="selectedEventType" 
                :aria-label="$t('search.filter.select_event_type')"
              >
                <option selected value="">{{ $t('search.filter.select_option') }}</option>
                <option v-for="eventType in eventTypes" :key="eventType.event_type_id" :value="eventType.event_type_id">
                  {{ eventType.event_type_name }}
                </option>
              </select>
            </div>

            <div>
              <!-- Space Type Dropdown -->
              <label for="spaceTypeSelect" class="block mb-1">{{ $t('search.filter.space_type') }}</label>
              <select 
                class="bg-white mt-1 p-3 w-full border rounded-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                id="spaceTypeSelect" 
                v-model="selectedSpaceType" 
                :aria-label="$t('search.filter.select_space_type')"
              >
                <option selected value="">{{ $t('search.filter.select_option') }}</option>
                <option v-for="spaceType in spaceTypes" :key="spaceType.space_type_id" :value="spaceType.space_type_id">
                  {{ spaceType.space_type_name }}
                </option>
              </select>
            </div>

            <div>
              <!-- Genre Type Dropdown -->
              <label for="genreTypeSelect" class="block mb-1">{{ $t('search.filter.genre_type') }}</label>
              <select 
                class="bg-white mt-1 p-3 w-full border rounded-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                id="genreTypeSelect" 
                v-model="selectedGenreType" 
                :aria-label="$t('search.filter.select_genre_type')"
              >
                <option selected value="">{{ $t('search.filter.select_option') }}</option>
                <option v-for="genreType in genreTypes" :key="genreType.genre_type_id" :value="genreType.genre_type_id">
                  {{ genreType.genre_type_name }}
                </option>
              </select>
            </div>

            <div>
              <label for="eventDateStart" class="block font-medium mb-1">{{ $t('search.filter.earliest_start') }}</label>
              <input 
                type="date" 
                id="eventDateStart" 
                v-model="eventDateStart" 
                class="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                :aria-describedby="eventDateStart"
                :aria-label="$t('search.filter.select_earliest_start_date')"
              >
              <div id="eventDateStart" class="sr-only">{{ $t('search.filter.earliest_start_desc') || 'Select the earliest date for events' }}</div>
            </div>

            <div>
              <label for="eventDateEnd" class="block font-medium mb-1">{{ $t('search.filter.latest_date') }}</label>
              <input 
                type="date" 
                id="eventDateEnd" 
                v-model="eventDateEnd" 
                class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                :aria-describedby="eventDateEnd"
                :aria-label="$t('search.filter.select_latest_end_date')"
              >
              <div id="eventDateEnd" class="sr-only">{{ $t('search.filter.latest_date_desc') || 'Select the latest date for events' }}</div>
            </div>
            
            <div class="flex flex-col space-y-2 mt-6">
              <button 
                type="button" 
                @click="resetFilters" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                {{ $t('search.filter.reset') || 'Reset' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRuntimeConfig } from '#app'
import { useI18n } from 'vue-i18n'
import EventMap from './EventMap.vue'

// Get i18n instance to access current locale
const { locale } = useI18n()

// Define reactive variables for dropdowns
const events = ref([])
const venues = ref([])
const eventCity = ref('')
const eventTypes = ref([])
const venueTypes = ref([])
const spaceTypes = ref([])
const genreTypes = ref([])

// Selected values
const selectedVenue = ref('')
const selectedEventType = ref('')
const selectedVenueType = ref('')
const selectedSpaceType = ref('')
const selectedGenreType = ref('')

// Date inputs
const eventDateStart = ref('')
const eventDateEnd = ref('')

// Reference to the EventMap component
const eventMapRef = ref(null)

// Get API base URL from Nuxt config
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

function formatDate(dateString) {
  const date = new Date(dateString)

  if (!isNaN(date)) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }

  return dateString
}

function truncateription(description) {
  if (description.length <= 200) return description;
  return description.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';
}

// Fetch function
const fetchData = async (url, targetArray) => {
  try {
    const response = await fetch(`${apiBaseUrl}${url}`)
    const data = await response.json()
    targetArray.value = data.length ? data : []
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    targetArray.value = []
  }
}

// Function to fetch type data with current locale
const fetchTypeData = () => {
  fetchData('/venue', venues)
  fetchData(`/event/type/?lang=${locale.value}`, eventTypes)
  fetchData(`/venue/type/?lang=${locale.value}`, venueTypes)
  fetchData(`/space/type/?lang=${locale.value}`, spaceTypes)
  fetchData(`/genre/type/?lang=${locale.value}`, genreTypes)
}

// Fetch data when component is mounted
onMounted(() => {
  fetchTypeData();
  fetchData('/event/', events);
})

// Watch for locale changes and refetch data when locale changes
watch(locale, () => {
  fetchTypeData();
})

// Function to generate query string based on selected filters
const generateQuery = (additionalParams = {}) => {
  const params = new URLSearchParams()

  if (eventCity.value) params.append('city', eventCity.value.trim())
  if (selectedVenue.value) params.append('venue_id', selectedVenue.value)
  if (selectedEventType.value) params.append('event_type_id', selectedEventType.value)
  if (selectedVenueType.value) params.append('venue_type_id', selectedVenueType.value)
  if (selectedSpaceType.value) params.append('space_type_id', selectedSpaceType.value)
  if (selectedGenreType.value) params.append('genre_type_id', selectedGenreType.value)
  if (eventDateStart.value) params.append('date_start', `>${formatDate(eventDateStart.value)}`)
  if (eventDateEnd.value) params.append('date_end', `<${formatDate(eventDateEnd.value)}`)

  // Add additional parameters
  Object.keys(additionalParams).forEach(key => {
    params.append(key, additionalParams[key])
  })

  return `/event/?${params.toString()}`
}

// Function to handle type click
const handleTypeClick = (type, typeKey) => {
  if (typeKey === 'venue_type') {
    selectedVenueType.value = type
  } else if (typeKey === 'space_type') {
    selectedSpaceType.value = type
  } else if (typeKey === 'event_type') {
    selectedEventType.value = type
  }
  fetchData(generateQuery(), events)
}

// Watchers for all filters
watch([eventCity, selectedVenue, selectedEventType, selectedVenueType, selectedSpaceType, selectedGenreType, eventDateStart, eventDateEnd], () => {
  fetchData(generateQuery(), events)
})

const downloadCalendar = async (eventDateId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/event/${eventDateId}/calendar`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to download calendar file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `event-${eventDateId}.ics`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error downloading calendar file:', error);
  }
};

// Apply filters
const applyFilters = () => {
  fetchData(generateQuery(), events);
}

const resetFilters = () => {
  eventCity.value = '';
  selectedVenue.value = '';
  selectedEventType.value = '';
  selectedVenueType.value = '';
  selectedSpaceType.value = '';
  selectedGenreType.value = '';
  eventDateStart.value = '';
  eventDateEnd.value = '';
  
  // Reset map to default view using the exposed method
  if (eventMapRef.value) {
    eventMapRef.value.resetMapView();
  }
  
  fetchData('/event/', events);
}
</script>

<style>
.marker {
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
</style>