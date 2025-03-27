<template>
  <form id="addVenueForm" class="space-y-6" @submit.prevent="handleSubmit" aria-labelledby="venueFormTitle">
    <div>
      <h2 id="venueFormTitle" class="text-2xl font-bold">
        {{ isModeEdit() ? $t('venueForm.editTitle') : $t('venueForm.title') }}
      </h2>
      <h3 class="text-md mb-4">Für Organisation: {{ venueOrganizerName }}</h3>
    </div>

    <!-- Accessibility status message for screen readers -->
    <div aria-live="assertive" role="status" class="sr-only">{{ statusMessage }}</div>
    
    <!-- Visual loading indicator -->
    <div v-if="isLoading" class="mb-4 p-2 bg-blue-100 text-blue-800 rounded" role="status">
      <p>{{ loadingMessage }}</p>
    </div>

    <!-- Venue Name -->
    <div>
      <label class="block text-gray-700" for="venueName">{{ $t('venueForm.name') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">{{ $t('venueForm.required') }}</span></label>
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
        autocomplete="organization"
      >
      <p v-if="errors.venueName" id="venueNameError" class="text-red-600">{{ errors.venueName }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Street -->
      <div class="col-span-12 sm:col-span-9">
        <label class="block text-gray-700" for="venueStreet">{{ $t('venueForm.street') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venueStreet" 
          name="venueStreet" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueStreet" 
          @input="validateField('venueStreet')" 
          @change="handleAddressChange"
          aria-describedby="venueStreetError"
          aria-required="true"
          :aria-invalid="!!errors.venueStreet"
          autocomplete="address-line1"
        >
        <p v-if="errors.venueStreet" id="venueStreetError" class="text-red-600">{{ errors.venueStreet }}</p>
      </div>

      <!-- Venue House Number -->
      <div class="col-span-12 sm:col-span-3">
        <label class="block text-gray-700" for="venueHouseNumber">{{ $t('venueForm.houseNumber') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venueHouseNumber" 
          name="venueHouseNumber" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueHouseNumber" 
          @input="validateField('venueHouseNumber')" 
          @change="handleAddressChange"
          aria-describedby="venueHouseNumberError"
          aria-required="true"
          :aria-invalid="!!errors.venueHouseNumber"
          autocomplete="address-line2"
        >
        <p v-if="errors.venueHouseNumber" id="venueHouseNumberError" class="text-red-600">{{ errors.venueHouseNumber }}</p>
      </div>
    </div>

    <!-- Venue Postal Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 sm:col-span-4">
        <label class="block text-gray-700" for="venuePostalCode">{{ $t('venueForm.postalCode') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venuePostalCode" 
          name="venuePostalCode" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venuePostalCode" 
          @input="validateField('venuePostalCode')" 
          @change="handleAddressChange"
          aria-describedby="venuePostalCodeError"
          aria-required="true"
          :aria-invalid="!!errors.venuePostalCode"
          autocomplete="postal-code"
        >
        <p v-if="errors.venuePostalCode" id="venuePostalCodeError" class="text-red-600">{{ errors.venuePostalCode }}</p>
      </div>

      <!-- Venue City -->
      <div class="col-span-12 sm:col-span-8">
        <label class="block text-gray-700" for="venueCity">{{ $t('venueForm.city') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <input 
          type="text" 
          id="venueCity" 
          name="venueCity" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueCity" 
          @input="validateField('venueCity')" 
          @change="handleAddressChange"
          aria-describedby="venueCityError"
          aria-required="true"
          :aria-invalid="!!errors.venueCity"
          autocomplete="address-level2"
        >
        <p v-if="errors.venueCity" id="venueCityError" class="text-red-600">{{ errors.venueCity }}</p>
      </div>
    </div>

    <!-- Venue County Code -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 sm:col-span-6">
        <label class="block text-gray-700" for="venueStateCode">{{ $t('venueForm.countyCode') }}</label>
        <select 
          id="venueStateCode" 
          name="venueStateCode" 
          class="bg-white mt-1 p-2.5 w-full border rounded-xs focus-visible" 
          v-model="venueStateCode" 
          aria-describedby="venueStateCodeError"
          aria-required="false"
          :aria-invalid="!!errors.venueStateCode"
          autocomplete="address-level1"
        >
          <option value="">{{ $t('venueForm.selectState') }}</option>
          <option v-for="state in germanStates" :key="state.state_code" :value="state.state_code">
            {{ state.state_name }}
          </option>
        </select>
        <p v-if="errors.venueStateCode" id="venueStateCodeError" class="text-red-600">{{ errors.venueStateCode }}</p>
      </div>

      <!-- Venue Country Code -->
      <div class="col-span-12 sm:col-span-6">
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
          autocomplete="country"
        >
          <option value="">{{ $t('venueForm.selectCountry') }}</option>
          <option v-for="country in countries" :key="country.country_code" :value="country.country_code">
            {{ country.country_name }}
          </option>
        </select>
        <p v-if="errors.venueCountryCode" id="venueCountryCodeError" class="text-red-600">{{ errors.venueCountryCode }}</p>
      </div>
    </div>

    <!-- Venue Latitude and Longitude -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 sm:col-span-6">
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
          autocomplete="off"
        >
        <p v-if="errors.venueLatitude" id="venueLatitudeError" class="text-red-600">{{ errors.venueLatitude }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6">
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
          autocomplete="off"
        >
        <p v-if="errors.venueLongitude" id="venueLongitudeError" class="text-red-600">{{ errors.venueLongitude }}</p>
      </div>
    </div>

    <!-- Venue Type -->
    <div>
      <label class="block text-gray-700" id="venueTypeLabel" for="venueTypeSelect">{{ $t('venueForm.type') }}</label>
      <Multiselect
        v-model="selectedVenueTypes"
        :options="venueTypes"
        :multiple="true"
        :searchable="true"
        :close-on-select="false"
        :show-labels="false"
        :placeholder="$t('venueForm.selectType')"
        label="venue_type_name"
        track-by="venue_type_id"
        @select="onVenueTypeSelect"
        @remove="onVenueTypeRemove"
        aria-describedby="venueTypeIdError"
        aria-labelledby="venueTypeLabel"
        id="venueTypeSelect"
        role="combobox"
        aria-expanded="false"
        aria-haspopup="listbox"
        :aria-busy="isLoading"
        :aria-invalid="!!errors.venueTypeId"
      />
      <p v-if="errors.venueTypeId" id="venueTypeIdError" class="text-red-600">{{ errors.venueTypeId }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Opened Date -->
      <div class="col-span-12 sm:col-span-6">
        <label class="block text-gray-700" for="venueOpenedAt">{{ $t('venueForm.openedAt') }}</label>
        <input 
          type="date" 
          id="venueOpenedAt" 
          name="venueOpenedAt" 
          class="mt-1 p-2 w-full border rounded-xs focus-visible" 
          v-model="venueOpenedAt"
          autocomplete="off"
        >
      </div>
    </div>

    <div v-if="submissionError" class="text-red-600 p-2 bg-red-100 rounded" role="alert" aria-live="assertive">{{ submissionError }}</div>

    <div class="flex space-x-4 justify-end">
      <button 
        type="button" 
        @click="cancelForm" 
        class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 focus-visible transition"
        :disabled="isSubmitting"
      >{{ $t('venueForm.cancelButton') }}</button>
      <button 
        type="submit" 
        class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 focus-visible transition"
        :disabled="isSubmitting"
        aria-busy="isSubmitting"
      >
        <span v-if="isSubmitting">{{ $t('venueForm.submitting') }}</span>
        <span v-else>{{ submitButtonText }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import Multiselect from 'vue-multiselect'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { fetchApi } = useApi()

const venueId = route.params.id
const organizerId = route.query.organizerId

const germanStates = ref([])
const countries = ref([])

// Reactive form data
const venueName = ref('')
const venueStreet = ref('')
const venueHouseNumber = ref('')
const venuePostalCode = ref('')
const venueCity = ref('')
const venueOrganizerId = ref(organizerId)
const venueOrganizerName = ref('')
const venueStateCode = ref('')
const venueCountryCode = ref('')
const venueLatitude = ref('')
const venueLongitude = ref('')
const venueOpenedAt = ref('')
const venueTypeId = ref([])
const selectedVenueTypes = ref([])
const venueTypes = ref([])
const organizers = ref([])

const errors = ref({})
const submissionError = ref('')
const statusMessage = ref('')
const submitButtonText = ref(t('venueForm.submitButton'))

const isLoading = ref(false)
const isSubmitting = ref(false)
const loadingMessage = ref('')

const updateStatusMessage = (message) => {
  statusMessage.value = message

  // Clear the message after screen readers have had time to announce it
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Function to get location data
const getLocationData = async () => {
  // Set loading state
  isLoading.value = true
  loadingMessage.value = t('venueForm.fetchingLocation')
  updateStatusMessage(t('venueForm.fetchingLocation'))

  const url = `https://nominatim.oklabflensburg.de/search?q=${venueStreet.value} ${venueHouseNumber.value} ${venueCity.value} ${venueStateCode.value} ${venuePostalCode.value}&limit=1`

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
      updateStatusMessage(t('venueForm.locationUpdated'))
    } else {
      updateStatusMessage(t('venueForm.noLocationFound'))
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    updateStatusMessage(t('venueForm.locationError'))
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Handler for browser autofill events
const handleAddressChange = (e) => {
  console.log('Address change detected', e?.target?.id)
  
  // Handle splitting street and house number
  if (e?.target?.id === 'venueStreet' && !venueHouseNumber.value) {
    const streetValue = e.target.value;
    // More permissive pattern for international addresses
    const matches = streetValue.match(/^(.*\D)\s*(\d+\s*[\w-]*)$/);
    
    if (matches && matches.length >= 3) {
      venueStreet.value = matches[1].trim();
      venueHouseNumber.value = matches[2].trim();
      updateStatusMessage(t('venueForm.addressAutofilled'));
    }
  }
  
  // Using setTimeout to ensure all fields have been autofilled before checking
  setTimeout(() => {
    // Check if we have the required fields for geocoding
    if (venueStreet.value && venueHouseNumber.value && venueCity.value) {
      console.log('Required address fields detected, fetching location')
      // Don't check for existing coordinates in edit mode - always update when address changes
      debouncedGetLocationData()
    }
  }, 300)  // Increased timeout to give more time for all fields to be filled
}

// Add debounce function to prevent too many API calls
const debounce = (fn, delay) => {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Create debounced version of getLocationData
const debouncedGetLocationData = debounce(getLocationData, 500)

// Watch for changes to the relevant input fields
watch([venueStreet, venueHouseNumber, venuePostalCode, venueCity], () => {
  // Only fetch location data if all required address fields are filled
  if (!venueStreet.value || !venueHouseNumber.value || !venueCity.value) {
    return
  }

  // Only skip in edit mode if we already have coordinates AND this is not a user-initiated change
  if (isModeEdit() && venueLatitude.value && venueLongitude.value && !userInitiatedAddressChange.value) {
    return
  }

  console.log('Address field watch triggered')
  debouncedGetLocationData()
})

// Track if address change was user-initiated
const userInitiatedAddressChange = ref(false)

// Variables to store cleanup functions
const cleanupFunctions = []

// Set up autofill detection with MutationObserver
const setupAutofillDetection = () => {
  const addressFields = [
    document.getElementById('venueStreet'),
    document.getElementById('venueHouseNumber'), 
    document.getElementById('venueCity'),
    document.getElementById('venuePostalCode')
  ]
  
  // Add event listener for Chrome/Safari/Firefox autofill
  const animationListeners = []
  
  addressFields.forEach(field => {
    if (field) {
      const listener = (e) => {
        if (e.animationName === 'onAutoFillStart' || 
            e.animationName === '-webkit-autofill') {
          console.log('Autofill detected via animation', e.target.id)
          handleAddressChange(e)
        }
      }
      
      field.addEventListener('animationstart', listener)
      animationListeners.push(() => field.removeEventListener('animationstart', listener))
    }
  })

  // Create MutationObserver for broader autofill detection
  const observer = new MutationObserver((mutations) => {
    let shouldCheckLocation = false
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' || 
          (mutation.type === 'characterData' && addressFields.includes(mutation.target))) {
        shouldCheckLocation = true
      }
    })
    
    if (shouldCheckLocation) {
      console.log('Autofill detected via MutationObserver')
      handleAddressChange()
    }
  })

  // Observe all address fields for changes
  addressFields.forEach(field => {
    if (field) {
      observer.observe(field, { 
        attributes: true, 
        characterData: true,
        childList: true,
        subtree: true
      })
    }
  })

  // Add input event listeners to detect manual changes
  const inputListeners = []
  const addressFieldIds = ['venueStreet', 'venueHouseNumber', 'venueCity', 'venuePostalCode']
  addressFieldIds.forEach(fieldId => {
    const element = document.getElementById(fieldId)
    if (element) {
      element.addEventListener('input', markAsUserChange)
      inputListeners.push(() => element.removeEventListener('input', markAsUserChange))
    }
  })

  return () => {
    // Cleanup function that removes all listeners and disconnects observer
    animationListeners.forEach(cleanup => cleanup())
    inputListeners.forEach(cleanup => cleanup())
    observer.disconnect()
  }
}

// CSS to detect autofill in various browsers
const addAutofillStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes onAutoFillStart { from {} to {} }
    @keyframes onAutoFillCancel { from {} to {} }
    input:-webkit-autofill { animation-name: onAutoFillStart; }
    input:not(:-webkit-autofill) { animation-name: onAutoFillCancel; }
  `
  document.head.appendChild(style)
  
  return () => {
    document.head.removeChild(style)
  }
}

// Register onUnmounted hook early in the setup function, before any async operations
onUnmounted(() => {
  // Clean up all registered cleanup functions
  cleanupFunctions.forEach(cleanup => {
    if (typeof cleanup === 'function') {
      cleanup()
    }
  })
})

onMounted(() => {
  loadGermanStates()
  loadCountries()
  loadOrganizers()
  loadVenueTypes()

  if (isModeEdit()) {
    // For edit mode, load venue types first, then load venue data
    // to ensure we can match venue types properly
    Promise.all([
      loadVenueTypes(),
      loadOrganizers(),
      loadGermanStates(),
      loadCountries()
    ]).then(() => {
      isLoading.value = true
      loadingMessage.value = t('venueForm.loadingVenueData')
      updateStatusMessage(t('venueForm.loadingVenueData'))
      
      loadVenueData(venueId).finally(() => {
        isLoading.value = false
        loadingMessage.value = ''
      })
    })
    submitButtonText.value = t('venueForm.saveChanges')
  } else {
    loadVenueTypes()
    loadOrganizers()
  }
  
  // Set up autofill detection after DOM is ready
  nextTick(() => {
    // Add autofill detection styles and store cleanup function
    const removeAutofillStyles = addAutofillStyles()
    cleanupFunctions.push(removeAutofillStyles)
    
    // Set up autofill detection and store cleanup function
    const cleanupAutofillDetection = setupAutofillDetection()
    cleanupFunctions.push(cleanupAutofillDetection)
  })
})

// When any address field is manually edited, mark as user-initiated change
const markAsUserChange = () => {
  userInitiatedAddressChange.value = true
  // Reset the flag after a delay
  setTimeout(() => {
    userInitiatedAddressChange.value = false
  }, 1000)
}

// Load organizers from API
const loadOrganizers = async () => {
  isLoading.value = true
  loadingMessage.value = t('venueForm.loadingOrganizers')
  updateStatusMessage(t('venueForm.loadingOrganizers'))
  
  try {
    const response = await fetchApi('/user/organizer/')
    organizers.value = response || []
    
    // Preselect organizer if organizerId is set in route query
    if (organizerId && organizerId.trim() !== '') {
      venueOrganizerId.value = organizerId
      venueOrganizerName.value = organizers.value.find(organizer => organizer.organizer_id === parseInt(organizerId, 10))?.organizer_name
    }
  } catch (error) {
    submissionError.value = t('venueForm.errors.loadOrganizers')
    updateStatusMessage(t('venueForm.errors.loadOrganizers'))
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Load venue types from API
const loadVenueTypes = async () => {
  isLoading.value = true
  loadingMessage.value = t('venueForm.loadingVenueTypes')
  updateStatusMessage(t('venueForm.loadingVenueTypes'))
  
  try {
    const response = await fetchApi('/venue/type/?lang=de')
    venueTypes.value = response || []
  } catch (error) {
    console.error('Failed to load venue types:', error)
    submissionError.value = t('venueForm.errors.loadVenueTypes')
    updateStatusMessage(t('venueForm.errors.loadVenueTypes'))
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Load states from API
const loadGermanStates = async () => {
  isLoading.value = true
  loadingMessage.value = t('venueForm.loadingStates')
  updateStatusMessage(t('venueForm.loadingStates'))
  
  try {
    const response = await fetchApi('/state/')
    germanStates.value = response || []
  } catch (error) {
    console.error('Failed to load states:', error)
    submissionError.value = t('venueForm.errors.loadStates')
    updateStatusMessage(t('venueForm.errors.loadStates'))
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Load countries from API
const loadCountries = async () => {
  isLoading.value = true
  loadingMessage.value = t('venueForm.loadingCountries')
  updateStatusMessage(t('venueForm.loadingCountries'))
  
  try {
    const response = await fetchApi(`/country/?lang=${locale.value}`)
    countries.value = response || []
  } catch (error) {
    console.error('Failed to load countries:', error)
    submissionError.value = t('venueForm.errors.loadCountries')
    updateStatusMessage(t('venueForm.errors.loadCountries'))
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
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
  validateField('venueCountryCode')
  validateField('venueLatitude')
  validateField('venueLongitude')
  
  // Focus first error field for better accessibility
  if (Object.keys(errors.value).length > 0) {
    const firstErrorField = Object.keys(errors.value)[0]
    nextTick(() => {
      document.getElementById(firstErrorField)?.focus()
      updateStatusMessage(t('venueForm.validationErrors') + ': ' + errors.value[firstErrorField])
    })
    return false
  }
  return true
}

const validateField = (field) => {
  const fields = {
    venueName,
    venueStreet,
    venueHouseNumber,
    venuePostalCode,
    venueCity,
    venueStateCode,
    venueCountryCode,
    venueLatitude,
    venueLongitude,
    venueTypeId
  }
  
  if (field === 'venueTypeId') {
    // Venue type is not required, so just clear any existing error
    delete errors.value[field]
  } else {
    if (!fields[field].value) {
      errors.value[field] = t(`venueForm.errors.${field}`)
    } else {
      delete errors.value[field]
    }
  }
}

const isModeEdit = () => {
  // must not be null or undefined
  return !!venueId
}

const loadVenueData = async (id) => {
  try {
    const response = await fetchApi(`/venue/${id}`)
    
    // Basic venue data
    venueName.value = response.venue_name
    venueStreet.value = response.venue_street
    venueHouseNumber.value = response.venue_house_number
    venuePostalCode.value = response.venue_postal_code
    venueCity.value = response.venue_city
    venueStateCode.value = response.venue_county_code || ''
    venueCountryCode.value = response.venue_country_code || ''
    venueLatitude.value = response.geojson?.coordinates?.[1] || ''
    venueLongitude.value = response.geojson?.coordinates?.[0] || ''
    venueOpenedAt.value = response.venue_opened_at || ''
    venueOrganizerId.value = response.venue_organizer_id
    
    // Properly pre-select venue types
    selectedVenueTypes.value = []
    if (response.venue_type_ids && Array.isArray(response.venue_type_ids)) {
      // Find matching venue type objects based on IDs
      const matchedVenueTypes = venueTypes.value.filter(
        venueType => response.venue_type_ids.includes(venueType.venue_type_id)
      )
      selectedVenueTypes.value = matchedVenueTypes
      
      // Update the venueTypeId array with the IDs
      updateVenueTypeIds()
    }
  } catch (error) {
    console.error('Error loading venue data:', error)
    submissionError.value = t('venueForm.errors.load')
    updateStatusMessage(t('venueForm.errors.load'))
  }
}

const handleSubmit = async () => {
  // Validate form fields before submitting
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  updateStatusMessage(t('venueForm.submitting'))

  // Create FormData object
  const formData = new FormData()
  console.log('venueOrganizerId.value', venueOrganizerId.value)
  formData.append('venue_organizer_id', venueOrganizerId.value)
  formData.append('venue_name', venueName.value)
  formData.append('venue_street', venueStreet.value)
  formData.append('venue_house_number', venueHouseNumber.value)
  formData.append('venue_postal_code', venuePostalCode.value)
  formData.append('venue_city', venueCity.value)
  
  if (venueStateCode.value) {
    formData.append('venue_county_code', venueStateCode.value)
  }
  
  formData.append('venue_country_code', venueCountryCode.value)
  formData.append('venue_latitude', venueLatitude.value)
  formData.append('venue_longitude', venueLongitude.value)
  
  if (venueOpenedAt.value) {
    formData.append('venue_opened_at', venueOpenedAt.value)
  }
  
  // Handle venue type IDs as an array
  venueTypeId.value.forEach(typeId => {
    formData.append('venue_type_ids', typeId)
  })

  try {
    console.log('Submitting form data using FormData:', isModeEdit() ? 'PUT' : 'POST')
    
    if (isModeEdit()) {
      await fetchApi(`/venue/${venueId}`, {
        method: 'PUT',
        body: formData,
      })

      updateStatusMessage(t('venueForm.success'))
      router.push(localePath('/dashboard'))
      return
    } else {
      await fetchApi('/venue/', {
        method: 'POST',
        body: formData,
      })

      updateStatusMessage(t('venueForm.success'))
      router.push(localePath('/dashboard'))
    }
  } catch (error) {
    console.error('Form submission error:', error)
    submissionError.value = t('venueForm.errors.submission')
    updateStatusMessage(t('venueForm.errors.submission'))
    // On error, focus the error message for screen readers
    nextTick(() => {
      const errorElement = document.querySelector('[role="alert"]')
      if (errorElement) errorElement.focus()
    })
  } finally {
    isSubmitting.value = false
  }
}

const cancelForm = () => {
  router.push(localePath('/dashboard'))
}

const onVenueTypeSelect = (selected) => {
  updateVenueTypeIds()
  validateField('venueTypeId')
}

const onVenueTypeRemove = (removed) => {
  updateVenueTypeIds()
  validateField('venueTypeId')
}

const updateVenueTypeIds = () => {
  if (selectedVenueTypes.value && Array.isArray(selectedVenueTypes.value)) {
    venueTypeId.value = selectedVenueTypes.value
      .filter(type => type && type.venue_type_id)
      .map(type => type.venue_type_id.toString())
  } else {
    venueTypeId.value = []
  }
}
</script>

<style>
@import 'vue-multiselect/dist/vue-multiselect.css';

/* Custom styles for multiselect to match your design */
.multiselect {
  border-radius: 0.125rem;
}
.multiselect__tags {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.125rem;
  min-height: 42px;
  height: auto;
}
.multiselect__select {
  height: 42px;
}
.multiselect__input, .multiselect__single {
  padding: 0;
  margin-bottom: 0;
}
.multiselect--active {
  z-index: 50;
}
.multiselect__tag {
  background-color: #10b981;
  margin-bottom: 3px;
}
.multiselect__tag-icon:after {
  color: white;
}
.multiselect__tag-icon:focus, .multiselect__tag-icon:hover {
  background-color: #059669;
}

/* CSS to help detect autofill */
input:-webkit-autofill {
  -webkit-animation-name: onAutoFillStart;
  animation-name: onAutoFillStart;
}

input:not(:-webkit-autofill) {
  -webkit-animation-name: onAutoFillCancel;
  animation-name: onAutoFillCancel;
}

@-webkit-keyframes onAutoFillStart { from {} to {} }
@keyframes onAutoFillStart { from {} to {} }
@-webkit-keyframes onAutoFillCancel { from {} to {} }
@keyframes onAutoFillCancel { from {} to {} }
</style>