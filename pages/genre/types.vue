<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Genre Typen</h1>
      <div class="flex space-x-2">
        <button @click="showAddForm = !showAddForm" class="px-4 py-2 text-md bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
          {{ showAddForm ? 'Abbrechen' : 'Hinzufügen' }}
        </button>
        <button @click="chooseLanguage" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Sprache wählen</button>
      </div>
    </div>
    <AddTypeForm v-if="showAddForm" title="Add New Genre Type" :newType="newGenre" @submit="addGenreType" />
    <template v-else>
      <ul v-if="genres.length" class="divide-y divide-gray-200">
        <li v-for="genre in genres" :key="genre.id" class="py-4 flex justify-between items-center hover:bg-gray-100">
          {{ genre.genre_type_name }}
          <button @click="editGenre(genre)" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Bearbeiten</button>
        </li>
      </ul>
      <div v-else class="text-gray-500">No genres available</div>
    </template>
    <AddTypeForm v-if="selectedGenre" title="Edit Genre" :newType="selectedGenre" @submit="saveGenre" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddTypeForm from '@/components/AddTypeForm.vue'

const genres = ref([])
const selectedGenre = ref(null)
const showAddForm = ref(false)
const newGenre = ref({ name_en: '', name_de: '', name_da: '' })

const fetchGenreTypes = async () => {
  try {
    const response = await fetch('https://api.uranus.oklabflensburg.de/genre/type/')
    genres.value = await response.json()
  } catch (error) {
    console.error('Error fetching genres:', error)
  }
}

const addGenreType = async () => {
  // Add logic to save new genre
  showAddForm.value = false
  newGenre.value = { name_en: '', name_de: '', name_da: '' }
  await fetchGenreTypes()
}

onMounted(fetchGenreTypes)

const editGenre = (genre) => {
  selectedGenre.value = { ...genre }
}

const saveGenre = () => {
  // Save logic here
  selectedGenre.value = null
}

const cancelEdit = () => {
  selectedGenre.value = null
}

const chooseLanguage = () => {
  // Logic to choose language
}
</script>