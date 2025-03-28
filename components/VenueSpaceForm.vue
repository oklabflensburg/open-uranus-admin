<template>
  <form id="venueSpaceForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="venueSpaceFormTitle">
    <h2 id="venueSpaceFormTitle" class="text-2xl font-bold mb-4">{{ $t('venueSpaceForm.title') }}</h2>

    <!-- Accessibility status message for screen readers -->
    <div class="sr-only" aria-live="polite" role="status">{{ statusMessage }}</div>
    
    <!-- Visual status message for sighted users -->
    <div v-if="statusMessage" class="p-2 bg-blue-50 border border-blue-200 rounded mb-4 transition-opacity" :class="{'opacity-100': statusMessage, 'opacity-0': !statusMessage}">
      {{ statusMessage }}
    </div>
    
    <!-- Name -->
    <div>
      <label class="block text-gray-700" for="name">{{ $t('venueSpaceForm.name') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">{{ $t('venueSpaceForm.required') }}</span></label>
      <input 
        type="text" 
        id="name" 
        v-model="name" 
        class="mt-1 p-2 w-full border rounded" 
        @input="validateField('name')" 
        aria-describedby="nameError" 
        aria-required="true"
        :aria-invalid="!!errors.name">
      <p v-if="errors.name" id="nameError" class="text-red-600" role="alert">{{ errors.name }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Total Capacity -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="totalCapacity">{{ $t('venueSpaceForm.totalCapacity') }}</label>
        <input 
          type="number" 
          id="totalCapacity" 
          v-model="totalCapacity" 
          class="mt-1 p-2 w-full border rounded" 
          @input="validateField('totalCapacity')" 
          aria-describedby="totalCapacityError"
          :aria-invalid="!!errors.totalCapacity">
        <p v-if="errors.totalCapacity" id="totalCapacityError" class="text-red-600" role="alert">{{ errors.totalCapacity }}</p>
      </div>

      <!-- Seating Capacity -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="seatingCapacity">{{ $t('venueSpaceForm.seatingCapacity') }}</label>
        <input 
          type="number" 
          id="seatingCapacity" 
          v-model="seatingCapacity" 
          class="mt-1 p-2 w-full border rounded" 
          @input="validateField('seatingCapacity')" 
          aria-describedby="seatingCapacityError"
          :aria-invalid="!!errors.seatingCapacity">
        <p v-if="errors.seatingCapacity" id="seatingCapacityError" class="text-red-600" role="alert">{{ errors.seatingCapacity }}</p>
      </div>

      <!-- Building Level -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="buildingLevel">{{ $t('venueSpaceForm.buildingLevel') }}</label>
        <input 
          type="number" 
          id="buildingLevel" 
          v-model="buildingLevel" 
          class="mt-1 p-2 w-full border rounded" 
          @input="validateField('buildingLevel')" 
          aria-describedby="buildingLevelError"
          :aria-invalid="!!errors.buildingLevel">
        <p v-if="errors.buildingLevel" id="buildingLevelError" class="text-red-600" role="alert">{{ errors.buildingLevel }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Space Type -->
      <div class="col-span-12 sm:col-span-6">
        <label class="block text-gray-700" for="spaceType">{{ $t('venueSpaceForm.spaceType') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">{{ $t('venueSpaceForm.required') }}</span></label>
        <select 
          id="spaceType" 
          v-model="selectedSpaceType" 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          @change="validateField('selectedSpaceType')"
          aria-describedby="spaceTypeError"
          aria-required="true"
          :aria-invalid="!!errors.selectedSpaceType">
          <option value="">{{ $t('venueSpaceForm.selectOption') }}</option>
          <option v-for="spaceType in spaceTypes" :key="spaceType.space_type_id" :value="spaceType.space_type_id">
            {{ spaceType.space_type_name }}
          </option>
        </select>
        <p v-if="errors.selectedSpaceType" id="spaceTypeError" class="text-red-600" role="alert">{{ errors.selectedSpaceType }}</p>
      </div>

      <!-- Venue Selection -->
      <div class="col-span-12 sm:col-span-6">
        <label class="block text-gray-700" for="venue">{{ $t('venueSpaceForm.venue') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">{{ $t('venueSpaceForm.required') }}</span></label>
        <select 
          id="venue" 
          v-model="selectedVenue" 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          @change="validateField('selectedVenue')" 
          aria-describedby="selectedVenueError"
          aria-required="true"
          :aria-invalid="!!errors.selectedVenue">
          <option value="">{{ $t('venueSpaceForm.selectOption') }}</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.selectedVenue" id="selectedVenueError" class="text-red-600" role="alert">{{ errors.selectedVenue }}</p>
      </div> 
    </div>

    <!-- Website -->
    <div>
      <label class="block text-gray-700" for="url">{{ $t('venueSpaceForm.websiteUrl') }}</label>
      <input 
        type="text" 
        id="url" 
        v-model="url" 
        class="mt-1 p-2 w-full border rounded" 
        @input="validateField('url')" 
        @blur="handleUrlBlur"
        aria-describedby="urlError urlHint"
        :aria-invalid="!!errors.url"
        placeholder="www.example.com">
      <p v-if="errors.url" id="urlError" class="text-red-600" role="alert">{{ errors.url }}</p>
      <p id="urlHint" class="text-gray-500 text-sm">{{ $t('venueSpaceForm.websiteUrlHint') || 'https:// will be added automatically if not provided' }}</p>
    </div>

    <div class="flex space-x-4 justify-end">
      <button type="button" @click="cancelForm" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition">{{ $t('venueSpaceForm.cancelButton') }}</button>
      <button
        type="submit" 
        class="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
        :disabled="isSubmitting"
        aria-busy="isSubmitting"
      >
        {{ submitButtonText }}
      </button>
    </div>
    
    <div v-if="submissionError" class="text-red-600 p-3 border border-red-300 bg-red-50 rounded" role="alert" aria-live="assertive">{{ submissionError }}</div>
  </form>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const route = useRoute()
const router = useRouter()

const venueId = route.query.venueId
const spaceId = route.params.id

// Form Data
const name = ref('')
const totalCapacity = ref(null)
const seatingCapacity = ref(null)
const selectedSpaceType = ref('')
const buildingLevel = ref(null)
const url = ref('')
const selectedVenue = ref('')

// Data Sources
const venues = ref([])
const spaceTypes = ref([])

// Validation
const errors = ref({})
const isSubmitting = ref(false)
const submissionError = ref('')
const statusMessage = ref('')
const submitButtonText = ref(t('venueSpaceForm.submitButton'))
const statusMessageTimeout = ref(null)

const validateField = (field) => {
  const fields = {
    name,
    totalCapacity,
    seatingCapacity,
    selectedSpaceType,
    buildingLevel,
    url,
    selectedVenue
  }
  
  if (field === 'name' && !fields[field].value) {
    errors.value[field] = t(`venueSpaceForm.errors.${field}`)
  } else if (field === 'selectedVenue' && !fields[field].value) {
    errors.value[field] = t(`venueSpaceForm.errors.${field}`)
  } else if (field === 'selectedSpaceType' && !fields[field].value) {
    errors.value[field] = t(`venueSpaceForm.errors.${field}`)
  } else if (field === 'url' && fields[field].value && !validateUrl(fields[field].value)) {
    errors.value[field] = t('venueSpaceForm.errors.invalidUrl')
  } else if ((field === 'totalCapacity' || field === 'seatingCapacity' || field === 'buildingLevel') && 
             fields[field].value !== null && fields[field].value < 0) {
    errors.value[field] = t(`venueSpaceForm.errors.negativeNumber`)
  } else {
    delete errors.value[field]
  }
}

const validateForm = () => {
  errors.value = {}
  
  // Validate required fields
  validateField('name')
  validateField('selectedVenue')
  validateField('selectedSpaceType')
  
  // Validate optional fields if they have values
  if (url.value) validateField('url')
  if (totalCapacity.value !== null) validateField('totalCapacity')
  if (seatingCapacity.value !== null) validateField('seatingCapacity')
  if (buildingLevel.value !== null) validateField('buildingLevel')
  
  // Focus first error field for better accessibility
  if (Object.keys(errors.value).length > 0) {
    const firstErrorField = Object.keys(errors.value)[0]
    nextTick(() => {
      document.getElementById(firstErrorField)?.focus()
      updateStatusMessage(t('venueSpaceForm.validationErrors'))
    })
  }
}

const validateUrl = (url) => {
  if (!url) return true
  
  // Add https:// prefix if not present
  let urlToCheck = url
  if (!/^https?:\/\//i.test(urlToCheck)) {
    urlToCheck = 'https://' + urlToCheck
  }
  
  try {
    new URL(urlToCheck)
    return true
  } catch (e) {
    return false
  }
}

const handleUrlBlur = () => {
  if (url.value && !/^https?:\/\//i.test(url.value)) {
    url.value = 'https://' + url.value
    validateField('url')
  }
}

const updateStatusMessage = (message) => {
  if (!message) return

  statusMessage.value = message
  
  if (statusMessageTimeout.value) {
    clearTimeout(statusMessageTimeout.value)
  }

  statusMessageTimeout.value = setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

onUnmounted(() => {
  if (statusMessageTimeout.value) {
    clearTimeout(statusMessageTimeout.value)
  }
})

const isModeEdit = () => {
  return !!spaceId
}

const loadSpaceData = async (id) => {
  try {
    const { fetchApi } = useApi()
    const data = await fetchApi(`/space/${id}`)
    
    name.value = data.space_name
    totalCapacity.value = data.space_total_capacity
    seatingCapacity.value = data.space_seating_capacity
    selectedSpaceType.value = data.space_type_id
    buildingLevel.value = data.space_building_level
    url.value = data.space_url
    selectedVenue.value = data.space_venue_id

    updateStatusMessage(t('venueSpaceForm.dataLoaded'))
  } catch (error) {
    console.error('Error loading space data:', error)
    submissionError.value = t('venueSpaceForm.errors.load')
    updateStatusMessage(t('venueSpaceForm.errors.load'))
  }
}

const handleSubmit = async () => {
  validateForm()
  if (Object.keys(errors.value).length > 0) return

  // Ensure website URL has https:// prefix before submission
  if (url.value && !/^https?:\/\//i.test(url.value)) {
    url.value = 'https://' + url.value
  }

  isSubmitting.value = true
  updateStatusMessage(t('venueSpaceForm.submitting'))

  const bodyData = {
    space_name: name.value,
    space_total_capacity: totalCapacity.value,
    space_seating_capacity: seatingCapacity.value,
    space_type_id: selectedSpaceType.value,
    space_building_level: buildingLevel.value,
    space_url: url.value,
    space_venue_id: parseInt(selectedVenue.value)
  }

  console.log('Submitting form with data:', bodyData)

  try {
    const { fetchApi } = useApi()
    
    if (isModeEdit()) {
      // Update existing space
      await fetchApi(`/space/${spaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
    } else {
      // Create new space
      await fetchApi('/space/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
    }
    
    updateStatusMessage(t('venueSpaceForm.success'))
    router.push(localePath('/dashboard'))
  } catch (error) {
    console.error('Error submitting form:', error)
    submissionError.value = t('venueSpaceForm.errors.submission')
    updateStatusMessage(t('venueSpaceForm.errors.submission'))
    
    // Focus the error message for screen readers
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

// Fetch Venues & SpaceTypes
const fetchData = async (url, targetArray) => {
  try {
    const { fetchApi } = useApi()
    const data = await fetchApi(url)
    targetArray.value = data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
  }
}

onMounted(() => {
  fetchData('/user/venue/', venues)
  fetchData(`/space/type/?lang=${locale.value}`, spaceTypes)

  if (isModeEdit()) {
    loadSpaceData(spaceId)
    submitButtonText.value = t('venueSpaceForm.updateButton')
  } else if (venueId) {
    // Preselect the venue option if venueId is provided (create mode with preselected venue)
    selectedVenue.value = venueId.toString()
    // Clear any validation errors for the venue field
    delete errors.value.selectedVenue
    updateStatusMessage(t('venueSpaceForm.venuePrefilled'))
  }
  
  // Set initial focus to the first form field for better keyboard navigation
  nextTick(() => {
    document.getElementById('name')?.focus()
  })
})
</script>