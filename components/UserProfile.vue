<template>
  <div class="max-w-screen-xl mx-auto bg-white p-3 md:p-6 space-y-12">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">{{ $t('userProfile.title') }}</h1>
      <p class="text-gray-600">{{ $t('userProfile.subtitle') }}</p>
    </div>

    <!-- Loading and error states -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">{{ $t('userProfile.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <p>{{ error }}</p>
    </div>

    <!-- User profile content -->
    <div v-else-if="userProfile" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile image and basic info -->
      <div class="md:col-span-1">
        <div class="bg-gray-50 rounded-lg p-6 text-center">
          <div class="mb-4 w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
            <img 
              v-if="userProfile.profile_image" 
              :src="userProfile.profile_image" 
              :alt="userProfile.name" 
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 class="text-xl font-semibold">{{ userProfile.name || userProfile.username }}</h2>
          <p class="text-gray-600">{{ userProfile.email }}</p>
          <p v-if="userProfile.role" class="mt-2 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {{ userProfile.role }}
          </p>
        </div>
      </div>

      <!-- Profile details -->
      <div class="md:col-span-2">
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">{{ $t('userProfile.details') }}</h3>
          
          <div class="space-y-4">
            <div v-if="userProfile.username" class="grid grid-cols-3 gap-4">
              <div class="font-medium text-gray-700">{{ $t('userProfile.username') }}</div>
              <div class="col-span-2">{{ userProfile.username }}</div>
            </div>

            <div v-if="userProfile.email" class="grid grid-cols-3 gap-4">
              <div class="font-medium text-gray-700">{{ $t('userProfile.email') }}</div>
              <div class="col-span-2">{{ userProfile.email }}</div>
            </div>

            <div v-if="userProfile.phone" class="grid grid-cols-3 gap-4">
              <div class="font-medium text-gray-700">{{ $t('userProfile.phone') }}</div>
              <div class="col-span-2">{{ userProfile.phone }}</div>
            </div>

            <div v-if="userProfile.created_at" class="grid grid-cols-3 gap-4">
              <div class="font-medium text-gray-700">{{ $t('userProfile.memberSince') }}</div>
              <div class="col-span-2">{{ formatDate(userProfile.created_at) }}</div>
            </div>

            <div v-if="userProfile.bio" class="grid grid-cols-3 gap-4">
              <div class="font-medium text-gray-700">{{ $t('userProfile.bio') }}</div>
              <div class="col-span-2">{{ userProfile.bio }}</div>
            </div>
          </div>
        </div>

        <!-- Associated organizations -->
        <div v-if="userProfile.organizations && userProfile.organizations.length > 0" class="bg-gray-50 rounded-lg p-6 mt-4">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">{{ $t('userProfile.organizations') }}</h3>
          <ul class="divide-y">
            <li v-for="org in userProfile.organizations" :key="org.id" class="py-3">
              <div class="flex items-center">
                <div class="flex-1">
                  <h4 class="font-medium">{{ org.name }}</h4>
                  <p v-if="org.role" class="text-sm text-gray-600">{{ org.role }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- User Roles Section -->
    <div v-if="userRoles && userRoles.length > 0" class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-4 border-b pb-2">{{ $t('userProfile.roles') || 'Your Roles & Permissions' }}</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('userProfile.organizationName') || 'Organization' }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('userProfile.organizationRole') || 'Organization Admin' }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('userProfile.venueRole') || 'Venue Admin' }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('userProfile.spaceRole') || 'Space Admin' }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('userProfile.eventRole') || 'Event Admin' }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(role, index) in userRoles" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ role.organizer_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="role.role_organization" class="text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="role.role_venue" class="text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="role.role_space" class="text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="role.role_event" class="text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">{{ $t('userProfile.noData') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useI18n } from 'vue-i18n'

const { fetchApi } = useApi()
const { t } = useI18n()

// Reactive state
const userProfile = ref(null)
const userRoles = ref(null)
const loading = ref(true)
const error = ref(null)
const statusMessage = ref('')

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Update status message for screen readers
const updateStatusMessage = (message) => {
  statusMessage.value = message
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Fetch user profile data
const fetchUserProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await fetchApi('/user/profile')
    userProfile.value = data
    updateStatusMessage(t('userProfile.dataLoaded'))
  } catch (err) {
    console.error('Error fetching user profile:', err)
    error.value = t('userProfile.errors.fetchingData')
    updateStatusMessage(t('userProfile.errors.fetchingData'))
  } finally {
    loading.value = false
  }
}

// Fetch user roles
const fetchUserRoles = async () => {
  try {
    const data = await fetchApi('/user/roles')
    userRoles.value = data
  } catch (err) {
    console.error('Error fetching user roles:', err)
    // Don't set main error state for this as it's supplementary data
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchUserProfile()
  fetchUserRoles()
})
</script>