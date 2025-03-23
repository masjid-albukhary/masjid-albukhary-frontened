<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import 'leaflet/dist/leaflet.css';

const { t } = useI18n();
const mapContainer = ref(null);

onMounted(async () => {
  if (!mapContainer.value) return;

  const L = await import('leaflet');

  const lat = 3.1394;
  const lng = 101.7121;

  const map = L.map(mapContainer.value).setView([lat, lng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lng])
      .addTo(map)
      .bindPopup('<b>Al Bukhary Mosque</b><br>Jln Hang Tuah, Kuala Lumpur')
      .openPopup();
});
</script>

<template>
  <section class="map-container">

    <h5 class="title">{{ t('mosque_location') }}</h5>
    <div ref="mapContainer" style="height: 400px; width: 100%;" class="rounded-lg shadow-md"></div>
  </section>
</template>


<style>
@import "leaflet/dist/leaflet.css";

section{
  display: block;
}
.map-container {
  max-width: 1000px;
  margin: 5% auto;
}

.title {
  text-align: start;
  font-size: 2em;
  margin: 1rem auto 1rem 2rem;
  color: var(--primary-color);
}


@media (max-width: 1200px) {
  .map-container {
    width: 95%;
    margin: 2.5% auto;
  }

  .title {
    font-size: 1em;
  }
}

</style>
