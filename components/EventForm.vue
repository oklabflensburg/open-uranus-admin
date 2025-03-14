<template>
  <form id="eventForm" class="space-y-4" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-bold mb-4">Event anlegen</h2>

    <div class="">
      <label class="block text-gray-700" for="eventTitle">Titel</label>
      <input type="text" id="eventTitle" name="eventTitle" class="mt-1 p-2 w-full border rounded-xs" v-model="eventTitle" @input="validateField('eventTitle')">
      <p v-if="errors.eventTitle" class="text-red-600">{{ errors.eventTitle }}</p>
    </div>
    <div>
      <label class="block text-gray-700" for="eventDescription">Beschreibung</label>
      <textarea id="eventDescription" name="eventDescription" rows="4" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDescription" @input="validateField('eventDescription')"></textarea>
      <p v-if="errors.eventDescription" class="text-red-600">{{ errors.eventDescription }}</p>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-4">
        <label class="block text-gray-700" for="eventDateStart">Beginn</label>
        <input type="datetime-local" name="eventDateStart" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDateStart" @input="validateField('eventDateStart')">
        <p v-if="errors.eventDateStart" class="text-red-600">{{ errors.eventDateStart }}</p>
      </div>
      <div class="col-span-4">
        <label class="block text-gray-700" for="eventDateEnd">Ende</label>
        <input type="datetime-local" name="eventDateEnd" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDateEnd">
      </div>
      <div class="col-span-4">
        <label class="block text-gray-700" for="entryTime">Einlasszeit</label>
        <input type="time" name="entryTime" class="mt-1 p-2 w-full border rounded-xs" v-model="entryTime" @input="validateField('entryTime')">
        <p v-if="errors.entryTime" class="text-red-600">{{ errors.entryTime }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Organizer ID -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="organizer">Veranstalter</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="organizer" v-model="selectedOrganizer" @change="validateField('selectedOrganizer')">
          <option selected value="">Bitte auswählen</option>
          <option v-for="organizer in organizers" :key="organizer.organizer_id" :value="organizer.organizer_id">
            {{ organizer.organizer_name }}
          </option>
        </select>
        <p v-if="errors.selectedOrganizer" class="text-red-600">{{ errors.selectedOrganizer }}</p>
      </div>

      <!-- Venue ID -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="venue">Veranstaltungsort</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="venue" v-model="selectedVenue" @change="fetchSpaces; validateField('selectedVenue')">
          <option selected value="">Bitte auswählen</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.selectedVenue" class="text-red-600">{{ errors.selectedVenue }}</p>
      </div>

      <!-- Space -->
      <div class="col-span-4">
        <label for="space">Space</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="space" v-model="selectedSpace" :disabled="spaces.length === 0" @change="validateField('selectedSpace')">
          <option v-if="spaces.length === 0" value="" selected>---</option>
          <option v-else value="" selected>Bitte auswählen</option>
          <option v-for="space in spaces" :key="space.id" :value="space.id">
            {{ space.name }}
          </option>
        </select>
        <p v-if="errors.selectedSpace" class="text-red-600">{{ errors.selectedSpace }}</p>
      </div>
    </div>

    <div class="text-right">
      <button type="submit" id="addEventButton" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">Speichern</button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router';
const route = useRoute();

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
  validateField('venueName')
}

// Validate individual field
const validateField = (field) => {
  switch (field) {
    case 'eventTitle':
      if (!eventTitle.value) {
        errors.value.eventTitle = 'Bitte einen Veranstaltungs Titel angeben'
      } else {
        delete errors.value.eventTitle
      }
      break
    case 'eventDescription':
      if (!eventDescription.value) {
        errors.value.eventDescription = 'Bitte eine Veranstaltungs Beschreibung angeben'
      } else {
        delete errors.value.eventDescription
      }
      break
    case 'eventDateStart':
      if (!eventDateStart.value) {
        errors.value.eventDateStart = 'Bitte einen Veranstaltungs Beginn angeben'
      } else {
        delete errors.value.eventDateStart
      }
      break
    case 'selectedOrganizer':
      if (!selectedOrganizer.value) {
        errors.value.selectedOrganizer = 'Bitte einen Veranstalter auswählen'
      } else {
        delete errors.value.selectedOrganizer
      }
      break
    case 'selectedVenue':
      if (!selectedVenue.value) {
        errors.value.selectedVenue = 'Bitte eine Veranstaltungsort ID angeben'
      } else {
        delete errors.value.selectedVenue
      }
      break
    case 'selectedSpace':
      if (!selectedSpace.value) {
        errors.value.selectedSpace = 'Bitte einen Raum auswählen'
      } else {
        delete errors.value.selectedSpace
      }
      break
  }
}

const handleSubmit = async () => {
  validateForm()

  if (Object.keys(errors.value).length > 0) {
    return
  }

  const bodyData = {
    event_title: eventTitle.value,
    event_description: eventDescription.value,
    event_date_start: eventDateStart.value,
    event_date_end: eventDateEnd.value,
    entry_time: entryTime.value,
    event_organizer_id: parseInt(selectedOrganizer.value, 10),
    event_venue_id: parseInt(selectedVenue.value, 10),
    event_venue_name: venueName.value,
    event_space_id: parseInt(selectedSpace.value, 10)
  }

  try {
    const { fetchApi } = useApi()
    const data = await fetchApi('/event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyData,
    })

    console.log('Success:', data)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error sending data:', error)
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
