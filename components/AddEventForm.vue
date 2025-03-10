<template>
  <form id="eventForm" class="space-y-4" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-bold mb-4">Veranstaltung eintragen</h2>

    <div class="">
      <label class="block text-gray-700" for="eventTitle">Veranstaltungs Titel</label>
      <input type="text" id="eventTitle" name="eventTitle" class="mt-1 p-2 w-full border rounded-xs" v-model="eventTitle" required>
      <p v-if="errors.eventTitle" class="text-red-600">{{ errors.eventTitle }}</p>
    </div>
    <div>
      <label class="block text-gray-700" for="eventDescription">Veranstaltungs Beschreibung</label>
      <textarea id="eventDescription" name="eventDescription" rows="4" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDescription" required></textarea>
      <p v-if="errors.eventDescription" class="text-red-600">{{ errors.eventDescription }}</p>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-6">
        <label class="block text-gray-700" for="eventDateStart">Veranstaltungs Beginn</label>
        <input type="datetime-local" name="eventDateStart" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDateStart" required>
        <p v-if="errors.eventDateStart" class="text-red-600">{{ errors.eventDateStart }}</p>
      </div>
      <div class="col-span-6">
        <label class="block text-gray-700" for="eventDateEnd">Veranstaltungs Ende</label>
        <input type="datetime-local" name="eventDateEnd" class="mt-1 p-2 w-full border rounded-xs" v-model="eventDateEnd">
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue ID -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="venue">Venue</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="venue" v-model="selectedVenue">
          <option selected value="">Bitte auswählen</option>
          <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
            {{ venue.venue_name }}
          </option>
        </select>
        <p v-if="errors.venueId" class="text-red-600">{{ errors.venueId }}</p>
      </div>

      <!-- Venue Type -->
      <div class="col-span-4">
        <label for="venueType">Venue Type</label>
        <select class="bg-white mt-1 p-3 w-full border rounded-xs" id="venueType" v-model="selectedVenueType">
          <option selected value="">Bitte auswählen</option>
          <option v-for="venueType in venueTypes" :key="venueType.venue_type_id" :value="venueType.venue_type_id">
            {{ venueType.venue_type_name }}
          </option>
        </select>  
    </div>
   </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Street -->
      <div class="col-span-9">
        <label class="block text-gray-700" for="venue_street">Straße</label>
        <input type="text" id="venue_street" name="venue_street" class="mt-1 p-2 w-full border rounded-xs" v-model="venueStreet">
        <p v-if="errors.venueStreet" class="text-red-600">{{ errors.venueStreet }}</p>
      </div>

      <!-- Venue House Number -->
      <div class="col-span-3">
        <label class="block text-gray-700" for="venue_house_number">Hausnummer</label>
        <input type="text" id="venue_house_number" name="venue_house_number" class="mt-1 p-2 w-full border rounded-xs" v-model="venueHouseNumber">
        <p v-if="errors.venueHouseNumber" class="text-red-600">{{ errors.venueHouseNumber }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Venue Postal Code -->
      <div class="col-span-4">
        <label class="block text-gray-700" for="venue_postal_code">Postleitzahl</label>
        <input type="text" id="venue_postal_code" name="venue_postal_code" class="mt-1 p-2 w-full border rounded-xs" v-model="venuePostalCode">
        <p v-if="errors.venuePostalCode" class="text-red-600">{{ errors.venuePostalCode }}</p>
      </div>

      <!-- Venue City -->
      <div class="col-span-8">
        <label class="block text-gray-700" for="venue_city">Stadt</label>
        <input type="text" id="venue_city" name="venue_city" class="mt-1 p-2 w-full border rounded-xs" v-model="venueCity">
        <p v-if="errors.venueCity" class="text-red-600">{{ errors.venueCity }}</p>
      </div>
    </div>

    <button type="submit" id="addEventButton" class="mt-6 px-4 py-2 bg-green-500 text-white rounded-xs hover:bg-green-700 transition">Speichern</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

  const eventTitle = ref('');
  const eventDescription = ref('');
  const eventDateStart = ref('');
  const eventDateEnd = ref(''); 
  const venueId = ref('');
  const venueName = ref('');
  const venueType = ref('');
  const venueStreet = ref('');
  const venueHouseNumber = ref('');
  const venuePostalCode = ref('');
  const venueCity = ref('');
  const errors = ref({});

// Define reactive variables for dropdowns
const venues = ref([]);
const venueTypes = ref([]);

// Selected values
const selectedVenue = ref("");
const selectedVenueType = ref("");

// Fetch function
const fetchData = async (url, targetArray) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    targetArray.value = data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
  }
};

// Fetch data when component is mounted
onMounted(() => {
  fetchData("https://api.uranus.oklabflensburg.de/venue/", venues);
  fetchData("https://api.uranus.oklabflensburg.de/venue/type/", venueTypes);
});

    const handleSubmit = () => {
      errors.value = {};
      if (!eventTitle.value) {
        errors.value.eventTitle = 'Bitte einen Veranstaltungs Titel angeben';
      }
      if (!eventDescription.value) {
        errors.value.eventDescription = 'Bitte eine Veranstaltungs Beschreibung angeben';
      }
      if (!eventDateStart.value) {
        errors.value.eventDateStart = 'Bitte einen Veranstaltungs Beginn angeben';
      }
      if (!venueId.value) {
        errors.value.venueId = 'Bitte eine Veranstaltungsort ID angeben';
      }
      if (!venueName.value) {
        errors.value.venueName = 'Bitte einen Veranstaltungsort Namen angeben';
      }
      if (!venueStreet.value) {
        errors.value.venueStreet = 'Bitte eine Straße des Veranstaltungsortes angeben';
      }
      if (!venuePostalCode.value) {
        errors.value.venuePostalCode = 'Bitte eine Postleitzahl des Veranstaltungsortes angeben';
      }
      if (!venueCity.value) {
        errors.value.venueCity = 'Bitte eine Stadt des Veranstaltungsortes angeben';
      }
      if (Object.keys(errors.value).length === 0) {
        alert('Event gespeichert');
      }
    };
</script>
