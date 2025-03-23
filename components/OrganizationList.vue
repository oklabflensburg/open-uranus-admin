<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 space-y-12">
    <!-- Organizers -->
    <section>
      <h2 class="text-2xl font-bold mb-4">Übersicht organisations</h2>
      <p v-if="organizers.length === 0" class="text-gray-500">Kein organisationen gefunden</p>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-200 text-gray-600 text-sm">
              <th class="p-3 border">organizer_id</th>
              <th class="p-3 border">organizer_holding_id</th>
              <th class="p-3 border">organizer_name</th>
              <th class="p-3 border">organizer_postal_code</th>
              <th class="p-3 border">organizer_city</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr v-for="organizer in organizers" :key="organizer.organizer_id" class="border-b hover:bg-gray-100">
              <td class="p-3 border">{{ organizer.organizer_id }}</td>
              <td class="p-3 border">{{ organizer.organizer_holding_organizer_id }}</td>
              <td class="p-3 border">{{ organizer.organizer_name }}</td>
              <td class="p-3 border">{{ organizer.organizer_postal_code }}</td>
              <td class="p-3 border">{{ organizer.organizer_city }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useLocalePath } from '#i18n'

const { fetchApi } = useApi()
const localePath = useLocalePath()
const organizers = ref([])

const fetchOrganizers = async () => {
  try {
    const data = await fetchApi('/organizer')
    organizers.value = data
  } catch (error) {
    console.error('Error fetching organizers:', error)
  }
}

onMounted(() => {
  fetchOrganizers()
})
</script>