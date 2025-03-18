<template>
  <form id="addSpaceForm" class="space-y-6" @submit.prevent="submitForm">
    <h2 class="text-2xl font-bold mb-4">Veranstaltungsraum hinzufügen</h2>

    <!-- Name -->
    <div>
      <label class="block text-gray-700" for="name">Raumname</label>
      <input type="text" id="name" class="mt-1 p-2 w-full border rounded-xs" v-model="formData.name">
      <p v-if="errors.name" class="text-red-600">{{ errors.name }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4 mb-4">
      <!-- Venue -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="venueId">Veranstaltungsort</label>
        <select id="venueId" class="bg-white mt-1 p-3 w-full border rounded-xs" v-model="formData.venue_id">
          <option selected value="">Bitte auswählen</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.venue_id" class="text-red-600">{{ errors.venue_id }}</p>
      </div>

      <!-- Space Type -->
      <div class="col-span-6">
        <label class="block text-gray-700" for="spaceType">Raumtyp</label>
        <select id="venueId" class="bg-white mt-1 p-3 w-full border rounded-xs" v-model="formData.space_type_id">
          <option selected value="">Bitte auswählen</option>
          <option v-for="spaceType in spaceTypes" :key="spaceType.space_type_id" :value="spaceType.space_type_id">
            {{ spaceType.space_type_name }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4 mb-4">
      <!-- Total Capacity -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="totalCapacity">Gesamtkapazität</label>
        <input type="number" id="totalCapacity" class="mt-1 p-2 w-full border rounded-xs" v-model="formData.total_capacity">
      </div>

      <!-- Seating Capacity -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="seatingCapacity">Sitzplatzkapazität</label>
        <input type="number" id="seatingCapacity" class="mt-1 p-2 w-full border rounded-xs" v-model="formData.seating_capacity">
      </div>

    <!-- Building Level -->
    <div class="col-span-4">
      <label class="block text-gray-700" for="buildingLevel">Gebäudeebene</label>
      <input type="number" id="buildingLevel" class="mt-1 p-2 w-full border rounded-xs" v-model="formData.building_level">
    </div>
    </div>

    <!-- URL -->
    <div>
      <label class="block text-gray-700" for="url">Webseite</label>
      <input type="url" id="url" class="mt-1 p-2 w-full border rounded-xs" v-model="formData.url">
    </div>

    <div class="flex items-center justify-end">
      <button type="button" @click="cancelForm" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition">Abbrechen</button>
      <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition">Raum hinzufügen</button>
    </div>

  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

// Reactive form state
const formData = ref({
  venue_id: '',
  name: '',
  total_capacity: '',
  seating_capacity: '',
  space_type_id: '',
  building_level: '',
  url: '',
})

const errors = ref({})
const venues = ref([])
const spaceTypes = ref([])

// Get parameters from url
import { useRoute } from 'vue-router';
const route = useRoute();
const venueId = route.params.id;

// Form validation
const validateForm = () => {
  errors.value = {}

  if (!formData.value.venue_id) errors.value.venue_id = 'Bitte eine Veranstaltungsort-ID angeben'
  if (!formData.value.name) errors.value.name = 'Bitte einen Raumname angeben'
}

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

// Submit form
const submitForm = async () => {
  validateForm()

  if (Object.keys(errors.value).length > 0) return

  try {
    const { fetchApi } = useApi()
    const data = await fetchApi('/space/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    })

    console.log('Success:', data)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const cancelForm = () => {
  router.push('/dashboard')
}

onMounted(() => {
  fetchData('/space/type/?lang=de', spaceTypes)
  fetchData('/user/venue/', venues)
  if (venueId) {
    formData.value.venue_id = venueId
  }
})
</script>