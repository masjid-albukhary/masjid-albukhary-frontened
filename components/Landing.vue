<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from "vue";
import {useRoute} from 'vue-router'
import {useNuxtApp} from '#app'

interface Activity {
  id: number;
  title_en: string;
  title_my: string;
  summary_content_en: string;
  summary_content_my: string;
  description_en: string;
  description_my: string;
  activity_date: string | null;
  time: string;
  activity_type: string | null;
  activity_status: string | null;
  location: string;
  target_audience: string;
  poster: string | null;
  estimated_participants: number | null;
  created_at: string;
  updated_at: string;

  [key: string]: any;
}

const currentActivity = ref<Activity | null>(null)
const allActivities = ref<Activity[]>([])
const error = ref<string | null>(null)
const isLoading = ref(true)
const {locale, t} = useI18n()
const route = useRoute()
const {$axios} = useNuxtApp()
const api = $axios()

const latestActivities = computed(() => {
  if (!allActivities.value.length) return []

  return [...allActivities.value]
      .filter(f => {

        const notCurrent = currentActivity.value ? f.id !== currentActivity.value.id : true

        const isUpcoming = f.activity_status === 'upcoming'
        return notCurrent && isUpcoming
      })
      .sort((a, b) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || b.updated_at).getTime())
      .slice(0, 2)
})


onMounted(async () => {
  try {
    console.log('Fetching activity data...')
    if (route.params.id) {
      const response = await api.get(`/content_manager/activities/${route.params.id}`)
      currentActivity.value = response.data
    }

    const activitiesResponse = await api.get('/content_manager/activities/')
    allActivities.value = activitiesResponse.data
    isLoading.value = false
  } catch (err: any) {
    console.error('Error fetching activity:', err)
    isLoading.value = false
    error.value = err.message || "Failed to load activity data"
  }
})
</script>

<template>
  <section class="landing">

    <div v-if="isLoading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="landing-container">

      <div class="info-container">
        <h2 class="masjid-title">
          {{ t('landing.title', {locale}) || t('landing.title_en') }}
        </h2>
      </div>

      <div class="prayer-time">

        <PrayerTime/>
      </div>

      <div class="activities-container" v-if="latestActivities.length > 0">

        <h3 class="section-title">
          {{ t('landing.latest_activity', {locale}) || t('landing.latest_activity_en') }}
        </h3>

        <div class="activity-highlight">
          <div
              class="activity-card"
              v-for="activity in latestActivities"
              :key="activity.id"
          >
            <div class="activity-image">
              <img
                  :src="activity.poster || '/images/masjid-activity-placeholder.jpg'"
                  :alt="activity[`title_${locale}`] || activity.title_my"
                  class="activity-img"
              />
            </div>

            <div class="activity-info">

              <h3 class="activity-title">
                {{ activity[`title_${locale}`] || activity.title_my }}
              </h3>

              <div class="activity-meta">

                <span>
                  <UIcon name="mdi-calendar" class="icon"/>
                  {{ activity.activity_date }}
                </span>

                <span>
                  <UIcon name="mdi-clock-outline" class="icon"/>
                  {{ activity.time }}
                </span>

                <span>
                  <UIcon name="mdi-alarm" class="icon"/>
                  {{ activity.activity_status }}
                </span>

              </div>

              <NuxtLink :to="`/activities/${activity.id}`" class="activity-btn">
                <UIcon name="mdi-information-outline"/>
                Learn More
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.landing {
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-image: url("/images/masjid-4.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: var(--text-hover);
  position: relative;
  overflow: hidden;
}

.landing::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: white;
  width: 100%;
  margin: 0 auto;
  z-index: 2;
}

.landing-container {
  width: 100%;
  max-width: 1200px;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.info-container {
  text-align: center;
  animation: fadeIn 1s ease-out;
}

.masjid-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  color: var(--text-hover);
  background: rgba(var(--primary-color), 0.8);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-block;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.prayer-time {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  animation: slideUp 0.8s ease-out 0.3s both;
}

.activities-container {
  animation: fadeIn 0.8s ease-out 0.4s both;
}

.section-title {
  font-size: clamp(1.5rem, 3vw, 1.8rem);
  margin-bottom: 1.5rem;
  color: var(--text-hover);
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.activity-highlight {
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  margin: 0 auto;
}

.activity-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 350px;
  max-height: 150px;
  margin: 0 auto;
  background-color: var(--bg-hover-color);
}

.activity-img {
  width: 100%;
  height: 100%;
  max-width: 350px;
  max-height: 150px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.activity-info {
  padding: .5rem;
  display: block;
  max-width: calc(350px / 2);
  color: var(--text-color);
}

.activity-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.activity-meta span {
  display: block;
  margin-bottom: auto;
  color: var(--secondary-color);
  font-size: 0.95rem;
  gap: 0.5rem;
}

.activity-meta span {
  display: flex;
}

.activity-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.25rem .5rem;
  color: var(--primary-color);
  text-decoration: none;
  width: fit-content;
  margin-top: .5rem;
  transition: all 0.3s ease;
}

.activity-btn:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .landing {
    padding: 1rem;
    min-height: auto;
    background-attachment: scroll;
  }

  .landing-container {
    gap: 1.5rem;
    padding: 0.5rem;
  }


  .activity-highlight {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .activity-card {
    grid-template-columns: 1fr;
  }

  .activity-image {
    height: 200px;
  }

  .activity-info {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .masjid-title {
    padding: 0.75rem 1.5rem;
    font-size: 1.5rem;
  }

  .activity-btn {
    width: 100%;
  }
}
</style>