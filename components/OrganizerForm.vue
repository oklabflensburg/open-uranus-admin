<template>
  <form id="addOrganizerForm" class="space-y-6" @submit.prevent="submitForm">
    <h2 class="text-2xl font-bold mb-4">Veranstalter</h2>

    <!-- Name -->
    <div class="">
      <label class="block text-gray-700" for="name">Name</label>
      <input type="text" id="name" name="name" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerName" @input="validateField('organizerName')">
      <p v-if="errors.organizerName" class="text-red-600">{{ errors.organizerName }}</p>
    </div>

    <!-- Description -->
    <div class="">
      <label class="block text-gray-700" for="description">Beschreibung</label>
      <textarea id="description" name="description" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerDescription" @input="validateField('organizerDescription')"></textarea>
      <p v-if="errors.organizerDescription" class="text-red-600">{{ errors.organizerDescription }}</p>
    </div>

    <!-- Contact Email -->
    <div class="">
      <label class="block text-gray-700" for="contact_email">Kontakt E-Mail</label>
      <input type="email" id="contact_email" name="contact_email" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerContactEmail" @input="validateField('organizerContactEmail')">
      <p v-if="errors.organizerContactEmail" class="text-red-600">{{ errors.organizerContactEmail }}</p>
    </div>

    <!-- Contact Phone -->
    <div class="">
      <label class="block text-gray-700" for="contact_phone">Kontakt Telefon</label>
      <input type="text" id="contact_phone" name="contact_phone" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerContactPhone" @input="validateField('organizerContactPhone')">
      <p v-if="errors.organizerContactPhone" class="text-red-600">{{ errors.organizerContactPhone }}</p>
    </div>

    <!-- Website URL -->
    <div class="">
      <label class="block text-gray-700" for="website_url">Website URL</label>
      <input type="url" id="website_url" name="website_url" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerWebsiteUrl" @input="validateField('organizerWebsiteUrl')">
      <p v-if="errors.organizerWebsiteUrl" class="text-red-600">{{ errors.organizerWebsiteUrl }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Street -->
      <div class="col-span-9">
        <label class="block text-gray-700" for="street">Straße</label>
        <input type="text" id="street" name="street" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerStreet" @input="validateField('organizerStreet')">
        <p v-if="errors.organizerStreet" class="text-red-600">{{ errors.organizerStreet }}</p>
      </div>

      <!-- House Number -->
      <div class="col-span-3">
        <label class="block text-gray-700" for="house_number">Hausnummer</label>
        <input type="text" id="house_number" name="house_number" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerHouseNumber" @input="validateField('organizerHouseNumber')">
        <p v-if="errors.organizerHouseNumber" class="text-red-600">{{ errors.organizerHouseNumber }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Postal Code -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="postal_code">Postleitzahl</label>
        <input type="text" id="postal_code" name="postal_code" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerPostalCode" @input="validateField('organizerPostalCode')">
        <p v-if="errors.organizerPostalCode" class="text-red-600">{{ errors.organizerPostalCode }}</p>
      </div>

      <!-- City -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="city">Stadt</label>
        <input type="text" id="city" name="city" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerCity" @input="validateField('organizerCity')">
        <p v-if="errors.organizerCity" class="text-red-600">{{ errors.organizerCity }}</p>
      </div>
    </div>

    <!-- Country Code -->
    <div class="">
      <label class="block text-gray-700" for="country_code">Ländercode</label>
      <input type="text" id="country_code" name="country_code" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerCountryCode" @input="validateField('organizerCountryCode')">
      <p v-if="errors.organizerCountryCode" class="text-red-600">{{ errors.organizerCountryCode }}</p>
    </div>

    <!-- Latitude and Longitude -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="latitude">Breitengrad</label>
        <input type="number" step="0.0000001" id="latitude" name="latitude" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerLatitude" @input="validateField('organizerLatitude')">
        <p v-if="errors.organizerLatitude" class="text-red-600">{{ errors.organizerLatitude }}</p>
      </div>

      <div class="col-span-6">
        <label class="block text-gray-700" for="longitude">Längengrad</label>
        <input type="number" step="0.0000001" id="longitude" name="longitude" class="mt-1 p-2 w-full border rounded-xs" v-model="organizerLongitude" @input="validateField('organizerLongitude')">
        <p v-if="errors.organizerLongitude" class="text-red-600">{{ errors.organizerLongitude }}</p>
      </div>
    </div>

    <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">Organisator hinzufügen</button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useApi } from '@/composables/useApi';

// Reactive form data
const organizerName = ref('');
const organizerDescription = ref('');
const organizerContactEmail = ref('');
const organizerContactPhone = ref('');
const organizerWebsiteUrl = ref('');
const organizerStreet = ref('');
const organizerHouseNumber = ref('');
const organizerPostalCode = ref('');
const organizerCity = ref('');
const organizerCountryCode = ref('');
const organizerLatitude = ref('');
const organizerLongitude = ref('');

const errors = ref({});

const getLocationData = async () => {
  const url = `https://nominatim.oklabflensburg.de/search?q=${organizerStreet.value} ${organizerHouseNumber.value} ${organizerCity.value} ${organizerCountryCode.value} ${organizerPostalCode.value}&limit=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Update latitude and longitude based on the fetched location data
    if (data && data[0]) {
      organizerLatitude.value = parseFloat(data[0].lat).toFixed(7);
      organizerLongitude.value = parseFloat(data[0].lon).toFixed(7);
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
};

// Watch for changes to the relevant fields
watch([organizerStreet, organizerHouseNumber, organizerPostalCode, organizerCity, organizerCountryCode], () => {
  getLocationData();
});

// Form validation
const validateForm = () => {
  errors.value = {};

  if (!organizerName.value) errors.value.organizerName = 'Bitte einen Namen angeben';
  if (!organizerDescription.value) errors.value.organizerDescription = 'Bitte eine Beschreibung angeben';
  if (!organizerContactEmail.value) errors.value.organizerContactEmail = 'Bitte eine E-Mail-Adresse angeben';
  if (!organizerContactPhone.value) errors.value.organizerContactPhone = 'Bitte eine Telefonnummer angeben';
  if (!organizerWebsiteUrl.value) errors.value.organizerWebsiteUrl = 'Bitte eine Website-URL angeben';
  if (!organizerStreet.value) errors.value.organizerStreet = 'Bitte eine Straße angeben';
  if (!organizerHouseNumber.value) errors.value.organizerHouseNumber = 'Bitte eine Hausnummer angeben';
  if (!organizerPostalCode.value) errors.value.organizerPostalCode = 'Bitte eine Postleitzahl angeben';
  if (!organizerCity.value) errors.value.organizerCity = 'Bitte eine Stadt angeben';
  if (!organizerCountryCode.value) errors.value.organizerCountryCode = 'Bitte einen Ländercode angeben';
  if (!organizerLatitude.value) errors.value.organizerLatitude = 'Bitte Breitengrad angeben';
  if (!organizerLongitude.value) errors.value.organizerLongitude = 'Bitte Längengrad angeben';
};

// Validate individual field
const validateField = (field) => {
  switch (field) {
    case 'organizerName':
      if (!organizerName.value) {
        errors.value.organizerName = 'Bitte einen Namen angeben';
      } else {
        delete errors.value.organizerName;
      }
      break;
    case 'organizerDescription':
      if (!organizerDescription.value) {
        errors.value.organizerDescription = 'Bitte eine Beschreibung angeben';
      } else {
        delete errors.value.organizerDescription;
      }
      break;
    case 'organizerContactEmail':
      if (!organizerContactEmail.value) {
        errors.value.organizerContactEmail = 'Bitte eine E-Mail-Adresse angeben';
      } else {
        delete errors.value.organizerContactEmail;
      }
      break;
    case 'organizerContactPhone':
      if (!organizerContactPhone.value) {
        errors.value.organizerContactPhone = 'Bitte eine Telefonnummer angeben';
      } else {
        delete errors.value.organizerContactPhone;
      }
      break;
    case 'organizerWebsiteUrl':
      if (!organizerWebsiteUrl.value) {
        errors.value.organizerWebsiteUrl = 'Bitte eine Website-URL angeben';
      } else {
        delete errors.value.organizerWebsiteUrl;
      }
      break;
    case 'organizerStreet':
      if (!organizerStreet.value) {
        errors.value.organizerStreet = 'Bitte eine Straße angeben';
      } else {
        delete errors.value.organizerStreet;
      }
      break;
    case 'organizerHouseNumber':
      if (!organizerHouseNumber.value) {
        errors.value.organizerHouseNumber = 'Bitte eine Hausnummer angeben';
      } else {
        delete errors.value.organizerHouseNumber;
      }
      break;
    case 'organizerPostalCode':
      if (!organizerPostalCode.value) {
        errors.value.organizerPostalCode = 'Bitte eine Postleitzahl angeben';
      } else {
        delete errors.value.organizerPostalCode;
      }
      break;
    case 'organizerCity':
      if (!organizerCity.value) {
        errors.value.organizerCity = 'Bitte eine Stadt angeben';
      } else {
        delete errors.value.organizerCity;
      }
      break;
    case 'organizerCountryCode':
      if (!organizerCountryCode.value) {
        errors.value.organizerCountryCode = 'Bitte einen Ländercode angeben';
      } else {
        delete errors.value.organizerCountryCode;
      }
      break;
    case 'organizerLatitude':
      if (!organizerLatitude.value) {
        errors.value.organizerLatitude = 'Bitte Breitengrad angeben';
      } else {
        delete errors.value.organizerLatitude;
      }
      break;
    case 'organizerLongitude':
      if (!organizerLongitude.value) {
        errors.value.organizerLongitude = 'Bitte Längengrad angeben';
      } else {
        delete errors.value.organizerLongitude;
      }
      break;
  }
};

// Form submit
const submitForm = async () => {
  // Validate form fields before submitting
  validateForm();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

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
    organizer_country_code: organizerCountryCode.value,
    organizer_latitude: organizerLatitude.value,
    organizer_longitude: organizerLongitude.value,
  };

  try {
    const { fetchApi } = useApi();

    const data = await fetchApi('https://api.uranus.oklabflensburg.de/organizer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Success:', data);
    // Empty the form
    organizerName.value = '';
    organizerDescription.value = '';
    organizerContactEmail.value = '';
    organizerContactPhone.value = '';
    organizerWebsiteUrl.value = '';
    organizerStreet.value = '';
    organizerHouseNumber.value = '';
    organizerPostalCode.value = '';
    organizerCity.value = '';
    organizerCountryCode.value = '';
    organizerLatitude.value = '';
    organizerLongitude.value = '';
    // Alert the response message
    alert('Organizer created successfully!');
  } catch (error) {
    console.error('Error sending data:', error);
  }
};
</script>
