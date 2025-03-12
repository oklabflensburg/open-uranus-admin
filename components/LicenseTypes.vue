<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Lizenz Typen</h1>
      <div class="flex space-x-2">
        <button @click="showAddForm = !showAddForm" class="px-4 py-2 text-md bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
          {{ showAddForm ? 'Abbrechen' : 'Hinzufügen' }}
        </button>
        <button @click="chooseLanguage" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Sprache wählen</button>
      </div>
    </div>
    <AddTypeForm v-if="showAddForm" title="Add New License Type" :newType="newLicense" @submit="addLicenseType" />
    <template v-else>
      <ul v-if="licenses.length" class="divide-y divide-gray-200">
        <li v-for="license in licenses" :key="license.id" class="py-4 flex justify-between items-center hover:bg-gray-100">
          {{ license.license_type_name }}
          <button @click="editLicense(license)" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Bearbeiten</button>
        </li>
      </ul>
      <div v-else class="text-gray-500">No licenses available</div>
    </template>
    <AddTypeForm v-if="selectedLicense" title="Edit License" :newType="selectedLicense" @submit="saveLicense" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import AddTypeForm from '@/components/AddTypeForm.vue'

const { fetchApi } = useApi()
const licenses = ref([])
const selectedLicense = ref(null)
const showAddForm = ref(false)
const newLicense = ref({ name_en: '', name_de: '', name_da: '' })

const fetchLicenseTypes = async () => {
  try {
    const data = await fetchApi('/license/type/')
    licenses.value = data
  } catch (error) {
    console.error('Error fetching licenses:', error)
  }
}

const addLicenseType = async () => {
  // Add logic to save new license
  showAddForm.value = false
  newLicense.value = { name_en: '', name_de: '', name_da: '' }
  await fetchLicenseTypes()
}

onMounted(fetchLicenseTypes)

const editLicense = (license) => {
  selectedLicense.value = { ...license }
}

const saveLicense = () => {
  // Save logic here
  selectedLicense.value = null
}

const cancelEdit = () => {
  selectedLicense.value = null
}

const chooseLanguage = () => {
  // Logic to choose language
}
</script>
