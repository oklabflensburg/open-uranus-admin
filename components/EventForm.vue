<template>
  <form id="eventForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="eventFormTitle">
    <h2 id="eventFormTitle" class="text-2xl font-bold mb-4">{{ $t('eventForm.title') }}</h2>

    <div>
      <label class="block text-gray-700" for="eventTitle">{{ $t('eventForm.eventTitle') }}</label>
      <input type="text" id="eventTitle" name="eventTitle" class="mt-1 p-2 w-full border rounded-xs" v-model="eventTitle" @input="validateField('eventTitle')" aria-describedby="eventTitleError">
      <p v-if="errors.eventTitle" id="eventTitleError" class="text-red-600">{{ errors.eventTitle }}</p>
    </div>
    <div>
      <label class="block text-gray-700" for="eventDescription">{{ $t('eventForm.eventDescription') }}</label>
      <textarea id="eventDescription" name="eventDescription" rows="4" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDescription" @input="validateField('eventDescription')" aria-describedby="eventDescriptionError"></textarea>
      <p v-if="errors.eventDescription" id="eventDescriptionError" class="text-red-600">{{ errors.eventDescription }}</p>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="eventDateStart">{{ $t('eventForm.eventDateStart') }}</label>
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
        <label class="block text-gray-700" for="organizer">{{ $t('eventForm.organizer') }}</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="organizer" v-model="selectedOrganizer" @change="validateField('selectedOrganizer')" aria-describedby="selectedOrganizerError">
          <option selected value="">{{ $t('eventForm.selectOption') }}</option>
          <option v-for="organizer in organizers" :key="organizer.organizer_id" :value="organizer.organizer_id">
            {{ organizer.organizer_name }}
          </option>
        </select>
        <p v-if="errors.selectedOrganizer" id="selectedOrganizerError" class="text-red-600">{{ errors.selectedOrganizer }}</p>
      </div>

      <!-- Venue ID -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label class="block text-gray-700" for="venue">{{ $t('eventForm.venue') }}</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="venue" v-model="selectedVenue" @change="fetchSpaces; validateField('selectedVenue')" aria-describedby="selectedVenueError">
          <option selected value="">{{ $t('eventForm.selectOption') }}</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.selectedVenue" id="selectedVenueError" class="text-red-600">{{ errors.selectedVenue }}</p>
      </div>

      <!-- Space -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <label for="space">{{ $t('eventForm.space') }}</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="space" v-model="selectedSpace" :disabled="spaces.length === 0" @change="validateField('selectedSpace')" aria-describedby="selectedSpaceError">
          <option v-if="spaces.length === 0" value="" selected>---</option>
          <option v-else value="" selected>{{ $t('eventForm.selectOption') }}</option>
          <option v-for="space in spaces" :key="space.id" :value="space.id">
            {{ space.name }}
          </option>
        </select>
        <p v-if="errors.selectedSpace" id="selectedSpaceError" class="text-red-600">{{ errors.selectedSpace }}</p>
      </div>
    </div>

    <div class="col-span-12 sm:col-span-6 lg:col-span-4">
      <input type="file" @change="onFileChange" accept="image/*" aria-describedby="fileError" required />
      <p v-if="errors.file" id="fileError" class="text-red-600">{{ errors.file }}</p>
      <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="w-32 h-32 mt-2" />
    </div>

    <div class="text-right">
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

const { t } = useI18n()

const venueId = route.params.id;
const eventTitle = ref('')
const eventDescription = ref('')
const eventDateStart = ref('')
const eventDateEnd = ref('')
const entryTime = ref('')
const venueName = ref('')
const errors = ref({})

// Define reactive variables for dropdowns
const organizers = ref([])
const venues = ref([])
const spaces = ref([])
const file = ref(null)
const previewUrl = ref('')

// Selected values
const selectedOrganizer = ref("")
const selectedVenue = ref("")
const selectedSpace = ref("")

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
  if (selectedVenue.value) {
    const url = `/space/filtered?venue_id=${selectedVenue.value}`
    fetchData(url, spaces)
  } else {
    spaces.value = []
  }
}

const onFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    previewUrl.value = URL.createObjectURL(selectedFile);
  }
}

// Watch for changes to selectedVenue and fetch spaces accordingly
watch(selectedVenue, fetchSpaces)

// Form validation
const validateForm = () => {
  errors.value = {}
  validateField('eventTitle')
  validateField('eventDescription')
  validateField('eventDateStart')
  validateField('selectedOrganizer')
  validateField('selectedVenue')
  if (spaces.value.length > 0) {
    validateField('selectedSpace')
  }
  // Validate file upload
  if (!file.value) {
    errors.value.file = t('eventForm.errors.file')
  }
}

// Validate individual field
const validateField = (field) => {
  const fields = {
    eventTitle,
    eventDescription,
    eventDateStart,
    eventDateEnd,
    entryTime,
    selectedOrganizer,
    selectedVenue,
    selectedSpace
  }
  
  if (!fields[field].value) {
    errors.value[field] = t(`eventForm.errors.${field}`)
  } else {
    delete errors.value[field]
  }
}

const handleSubmit = async () => {
  validateForm();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  let imageUrl = ''

  if (file.value) {
    try {
      const formData = new FormData();
      formData.append('file', file.value);

      const { fetchApi } = useApi();
      const response = await fetchApi('/event/upload', {
        method: 'POST',
        body: formData,
      });

      if (response && response.source_name) {
        imageUrl = response.source_name; // Adjust based on API response
        console.log(imageUrl)
      } else {
        throw new Error('Invalid response from upload API');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      return alert('File upload failed!'); // Prevent form submission if upload fails
    }
  }

  // Prepare form data with uploaded image URL
  const bodyData = {
    event_title: eventTitle.value,
    event_description: eventDescription.value,
    event_date_start: eventDateStart.value,
    event_date_end: eventDateEnd.value,
    entry_time: entryTime.value,
    event_organizer_id: parseInt(selectedOrganizer.value, 10),
    event_venue_id: parseInt(selectedVenue.value, 10),
    event_venue_name: venueName.value,
    event_space_id: parseInt(selectedSpace.value, 10),
    event_image: imageUrl, // Add image URL to the payload
  };

  try {
    const { fetchApi } = useApi();
    const data = await fetchApi("/event/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    console.log("Success:", data);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

// Fetch organizers and venues when component is mounted
onMounted(() => {
  fetchData('/user/organizer/', organizers)
  fetchData('/venue/', venues)
  if (venueId) {
    // Preselect the option if venueId is provided
    selectedVenue.value = venueId
  }
})
</script>