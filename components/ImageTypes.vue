<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Bild Typen</h1>
      <div class="flex space-x-2">
        <button @click="showAddForm = !showAddForm" class="px-4 py-2 text-md bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
          {{ showAddForm ? 'Abbrechen' : 'Hinzufügen' }}
        </button>
        <button @click="chooseLanguage" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Sprache wählen</button>
      </div>
    </div>
    <AddTypeForm v-if="showAddForm" title="Add New Image Type" :newType="newImage" @submit="addImageType" />
    <template v-else>
      <ul v-if="images.length" class="divide-y divide-gray-200">
        <li v-for="image in images" :key="image.id" class="py-4 flex justify-between items-center hover:bg-gray-100">
          {{ image.image_type_name }}
          <button @click="editImage(image)" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Bearbeiten</button>
        </li>
      </ul>
      <div v-else class="text-gray-500">No images available</div>
    </template>
    <AddTypeForm v-if="selectedImage" title="Edit Image" :newType="selectedImage" @submit="saveImage" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import AddTypeForm from '@/components/AddTypeForm.vue'

const { fetchApi } = useApi()
const images = ref([])
const selectedImage = ref(null)
const showAddForm = ref(false)
const newImage = ref({ name_en: '', name_de: '', name_da: '' })

const fetchImageTypes = async () => {
  try {
    const data = await fetchApi('/image/type/')
    images.value = data
  } catch (error) {
    console.error('Error fetching images:', error)
  }
}

const addImageType = async () => {
  // Add logic to save new image
  showAddForm.value = false
  newImage.value = { name_en: '', name_de: '', name_da: '' }
  await fetchImageTypes()
}

onMounted(fetchImageTypes)

const editImage = (image) => {
  selectedImage.value = { ...image }
}

const saveImage = () => {
  // Save logic here
  selectedImage.value = null
}

const cancelEdit = () => {
  selectedImage.value = null
}

const chooseLanguage = () => {
  // Logic to choose language
}
</script>
