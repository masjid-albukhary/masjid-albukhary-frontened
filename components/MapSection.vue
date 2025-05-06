<script setup>
import {ref, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import 'leaflet/dist/leaflet.css';

const {t} = useI18n();
const mapContainer = ref(null);

const getFormattedDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const currentDate = ref(getFormattedDate());

const setupMap = async () => {
  if (!mapContainer.value) return;
  const L = await import('leaflet');
  const lat = 31.5194; // Latitude for Al Awda Mosque
  const lng = 34.4478; // Longitude for Al Awda Mosque
  const map = L.map(mapContainer.value).setView([lat, lng], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);
  L.marker([lat, lng])
      .addTo(map)
      .bindPopup('<b>Al Awda Mosque</b><br>3 8، Трудовец')
      .openPopup();
};

onMounted(async () => {
  await setupMap();
  fetchPrayerTimes();
  setInterval(updateTime, 1000);
  setInterval(() => {
    currentDate.value = getFormattedDate();
  }, 86400000);
});
</script>

<template>
  <section class="map-container">

    <div class="map-box-container">
      <h2 class="title">{{ t('map_mosque.mosque_location') }}</h2>
      <div ref="mapContainer" class="map" style="height: 350px;"></div>
    </div>

  </section>
</template>


<style scoped>
@import "leaflet/dist/leaflet.css";

.map-container {
  display: block;
  padding: 4rem 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.map-box-container .title {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  text-align: center;
}

.map {
  height: 350px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .map {
    height: 300px;
  }
}

</style>
