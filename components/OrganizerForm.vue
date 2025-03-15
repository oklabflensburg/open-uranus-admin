<template>
  <form id="addOrganizerForm" class="space-y-4 bg-white p-6 rounded-lg shadow-md" @submit.prevent="handleSubmit" aria-labelledby="organizerFormTitle">
    <h2 id="organizerFormTitle" class="text-2xl font-bold mb-4">{{ $t('organizerForm.title') }}</h2>

    <!-- Name -->
    <div>
      <label class="block text-gray-700" for="organizerName">{{ $t('organizerForm.name') }}</label>
      <input type="text" id="organizerName" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerName" @input="validateField('organizerName')" aria-describedby="organizerNameError">
      <p v-if="errors.organizerName" id="organizerNameError" class="text-red-600">{{ errors.organizerName }}</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-gray-700" for="organizerDescription">{{ $t('organizerForm.description') }}</label>
      <textarea id="organizerDescription" rows="4" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerDescription" @input="validateField('organizerDescription')" aria-describedby="organizerDescriptionError"></textarea>
      <p v-if="errors.organizerDescription" id="organizerDescriptionError" class="text-red-600">{{ errors.organizerDescription }}</p>
    </div>

    <!-- Contact Information -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="organizerContactEmail">{{ $t('organizerForm.contactEmail') }}</label>
        <input type="email" id="organizerContactEmail" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerContactEmail" @input="validateField('organizerContactEmail')" aria-describedby="organizerContactEmailError">
        <p v-if="errors.organizerContactEmail" id="organizerContactEmailError" class="text-red-600">{{ errors.organizerContactEmail }}</p>
      </div>
      <div class="col-span-6">
        <label class="block text-gray-700" for="organizerContactPhone">{{ $t('organizerForm.contactPhone') }}</label>
        <input type="text" id="organizerContactPhone" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerContactPhone" @input="validateField('organizerContactPhone')" aria-describedby="organizerContactPhoneError">
        <p v-if="errors.organizerContactPhone" id="organizerContactPhoneError" class="text-red-600">{{ errors.organizerContactPhone }}</p>
      </div>
    </div>

    <!-- Website URL -->
    <div>
      <label class="block text-gray-700" for="organizerWebsiteUrl">{{ $t('organizerForm.websiteUrl') }}</label>
      <input type="url" id="organizerWebsiteUrl" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerWebsiteUrl" @input="validateField('organizerWebsiteUrl')" aria-describedby="organizerWebsiteUrlError">
      <p v-if="errors.organizerWebsiteUrl" id="organizerWebsiteUrlError" class="text-red-600">{{ errors.organizerWebsiteUrl }}</p>
    </div>

    <!-- Address Fields -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-7 sm:col-span-9">
        <label class="block text-gray-700" for="organizerStreet">{{ $t('organizerForm.street') }}</label>
        <input type="text" id="organizerStreet" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerStreet" @input="validateField('organizerStreet')" aria-describedby="organizerStreetError">
        <p v-if="errors.organizerStreet" id="organizerStreetError" class="text-red-600">{{ errors.organizerStreet }}</p>
      </div>
      <div class="col-span-5 sm:col-span-3">
        <label class="block text-gray-700" for="organizerHouseNumber">{{ $t('organizerForm.houseNumber') }}</label>
        <input type="text" id="organizerHouseNumber" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerHouseNumber" @input="validateField('organizerHouseNumber')" aria-describedby="organizerHouseNumberError">
        <p v-if="errors.organizerHouseNumber" id="organizerHouseNumberError" class="text-red-600">{{ errors.organizerHouseNumber }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4">
        <label class="block text-gray-700" for="organizerPostalCode">{{ $t('organizerForm.postalCode') }}</label>
        <input type="text" id="organizerPostalCode" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerPostalCode" @input="validateField('organizerPostalCode')" aria-describedby="organizerPostalCodeError">
        <p v-if="errors.organizerPostalCode" id="organizerPostalCodeError" class="text-red-600">{{ errors.organizerPostalCode }}</p>
      </div>
      <div class="col-span-8">
        <label class="block text-gray-700" for="organizerCity">{{ $t('organizerForm.city') }}</label>
        <input type="text" id="organizerCity" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerCity" @input="validateField('organizerCity')" aria-describedby="organizerCityError">
        <p v-if="errors.organizerCity" id="organizerCityError" class="text-red-600">{{ errors.organizerCity }}</p>
      </div>
    </div>

    <div v-if="submissionError" class="text-red-600">{{ submissionError }}</div>

    <div class="text-right">
      <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">
        {{ $t('organizerForm.submitButton') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()
const { fetchApi } = useApi()

// Reactive form data
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

// Validation
const validateForm = () => {
  errors.value = {}
  validateField('organizerName')
  validateField('organizerDescription')
  validateField('organizerContactEmail')
  validateField('organizerContactPhone')
  validateField('organizerWebsiteUrl')
  validateField('organizerStreet')
  validateField('organizerHouseNumber')
  validateField('organizerPostalCode')
  validateField('organizerCity')
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
  
  if (!fields[field].value) {
    errors.value[field] = t(`organizerForm.errors.${field}`)
  } else {
    delete errors.value[field]
  }
}

// Form submission
const handleSubmit = async () => {
  validateForm()
  if (Object.keys(errors.value).length > 0) return

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
    await fetchApi('/organizer/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    console.log('Organizer successfully created!')
    router.push('dashboard')
  } catch (error) {
    console.error('Error submitting form:', error)
    submissionError.value = t('organizerForm.errors.submission')
  }
}
</script>