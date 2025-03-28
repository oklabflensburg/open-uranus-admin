<template>
  <form id="eventForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="eventFormTitle" novalidate>
    <h2 id="eventFormTitle" class="text-2xl font-bold mb-4">{{ $t('eventForm.title') }}</h2>

    <!-- Accessibility status message for screen readers -->
    <div class="sr-only" aria-live="assertive" role="status">{{ statusMessage }}</div>

    <div>
      <label class="block text-gray-700" for="eventTitle">{{ $t('eventForm.eventTitle') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
      <input 
        type="text" 
        id="eventTitle" 
        name="eventTitle" 
        class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
        v-model="eventTitle" 
        @input="validateField('eventTitle')" 
        aria-describedby="eventTitleError"
        aria-required="true"
        :aria-invalid="!!errors.eventTitle"
      >
      <p v-if="errors.eventTitle" id="eventTitleError" class="text-red-600" role="alert">{{ errors.eventTitle }}</p>
    </div>
    
    <div>
      <label class="block text-gray-700" for="eventDescription">{{ $t('eventForm.eventDescription') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
      <textarea 
        id="eventDescription" 
        name="eventDescription" 
        rows="4" 
        class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
        v-model="eventDescription" 
        @input="validateField('eventDescription')"
        aria-describedby="eventDescriptionError"
        aria-required="true"
        :aria-invalid="!!errors.eventDescription"
      ></textarea>
      <p v-if="errors.eventDescription" id="eventDescriptionError" class="text-red-600" role="alert">{{ errors.eventDescription }}</p>
    </div>

    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <label for="eventType">{{ $t('eventForm.eventType') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
      <select 
        class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
        id="eventType" 
        v-model="selectedEventTypes" 
        multiple 
        :disabled="eventTypes.length === 0" 
        @change="validateField('selectedEventTypes')"
        aria-describedby="selectedEventTypesError eventTypeInstructions"
        aria-required="true"
        :aria-invalid="!!errors.selectedEventTypes"
      >
        <option v-if="eventTypes.length === 0" value="" selected>---</option>
        <option v-for="eventType in eventTypes" :key="eventType.id" :value="eventType.event_type_id">
          {{ eventType.event_type_name }}
        </option>
      </select>
      <p id="eventTypeInstructions" class="text-sm text-gray-600">{{ $t('eventForm.multiSelectInstructions', 'Hold Ctrl (or Cmd) to select multiple options') }}</p>
      <p v-if="errors.selectedEventTypes" id="selectedEventTypesError" class="text-red-600" role="alert">{{ errors.selectedEventTypes }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="eventDateStart">{{ $t('eventForm.eventDateStart') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
        <input 
          type="datetime-local" 
          name="eventDateStart" 
          id="eventDateStart"
          class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          v-model="eventDateStart" 
          @input="validateField('eventDateStart')"
          aria-describedby="eventDateStartError"
          aria-required="true"
          :aria-invalid="!!errors.eventDateStart"
        >
        <p v-if="errors.eventDateStart" id="eventDateStartError" class="text-red-600" role="alert">{{ errors.eventDateStart }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="eventDateEnd">{{ $t('eventForm.eventDateEnd') }}</label>
        <input 
          type="datetime-local" 
          name="eventDateEnd" 
          id="eventDateEnd"
          class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          v-model="eventDateEnd"
        >
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="entryTime">{{ $t('eventForm.entryTime') }}</label>
        <input 
          type="time" 
          name="entryTime" 
          id="entryTime"
          class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          v-model="entryTime" 
          @input="validateField('entryTime')"
          aria-describedby="entryTimeError"
          :aria-invalid="!!errors.entryTime"
        >
        <p v-if="errors.entryTime" id="entryTimeError" class="text-red-600" role="alert">{{ errors.entryTime }}</p>
      </div>

      <!-- Organizer ID -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="organizer">{{ $t('eventForm.organizer') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
        <p v-if="errors.selectedOrganizer" id="selectedOrganizerError" class="text-red-600" role="alert">{{ errors.selectedOrganizer }}</p>
      </div>

      <!-- Venue ID -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="venue">{{ $t('eventForm.venue') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
        <p v-if="errors.selectedVenue" id="selectedVenueError" class="text-red-600" role="alert">{{ errors.selectedVenue }}</p>
      </div>

      <!-- Space -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="space">{{ $t('eventForm.space') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">({{ $t('eventForm.required') }})</span></label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
        <p v-if="errors.selectedSpace" id="selectedSpaceError" class="text-red-600" role="alert">{{ errors.selectedSpace }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="genreType">{{ $t('eventForm.genreType') }}</label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          id="genreType" 
          v-model="selectedGenreType" 
          :disabled="genreTypes.length === 0" 
          @change="validateField('selectedGenreType')"
          aria-describedby="selectedGenreTypeError"
          :aria-invalid="!!errors.selectedGenreType"
        >
          <option v-if="genreTypes.length === 0" value="" selected>---</option>
          <option v-else value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="genreType in genreTypes" :key="genreType.id" :value="genreType.id">
            {{ genreType.genre_type_name }}
          </option>
        </select>
        <p v-if="errors.selectedGenreType" id="selectedGenreTypeError" class="text-red-600" role="alert">{{ errors.selectedGenreType }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="licenseType">{{ $t('eventForm.licenseType') }}</label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
        <p v-if="errors.selectedLicenseType" id="selectedLicenseTypeError" class="text-red-600" role="alert">{{ errors.selectedLicenseType }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="imageType">{{ $t('eventForm.imageType') }}</label>
        <select 
          class="bg-white mt-1 p-3 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
        <p v-if="errors.selectedImageType" id="selectedImageTypeError" class="text-red-600" role="alert">{{ errors.selectedImageType }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="eventImage">{{ $t('eventForm.selectImage') }}</label>
        <div class="relative mt-1">
          <!-- Make file input properly accessible -->
          <input 
            type="file" 
            id="eventImage"
            class="sr-only"
            ref="fileInput"
            @change="onFileChange" 
            accept="image/*" 
            aria-describedby="fileError fileInstructions"
            :aria-invalid="!!errors.file"
          >
          <button 
            type="button" 
            class="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            @click="$refs.fileInput.click()"
            aria-controls="eventImage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ file?.name || $t('eventForm.selectImage') }}</span>
          </button>
          <p id="fileInstructions" class="text-sm text-gray-600">{{ $t('eventForm.imageInstructions', 'Select an image for the event') }}</p>
          <p v-if="errors.file" id="fileError" class="text-red-600 mt-1" role="alert">{{ errors.file }}</p>
          <div v-if="previewUrl" class="mt-2">
            <img :src="previewUrl" :alt="$t('eventForm.imagePreview', 'Event image preview')" class="h-32 w-auto object-contain border rounded" />
            <button 
              type="button" 
              class="mt-2 px-3 py-1 bg-red-500 text-white rounded-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition flex items-center"
              @click="removeFile"
              aria-label="{{ $t('eventForm.removeImageFull', 'Remove the selected image') }}"
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

    <div v-if="submissionError" class="text-red-600 p-4 border border-red-300 bg-red-50 rounded-md" role="alert" aria-live="assertive">{{ submissionError }}</div>

    <div class="flex space-x-4 justify-end">
      <button 
        type="button" 
        @click="cancelForm" 
        class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
      >
        {{ $t('eventForm.cancelButton') }}
      </button>
      <button 
        type="submit" 
        id="addEventButton" 
        class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ submitButtonText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRouter, useLocalePath } from '#imports'

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
const selectedGenreType = ref('')
const selectedLicenseType = ref('')
const selectedImageType = ref('')
const selectedVenue = ref(venueId || '')
const selectedSpace = ref('')

const isSubmitting = ref(false)

// Improved status message handling for better screen reader announcements
const updateStatusMessage = (message) => {
  statusMessage.value = message

  // For important messages, keep them longer
  const clearTime = message.includes('error') || message.includes('success') ? 8000 : 5000
  
  setTimeout(() => {
    statusMessage.value = ''
  }, clearTime)
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
const fetchSpaces = async () => {
  if (selectedVenue.value) {
    const url = `/space/venue/${selectedVenue.value}`
    fetchData(url, spaces)
  } else {
    spaces.value = []
  }
}

watch(selectedVenue, () => {
  fetchSpaces()
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

// Enhanced validation for better accessibility
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
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      updateStatusMessage(t('eventForm.validationErrors'))
    })
    return false
  }
  return true
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
    selectedGenreType,
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
  return !!eventDateId && updteEvent
}

// Improved form submission with proper accessibility states
const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      return
    }

    isSubmitting.value = true
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

    if (selectedGenreType.value) {
      formData.append('event_genre_type_id', parseInt(selectedGenreType.value));
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

    try {
      await fetchApi(`/event/${isModeEdit() ? parseInt(eventDateId) : ''}`, {
        method: isModeEdit() ? 'PUT' : 'POST',
        body: formData,
      })

      updateStatusMessage(t('eventForm.success'))
      // Add a slight delay before navigation to ensure screen readers announce success
      setTimeout(() => {
        router.push(localePath('/dashboard'))
      }, 1000)
    } catch (error) {
      console.error('Error sending data:', error)
      submissionError.value = t('eventForm.errors.submission')
      updateStatusMessage(t('eventForm.errors.submission'))
      // Focus the error message for better accessibility
      nextTick(() => {
        const errorElement = document.querySelector('[role="alert"]')
        if (errorElement) errorElement.focus()
      })
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    console.error('Error in handleSubmit:', error)
    submissionError.value = t('eventForm.errors.submission')
    updateStatusMessage(t('eventForm.errors.submission'))
    isSubmitting.value = false
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
      selectedGenreType.value = eventData.event_genre_type_id || ''
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
  fetchSpaces()
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
})
</script>