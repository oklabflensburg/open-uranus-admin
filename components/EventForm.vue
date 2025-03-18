<template>
  <form id="eventForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="eventFormTitle">
    <h2 id="eventFormTitle" class="text-2xl font-bold mb-4">{{ $t('eventForm.title') }}</h2>

    <div>
      <label class="block text-gray-700" for="eventTitle">{{ $t('eventForm.eventTitle') }} <span class="text-red-600">*</span></label>
      <input type="text" id="eventTitle" name="eventTitle" class="mt-1 p-2 w-full border rounded-xs" v-model="eventTitle" @input="validateField('eventTitle')" aria-describedby="eventTitleError">
      <p v-if="errors.eventTitle" id="eventTitleError" class="text-red-600">{{ errors.eventTitle }}</p>
    </div>
    <div>
      <label class="block text-gray-700" for="eventDescription">{{ $t('eventForm.eventDescription') }} <span class="text-red-600">*</span></label>
      <textarea id="eventDescription" name="eventDescription" rows="4" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDescription" @input="validateField('eventDescription')" aria-describedby="eventDescriptionError"></textarea>
      <p v-if="errors.eventDescription" id="eventDescriptionError" class="text-red-600">{{ errors.eventDescription }}</p>
    </div>

    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <label for="eventType">Event Typ <span class="text-red-600">*</span></label>
      <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="eventType" v-model="selectedEventTypes" multiple :disabled="eventTypes.length === 0" @change="validateField('selectedEventTypes')" aria-describedby="selectedEventTypesError">
        <option v-if="eventTypes.length === 0" value="" selected>---</option>
        <option v-for="eventType in eventTypes" :key="eventType.id" :value="eventType.event_type_id">
          {{ eventType.event_type_name }}
        </option>
      </select>
      <p v-if="errors.selectedEventTypes" id="selectedEventTypesError" class="text-red-600">{{ errors.selectedEventTypes }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="eventDateStart">{{ $t('eventForm.eventDateStart') }} <span class="text-red-600">*</span></label>
        <input type="datetime-local" name="eventDateStart" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDateStart" @input="validateField('eventDateStart')" aria-describedby="eventDateStartError">
        <p v-if="errors.eventDateStart" id="eventDateStartError" class="text-red-600">{{ errors.eventDateStart }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="eventDateEnd">{{ $t('eventForm.eventDateEnd') }}</label>
        <input type="datetime-local" name="eventDateEnd" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDateEnd">
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="entryTime">{{ $t('eventForm.entryTime') }}</label>
        <input type="time" name="entryTime" class="mt-1 p-2 w-full border rounded-xs" v-model="entryTime" @input="validateField('entryTime')" aria-describedby="entryTimeError">
        <p v-if="errors.entryTime" id="entryTimeError" class="text-red-600">{{ errors.entryTime }}</p>
      </div>

      <!-- Organizer ID -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="organizer">{{ $t('eventForm.organizer') }} <span class="text-red-600">*</span></label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="organizer" v-model="selectedOrganizer" @change="validateField('selectedOrganizer')" aria-describedby="selectedOrganizerError">
          <option value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="organizer in organizers" :key="organizer.organizer_id" :value="organizer.organizer_id">
            {{ organizer.organizer_name }}
          </option>
        </select>
        <p v-if="errors.selectedOrganizer" id="selectedOrganizerError" class="text-red-600">{{ errors.selectedOrganizer }}</p>
      </div>

      <!-- Venue ID -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="venue">{{ $t('eventForm.venue') }} <span class="text-red-600">*</span></label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="venue" v-model="selectedVenue" @change="validateField('selectedVenue')" aria-describedby="selectedVenueError">
          <option value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.selectedVenue" id="selectedVenueError" class="text-red-600">{{ errors.selectedVenue }}</p>
      </div>

      <!-- Space -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="space">{{ $t('eventForm.space') }} <span class="text-red-600">*</span></label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="space" v-model="selectedSpace" :disabled="spaces.length === 0" @change="validateField('selectedSpace')" aria-describedby="selectedSpaceError">
          <option value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="space in spaces" :key="space.id" :value="space.id">
            {{ space.name }}
          </option>
        </select>
        <p v-if="errors.selectedSpace" id="selectedSpaceError" class="text-red-600">{{ errors.selectedSpace }}</p>
      </div>
    </div>


    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="licenseType">{{ $t('eventForm.licenseType') }}</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="licenseType" v-model="selectedLicenseType" :disabled="licenseTypes.length === 0" @change="validateField('selectedLicenseType')" aria-describedby="selectedLicenseTypeError">
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
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="imageType" v-model="selectedImageType" :disabled="imageTypes.length === 0" @change="validateField('selectedImageType')" aria-describedby="selectedImageTypeError">
          <option v-if="imageTypes.length === 0" value="" selected>---</option>
          <option v-else value="" disabled>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="imageType in imageTypes" :key="imageType.id" :value="imageType.id">
            {{ imageType.image_type_name }}
          </option>
        </select>
        <p v-if="errors.selectedImageType" id="selectedImageTypeError" class="text-red-600">{{ errors.selectedImageType }}</p>
      </div>

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="imageType">Bild auswählen</label>
        <input type="file" @change="onFileChange" accept="image/*" aria-describedby="fileError">
        <p v-if="errors.file" id="fileError" class="text-red-600">{{ errors.file }}</p>
        <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="w-32 mt-2" />
      </div>
    </div>

    <div class="flex space-x-4 justify-end">
      <button type="button" @click="cancelForm" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 transition">{{ $t('eventForm.cancelButton') }}</button>
      <button type="submit" id="addEventButton" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">{{ $t('eventForm.submitButton') }}</button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()

const { t, locale } = useI18n()

const venueId = route.params.id
const eventTitle = ref('')
const eventDescription = ref('')
const eventDateStart = ref('')
const eventDateEnd = ref('')
const entryTime = ref('')
const errors = ref({})

// Define reactive variables for dropdowns
const organizers = ref([])
const venues = ref([])
const imageTypes = ref([])
const eventTypes = ref([])
const licenseTypes = ref([])
const spaces = ref([])

// Image upload
const file = ref(null)
const previewUrl = ref('')

// Selected values
const selectedEventTypes = ref([])
const selectedOrganizer = ref('')
const selectedLicenseType = ref('')
const selectedImageType = ref('')
const selectedVenue = ref('')
const selectedSpace = ref('')

// Fetch function
const fetchData = async (url, targetArray) => {
  try {
    const { fetchApi } = useApi()
    const data = await fetchApi(url)
    targetArray.value = data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
  }
}

// Fetch spaces based on selected venue
const fetchSpaces = async () => {
  if (selectedVenue.value.length > 0) {
    const url = `/space/filtered?venue_id=${selectedVenue.value}`
    fetchData(url, spaces)
  } else {
    spaces.value = []
  }
}

const onFileChange = (event) => {
  try {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      file.value = selectedFile
      previewUrl.value = URL.createObjectURL(selectedFile)
    }
  } catch (error) {
    console.error('Error handling file change:', error)
  }
}

// Watch for changes to selectedVenue and fetch spaces accordingly
watch(selectedVenue, fetchSpaces)

// Form validation
const validateForm = () => {
  errors.value = {}
  
  // Required fields validation
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
    selectedEventTypes
  }
  
  if (!fields[field]?.value || fields[field]?.value.length === 0) {
    errors.value[field] = t(`eventForm.errors.${field}`)
  } else {
    delete errors.value[field]
  }
}

const handleSubmit = async () => {
  try {
    validateForm()

    // Ensure all required fields are present
    if (Object.keys(errors.value).length > 0) {
      return
    }

    const formData = new FormData();

    if (file.value) {
      formData.append('file', file.value);
    }

    formData.append('event_title', eventTitle.value);
    formData.append('event_description', eventDescription.value);
    formData.append('event_date_start', eventDateStart.value);
    formData.append('event_date_end', eventDateEnd.value || '');
    formData.append('event_entry_time', entryTime.value || '');

    // Append only if the value is a valid number
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

    try {
      const { fetchApi } = useApi()
      const data = await fetchApi('/event/', {
        method: 'POST',
        body: formData,
      })

      console.log('Success:', data)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error sending data:', error)
    }
  } catch (error) {
    console.error('Error in handleSubmit:', error)
  }
}

const cancelForm = () => {
  router.push('/dashboard')
}

// Fetch organizers and venues when component is mounted
onMounted(() => {
  fetchData('/user/organizer/', organizers)
  fetchData(`/license/type?lang=${locale.value}`, licenseTypes)
  fetchData(`/image/type/?lang=${locale.value}`, imageTypes)
  fetchData(`/event/type/?lang=${locale.value}`, eventTypes)
  fetchData('/user/venue/', venues)
  if (venueId) {
    // Preselect the option if venueId is provided
    selectedVenue.value = venueId
  }
})
</script>