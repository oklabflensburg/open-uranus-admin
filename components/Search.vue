<template>
  <div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-8">
        <ul class="grid grid-cols-12 gap-4 mb-4">
          <li v-for="event in events" :key="`${event.event_id}-${event.event_date_id}`" class="border border-gray-100 bg-gray-200 col-span-6 space-y-4">
            <div class="">
              <img :src="event.image_url" :alt="event.image_alt_name">
            </div>
            <div class="p-3">
              <h1 class="text-xl">{{ event.event_title }}</h1>
              <p>{{ event.event_description }}</p>
              <address>{{ event.venue_postcode }} {{ event.venue_city }}</address>
              {{ event.event_id }}<br>
              {{ event.event_date_id }}<br>
              {{ event.organizer_name }}<br>
              {{ formatDate(event.event_date_start) }}

              <div class="flex flex-wrap gap-2 mt-2">
                <span v-if="event.venue_type" v-for="type in event.venue_type.split(',').map(t => t.trim())" :key="type" class="font-sans text-xs font-medium px-2.5 py-1 rounded bg-orange-100 text-orange-800 hover:bg-orange-500 hover:text-white cursor-pointer" @click="handleTypeClick(type, 'venue_type')">{{ type }}</span>
                <span v-if="event.space_type" v-for="type in event.space_type.split(',').map(t => t.trim())" :key="type" class="font-sans text-xs font-medium px-2.5 py-1 rounded bg-pink-100 text-pink-800 hover:bg-pink-500 hover:text-white cursor-pointer" @click="handleTypeClick(type, 'space_type')">{{ type }}</span>
                <span v-if="event.event_type" v-for="type in event.event_type.split(',').map(t => t.trim())" :key="type" class="font-sans text-xs font-medium px-2.5 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white cursor-pointer" @click="handleTypeClick(type, 'event_type')">{{ type }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-span-4 space-y-4">
        <div>
          <!-- Event City Input -->
          <label for="eventCity">Event City</label>
          <input type="text" id="eventCity" v-model="eventCity" class="bg-white mt-1 p-3 w-full border rounded-xs" placeholder="Enter city">
        </div>
        <div>
          <!-- Venue Type Dropdown -->
          <label for="venueType">Venue Type</label>
          <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="venueType" v-model="selectedVenueType">
            <option selected value="">Bitte auswählen</option>
            <option v-for="venueType in venueTypes" :key="venueType.venue_type_id" :value="venueType.venue_type_id">
              {{ venueType.venue_type_name }}
            </option>
          </select>
        </div>

        <div>
          <!-- Event Type Dropdown -->
          <label for="eventType">Event Type</label>
          <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="eventType" v-model="selectedEventType">
            <option selected value="">Bitte auswählen</option>
            <option v-for="eventType in eventTypes" :key="eventType.event_type_id" :value="eventType.event_type_id">
              {{ eventType.event_type_name }}
            </option>
          </select>
        </div>

        <div>
          <!-- Space Type Dropdown -->
          <label for="spaceType">Space Type</label>
          <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="spaceType" v-model="selectedSpaceType">
            <option selected value="">Bitte auswählen</option>
            <option v-for="spaceType in spaceTypes" :key="spaceType.space_type_id" :value="spaceType.space_type_id">
              {{ spaceType.space_type_name }}
            </option>
          </select>
        </div>

        <div>
          <!-- Genre Type Dropdown -->
          <label for="genreType">Genre Type</label>
          <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="genreType" v-model="selectedGenreType">
            <option selected value="">Bitte auswählen</option>
            <option v-for="genreType in genreTypes" :key="genreType.genre_type_id" :value="genreType.genre_type_id">
              {{ genreType.genre_type_name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRuntimeConfig } from '#app'

// Define reactive variables for dropdowns
const events = ref([])
const eventCity = ref('')
const eventTypes = ref([])
const venueTypes = ref([])
const spaceTypes = ref([])
const genreTypes = ref([])

// Define the venue property
const venue = ref('')

// Selected values
const selectedEventType = ref('')
const selectedVenueType = ref('')
const selectedSpaceType = ref('')
const selectedGenreType = ref('')

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

// Fetch data when component is mounted
onMounted(() => {
  fetchData('/event/type/?lang=de', eventTypes)
  fetchData('/venue/type/?lang=de', venueTypes)
  fetchData('/space/type/?lang=de', spaceTypes)
  fetchData('/genre/type/?lang=de', genreTypes)
})

// Function to generate query string based on selected filters
const generateQuery = (additionalParams = {}) => {
  const params = new URLSearchParams()

  if (eventCity.value) params.append('city', eventCity.value)
  if (selectedEventType.value) params.append('event_type_id', selectedEventType.value)
  if (selectedVenueType.value) params.append('venue_type_id', selectedVenueType.value)
  if (selectedSpaceType.value) params.append('space_type_id', selectedSpaceType.value)
  if (selectedGenreType.value) params.append('genre_type_id', selectedGenreType.value)

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
watch([eventCity, selectedEventType, selectedVenueType, selectedSpaceType, selectedGenreType], () => {
  fetchData(generateQuery(), events)
})
</script>