<template>
  <div class="bg-gray-100 p-3 mb-4">
    <h2 class="text-xl font-semibold mb-6">{{ title }}</h2>

    <form @submit.prevent="handleSubmit">
      <label for="type_name_en">Type Name (English):</label>
      <input v-model="newType.name_en" id="type_name_en" type="text" required class="mt-1 mb-3 p-2 w-full border rounded-xs" />
      
      <label for="type_name_de">Type Name (German):</label>
      <input v-model="newType.name_de" id="type_name_de" type="text" required class="mt-1 mb-3 p-2 w-full border rounded-xs" />
      
      <label for="type_name_da">Type Name (Danish):</label>
      <input v-model="newType.name_da" id="type_name_da" type="text" required class="mt-1 mb-6 p-2 w-full border rounded-xs" />
      
      <div class="flex items-center justify-end">
        <button type="submit" class="px-4 py-2 text-md bg-blue-500 text-white rounded-xs hover:bg-blue-700 transition">Speichern</button>
     </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  newType: Object
})

const emits = defineEmits(['submit'])

const handleSubmit = () => {
  emits('submit')
}
</script>
