<script setup>
import {ref, onMounted} from 'vue'

const city = 'Kuala Lumpur'
const country = 'Malaysia'
const method = 2
const prayerTimes = ref(null)

const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

const fetchPrayerTimes = async () => {
  try {
    const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
    )
    const data = await response.json()

    prayerTimes.value = Object.keys(data.data.timings)
        .filter(prayer => mainPrayers.includes(prayer))
        .reduce((obj, prayer) => {
          obj[prayer] = data.data.timings[prayer]
          return obj
        }, {})
  } catch (error) {
    console.error('Failed to fetch prayer times:', error)
  }
}

const formatTime = (time) => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const addMinutes = (time, minutes) => {
  const date = new Date(`1970-01-01T${time}`);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: true});
};

onMounted(fetchPrayerTimes)
</script>

<template>
  <div class="prayer-time">
    <div class="container">

      <div class="image-container">
        <img
            src="../public/images/Masjid-Al-Bukhary.png"
            alt="Masjid Al-Bukhary"
            class="prayer-time-image"
            loading="lazy"
        />
      </div>

      <div class="time-prayer-content">
        <h2 class="prayer-time-title">Prayer Azan Times - {{ city }}</h2>

        <div v-if="prayerTimes" class="prayer-times-table">
          <div class="table-header">
            <span class="table-title">Name of Salat</span>
            <span class="table-title">Azan</span>
            <span class="table-title">Prayer</span>
          </div>
          <div
              v-for="(time, prayer) in prayerTimes"
              :key="prayer"
              class="table-row"
          >
            <span class="table-data">{{ prayer }}</span>
            <span class="table-data">{{ formatTime(time) }}</span>
            <span class="table-data">{{ addMinutes(time, 10) }}</span>
          </div>
        </div>

        <p v-else class="loading">Loading prayer times...</p>
      </div>

    </div>
  </div>
</template>

<style scoped>

.prayer-time {
  width: 100%;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-unit);
  color: var(--text-prayer-color);
  align-content: center;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-unit);
  align-items: center;
}

.image-container {
  display: flex;
  justify-content: center;
}


.prayer-time-image {
  width: 100%;
  max-width: 450px;
  height: 425px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.prayer-time-image:hover {
  transform: scale(1.05);
}

.time-prayer-content {
  text-align: center;
  background: linear-gradient(190deg, #c38b1a 0%, #c68414 50%, #F5F5F5 10%);
  border-radius: 8px;
}

.prayer-time-title {
  font-size: 1.5rem;
  color: var(--text-prayer-color);
  margin: var(--spacing-unit);
}

.prayer-times-table {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.table-header,
.table-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 2px dotted var(--text-prayer-color);
}

.table-row:last-child {
  border-bottom: none;
}

.table-header {
  font-weight: bold;
  color: var(--text-prayer-color);
}

.table-data {
  flex: 1;
  text-align: center;
}

.loading {
  font-style: italic;
  color: var(--text-prayer-color);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .prayer-time-image {
    width: 100%;
    height: auto;
  }
}
</style>