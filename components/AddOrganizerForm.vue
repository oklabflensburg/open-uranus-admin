<template>
  <form id="addOrganizerForm" class="space-y-6" @submit.prevent="submitForm">
    <h2 class="text-2xl font-bold mb-4">Veranstalter</h2>

    <!-- Name -->
    <div class="">
      <label class="block text-gray-700" for="name">Name</label>
      <input type="text" id="name" name="name" class="mt-1 p-2 w-full border rounded-xs" v-model="name">
      <p v-if="errors.name" class="text-red-600">{{ errors.name }}</p>
    </div>

    <!-- Description -->
    <div class="">
      <label class="block text-gray-700" for="description">Beschreibung</label>
      <textarea id="description" name="description" class="mt-1 p-2 w-full border rounded-xs" v-model="description"></textarea>
      <p v-if="errors.description" class="text-red-600">{{ errors.description }}</p>
    </div>

    <!-- Contact Email -->
    <div class="">
      <label class="block text-gray-700" for="contact_email">Kontakt E-Mail</label>
      <input type="email" id="contact_email" name="contact_email" class="mt-1 p-2 w-full border rounded-xs" v-model="contactEmail">
      <p v-if="errors.contactEmail" class="text-red-600">{{ errors.contactEmail }}</p>
    </div>

    <!-- Contact Phone -->
    <div class="">
      <label class="block text-gray-700" for="contact_phone">Kontakt Telefon</label>
      <input type="text" id="contact_phone" name="contact_phone" class="mt-1 p-2 w-full border rounded-xs" v-model="contactPhone">
      <p v-if="errors.contactPhone" class="text-red-600">{{ errors.contactPhone }}</p>
    </div>

    <!-- Website URL -->
    <div class="">
      <label class="block text-gray-700" for="website_url">Website URL</label>
      <input type="url" id="website_url" name="website_url" class="mt-1 p-2 w-full border rounded-xs" v-model="websiteUrl">
      <p v-if="errors.websiteUrl" class="text-red-600">{{ errors.websiteUrl }}</p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Street -->
      <div class="col-span-9">
        <label class="block text-gray-700" for="street">Straße</label>
        <input type="text" id="street" name="street" class="mt-1 p-2 w-full border rounded-xs" v-model="street">
        <p v-if="errors.street" class="text-red-600">{{ errors.street }}</p>
      </div>

      <!-- House Number -->
      <div class="col-span-3">
        <label class="block text-gray-700" for="house_number">Hausnummer</label>
        <input type="text" id="house_number" name="house_number" class="mt-1 p-2 w-full border rounded-xs" v-model="houseNumber">
        <p v-if="errors.houseNumber" class="text-red-600">{{ errors.houseNumber }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Postal Code -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="postal_code">Postleitzahl</label>
        <input type="text" id="postal_code" name="postal_code" class="mt-1 p-2 w-full border rounded-xs" v-model="postalCode">
        <p v-if="errors.postalCode" class="text-red-600">{{ errors.postalCode }}</p>
      </div>

      <!-- City -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="city">Stadt</label>
        <input type="text" id="city" name="city" class="mt-1 p-2 w-full border rounded-xs" v-model="city">
        <p v-if="errors.city" class="text-red-600">{{ errors.city }}</p>
      </div>
    </div>

    <!-- Country Code -->
    <div class="">
      <label class="block text-gray-700" for="country_code">Ländercode</label>
      <input type="text" id="country_code" name="country_code" class="mt-1 p-2 w-full border rounded-xs" v-model="countryCode">
      <p v-if="errors.countryCode" class="text-red-600">{{ errors.countryCode }}</p>
    </div>

    <!-- Latitude and Longitude -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="latitude">Breitengrad</label>
        <input type="number" step="0.0000001" id="latitude" name="latitude" class="mt-1 p-2 w-full border rounded-xs" v-model="latitude">
        <p v-if="errors.latitude" class="text-red-600">{{ errors.latitude }}</p>
      </div>

      <div class="col-span-6">
        <label class="block text-gray-700" for="longitude">Längengrad</label>
        <input type="number" step="0.0000001" id="longitude" name="longitude" class="mt-1 p-2 w-full border rounded-xs" v-model="longitude">
        <p v-if="errors.longitude" class="text-red-600">{{ errors.longitude }}</p>
      </div>
    </div>

    <button type="submit" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">Organisator hinzufügen</button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';

// Reactive form data
const name = ref('');
const description = ref('');
const contactEmail = ref('');
const contactPhone = ref('');
const websiteUrl = ref('');
const street = ref('');
const houseNumber = ref('');
const postalCode = ref('');
const city = ref('');
const countryCode = ref('');
const latitude = ref('');
const longitude = ref('');

const errors = ref({});

const getLocationData = async () => {
  const url = `https://nominatim.oklabflensburg.de/search?street=${street.value}&housenumber=${houseNumber.value}&city=${city.value}&country=${countryCode.value}&postalcode=${postalCode.value}&limit=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Update latitude and longitude based on the fetched location data
    if (data && data[0]) {
      latitude.value = data[0].lat;
      longitude.value = data[0].lon;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
};

// Watch for changes to the relevant fields
watch([street, houseNumber, postalCode, city, countryCode], () => {
  getLocationData();
});

// Form validation
const validateForm = () => {
  errors.value = {};

  if (!name.value) errors.value.name = 'Bitte einen Namen angeben';
  if (!description.value) errors.value.description = 'Bitte eine Beschreibung angeben';
  if (!contactEmail.value) errors.value.contactEmail = 'Bitte eine E-Mail-Adresse angeben';
  if (!contactPhone.value) errors.value.contactPhone = 'Bitte eine Telefonnummer angeben';
  if (!websiteUrl.value) errors.value.websiteUrl = 'Bitte eine Website-URL angeben';
  if (!street.value) errors.value.street = 'Bitte eine Straße angeben';
  if (!houseNumber.value) errors.value.houseNumber = 'Bitte eine Hausnummer angeben';
  if (!postalCode.value) errors.value.postalCode = 'Bitte eine Postleitzahl angeben';
  if (!city.value) errors.value.city = 'Bitte eine Stadt angeben';
  if (!countryCode.value) errors.value.countryCode = 'Bitte einen Ländercode angeben';
  if (!latitude.value) errors.value.latitude = 'Bitte Breitengrad angeben';
  if (!longitude.value) errors.value.longitude = 'Bitte Längengrad angeben';
};

// Form submit
const submitForm = async () => {
  // Validate form fields before submitting
  validateForm();

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  const body = {
    name: name.value,
    description: description.value,
    contact_email: contactEmail.value,
    contact_phone: contactPhone.value,
    website_url: websiteUrl.value,
    street: street.value,
    house_number: houseNumber.value,
    postal_code: postalCode.value,
    city: city.value,
    country_code: countryCode.value,
    latitude: latitude.value,
    longitude: longitude.value,
  };

  try {
    const response = await fetch('https://api.uranus.oklabflensburg.de/organizer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
    }
  } catch (error) {
    console.error('Error sending data:', error);
  }
};
</script>
