<template>
  <form id="addOrganizerForm" class="space-y-4" @submit.prevent="handleSubmit" aria-labelledby="organizerFormTitle">
    <h2 id="organizerFormTitle" class="text-2xl font-bold mb-4">{{ $t('organizerForm.title') }}</h2>
    
    <!-- Accessibility status message for screen readers -->
    <div class="sr-only" aria-live="polite" role="status">{{ statusMessage }}</div>

    <!-- Name -->
    <div>
      <label class="block text-gray-700" for="organizerName">{{ $t('organizerForm.name') }}<span class="text-red-600 ml-1" aria-hidden="true">*</span><span class="sr-only">{{ $t('organizerForm.required') }}</span></label>
      <input 
        type="text" 
        id="organizerName" 
        class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
        v-model="organizerName" 
        @input="validateField('organizerName')" 
        aria-describedby="organizerNameError" 
        aria-required="true"
        :aria-invalid="!!errors.organizerName"
      >
      <p v-if="errors.organizerName" id="organizerNameError" class="text-red-600" role="alert">{{ errors.organizerName }}</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-gray-700" for="organizerDescription">{{ $t('organizerForm.description') }}</label>
      <textarea 
        id="organizerDescription" 
        rows="4" 
        class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
        v-model="organizerDescription" 
        @input="validateField('organizerDescription')" 
        aria-describedby="organizerDescriptionError" 
        :aria-invalid="!!errors.organizerDescription"
      ></textarea>
      <p v-if="errors.organizerDescription" id="organizerDescriptionError" class="text-red-600" role="alert">{{ errors.organizerDescription }}</p>
    </div>

    <!-- Contact Information -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="organizerContactEmail">{{ $t('organizerForm.contactEmail') }}</label>
        <input 
          type="email" 
          id="organizerContactEmail" 
          class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          v-model="organizerContactEmail" 
          @input="validateField('organizerContactEmail')" 
          aria-describedby="organizerContactEmailError" 
          :aria-invalid="!!errors.organizerContactEmail"
        >
        <p v-if="errors.organizerContactEmail" id="organizerContactEmailError" class="text-red-600" role="alert">{{ errors.organizerContactEmail }}</p>
      </div>
      <div class="col-span-6">
        <label class="block text-gray-700" for="organizerContactPhone">{{ $t('organizerForm.contactPhone') }}</label>
        <input 
          type="tel" 
          id="organizerContactPhone" 
          class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          v-model="organizerContactPhone" 
          @input="validateField('organizerContactPhone')" 
          aria-describedby="organizerContactPhoneError" 
          :aria-invalid="!!errors.organizerContactPhone"
        >
        <p v-if="errors.organizerContactPhone" id="organizerContactPhoneError" class="text-red-600" role="alert">{{ errors.organizerContactPhone }}</p>
      </div>
    </div>

    <!-- Website URL -->
    <div>
      <label class="block text-gray-700" for="organizerWebsiteUrl">{{ $t('organizerForm.websiteUrl') }}</label>
      <input 
        type="url" 
        id="organizerWebsiteUrl" 
        class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
        v-model="organizerWebsiteUrl" 
        @input="validateField('organizerWebsiteUrl')" 
        @blur="handleUrlBlur"
        aria-describedby="organizerWebsiteUrlError organizerWebsiteUrlHint"
        :aria-invalid="!!errors.organizerWebsiteUrl"
        placeholder="www.example.com"
      >
      <p v-if="errors.organizerWebsiteUrl" id="organizerWebsiteUrlError" class="text-red-600" role="alert">{{ errors.organizerWebsiteUrl }}</p>
      <p id="organizerWebsiteUrlHint" class="text-gray-500 text-sm">{{ $t('organizerForm.websiteUrlHint') || 'https:// will be added automatically if not provided' }}</p>
    </div>

    <!-- Address Fields -->
    <fieldset>
      <legend class="sr-only">{{ $t('organizerForm.addressInformation') }}</legend>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-7 sm:col-span-9">
          <label class="block text-gray-700" for="organizerStreet">{{ $t('organizerForm.street') }}</label>
          <input type="text" id="organizerStreet" class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="organizerStreet" @input="validateField('organizerStreet')" aria-describedby="organizerStreetError" :aria-invalid="!!errors.organizerStreet">
          <p v-if="errors.organizerStreet" id="organizerStreetError" class="text-red-600" role="alert">{{ errors.organizerStreet }}</p>
        </div>
        <div class="col-span-5 sm:col-span-3">
          <label class="block text-gray-700" for="organizerHouseNumber">{{ $t('organizerForm.houseNumber') }}</label>
          <input type="text" id="organizerHouseNumber" class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="organizerHouseNumber" @input="validateField('organizerHouseNumber')" aria-describedby="organizerHouseNumberError" :aria-invalid="!!errors.organizerHouseNumber">
          <p v-if="errors.organizerHouseNumber" id="organizerHouseNumberError" class="text-red-600" role="alert">{{ errors.organizerHouseNumber }}</p>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 mt-4">
        <div class="col-span-4">
          <label class="block text-gray-700" for="organizerPostalCode">{{ $t('organizerForm.postalCode') }}</label>
          <input type="text" id="organizerPostalCode" class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="organizerPostalCode" @input="validateField('organizerPostalCode')" aria-describedby="organizerPostalCodeError" :aria-invalid="!!errors.organizerPostalCode">
          <p v-if="errors.organizerPostalCode" id="organizerPostalCodeError" class="text-red-600" role="alert">{{ errors.organizerPostalCode }}</p>
        </div>
        <div class="col-span-8">
          <label class="block text-gray-700" for="organizerCity">{{ $t('organizerForm.city') }}</label>
          <input type="text" id="organizerCity" class="mt-1 p-2 w-full border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="organizerCity" @input="validateField('organizerCity')" aria-describedby="organizerCityError" :aria-invalid="!!errors.organizerCity">
          <p v-if="errors.organizerCity" id="organizerCityError" class="text-red-600" role="alert">{{ errors.organizerCity }}</p>
        </div>
      </div>
    </fieldset>

    <div v-if="submissionError" class="text-red-600 p-3 border border-red-300 bg-red-50 rounded" role="alert" aria-live="assertive">{{ submissionError }}</div>

    <div class="flex space-x-4 justify-end" role="group" aria-label="Form submission controls">
      <button 
        type="button" 
        @click="cancelForm" 
        class="mt-6 px-4 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
      >
        {{ $t('organizerForm.cancelButton') }}
      </button>
      <button 
        type="submit" 
        class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
        :disabled="isSubmitting"
        aria-busy="isSubmitting"
      >
        {{ submitButtonText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute, useLocalePath } from '#imports'

const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()

const { t } = useI18n()
const { fetchApi } = useApi()

const organizerName = ref('')
const organizerDescription = ref('')
const organizerContactEmail = ref('')
const organizerContactPhone = ref('')
const organizerWebsiteUrl = ref('')
const organizerStreet = ref('')
const organizerHouseNumber = ref('')
const organizerPostalCode = ref('')
const organizerCity = ref('')

const errors = ref({})
const submissionError = ref('')
const statusMessage = ref('')
const submitButtonText = ref(t('organizerForm.submitButton'))
const isSubmitting = ref(false)

const organizerId = route.params.id

const updateStatusMessage = (message) => {
  statusMessage.value = message

  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

const validateForm = () => {
  errors.value = {}

  // Validate required fields
  validateField('organizerName')
  
  // Add validation for other fields
  if (organizerContactEmail.value) validateField('organizerContactEmail')
  if (organizerWebsiteUrl.value) validateField('organizerWebsiteUrl')
  
  // Focus first error field for better accessibility
  if (Object.keys(errors.value).length > 0) {
    const firstErrorField = Object.keys(errors.value)[0]
    nextTick(() => {
      document.getElementById(firstErrorField)?.focus()
      updateStatusMessage(t('organizerForm.validationErrors'))
    })
  }
}

const validateField = (field) => {
  const fields = {
    organizerName,
    organizerDescription,
    organizerContactEmail,
    organizerContactPhone,
    organizerWebsiteUrl,
    organizerStreet,
    organizerHouseNumber,
    organizerPostalCode,
    organizerCity
  }
  
  if (field === 'organizerName' && !fields[field].value) {
    errors.value[field] = t(`organizerForm.errors.${field}`)
  } else if (field === 'organizerContactEmail' && fields[field].value && !validateEmail(fields[field].value)) {
    errors.value[field] = t('organizerForm.errors.invalidEmail')
  } else if (field === 'organizerWebsiteUrl' && fields[field].value && !validateUrl(fields[field].value)) {
    errors.value[field] = t('organizerForm.errors.invalidUrl')
  } else {
    delete errors.value[field]
  }
}

// Form validation helpers
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateUrl = (url) => {
  if (!url) return true
  
  // Add https:// prefix if not present
  let urlToCheck = url
  if (!/^https?:\/\//i.test(urlToCheck)) {
    urlToCheck = 'https://' + urlToCheck
  }
  
  try {
    new URL(urlToCheck)
    return true
  } catch (e) {
    return false
  }
}

const handleUrlBlur = () => {
  if (organizerWebsiteUrl.value && !/^https?:\/\//i.test(organizerWebsiteUrl.value)) {
    organizerWebsiteUrl.value = 'https://' + organizerWebsiteUrl.value
    validateField('organizerWebsiteUrl')
  }
}

const isModeEdit = () => {
  // must not be null or undefined
  return !!organizerId
}

const handleSubmit = async () => {
  validateForm()
  if (Object.keys(errors.value).length > 0) return
  
  // Ensure website URL has https:// prefix before submission
  if (organizerWebsiteUrl.value && !/^https?:\/\//i.test(organizerWebsiteUrl.value)) {
    organizerWebsiteUrl.value = 'https://' + organizerWebsiteUrl.value
  }
  
  isSubmitting.value = true
  updateStatusMessage(t('organizerForm.submitting'))
  
  const body = {
    organizer_name: organizerName.value,
    organizer_description: organizerDescription.value,
    organizer_contact_email: organizerContactEmail.value,
    organizer_contact_phone: organizerContactPhone.value,
    organizer_website_url: organizerWebsiteUrl.value,
    organizer_street: organizerStreet.value,
    organizer_house_number: organizerHouseNumber.value,
    organizer_postal_code: organizerPostalCode.value,
    organizer_city: organizerCity.value,
  }

  try {
    if (isModeEdit()) {
      await fetchApi(`/organizer/${organizerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      updateStatusMessage(t('organizerForm.success'))
      router.push(localePath('/dashboard'))
      return
    } else {
      await fetchApi('/organizer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      updateStatusMessage(t('organizerForm.success'))
      router.push(localePath('/dashboard'))
    }
  } catch (error) {
    submissionError.value = t('organizerForm.errors.submission')
    updateStatusMessage(t('organizerForm.errors.submission'))
    // Focus the error message for screen readers
    nextTick(() => {
      const errorElement = document.querySelector('[role="alert"]')
      if (errorElement) errorElement.focus()
    })
  } finally {
    isSubmitting.value = false
  }
}

const cancelForm = () => {
  router.push(localePath('/dashboard'))
}

const loadOrganizerData = async (id) => {
  try {
    const response = await fetchApi(`/organizer/${id}`)

    organizerName.value = response.organizer_name
    organizerDescription.value = response.organizer_description
    organizerContactEmail.value = response.organizer_contact_email
    organizerContactPhone.value = response.organizer_contact_phone
    organizerWebsiteUrl.value = response.organizer_website_url
    organizerStreet.value = response.organizer_street
    organizerHouseNumber.value = response.organizer_house_number
    organizerPostalCode.value = response.organizer_postal_code
    organizerCity.value = response.organizer_city

    updateStatusMessage(t('organizerForm.dataLoaded'))
  } catch (error) {
    submissionError.value = t('organizerForm.errors.load')
    updateStatusMessage(t('organizerForm.errors.load'))
  }
}

onMounted(() => {
  if (isModeEdit()) {
    loadOrganizerData(organizerId)
    submitButtonText.value = t('organizerForm.updateButton')
  }
  // Set initial focus to the first form field for better keyboard navigation
  nextTick(() => {
    document.getElementById('organizerName')?.focus()
  })
})
</script>