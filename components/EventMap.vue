<template>
  <div id="map" class="h-96 w-full rounded-md"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Define props
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  eventCity: {
    type: String,
    default: ''
  }
})

// Map reference
const map = ref(null)

// Loading state for geocoding
const isLoadingGeocode = ref(false)
const geocodeError = ref(null)

// Timeout for debouncing the eventCity input
const searchTimeout = ref(null)

// Helper function for formatting dates
function formatDate(dateString) {
  const date = new Date(dateString)

  if (!isNaN(date)) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }

  return dateString
}

// Initialize map with raster tiles
const initMap = () => {
  if (map.value) return; // Avoid initializing multiple times
  
  map.value = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tiles.oklabflensburg.de/fosm/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      layers: [
        {
          id: 'fosm-layer',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    },
    center: [9.4515, 54.1657],
    zoom: 10
  });
  
  // Add navigation controls
  map.value.addControl(new maplibregl.NavigationControl());
  
  // Add event markers when map is loaded
  map.value.on('load', () => {
    updateEventMarkers();
  });
}

// Update event markers on the map
const updateEventMarkers = () => {
  if (!map.value || !props.events.length) return;
  
  // Clear existing markers
  const existingMarkers = document.querySelectorAll('.maplibregl-marker');
  existingMarkers.forEach(marker => marker.remove());
  
  // Add markers for each event with coordinates
  props.events.forEach(event => {
    if (event.geojson && event.geojson.coordinates) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#F59E0B';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      
      // Format the event date for the popup
      const formattedDate = formatDate(event.event_date_start);
      
      // Add popup with enhanced event info
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div style="max-width: 220px;">
            <h3 class="font-bold">${event.event_title}</h3>
            <p>${event.venue_name}</p>
            <p>${formattedDate}</p>
            ${event.event_type ? `<p><small>${event.event_type}</small></p>` : ''}
          </div>
        `);
        
      // Use GeoJSON coordinates [longitude, latitude]
      new maplibregl.Marker(el)
        .setLngLat(event.geojson.coordinates)
        .setPopup(popup)
        .addTo(map.value);
    }
  });
}

// Function to fetch city coordinates from Nominatim
const fetchCityCoordinates = async (city) => {
  if (!city || !map.value) return;
  
  const trimmedCity = city.trim();
  if (!trimmedCity) return;
  
  isLoadingGeocode.value = true;
  geocodeError.value = null;
  
  try {
    const response = await fetch(`https://nominatim.oklabflensburg.de/search?q=${encodeURIComponent(trimmedCity)}&format=json`);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      
      // Center map on found coordinates
      map.value.flyTo({
        center: [parseFloat(lon), parseFloat(lat)],
        zoom: 12,
        essential: true
      });
    } else {
      console.warn(`No geocoding results found for: ${city}`);
    }
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    geocodeError.value = error.message;
  } finally {
    isLoadingGeocode.value = false;
  }
};

// Method to reset the map view
const resetMapView = () => {
  if (map.value) {
    map.value.flyTo({
      center: [9.4515, 54.1657],
      zoom: 10,
      essential: true
    });
  }
};

// Make resetMapView available to parent component
defineExpose({
  resetMapView
});

// Initialize map on component mount
onMounted(() => {
  initMap();
})

// Watch for events changes to update markers
watch(() => props.events, () => {
  updateEventMarkers();
}, { deep: true })

// Watch for city changes to update map with timeout
watch(() => props.eventCity, (newValue) => {
  // Clear any existing timeout to prevent multiple API calls
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  // Set a new timeout - only execute after user stops typing
  searchTimeout.value = setTimeout(() => {
    if (newValue && newValue.trim()) {
      fetchCityCoordinates(newValue);
    }
  }, 500); // 500ms delay
})
</script>

<style>
.marker {
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
</style>
