<template>
  <form id="addVenueForm" class="space-y-6" @submit.prevent="submitForm" aria-labelledby="venueFormTitle">
    <h2 id="venueFormTitle" class="text-2xl font-bold mb-4">{{ $t('venueForm.title') }}</h2>

    <!-- Venue Name -->
    <div>
      <label class="block text-gray-700" for="venueName">{{ $t('venueForm.name') }}</label>
      <input type="text" id="venueName" name="venueName" class="mt-1 p-2 w-full border rounded-xs" v-model="venueName" @input="validateField('venueName')" aria-describedby="venueNameError">
      <p v-if="errors.venueName" id="venueNameError" class="text-red-600">{{ errors.venueName }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Street -->
      <div class="col-span-9">
        <label class="block text-gray-700" for="venueStreet">{{ $t('venueForm.street') }}</label>
        <input type="text" id="venueStreet" name="venueStreet" class="mt-1 p-2 w-full border rounded-xs" v-model="venueStreet" @input="validateField('venueStreet')" aria-describedby="venueStreetError">
        <p v-if="errors.venueStreet" id="venueStreetError" class="text-red-600">{{ errors.venueStreet }}</p>
      </div>

      <!-- Venue House Number -->
      <div class="col-span-3">
        <label class="block text-gray-700" for="venueHouseNumber">{{ $t('venueForm.houseNumber') }}</label>
        <input type="text" id="venueHouseNumber" name="venueHouseNumber" class="mt-1 p-2 w-full border rounded-xs" v-model="venueHouseNumber" @input="validateField('venueHouseNumber')" aria-describedby="venueHouseNumberError">
        <p v-if="errors.venueHouseNumber" id="venueHouseNumberError" class="text-red-600">{{ errors.venueHouseNumber }}</p>
      </div>
    </div>

    <!-- Venue Postal Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4">
        <label class="block text-gray-700" for="venuePostalCode">{{ $t('venueForm.postalCode') }}</label>
        <input type="text" id="venuePostalCode" name="venuePostalCode" class="mt-1 p-2 w-full border rounded-xs" v-model="venuePostalCode" @input="validateField('venuePostalCode')" aria-describedby="venuePostalCodeError">
        <p v-if="errors.venuePostalCode" id="venuePostalCodeError" class="text-red-600">{{ errors.venuePostalCode }}</p>
      </div>

      <!-- Venue City -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="venueCity">{{ $t('venueForm.city') }}</label>
        <input type="text" id="venueCity" name="venueCity" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCity" @input="validateField('venueCity')" aria-describedby="venueCityError">
        <p v-if="errors.venueCity" id="venueCityError" class="text-red-600">{{ errors.venueCity }}</p>
      </div>
    </div>

    <!-- Venue County Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueCountyCode">{{ $t('venueForm.countyCode') }}</label>
        <input type="text" id="venueCountyCode" name="venueCountyCode" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCountyCode" @input="validateField('venueCountyCode')" aria-describedby="venueCountyCodeError">
        <p v-if="errors.venueCountyCode" id="venueCountyCodeError" class="text-red-600">{{ errors.venueCountyCode }}</p>
      </div>

      <!-- Venue Country Code -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueCountryCode">{{ $t('venueForm.countryCode') }}</label>
        <input type="text" id="venueCountryCode" name="venueCountryCode" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCountryCode" @input="validateField('venueCountryCode')" aria-describedby="venueCountryCodeError">
        <p v-if="errors.venueCountryCode" id="venueCountryCodeError" class="text-red-600">{{ errors.venueCountryCode }}</p>
      </div>
    </div>

    <!-- Venue Latitude and Longitude -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueLatitude">{{ $t('venueForm.latitude') }}</label>
        <input type="number" step="0.0000001" id="venueLatitude" name="venueLatitude" class="mt-1 p-2 w-full border rounded-xs" v-model="venueLatitude" @input="validateField('venueLatitude')" aria-describedby="venueLatitudeError">
        <p v-if="errors.venueLatitude" id="venueLatitudeError" class="text-red-600">{{ errors.venueLatitude }}</p>
      </div>

      <div class="col-span-6">
        <label class="block text-gray-700" for="venueLongitude">{{ $t('venueForm.longitude') }}</label>
        <input type="number" step="0.0000001" id="venueLongitude" name="venueLongitude" class="mt-1 p-2 w-full border rounded-xs" v-model="venueLongitude" @input="validateField('venueLongitude')" aria-describedby="venueLongitudeError">
        <p v-if="errors.venueLongitude" id="venueLongitudeError" class="text-red-600">{{ errors.venueLongitude }}</p>
      </div>
    </div>

    <!-- Venue Opened Date -->
    <div>
      <label class="block text-gray-700" for="venueOpenedAt">{{ $t('venueForm.openedAt') }}</label>
      <input type="date" id="venueOpenedAt" name="venueOpenedAt" class="mt-1 p-2 w-full border rounded-xs" v-model="venueOpenedAt">
    </div>

    <div class="flex space-x-4 justify-end">
      <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">{{ $t('venueForm.submitButton') }}</button>
      <button type="button" @click="cancelForm" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 transition">{{ $t('venueForm.cancelButton') }}</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const organizerId = route.params.id

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
    venue_organizer_id: parseInt(organizerId, 10),
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
  validateField('venueName')
  validateField('venueStreet')
  validateField('venueHouseNumber')
  validateField('venuePostalCode')
  validateField('venueCity')
  validateField('venueCountyCode')
  validateField('venueCountryCode')
  validateField('venueLatitude')
  validateField('venueLongitude')
}

const validateField = (field) => {
  const fields = {
    venueName,
    venueStreet,
    venueHouseNumber,
    venuePostalCode,
    venueCity,
    venueCountyCode,
    venueCountryCode,
    venueLatitude,
    venueLongitude
  }
  
  if (!fields[field].value) {
    errors.value[field] = t(`venueForm.errors.${field}`)
  } else {
    delete errors.value[field]
  }
}

const cancelForm = () => {
  router.push('/dashboard')
}
</script>