<script setup>
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import 'leaflet/dist/leaflet.css';

const {t} = useI18n();
const mapContainer = ref(null);

const city = ref('Kuala Lumpur');
const country = ref('Malaysia');
const method = ref(2);
const prayerTimes = ref(null);
const currentTime = ref(new Date().toLocaleTimeString());

const mainPrayers = [
  {value: "Fajr", label: "Subuh"},
  {value: "Dhuhr", label: "Zohor"},
  {value: "Asr", label: "Asar"},
  {value: "Maghrib", label: "Maghrib"},
  {value: "Isha", label: "Isyak"},
];

const fetchPrayerTimes = async () => {
  try {
    const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=${country.value}&method=${method.value}`
    );
    const {data} = await response.json();

    prayerTimes.value = mainPrayers.reduce((times, prayer) => {
      if (data.timings[prayer.value]) {
        times[prayer.value] = data.timings[prayer.value];
      }
      return times;
    }, {});
  } catch (error) {
    console.error('Failed to fetch prayer times:', error);
  }
};

const formatTime = (time) => {
  if (!time || time === '24:00') return '12:00 AM';
  const date = new Date(`1970-01-01T${time}`);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const addMinutes = (time, minutes) => {
  const date = new Date(`1970-01-01T${time}`);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: true});
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

const formattedPrayerTimes = computed(() => {
  if (!prayerTimes.value) return null;
  return Object.entries(prayerTimes.value).map(([prayer, time]) => {
    const label = mainPrayers.find(p => p.value === prayer)?.label || prayer;
    return {
      name: label,
      original: formatTime(time),
      adjusted: addMinutes(time, 10),
    };
  });
});

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
    <div class="container">
      <div class="prayer-container">
        <div class="prayer-time">
          <h2 class="title">{{ t('map_mosque.prayer_time') }}</h2>
          <div class="time-prayer-content">
            <div class="time-box">
              <div class="time-prayer-title">
                <h3>{{ city }}</h3>
                <h4>{{ currentTime }}</h4>
                <h3>{{ currentDate }}</h3>
              </div>
            </div>

            <div v-if="formattedPrayerTimes" class="time-prayer-container">
              <div
                  v-for="prayer in formattedPrayerTimes"
                  :key="prayer.name"
                  class="prayer-time-box"
              >
                <span class="time-data">
                  {{ prayer.name }}
                </span>
                <hr class="prayer-time-divider"/>
                <span class="time-data">{{ prayer.original }}</span>
              </div>
            </div>

            <p v-else class="loading">Loading prayer times...</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>


<style scoped>
@import "leaflet/dist/leaflet.css";

.map-container {
  display: block;
  background-color: var(--bg-color);
  padding: 4rem 0;
}

.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
}

.prayer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
}

.prayer-time {
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
}

.prayer-time .title,
.map-box-container .title {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  text-align: center;
}

.time-prayer-content {
  background: url("../public/images/masjid-bg.jpg") center/cover no-repeat;
  border-radius: 0;
  padding: 2rem;
  position: relative;
  color: var(--primary-color);
  min-height: 350px;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
}

.time-prayer-content::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: inherit;
  z-index: 0;
}

.time-prayer-title h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  z-index: 1002;
  text-align: center;
}

.time-prayer-title h4 {
  font-size: 2rem;
  text-align: center;
}

.time-prayer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  z-index: 1;
  position: relative;
}

.prayer-time-box {
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 992px) {
  .container {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 768px) {
  .time-prayer-content {
    min-height: 300px;
    padding: 1rem;
  }

  .time-prayer-container {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

@media (max-width: 576px) {
  .time-prayer-content {
    min-height: 200px;
  }

  .prayer-time .title {
    font-size: clamp(1.2rem, 5vw, 1.5rem);
  }

  .time-prayer-container {
    grid-template-columns: 1fr;
  }

  .time-prayer-title h4 {
    font-size: 2.5rem;
  }

}
</style>
