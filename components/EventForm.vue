<template>
  <form id="eventForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="eventFormTitle">
    <h2 id="eventFormTitle" class="text-2xl font-bold mb-4">{{ $t('eventForm.title') }}</h2>

    <!-- Accessibility status message for screen readers -->
    <div class="sr-only" aria-live="polite" role="status">{{ statusMessage }}</div>

    <div>
      <label class="block text-gray-700" for="eventTitle">{{ $t('eventForm.eventTitle') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
      <input 
        type="text" 
        id="eventTitle" 
        name="eventTitle" 
        class="mt-1 p-2 w-full border rounded-xs focus-visible" 
        v-model="eventTitle" 
        @input="validateField('eventTitle')" 
        aria-describedby="eventTitleError"
        aria-required="true"
        :aria-invalid="!!errors.eventTitle"
      >
      <p v-if="errors.eventTitle" id="eventTitleError" class="text-red-600">{{ errors.eventTitle }}</p>
    </div>
    
    <div>
      <label class="block text-gray-700" for="eventDescription">{{ $t('eventForm.eventDescription') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
      <textarea 
        id="eventDescription" 
        name="eventDescription" 
        rows="4" 
        class="mt-1 p-2 w-full border rounded-xs focus-visible" 
        v-model="eventDescription" 
        @input="validateField('eventDescription')"
        aria-describedby="eventDescriptionError"
        aria-required="true"
        :aria-invalid="!!errors.eventDescription"
      ></textarea>
      <p v-if="errors.eventDescription" id="eventDescriptionError" class="text-red-600">{{ errors.eventDescription }}</p>
    </div>

    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <label for="eventType">{{ $t('eventForm.eventType') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
      <select 
        class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
        id="eventType" 
        v-model="selectedEventTypes" 
        multiple 
        :disabled="eventTypes.length === 0" 
        @change="validateField('selectedEventTypes')"
        aria-describedby="selectedEventTypesError"
        aria-required="true"
        :aria-invalid="!!errors.selectedEventTypes"
      >
        <option v-if="eventTypes.length === 0" value="" selected>---</option>
        <option v-for="eventType in eventTypes" :key="eventType.id" :value="eventType.event_type_id">
          {{ eventType.event_type_name }}
        </option>
      </select>
      <p v-if="errors.selectedEventTypes" id="selectedEventTypesError" class="text-red-600">{{ errors.selectedEventTypes }}</p>
    </div>

    <EventDateFields
      :event-date-start="eventDateStart"
      @update:event-date-start="eventDateStart = $event"
      :event-date-end="eventDateEnd"
      @update:event-date-end="eventDateEnd = $event"
      :entry-time="entryTime"
      @update:entry-time="entryTime = $event"
      :errors="errors"
      @validate-field="validateField"
    />

    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="organizer">{{ $t('eventForm.organizer') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
          id="organizer" 
          v-model="selectedOrganizer" 
          @change="validateField('selectedOrganizer')"
          aria-describedby="selectedOrganizerError"
          aria-required="true"
          :aria-invalid="!!errors.selectedOrganizer"
        >
          <option value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="organizer in organizers" :key="organizer.organizer_id" :value="organizer.organizer_id">
            {{ organizer.organizer_name }}
          </option>
        </select>
        <p v-if="errors.selectedOrganizer" id="selectedOrganizerError" class="text-red-600">{{ errors.selectedOrganizer }}</p>
      </div>

      <!-- Venue ID -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="venue">{{ $t('eventForm.venue') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
          id="venue" 
          v-model="selectedVenue" 
          @change="validateField('selectedVenue')"
          aria-describedby="selectedVenueError"
          aria-required="true"
          :aria-invalid="!!errors.selectedVenue"
        >
          <option value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.selectedVenue" id="selectedVenueError" class="text-red-600">{{ errors.selectedVenue }}</p>
      </div>

      <!-- Space -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="space">{{ $t('eventForm.space') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span></label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
          id="space" 
          v-model="selectedSpace" 
          :disabled="spaces.length === 0" 
          @change="validateField('selectedSpace')"
          aria-describedby="selectedSpaceError"
          aria-required="true"
          :aria-invalid="!!errors.selectedSpace"
        >
          <option value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="space in spaces" :key="space.space_id" :value="space.space_id">
            {{ space.space_name }}
          </option>
        </select>
        <p v-if="errors.selectedSpace" id="selectedSpaceError" class="text-red-600">{{ errors.selectedSpace }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="genreType">{{ $t('eventForm.genreType') }}</label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
          id="genreType" 
          v-model="selectedGenreTypes"
          multiple
          :disabled="genreTypes.length === 0" 
          @change="validateField('selectedGenreTypes')"
          aria-describedby="selectedGenreTypesError"
          :aria-invalid="!!errors.selectedGenreTypes"
        >
          <option v-if="genreTypes.length === 0" value="" selected>---</option>
          <option v-else value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="genreType in genreTypes" :key="genreType.genre_type_id" :value="genreType.genre_type_id">
            {{ genreType.genre_type_name }}
          </option>
        </select>
        <p v-if="errors.selectedGenreTypes" id="selectedGenreTypesError" class="text-red-600">{{ errors.selectedGenreTypes }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="licenseType">{{ $t('eventForm.licenseType') }}</label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
          id="licenseType" 
          v-model="selectedLicenseType" 
          :disabled="licenseTypes.length === 0" 
          @change="validateField('selectedLicenseType')"
          aria-describedby="selectedLicenseTypeError"
          :aria-invalid="!!errors.selectedLicenseType"
        >
          <option v-if="licenseTypes.length === 0" value="" selected>---</option>
          <option v-else value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="licenseType in licenseTypes" :key="licenseType.id" :value="licenseType.id">
            {{ licenseType.license_type_name }}
          </option>
        </select>
        <p v-if="errors.selectedLicenseType" id="selectedLicenseTypeError" class="text-red-600">{{ errors.selectedLicenseType }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="imageType">{{ $t('eventForm.imageType') }}</label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus-visible" 
          id="imageType" 
          v-model="selectedImageType" 
          :disabled="imageTypes.length === 0" 
          @change="validateField('selectedImageType')"
          aria-describedby="selectedImageTypeError"
          :aria-invalid="!!errors.selectedImageType"
        >
          <option v-if="imageTypes.length === 0" value="" selected>---</option>
          <option v-else value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="imageType in imageTypes" :key="imageType.id" :value="imageType.id">
            {{ imageType.image_type_name }}
          </option>
        </select>
        <p v-if="errors.selectedImageType" id="selectedImageTypeError" class="text-red-600">{{ errors.selectedImageType }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="eventImage">{{ $t('eventForm.selectImage') }}</label>
        <div class="relative mt-1">
          <input 
            type="file" 
            id="eventImage"
            class="sr-only absolute"
            ref="fileInput"
            @change="onFileChange" 
            accept="image/*" 
            aria-describedby="fileError"
            :aria-invalid="!!errors.file"
          >
          <button 
            type="button" 
            class="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            @click="$refs.fileInput.click()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ file?.name || $t('eventForm.selectImage') }}</span>
          </button>
          <p v-if="errors.file" id="fileError" class="text-red-600 mt-1">{{ errors.file }}</p>
          <div v-if="previewUrl" class="mt-2">
            <img :src="previewUrl" alt="Preview" class="h-32 w-auto object-contain border rounded" />
            <button 
              type="button" 
              class="mt-2 px-3 py-1 bg-red-500 text-white rounded-xs hover:bg-red-700 focus-visible transition flex items-center"
              @click="removeFile"
              aria-label="Remove selected image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ $t('eventForm.removeImage', 'Remove') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="submissionError" class="text-red-600" aria-live="assertive">{{ submissionError }}</div>

    <div class="flex space-x-4 justify-end">
      <button type="button" @click="cancelForm" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 focus-visible transition">{{ $t('eventForm.cancelButton') }}</button>
      <button type="submit" id="addEventButton" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 focus-visible transition">{{ submitButtonText }}</button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRouter, useLocalePath } from '#imports'
import EventDateFields from './EventDateFields.vue'

const { fetchApi } = useApi()

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const { t, locale } = useI18n()

// Read venueId from query parameters
const venueId = route.query.venueId
const updteEvent = route.query.update
const eventDateId = route.params.id

const eventTitle = ref('')
const eventDescription = ref('')
const eventDateStart = ref('')
const eventDateEnd = ref('')
const entryTime = ref('')
const errors = ref({})
const submissionError = ref('')
const statusMessage = ref('')
const submitButtonText = ref(t('eventForm.submitButton'))

// Define reactive variables for dropdowns
const organizers = ref([])
const venues = ref([])
const imageTypes = ref([])
const eventTypes = ref([])
const licenseTypes = ref([])
const genreTypes = ref([])
const spaces = ref([])

// Image upload
const file = ref(null)
const previewUrl = ref('')

// Selected values
const selectedEventTypes = ref([])
const selectedOrganizer = ref('')
const selectedGenreTypes = ref('')
const selectedLicenseType = ref('')
const selectedImageType = ref('')
const selectedVenue = ref(venueId || '')
const selectedSpace = ref('')

// Add this with your other refs
const isInitialLoad = ref(true)

const updateStatusMessage = (message) => {
  statusMessage.value = message

  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

const fetchData = async (url, targetArray) => {
  try {
    const data = await fetchApi(url)
    targetArray.value = data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    updateStatusMessage(t('eventForm.errors.fetchingData'))
  }
}

// Fetch spaces based on selected venue
const fetchSpaces = async (id) => {
  if (selectedVenue.value) {
    try {
      const url = `/space/venue/${id}`
      if (!isInitialLoad.value) {
        selectedSpace.value = ''
      }
      const data = await fetchApi(url)
      spaces.value = data
    } catch (error) {
      console.error(`Error fetching spaces:`, error)
      updateStatusMessage(t('eventForm.errors.fetchingData'))
      spaces.value = []
    }
  } else {
    spaces.value = []
    selectedSpace.value = ''
  }
}

watch(selectedVenue, (newVenueId) => {
  if (newVenueId) {
    fetchSpaces(newVenueId)
  } else {
    spaces.value = []
    selectedSpace.value = ''
  }
})

const onFileChange = (event) => {
  try {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      file.value = selectedFile
      previewUrl.value = URL.createObjectURL(selectedFile)
    }
  } catch (error) {
    console.error('Error handling file change:', error)
    errors.value.file = t('eventForm.errors.fileUpload')
  }
}

// New function to remove the selected file
const removeFile = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value) // Clean up the object URL
  }
  file.value = null
  previewUrl.value = ''
  // Reset the file input so the same file can be selected again if needed
  const fileInputElement = document.getElementById('eventImage')
  if (fileInputElement) {
    fileInputElement.value = ''
  }
  updateStatusMessage(t('eventForm.imageRemoved', 'Image removed'))
}

const validateForm = () => {
  errors.value = {}
  
  const requiredFields = [
    'eventTitle',
    'eventDescription',
    'eventDateStart',
    'selectedOrganizer',
    'selectedVenue',
    'selectedEventTypes',
    'selectedSpace'
  ]

  requiredFields.forEach(field => {
    validateField(field, true)
  })

  // Focus first error field for better accessibility
  if (Object.keys(errors.value).length > 0) {
    const firstErrorField = Object.keys(errors.value)[0]
    nextTick(() => {
      document.getElementById(firstErrorField)?.focus()
      updateStatusMessage(t('eventForm.validationErrors'))
    })
  }
}

// Update validateField to handle required fields
const validateField = (field, required = false) => {
  const fields = {
    eventTitle,
    eventDescription,
    eventDateStart,
    selectedOrganizer,
    selectedVenue,
    selectedSpace,
    selectedEventTypes,
    selectedGenreTypes,
    selectedLicenseType,
    selectedImageType
  }
  
  // Only validate if field is required or we're doing form-wide validation
  if (required && (!fields[field]?.value || fields[field]?.value.length === 0)) {
    errors.value[field] = t(`eventForm.errors.${field}`)
  } else {
    // Always clear errors when field is valid or not required
    delete errors.value[field]
  }
}

const isModeEdit = () => {
  return !!eventDateId
}

const handleSubmit = async () => {
  try {
    validateForm()

    // Ensure all required fields are present
    if (Object.keys(errors.value).length > 0) {
      return
    }

    updateStatusMessage(t('eventForm.submitting'))

    const formData = new FormData();

    if (file.value) {
      formData.append('file', file.value);
    }

    formData.append('event_title', eventTitle.value)
    formData.append('event_description', eventDescription.value)

    if (eventDateStart.value) {
      formData.append('event_date_start', eventDateStart.value)
    }
    if (eventDateEnd.value) {
      formData.append('event_date_end', eventDateEnd.value)
    }
    if (entryTime.value) {
      formData.append('event_entry_time', entryTime.value)
    }

    if (selectedLicenseType.value) {
      formData.append('event_image_license_type_id', parseInt(selectedLicenseType.value));
    }

    if (selectedImageType.value) {
      formData.append('event_image_type_id', parseInt(selectedImageType.value));
    }

    if (selectedOrganizer.value) {
      formData.append('event_organizer_id', parseInt(selectedOrganizer.value));
    }

    if (selectedVenue.value) {
      formData.append('event_venue_id', parseInt(selectedVenue.value));
    }

    if (selectedSpace.value) {
      formData.append('event_space_id', parseInt(selectedSpace.value));
    }

    selectedEventTypes.value.forEach(eventType => {
      formData.append('event_type_id', parseInt(eventType))
    })

    selectedGenreTypes.value.forEach(genreType => {
      formData.append('event_genre_type_id', parseInt(genreType))
    })

    console.log('formData:', formData)

    try {
      await fetchApi(`/event/${isModeEdit() ? parseInt(eventDateId) : ''}`, {
        method: isModeEdit() ? 'PUT' : 'POST',
        body: formData,
      })

      updateStatusMessage(t('eventForm.success'))
      // router.push(localePath('/dashboard'))
    } catch (error) {
      console.error('Error sending data:', error)
      submissionError.value = t('eventForm.errors.submission')
      updateStatusMessage(t('eventForm.errors.submission'))
    }
  } catch (error) {
    console.error('Error in handleSubmit:', error)
    submissionError.value = t('eventForm.errors.submission')
    updateStatusMessage(t('eventForm.errors.submission'))
  }
}

const cancelForm = () => {
  router.push(localePath('/dashboard'))
}

// Fetch event data for editing
const fetchEventData = async () => {
  if (eventDateId) {
    try {
      const eventData = await fetchApi(`/event/${parseInt(eventDateId)}?lang=${locale.value}`)

      eventTitle.value = eventData.event_title || ''
      eventDescription.value = eventData.event_description || ''
      eventDateStart.value = eventData.event_date_start || ''
      eventDateEnd.value = eventData.event_date_end || ''
      entryTime.value = eventData.event_entry_time || ''
      selectedOrganizer.value = eventData.event_organizer_id || ''
      selectedVenue.value = eventData.event_venue_id || ''
      selectedSpace.value = eventData.event_space_id || ''
      selectedEventTypes.value = []
      if (eventData.event_type_ids && Array.isArray(eventData.event_type_ids)) {
        eventData.event_type_ids.forEach(eventTypeId => {
          selectedEventTypes.value.push(eventTypeId)
        })
      }
      selectedGenreTypes.value = eventData.event_genre_type_ids || ''
      if (eventData.event_genre_type_ids && Array.isArray(eventData.event_genre_type_ids)) {
        eventData.event_genre_type_ids.forEach(genreTypeId => {
          selectedGenreTypes.value.push(genreTypeId)
        })
      } 
      selectedLicenseType.value = eventData.event_image_license_type_id || ''
      selectedImageType.value = eventData.event_image_type_id || ''
      
      if (isModeEdit()) {
        submitButtonText.value = t('eventForm.updateButton')
      }
    } catch (error) {
      console.error('Error fetching event data:', error)
      submissionError.value = t('eventForm.errors.load')
      updateStatusMessage(t('eventForm.errors.load'))
    }
  }
}

// Fetch organizers, venues, and event data when component is mounted
onMounted(() => {
  fetchData('/user/organizer/', organizers)
  fetchData(`/genre/type/?lang=${locale.value}`, genreTypes)
  fetchData(`/license/type?lang=${locale.value}`, licenseTypes)
  fetchData(`/image/type/?lang=${locale.value}`, imageTypes)
  fetchData(`/event/type/?lang=${locale.value}`, eventTypes)
  fetchData('/user/venue/', venues)
  if (venueId) {
    selectedVenue.value = venueId
  }
  
  fetchEventData() // Fetch event data if eventDateId is present
  
  if (isModeEdit()) {
    submitButtonText.value = t('eventForm.updateButton')
  }
  
  // Set isInitialLoad to false after all initial data loading is complete
  setTimeout(() => {
    isInitialLoad.value = false
  }, 500)
})
</script>