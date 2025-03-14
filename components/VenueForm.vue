<template>
  <form id="addVenueForm" class="space-y-6" @submit.prevent="submitForm">
    <h2 class="text-2xl font-bold mb-4">Location</h2>

    <!-- Venue Name -->
    <div class="">
      <label class="block text-gray-700" for="venueName">Name</label>
      <input type="text" id="venueName" name="venueName" class="mt-1 p-2 w-full border rounded-xs" v-model="venueName">
      <p v-if="errors.venueName" class="text-red-600">{{ errors.venueName }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Street -->
      <div class="col-span-9">
        <label class="block text-gray-700" for="venueStreet">Straße</label>
        <input type="text" id="venueStreet" name="venueStreet" class="mt-1 p-2 w-full border rounded-xs" v-model="venueStreet">
        <p v-if="errors.venueStreet" class="text-red-600">{{ errors.venueStreet }}</p>
      </div>

      <!-- Venue House Number -->
      <div class="col-span-3">
        <label class="block text-gray-700" for="venueHouseNumber">Hausnummer</label>
        <input type="text" id="venueHouseNumber" name="venueHouseNumber" class="mt-1 p-2 w-full border rounded-xs" v-model="venueHouseNumber">
        <p v-if="errors.venueHouseNumber" class="text-red-600">{{ errors.venueHouseNumber }}</p>
      </div>
    </div>

    <!-- Venue Postal Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4">
        <label class="block text-gray-700" for="venuePostalCode">Postleitzahl</label>
        <input type="text" id="venuePostalCode" name="venuePostalCode" class="mt-1 p-2 w-full border rounded-xs" v-model="venuePostalCode">
        <p v-if="errors.venuePostalCode" class="text-red-600">{{ errors.venuePostalCode }}</p>
      </div>

      <!-- Venue City -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="venueCity">Stadt</label>
        <input type="text" id="venueCity" name="venueCity" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCity">
        <p v-if="errors.venueCity" class="text-red-600">{{ errors.venueCity }}</p>
      </div>
    </div>

    <!-- Venue County Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueCountyCode">Bundesland</label>
        <input type="text" id="venueCountyCode" name="venueCountyCode" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCountyCode">
        <p v-if="errors.venueCountyCode" class="text-red-600">{{ errors.venueCountyCode }}</p>
      </div>

      <!-- Venue Country Code -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueCountryCode">Land</label>
        <input type="text" id="venueCountryCode" name="venueCountryCode" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCountryCode">
        <p v-if="errors.venueCountryCode" class="text-red-600">{{ errors.venueCountryCode }}</p>
      </div>
    </div>

    <!-- Venue Latitude and Longitude -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueLatitude">Breitengrad</label>
        <input type="number" step="0.0000001" id="venueLatitude" name="venueLatitude" class="mt-1 p-2 w-full border rounded-xs" v-model="venueLatitude">
        <p v-if="errors.venueLatitude" class="text-red-600">{{ errors.venueLatitude }}</p>
      </div>

      <div class="col-span-6">
        <label class="block text-gray-700" for="venueLongitude">Längengrad</label>
        <input type="number" step="0.0000001" id="venueLongitude" name="venueLongitude" class="mt-1 p-2 w-full border rounded-xs" v-model="venueLongitude">
        <p v-if="errors.venueLongitude" class="text-red-600">{{ errors.venueLongitude }}</p>
      </div>
    </div>

    <!-- Venue Opened Date -->
    <div class="">
      <label class="block text-gray-700" for="venueOpenedAt">Eröffnungsdatum</label>
      <input type="date" id="venueOpenedAt" name="venueOpenedAt" class="mt-1 p-2 w-full border rounded-xs" v-model="venueOpenedAt">
    </div>

    <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">Ort hinzufügen</button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'

// Reactive form data
const venueName = ref('')
const venueStreet = ref('')
const venueHouseNumber = ref('')
const venuePostalCode = ref('')
const venueCity = ref('')
const venueCountyCode = ref('')
const venueCountryCode = ref('')
const venueLatitude = ref('')
const venueLongitude = ref('')
const venueOpenedAt = ref('')
const errors = ref({})

// Function to get location data
const getLocationData = async () => {
  const url = `https://nominatim.oklabflensburg.de/search?q=${venueStreet.value} ${venueHouseNumber.value} ${venueCity.value} ${venueCountyCode.value} ${venueCountryCode.value} ${venuePostalCode.value}&limit=1`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Parse the response as JSON
    const data = await response.json()

    if (data && data[0]) {
      venueLatitude.value = parseFloat(data[0].lat).toFixed(6)
      venueLongitude.value = parseFloat(data[0].lon).toFixed(6)
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
  }
}

// Watch for changes to the relevant input fields
watch([venueStreet, venueHouseNumber, venueCity, venueCountyCode, venuePostalCode], () => {
  // Call getLocationData whenever one of these inputs changes
  getLocationData()
})

// Submit method using fetchApi
const submitForm = async () => {
  // Validate form fields before submitting
  validateForm()

  // If there are errors, don't submit
  if (Object.keys(errors.value).length > 0) {
    return
  }

  // Prepare data to send
  const body = {
    venue_name: venueName.value,
    venue_street: venueStreet.value,
    venue_house_number: venueHouseNumber.value,
    venue_postal_code: venuePostalCode.value,
    venue_city: venueCity.value,
    venue_latitude: venueLatitude.value,
    venue_longitude: venueLongitude.value,
    venue_opened_at: venueOpenedAt.value || null
  }

  try {
    const { fetchApi } = useApi()
    const data = await fetchApi('/venue/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (data) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error sending data:', error)
    // Handle network error
  }
}

// Form validation
const validateForm = () => {
  errors.value = {}

  if (!venueName.value) errors.value.venueName = 'Bitte Namen für den Veranstaltungsort angeben'
  if (!venueStreet.value) errors.value.venueStreet = 'Bitte eine Straße angeben'
  if (!venueHouseNumber.value) errors.value.venueHouseNumber = 'Bitte Hausnummer angeben'
  if (!venuePostalCode.value) errors.value.venuePostalCode = 'Bitte eine Postleitzahl angeben'
  if (!venueCity.value) errors.value.venueCity = 'Bitte eine Stadt angeben'
  if (!venueCountyCode.value) errors.value.venueCountyCode = 'Bitte Bundesland auswählen'
  if (!venueCountryCode.value) errors.value.venueCountryCode = 'Bitte Ländercode auswählen'
  if (!venueLatitude.value) errors.value.venueLatitude = 'Bitte Breitengrad angeben'
  if (!venueLongitude.value) errors.value.venueLongitude = 'Bitte Längengrad angeben'
}
</script>
