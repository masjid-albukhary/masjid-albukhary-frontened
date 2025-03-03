<script setup>
import { ref, onMounted } from 'vue'

const city = 'Kuala Lumpur'
const country = 'Malaysia'
const method = 2
const prayerTimes = ref(null)

// Function to fetch prayer times
const fetchPrayerTimes = async () => {
  try {
    const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
    )
    const data = await response.json()
    prayerTimes.value = data.data.timings
  } catch (error) {
    console.error('Failed to fetch prayer times:', error)
  }
}

// Function to format time (12-hour AM/PM)
const formatTime = (time) => {
  return new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Function to add minutes for prayer time (e.g., 10 minutes after Azan)
const addMinutes = (time, minutes) => {
  const date = new Date(`1970-01-01T${time}Z`);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

onMounted(fetchPrayerTimes)
</script>

<template>
  <div class="p-6 bg-white shadow-md rounded-xl">
    <h2 class="text-xl font-semibold text-center">Prayer & Azan Times - {{ city }}</h2>
    <ul v-if="prayerTimes" class="mt-4 space-y-2">
      <li v-for="(time, prayer) in prayerTimes" :key="prayer" class="flex justify-between border-b pb-2">
        <div class="flex flex-col">
          <span class="font-medium">{{ prayer }}</span>
          <small class="text-gray-500">Azan: {{ formatTime(time) }}</small>
          <small class="text-gray-600">Prayer: {{ addMinutes(time, 10) }}</small>
        </div>
      </li>
    </ul>
    <p v-else class="text-center text-gray-500">Loading prayer times...</p>
  </div>
</template>

<style scoped>
/* Tailwind styles */
</style>
