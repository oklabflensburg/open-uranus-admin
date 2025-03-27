<template>
  <form id="venueSpaceForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="venueSpaceFormTitle">
    <h2 id="venueSpaceFormTitle" class="text-2xl font-bold mb-4">{{ $t('venueSpaceForm.title') }}</h2>

    <!-- Accessibility status message for screen readers -->
    <div class="sr-only" aria-live="polite" role="status">{{ statusMessage }}</div>
    
    <!-- Name -->
    <div>
      <label class="block text-gray-700" for="name">{{ $t('venueSpaceForm.name') }}</label>
      <input type="text" id="name" v-model="name" class="mt-1 p-2 w-full border rounded" @input="validateField('name')" aria-describedby="nameError">
      <p v-if="errors.name" id="nameError" class="text-red-600">{{ errors.name }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Total Capacity -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="totalCapacity">{{ $t('venueSpaceForm.totalCapacity') }}</label>
        <input type="number" id="totalCapacity" v-model="totalCapacity" class="mt-1 p-2 w-full border rounded" aria-describedby="totalCapacityError">
        <p v-if="errors.totalCapacity" id="totalCapacityError" class="text-red-600">{{ errors.totalCapacity }}</p>
      </div>

      <!-- Seating Capacity -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="seatingCapacity">{{ $t('venueSpaceForm.seatingCapacity') }}</label>
        <input type="number" id="seatingCapacity" v-model="seatingCapacity" class="mt-1 p-2 w-full border rounded" aria-describedby="seatingCapacityError">
        <p v-if="errors.seatingCapacity" id="seatingCapacityError" class="text-red-600">{{ errors.seatingCapacity }}</p>
      </div>

      <!-- Building Level -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="buildingLevel">{{ $t('venueSpaceForm.buildingLevel') }}</label>
        <input type="number" id="buildingLevel" v-model="buildingLevel" class="mt-1 p-2 w-full border rounded" aria-describedby="buildingLevelError">
        <p v-if="errors.buildingLevel" id="buildingLevelError" class="text-red-600">{{ errors.buildingLevel }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Space Type -->
      <div class="col-span-12 sm:col-span-6">
        <label class="block text-gray-700" for="spaceType">{{ $t('venueSpaceForm.spaceType') }}</label>
        <select id="spaceType" v-model="spaceTypeId" class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" aria-describedby="spaceTypeError">
          <option value="">{{ $t('venueSpaceForm.selectOption') }}</option>
          <option v-for="type in spaceTypes" :key="type.id" :value="type.id">
            {{ type.space_type_name }}
          </option>
        </select>
        <p v-if="errors.spaceTypeId" id="spaceTypeError" class="text-red-600">{{ errors.spaceTypeId }}</p>
      </div>

      <!-- Venue Selection -->
      <div class="col-span-12 sm:col-span-6">
        <label class="block text-gray-700" for="venue">{{ $t('venueSpaceForm.venue') }}</label>
        <select id="venue" v-model="selectedVenue" class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" @change="validateField('selectedVenue')" aria-describedby="selectedVenueError">
          <option value="">{{ $t('venueSpaceForm.selectOption') }}</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.selectedVenue" id="selectedVenueError" class="text-red-600">{{ errors.selectedVenue }}</p>
      </div> 
    </div>

    <!-- Website -->
    <div>
      <label class="block text-gray-700" for="url">{{ $t('venueSpaceForm.websiteUrl') }}</label>
      <input type="text" id="url" v-model="url" class="mt-1 p-2 w-full border rounded" aria-describedby="urlError">
      <p v-if="errors.url" id="urlError" class="text-red-600">{{ errors.url }}</p>
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
import { ref, onMounted, nextTick } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const route = useRoute()
const router = useRouter()

const venueId = route.params.id

// Form Data
const name = ref('')
const totalCapacity = ref(null)
const seatingCapacity = ref(null)
const spaceTypeId = ref('')
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

const validateField = (field) => {
  const fields = {
    name,
    totalCapacity,
    seatingCapacity,
    spaceTypeId,
    buildingLevel,
    url,
    selectedVenue
  }
  
  if (!fields[field].value) {
    errors.value[field] = t(`venueSpaceForm.errors.${field}`)
  } else {
    delete errors.value[field]
  }
}

const validateForm = () => {
  errors.value = {}
  validateField('name')
  validateField('selectedVenue')
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

const updateStatusMessage = (message) => {
  statusMessage.value = message

  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Handle Form Submission
const handleSubmit = async () => {
  validateForm()
  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  updateStatusMessage(t('venueSpaceForm.submitting'))

  const bodyData = {
    space_name: name.value,
    space_total_capacity: totalCapacity.value || null,
    space_seating_capacity: seatingCapacity.value || null,
    space_type_id: parseInt(spaceTypeId.value, 10) || null,
    space_building_level: buildingLevel.value || null,
    space_url: url.value,
    space_venue_id: parseInt(selectedVenue.value, 10)
  }

  try {
    const { fetchApi } = useApi()
    await fetchApi('/space/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    })
    
    updateStatusMessage(t('venueSpaceForm.success'))
    router.push('/dashboard')
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
  router.push('/dashboard')
}

onMounted(() => {
  fetchData('/user/venue/', venues)
  fetchData(`/space/type/?lang=${locale.value}`, spaceTypes)

  if (venueId) {
    // Preselect the option if venueId is provided
    selectedVenue.value = venueId
    updateStatusMessage(t('venueSpaceForm.venuePrefilled'))
  }
  
  // Set initial focus to the first form field for better keyboard navigation
  nextTick(() => {
    document.getElementById('name')?.focus()
  })
})
</script>