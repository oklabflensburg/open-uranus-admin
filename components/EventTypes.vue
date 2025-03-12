<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Veranstaltungs Typen</h1>
      <div class="flex space-x-2">
        <button @click="showAddForm = !showAddForm" class="px-4 py-2 text-md bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
          {{ showAddForm ? 'Abbrechen' : 'Hinzufügen' }}
        </button>
        <button @click="chooseLanguage" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Sprache wählen</button>
      </div>
    </div>
    <AddTypeForm v-if="showAddForm" title="Add New Event Type" :newType="newEvent" @submit="addEventType" />
    <template v-else>
      <ul v-if="events.length" class="divide-y divide-gray-200">
        <li v-for="event in events" :key="event.id" class="py-4 flex justify-between items-center hover:bg-gray-100">
          {{ event.event_type_name }}
          <button @click="editEvent(event)" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Bearbeiten</button>
        </li>
      </ul>
      <div v-else class="text-gray-500">No events available</div>
    </template>
    <AddTypeForm v-if="selectedEvent" title="Edit Event" :newType="selectedEvent" @submit="saveEvent" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import AddTypeForm from '@/components/AddTypeForm.vue'

const { fetchApi } = useApi()
const events = ref([])
const selectedEvent = ref(null)
const showAddForm = ref(false)
const newEvent = ref({ name_en: '', name_de: '', name_da: '' })

const fetchEventTypes = async () => {
  try {
    const data = await fetchApi('/event/type/')
    events.value = data
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

const addEventType = async () => {
  // Add logic to save new event
  showAddForm.value = false
  newEvent.value = { name_en: '', name_de: '', name_da: '' }
  await fetchEventTypes()
}

onMounted(fetchEventTypes)

const editEvent = (event) => {
  selectedEvent.value = { ...event }
}

const saveEvent = () => {
  // Save logic here
  selectedEvent.value = null
}

const cancelEdit = () => {
  selectedEvent.value = null
}

const chooseLanguage = () => {
  // Logic to choose language
}
</script>
