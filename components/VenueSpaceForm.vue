<template>
  <form id="venueSpaceForm" class="space-y-4 bg-white p-6 rounded-lg shadow-md" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-bold mb-4">Raum anlegen</h2>

    <!-- Name -->
    <div>
      <label class="block text-gray-700" for="name">Name</label>
      <input type="text" id="name" v-model="name" class="mt-1 p-2 w-full border rounded" @input="validateField('name')">
      <p v-if="errors.name" class="text-red-600">{{ errors.name }}</p>
    </div>

    <!-- Total Capacity -->
    <div>
      <label class="block text-gray-700" for="totalCapacity">Gesamtkapazität</label>
      <input type="number" id="totalCapacity" v-model="totalCapacity" class="mt-1 p-2 w-full border rounded">
    </div>

    <!-- Seating Capacity -->
    <div>
      <label class="block text-gray-700" for="seatingCapacity">Sitzkapazität</label>
      <input type="number" id="seatingCapacity" v-model="seatingCapacity" class="mt-1 p-2 w-full border rounded">
    </div>

    <!-- Space Type -->
    <div>
      <label class="block text-gray-700" for="spaceType">Space-Typ</label>
      <select id="spaceType" v-model="spaceTypeId" class="bg-white mt-1 p-3 w-full border rounded-xs">
        <option value="">Bitte auswählen</option>
        <option v-for="type in spaceTypes" :key="type.id" :value="type.id">
          {{ type.space_type_name }}
        </option>
      </select>
    </div>

    <!-- Building Level -->
    <div>
      <label class="block text-gray-700" for="buildingLevel">Gebäude Ebene</label>
      <input type="number" id="buildingLevel" v-model="buildingLevel" class="mt-1 p-2 w-full border rounded">
    </div>

    <!-- URL -->
    <div>
      <label class="block text-gray-700" for="url">URL</label>
      <input type="url" id="url" v-model="url" class="mt-1 p-2 w-full border rounded">
    </div>

    <!-- Venue Selection -->
    <div>
      <label class="block text-gray-700" for="venue">Veranstaltungsort</label>
      <select id="venue" v-model="selectedVenue" class="bg-white mt-1 p-3 w-full border rounded-xs" @change="validateField('selectedVenue')">
        <option value="">Bitte auswählen</option>
        <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
          {{ venue.venue_name }}
        </option>
      </select>
      <p v-if="errors.selectedVenue" class="text-red-600">{{ errors.selectedVenue }}</p>
    </div>

    <!-- Submit Button -->
    <div class="text-right">
      <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition">
        Speichern
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
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

const validateField = (field) => {
  if (field === 'name' && !name.value) {
    errors.value.name = 'Bitte einen Namen eingeben'
  } else {
    delete errors.value.name
  }

  if (field === 'selectedVenue' && !selectedVenue.value) {
    errors.value.selectedVenue = 'Bitte eine Veranstaltungsort auswählen'
  } else {
    delete errors.value.selectedVenue
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

// Handle Form Submission
const handleSubmit = async () => {
  validateForm()
  if (Object.keys(errors.value).length > 0) return

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
      body: bodyData,
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

onMounted(() => {
  fetchData('/venue/', venues)
  fetchData('/space/type/', spaceTypes)
  if (venueId) {
    // Preselect the option if venueId is provided
    selectedVenue.value = venueId
  }
})
</script>