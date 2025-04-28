<script setup>
import { ref, computed, onMounted } from 'vue';

const city = ref('Kuala Lumpur');
const country = ref('Malaysia');
const method = ref(2);
const prayerTimes = ref(null);
const currentTime = ref(new Date().toLocaleTimeString());
const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const prayerNamesMap = {
  Fajr: "Subuh",
  Dhuhr: "Zohor",
  Asr: "Asar",
  Maghrib: "Maghrib",
  Isha: "Isyak"
};

const hijriDate = ref('');

const mapHijriMonth = (month) => {
  const months = {
    "Muharram": "Muharram",
    "Safar": "Safar",
    "Rabi al-awwal": "Rabi' al-awwal",
    "Rabi al-thani": "Rabi' al-thani",
    "Jumada al-awwal": "Jumada al-awwal",
    "Jumada al-thani": "Jumada al-thani",
    "Rajab": "Rajab",
    "Sha'ban": "Sha'ban",
    "Ramadan": "Ramadan",
    "Shawwal": "Shawaal", // Custom spelling here
    "Dhul-Qadah": "Dhul-Qadah",
    "Dhul-Hijjah": "Dhul-Hijjah"
  };
  return months[month] || month;
};

const fetchPrayerTimes = async () => {
  try {
    const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=${country.value}&method=${method.value}`
    );
    const { data } = await response.json();

    prayerTimes.value = mainPrayers.reduce((times, prayer) => {
      if (data.timings[prayer]) {
        times[prayer] = data.timings[prayer];
      }
      return times;
    }, {});

    // Extract Hijri date and format
    const hijriDay = data.date.hijri.day;
    const hijriMonth = mapHijriMonth(data.date.hijri.month.en); // Map Hijri month name
    const hijriYear = data.date.hijri.year;
    hijriDate.value = `${hijriDay} ${hijriMonth} ${hijriYear}`;
  } catch (error) {
    console.error('Failed to fetch prayer times:', error);
  }
};

const formatTime = (time) =>
    new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

const addMinutes = (time, minutes) => {
  const date = new Date(`1970-01-01T${time}`);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

const formattedPrayerTimes = computed(() => {
  if (!prayerTimes.value) return null;
  return Object.entries(prayerTimes.value).map(([prayer, time]) => ({
    name: prayerNamesMap[prayer] || prayer, // Use the local name from the map
    original: formatTime(time),
    adjusted: addMinutes(time, 10),
  }));
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

const fullDate = computed(() => {
  return `${currentDate.value} · ${hijriDate.value}`;
});

onMounted(() => {
  fetchPrayerTimes();
  setInterval(updateTime, 1000);

  setInterval(() => {
    currentDate.value = getFormattedDate();
    fetchPrayerTimes();
  }, 86400000);
});
</script>

<template>
  <div class="prayer-time">
    <div class="time-prayer-content">
      <div class="time-box-title">
        <span class="section-title city">{{ city }}</span>
        <span class="section-title time">{{ fullDate }} {{ currentTime }}</span>
      </div>

      <div v-if="formattedPrayerTimes" class="time-prayer-container">
        <div
            v-for="prayer in formattedPrayerTimes"
            :key="prayer.name"
            class="prayer-time-box"
            :class="prayer.name.toLowerCase()"
        >
          <span class="prayer-name">{{ prayer.name }}</span>
          <span class="time-data">{{ prayer.original }}</span>
        </div>
      </div>

      <p v-else class="loading">Loading prayer times...</p>
    </div>
  </div>
</template>
<style scoped>
.prayer-time {
  display: block;
  width: 100%;
  margin: 0 auto;
  background-color: var(--bg-color);
  padding: 0.5rem;
}

.time-prayer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.time-box-title {
  display: block;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;

  span {
    display: block;
  }
}

.section-title {
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 600;
  line-height: 1.2;
  transition: all 0.3s ease;
}

.time-prayer-container {
  display: flex;
  gap: .5rem;
}

.prayer-time-box {
  color: var(--primary-color);
  text-align: center;
  align-items: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  margin: 0 .5rem ;
}

.prayer-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.time-data {
  font-size: 1.1rem;
  font-weight: 500;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: var(--primary-color);
  animation: pulse 1.5s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .time-box-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .section-title {
    font-size: 0.9rem;
  }

  .prayer-time-box {
    min-width: calc(50% - 0.5rem);
  }

  .prayer-name {
    font-size: 0.8rem;
  }

  .time-data {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .time-prayer-container {
    gap: 0.5rem;
  }

  .prayer-time-box {
    min-width: 100%;
    padding: 0.6rem;
  }

  .section-title {
    font-size: 0.8rem;
  }

  .loading {
    font-size: 1rem;
  }
}

.prayer-time-box:nth-child(1) {
  animation-delay: 0.1s;
}

.prayer-time-box:nth-child(2) {
  animation-delay: 0.2s;
}

.prayer-time-box:nth-child(3) {
  animation-delay: 0.3s;
}

.prayer-time-box:nth-child(4) {
  animation-delay: 0.4s;
}

.prayer-time-box:nth-child(5) {
  animation-delay: 0.5s;
}
</style>