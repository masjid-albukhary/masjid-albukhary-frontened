<script setup>
import { ref, onMounted } from "vue";

const mapContainer = ref(null);

onMounted(async () => {
  if (!mapContainer.value || !process.client) return;

  const L = await import("leaflet");

  const lat = 3.1394;
  const lng = 101.7121;

  const map = L.map(mapContainer.value).setView([lat, lng], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
      .addTo(map)
      .bindPopup("<b>Al Bukhary Mosque</b><br>Jln Hang Tuah, Kuala Lumpur")
      .openPopup();
});
</script>

<template>
  <div ref="mapContainer" class="h-[400px] w-full rounded-lg shadow-md"></div>
</template>

<style>
@import "leaflet/dist/leaflet.css";
</style>
