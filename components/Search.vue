<template>
  <div>
    <!-- Event Type Dropdown -->
    <label for="eventType">Event Type</label>
    <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="eventType" v-model="selectedEventType">
      <option selected value="">Bitte auswählen</option>
      <option v-for="eventType in eventTypes" :key="eventType.event_type_id" :value="eventType.event_type_id">
        {{ eventType.event_type_name }}
      </option>
    </select>

    <!-- Space Type Dropdown -->
    <label for="spaceType">Space Type</label>
    <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="spaceType" v-model="selectedSpaceType">
      <option selected value="">Bitte auswählen</option>
      <option v-for="spaceType in spaceTypes" :key="spaceType.space_type_id" :value="spaceType.space_type_id">
        {{ spaceType.space_type_name }}
      </option>
    </select>

    <!-- Genre Type Dropdown -->
    <label for="genreType">Genre Type</label>
    <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="genreType" v-model="selectedGenreType">
      <option selected value="">Bitte auswählen</option>
      <option v-for="genreType in genreTypes" :key="genreType.genre_type_id" :value="genreType.genre_type_id">
        {{ genreType.genre_type_name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

// Define reactive variables for dropdowns
const venues = ref([])
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

// Get API base URL from Nuxt config
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// Fetch function
const fetchData = async (url, targetArray) => {
  try {
    const response = await fetch(`${apiBaseUrl}${url}`)
    const data = await response.json()
    targetArray.value = data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
  }
}

// Fetch data when component is mounted
onMounted(() => {
  fetchData('/venue/', venues)
  fetchData('/event/type/', eventTypes)
  fetchData('/venue/type/', venueTypes)
  fetchData('/space/type/', spaceTypes)
  fetchData('/genre/type/', genreTypes)
})
</script>