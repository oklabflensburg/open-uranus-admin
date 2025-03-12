<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Veranstaltungsort Typen</h1>
      <div class="flex space-x-2">
        <button @click="showAddForm = !showAddForm" class="px-4 py-2 text-md bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
          {{ showAddForm ? 'Abbrechen' : 'Hinzufügen' }}
        </button>
        <button @click="chooseLanguage" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Sprache wählen</button>
      </div>
    </div>
    <AddTypeForm v-if="showAddForm" title="Add New Venue Type" :newType="newVenue" @submit="addVenueType" />
    <template v-else>
      <ul v-if="venues.length" class="divide-y divide-gray-200">
        <li v-for="venue in venues" :key="venue.id" class="py-4 flex justify-between items-center hover:bg-gray-100">
          {{ venue.venue_type_name }}
          <button @click="editVenue(venue)" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Bearbeiten</button>
        </li>
      </ul>
      <div v-else class="text-center text-gray-500">No venues available</div>
    </template>
    <AddTypeForm v-if="selectedVenue" title="Edit Venue" :newType="selectedVenue" @submit="saveVenue" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import AddTypeForm from '@/components/AddTypeForm.vue'

const { fetchApi } = useApi()
const venues = ref([])
const selectedVenue = ref(null)
const showAddForm = ref(false)
const newVenue = ref({ name_en: '', name_de: '', name_da: '' })

const fetchVenueTypes = async () => {
  try {
    const data = await fetchApi('/venue/type/')
    venues.value = data
  } catch (error) {
    console.error('Error fetching venues:', error)
  }
}

const addVenueType = async () => {
  // Add logic to save new venue
  showAddForm.value = false
  newVenue.value = { name_en: '', name_de: '', name_da: '' }
  await fetchVenueTypes()
}

onMounted(fetchVenueTypes)

const editVenue = (venue) => {
  selectedVenue.value = { ...venue }
}

const saveVenue = () => {
  // Save logic here
  selectedVenue.value = null
}

const cancelEdit = () => {
  selectedVenue.value = null
}

const chooseLanguage = () => {
  // Logic to choose language
}
</script>