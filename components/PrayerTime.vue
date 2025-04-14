<script setup>
import {ref, computed, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';

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


const currentHijriDate = ref(getHijriDate())

function getHijriDate() {
  const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(new Date());
}

onMounted(() => {
  setInterval(() => {
    currentHijriDate.value = getHijriDate();
  }, 86400000);
});

</script>

<template>
  <div class="prayer-time">
    <div class="container">
      <div class="time-prayer-content">
        <div class="time-box">

          <div class="time-prayer-title">
<!--            <span class="section-title">{{ city }}</span>-->
<!--            <span class="section-title">{{ currentTime }} {{ currentDate }}</span>-->
            <span class="section-title">{{ currentHijriDate}}</span>

          </div>
        </div>

        <div v-if="formattedPrayerTimes" class="time-prayer-container">
          <div v-for="prayer in formattedPrayerTimes" :key="prayer.name" class="prayer-time-box">
            <span class="F">
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
  padding: 1.5rem;
  color: var(--text-color);
  border-radius: 25px;
}

.container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.time-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-weight: 600;
  line-height: 1.2;
}

.time-prayer-content {
  position: relative;
  background-size: cover;
  background-position: center;
  padding: 0;
  overflow: hidden;
}

.time-prayer-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin: 1rem auto;
}

.prayer-time-box {
  background-color: var(--primary-color);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  min-width: 150px;
  text-align: center;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.prayer-time-divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0.5rem 0;
}

.time-data {
  font-size: 1.2rem;
  font-weight: 500;
}

.mosque-icon {
  margin-right: 0.5rem;
  vertical-align: middle;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .prayer-time {
    padding: 1rem;
  }

  .time-prayer-container {
    display: block;
  }

  .prayer-time-box {
    margin: 1rem auto;
  }


  .section-title {
    font-size: 1.5rem;
  }

  .time-prayer-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .prayer-time-box {
    padding: 0.8rem;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .time-prayer-container {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .time-data {
    font-size: 1rem;
  }
}
</style>