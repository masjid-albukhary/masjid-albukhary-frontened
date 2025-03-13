<script setup>
import {ref, computed, onMounted} from 'vue';

const city = ref('Kuala Lumpur');
const country = ref('Malaysia');
const method = ref(2);
const prayerTimes = ref(null);
const currentTime = ref(new Date().toLocaleTimeString());

const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const fetchPrayerTimes = async () => {
  try {
    const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=${country.value}&method=${method.value}`
    );
    const {data} = await response.json();

    prayerTimes.value = mainPrayers.reduce((times, prayer) => {
      if (data.timings[prayer]) {
        times[prayer] = data.timings[prayer];
      }
      return times;
    }, {});
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
  return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: true});
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

const formattedPrayerTimes = computed(() => {
  if (!prayerTimes.value) return null;
  return Object.entries(prayerTimes.value).map(([prayer, time]) => ({
    name: prayer,
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

onMounted(() => {
  setInterval(() => {
    currentDate.value = getFormattedDate();
  }, 86400000);
});

onMounted(() => {
  fetchPrayerTimes();
  setInterval(updateTime, 1000);
});
</script>

<template>
  <div class="prayer-time">
    <h2 class="title">Prayer Time</h2>
    <div class="container">
      <div class="time-prayer-content">
        <div class="time-box">

          <span class="icon-box">
            <UIcon name="mdi-mosque"/>
          </span>

          <div class="time-prayer-title">
            <h3 class="prayer-time-title">{{ city }}</h3>
            <h4>{{ currentTime }}</h4>
            <h3>{{ currentDate }}</h3>
          </div>

          <span class="icon-box">
            <UIcon name="mdi-mosque"/>
          </span>
        </div>

        <div v-if="formattedPrayerTimes" class="time-prayer-container">
          <div v-for="prayer in formattedPrayerTimes" :key="prayer.name" class="prayer-time-box">
            <span class="time-data">
              <span>
                <UIcon
                    name="mdi-mosque"
                    class="mosque-icon"
                />
              </span>
              {{ prayer.name }}</span>
            <hr class="prayer-time-divider"/>
            <span class="time-data">
              {{ prayer.original }}
            </span>
          </div>
        </div>

        <p v-else class="loading">Loading prayer times...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prayer-time {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-unit);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.prayer-time > h2 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin: 1rem auto;
  text-align: center;
}

.container {
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-unit);
  align-items: center;
}

.time-box {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  gap: var(--spacing-unit);
  text-align: center;
}

.time-box span {
  color: var(--text-color);
  font-size: 4rem;
}

.time-box h3,
.time-box h4 {
  color: var(--text-color);
  z-index: 1002;
}

.time-box h3 {
  font-size: var(--text-size-h3);
}

.time-box h4 {
  font-size: 4rem;
}

.time-prayer-content {
  position: relative;
  text-align: center;
  background-image: url("../public/images/Masjid-Al-Bukhary-1.png");
  background-size: cover;
  background-position: center;
  border-radius: 25px;
  min-height: 350px;
  overflow: hidden;
  z-index: 1;
}

.time-prayer-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.prayer-time-title {
  font-size: var(--text-size-h2);
  color: var(--text-color);
  margin: var(--spacing-unit);
  text-align: center;
}

.time-prayer-container {
  width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-unit);
  margin: 1rem auto;
  padding: var(--spacing-unit);
}

.prayer-time-box {
  background-color: var(--primary-color);
  gap: var(--spacing-unit);
  padding: var(--spacing-unit);
  border-radius: 1rem;
}

@media screen and (max-width: 800px) {
  .container {
    width: 100%;
  }

  .time-prayer-container {
    width: 90%;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .time-box {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .time-box span {
    font-size: 3rem;
  }

  .time-box h3, .time-box h4 {
    font-size: 3rem;
  }

  .time-prayer-content {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .prayer-time > h2 {
    font-size: var(--text-size-h3);
    margin: 1rem auto;
  }

  .time-box span {
    font-size: 2.5rem;
  }

  .time-box h3,
  .time-box h4 {
    font-size: 2.5rem;
  }

  .time-prayer-content {
    min-height: 200px;
  }
}
</style>
