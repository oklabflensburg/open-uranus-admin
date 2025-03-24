<template>
  <form id="addVenueForm" class="space-y-6" @submit.prevent="handleSubmit" aria-labelledby="venueFormTitle">
    <h2 id="venueFormTitle" class="text-2xl font-bold mb-4">{{ $t('venueForm.title') }}</h2>
    
    <!-- Accessibility status message for screen readers -->
    <div class="sr-only" aria-live="polite" role="status">{{ statusMessage }}</div>

    <!-- Venue Name -->
    <div>
      <label class="block text-gray-700" for="venueName">{{ $t('venueForm.name') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
      <input 
        type="text" 
        id="venueName" 
        name="venueName" 
        class="mt-1 p-2 w-full border rounded-xs focus-visible" 
        v-model="venueName" 
        @input="validateField('venueName')" 
        aria-describedby="venueNameError"
        aria-required="true"
        :aria-invalid="!!errors.venueName"
      >
      <p v-if="errors.venueName" id="venueNameError" class="text-red-600">{{ errors.venueName }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Street -->
      <div class="col-span-9">
        <label class="block text-gray-700" for="venueStreet">{{ $t('venueForm.street') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venueStreet" 
          name="venueStreet" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueStreet" 
          @input="validateField('venueStreet')" 
          aria-describedby="venueStreetError"
          aria-required="true"
          :aria-invalid="!!errors.venueStreet"
        >
        <p v-if="errors.venueStreet" id="venueStreetError" class="text-red-600">{{ errors.venueStreet }}</p>
      </div>

      <!-- Venue House Number -->
      <div class="col-span-3">
        <label class="block text-gray-700" for="venueHouseNumber">{{ $t('venueForm.houseNumber') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venueHouseNumber" 
          name="venueHouseNumber" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueHouseNumber" 
          @input="validateField('venueHouseNumber')" 
          aria-describedby="venueHouseNumberError"
          aria-required="true"
          :aria-invalid="!!errors.venueHouseNumber"
        >
        <p v-if="errors.venueHouseNumber" id="venueHouseNumberError" class="text-red-600">{{ errors.venueHouseNumber }}</p>
      </div>
    </div>

    <!-- Venue Postal Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4">
        <label class="block text-gray-700" for="venuePostalCode">{{ $t('venueForm.postalCode') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venuePostalCode" 
          name="venuePostalCode" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venuePostalCode" 
          @input="validateField('venuePostalCode')" 
          aria-describedby="venuePostalCodeError"
          aria-required="true"
          :aria-invalid="!!errors.venuePostalCode"
        >
        <p v-if="errors.venuePostalCode" id="venuePostalCodeError" class="text-red-600">{{ errors.venuePostalCode }}</p>
      </div>

      <!-- Venue City -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="venueCity">{{ $t('venueForm.city') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venueCity" 
          name="venueCity" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueCity" 
          @input="validateField('venueCity')" 
          aria-describedby="venueCityError"
          aria-required="true"
          :aria-invalid="!!errors.venueCity"
        >
        <p v-if="errors.venueCity" id="venueCityError" class="text-red-600">{{ errors.venueCity }}</p>
      </div>
    </div>

    <!-- Venue County Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueCountyCode">{{ $t('venueForm.countyCode') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <select 
          id="venueCountyCode" 
          name="venueCountyCode" 
          class="bg-white mt-1 p-2.5 w-full border rounded-xs focus-visible" 
          v-model="venueCountyCode" 
          @change="validateField('venueCountyCode')" 
          aria-describedby="venueCountyCodeError"
          aria-required="true"
          :aria-invalid="!!errors.venueCountyCode"
        >
          <option value="">{{ $t('venueForm.selectState') }}</option>
          <option v-for="state in germanStates" :key="state.code" :value="state.code">
            {{ state.name }}
          </option>
        </select>
        <p v-if="errors.venueCountyCode" id="venueCountyCodeError" class="text-red-600">{{ errors.venueCountyCode }}</p>
      </div>

      <!-- Venue Country Code -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueCountryCode">{{ $t('venueForm.countryCode') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <select 
          id="venueCountryCode" 
          name="venueCountryCode" 
          class="bg-white mt-1 p-2.5 w-full border rounded-xs focus-visible" 
          v-model="venueCountryCode" 
          @change="validateField('venueCountryCode')" 
          aria-describedby="venueCountryCodeError"
          aria-required="true"
          :aria-invalid="!!errors.venueCountryCode"
        >
          <option value="">{{ $t('venueForm.selectCountry') }}</option>
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.name }}
          </option>
        </select>
        <p v-if="errors.venueCountryCode" id="venueCountryCodeError" class="text-red-600">{{ errors.venueCountryCode }}</p>
      </div>
    </div>

    <!-- Venue Latitude and Longitude -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueLatitude">{{ $t('venueForm.latitude') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="number" 
          step="0.0000001" 
          id="venueLatitude" 
          name="venueLatitude" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueLatitude" 
          @input="validateField('venueLatitude')" 
          aria-describedby="venueLatitudeError"
          aria-required="true"
          :aria-invalid="!!errors.venueLatitude"
        >
        <p v-if="errors.venueLatitude" id="venueLatitudeError" class="text-red-600">{{ errors.venueLatitude }}</p>
      </div>

      <div class="col-span-6">
        <label class="block text-gray-700" for="venueLongitude">{{ $t('venueForm.longitude') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="number" 
          step="0.0000001" 
          id="venueLongitude" 
          name="venueLongitude" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueLongitude" 
          @input="validateField('venueLongitude')" 
          aria-describedby="venueLongitudeError"
          aria-required="true"
          :aria-invalid="!!errors.venueLongitude"
        >
        <p v-if="errors.venueLongitude" id="venueLongitudeError" class="text-red-600">{{ errors.venueLongitude }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Opened Date -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueOpenedAt">{{ $t('venueForm.openedAt') }}</label>
        <input 
          type="date" 
          id="venueOpenedAt" 
          name="venueOpenedAt" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueOpenedAt"
        >
      </div>
      <!-- Venue Organizer -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueOrganizerId">{{ $t('venueForm.organizer') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <select 
          id="venueOrganizerId" 
          name="venueOrganizerId" 
          class="bg-white mt-1 p-2.5 w-full border rounded-xs focus-visible" 
          v-model="venueOrganizerId" 
          @change="validateField('venueOrganizerId')" 
          aria-describedby="venueOrganizerIdError"
          aria-required="true"
          :aria-invalid="!!errors.venueOrganizerId"
        >
          <option value="">{{ $t('venueForm.selectOrganizer') }}</option>
          <option v-for="organizer in organizers" :key="organizer.organizer_id" :value="organizer.organizer_id">
            {{ organizer.organizer_name }}
          </option>
        </select>
        <p v-if="errors.venueOrganizerId" id="venueOrganizerIdError" class="text-red-600">{{ errors.venueOrganizerId }}</p>
      </div>
    </div>

    <div v-if="submissionError" class="text-red-600" aria-live="assertive">{{ submissionError }}</div>

    <div class="flex space-x-4 justify-end">
      <button type="button" @click="cancelForm" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 focus-visible transition">{{ $t('venueForm.cancelButton') }}</button>
      <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 focus-visible transition">{{ submitButtonText }}</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { fetchApi } = useApi()

const venueId = route.params.id
const organizerId = route.query.organizerId

// German states list
const germanStates = [
  { code: "BW", name: "Baden-Württemberg" },
  { code: "BY", name: "Bayern" },
  { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" },
  { code: "HB", name: "Bremen" },
  { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hessen" },
  { code: "MV", name: "Mecklenburg-Vorpommern" },
  { code: "NI", name: "Niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen" },
  { code: "RP", name: "Rheinland-Pfalz" },
  { code: "SL", name: "Saarland" },
  { code: "SN", name: "Sachsen" },
  { code: "ST", name: "Sachsen-Anhalt" },
  { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Thüringen" }
]

// Countries list
const countries = [
  { code: "DE", name: "Germany" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" },
  { code: "NO", name: "Norway" },
  { code: "IS", name: "Iceland" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "RU", name: "Russia" },
  { code: "TR", name: "Turkey" }
]

// Reactive form data
const venueName = ref('')
const venueStreet = ref('')
const venueHouseNumber = ref('')
const venuePostalCode = ref('')
const venueCity = ref('')
const venueOrganizerId = ref('')
const venueCountyCode = ref('')
const venueCountryCode = ref('')
const venueLatitude = ref('')
const venueLongitude = ref('')
const venueOpenedAt = ref('')
const organizers = ref([])

const errors = ref({})
const submissionError = ref('')
const statusMessage = ref('')
const submitButtonText = ref(t('venueForm.submitButton'))

const updateStatusMessage = (message) => {
  statusMessage.value = message

  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

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

// Load organizers from API
const loadOrganizers = async () => {
  try {
    const response = await fetchApi('/user/organizer/')
    organizers.value = response || []
    
    // Preselect organizer if organizerId is set in route query
    if (organizerId && organizerId.trim() !== '') {
      venueOrganizerId.value = organizerId
    }
  } catch (error) {
    submissionError.value = t('venueForm.errors.loadOrganizers')
    updateStatusMessage(t('venueForm.errors.loadOrganizers'))
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
  validateField('venueOrganizerId')
  
  // Focus first error field for better accessibility
  if (Object.keys(errors.value).length > 0) {
    const firstErrorField = Object.keys(errors.value)[0]
    nextTick(() => {
      document.getElementById(firstErrorField)?.focus()
      updateStatusMessage(t('venueForm.validationErrors'))
    })
  }
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
    venueLongitude,
    venueOrganizerId
  }
  
  if (!fields[field].value) {
    errors.value[field] = t(`venueForm.errors.${field}`)
  } else {
    delete errors.value[field]
  }
}

const isModeEdit = () => {
  // must not be null or undefined
  return !!venueId
}

const loadVenueData = async (id) => {
  console.log('Loading venue data for ID:', id)
  try {
    const response = await fetchApi(`/venue/${id}`)

    venueName.value = response.venue_name
    venueStreet.value = response.venue_street
    venueHouseNumber.value = response.venue_house_number
    venuePostalCode.value = response.venue_postal_code
    venueCity.value = response.venue_city
    venueCountyCode.value = response.venue_county_code || ''
    venueCountryCode.value = response.venue_country_code || ''
    venueLatitude.value = response.venue_latitude
    venueLongitude.value = response.venue_longitude
    venueOpenedAt.value = response.venue_opened_at || ''
    venueOrganizerId.value = response.venue_organizer_id ? response.venue_organizer_id.toString() : ''
  } catch (error) {
    submissionError.value = t('venueForm.errors.load')
    updateStatusMessage(t('venueForm.errors.load'))
  }
}

const handleSubmit = async () => {
  // Validate form fields before submitting
  validateForm()

  // If there are errors, don't submit
  if (Object.keys(errors.value).length > 0) {
    return
  }

  updateStatusMessage(t('venueForm.submitting'))

  // Prepare data to send
  const body = {
    venue_organizer_id: parseInt(venueOrganizerId.value, 10),
    venue_name: venueName.value,
    venue_street: venueStreet.value,
    venue_house_number: venueHouseNumber.value,
    venue_postal_code: venuePostalCode.value,
    venue_city: venueCity.value,
    venue_county_code: venueCountyCode.value,
    venue_country_code: venueCountryCode.value,
    venue_latitude: venueLatitude.value,
    venue_longitude: venueLongitude.value,
    venue_opened_at: venueOpenedAt.value || null
  }

  try {
    console.log('Submitting form data:', isModeEdit() ? 'PUT' : 'POST', body)
    if (isModeEdit()) {
      await fetchApi(`/venue/${venueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      updateStatusMessage(t('venueForm.success'))
      router.push(localePath('/dashboard'))
      return
    } else {
      await fetchApi('/venue/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      updateStatusMessage(t('venueForm.success'))
      router.push(localePath('/dashboard'))
    }
  } catch (error) {
    submissionError.value = t('venueForm.errors.submission')
    updateStatusMessage(t('venueForm.errors.submission'))
  }
}

const cancelForm = () => {
  router.push(localePath('/dashboard'))
}

onMounted(() => {
  loadOrganizers()
  if (isModeEdit()) {
    loadVenueData(venueId)
    submitButtonText.value = t('venueForm.saveChanges')
  }
})
</script>