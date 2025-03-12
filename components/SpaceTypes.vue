<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Veranstaltungsraum Typen</h1>
      <div class="flex space-x-2">
        <button @click="showAddForm = !showAddForm" class="px-4 py-2 text-md bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
          {{ showAddForm ? 'Abbrechen' : 'Hinzufügen' }}
        </button>
        <button @click="chooseLanguage" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Sprache wählen</button>
      </div>
    </div>
    <AddTypeForm v-if="showAddForm" title="Add New Space Type" :newType="newSpace" @submit="addSpaceType" />
    <template v-else>
      <ul v-if="spaces.length" class="divide-y divide-gray-200">
        <li v-for="space in spaces" :key="space.id" class="py-4 flex justify-between items-center hover:bg-gray-100">
          {{ space.space_type_name }}
          <button @click="editSpace(space)" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Bearbeiten</button>
        </li>
      </ul>
      <div v-else class="text-gray-500">No spaces available</div>
    </template>
    <AddTypeForm v-if="selectedSpace" title="Edit Space" :newType="selectedSpace" @submit="saveSpace" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import AddTypeForm from '@/components/AddTypeForm.vue'

const { fetchApi } = useApi()
const spaces = ref([])
const selectedSpace = ref(null)
const showAddForm = ref(false)
const newSpace = ref({ name_en: '', name_de: '', name_da: '' })

const fetchSpaceTypes = async () => {
  try {
    const data = await fetchApi('/space/type/')
    spaces.value = data
  } catch (error) {
    console.error('Error fetching spaces:', error)
  }
}

const addSpaceType = async () => {
  // Add logic to save new space
  showAddForm.value = false
  newSpace.value = { name_en: '', name_de: '', name_da: '' }
  await fetchSpaceTypes()
}

onMounted(fetchSpaceTypes)

const editSpace = (space) => {
  selectedSpace.value = { ...space }
}

const saveSpace = () => {
  // Save logic here
  selectedSpace.value = null
}

const cancelEdit = () => {
  selectedSpace.value = null
}

const chooseLanguage = () => {
  // Logic to choose language
}
</script>
