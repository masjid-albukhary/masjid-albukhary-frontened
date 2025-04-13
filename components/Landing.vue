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
      .filter(f => currentActivity.value ? f.id !== currentActivity.value.id : true)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 1)
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
          {{ t('landing.title', { locale }) || t('landing.title_en') }}
        </h2>
      </div>

      <div class="activities-container" v-if="latestActivities.length > 0">

        <h3 class="section-title">
          {{ t('landing.latest_activity', { locale }) || t('landing.latest_activity_en') }}
        </h3>

        <div class="activity-highlight">
          <div class="activity-card">

            <div class="activity-image">
              <img
                  :src="latestActivities[0].poster || '/images/masjid-activity-placeholder.jpg'"
                  :alt="latestActivities[0][`title_${locale}`] || latestActivities[0].title_my"
                  class="activity-img"
              />
            </div>

            <div class="activity-info">

              <h3 class="activity-title">
                {{ latestActivities[0][`title_${locale}`] || latestActivities[0].title_my }}
              </h3>

              <div class="activity-meta">
                <p class="activity-date">
                  <UIcon name="mdi-calendar" class="icon"/>
                  {{ latestActivities[0].activity_date }} • {{ latestActivities[0].time }}
                </p>
              </div>

              <NuxtLink :to="`/activities/${latestActivities[0].id}`" class="activity-btn">
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
.landing {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background-image: url("/images/masjid-4.jpg");
  background-size: cover;
  background-position: center;
  color: var(--text-hover);
  height: 100vh;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: white;
}

.landing-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.info-container {
  padding: 2rem;
}

.masjid-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-hover);
  background: var(--primary-color);
  padding: 1rem;
  border-radius: 2rem 0;
  font-weight: 600;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #f8f8f8;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.activity-highlight {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.activity-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.activity-image {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.activity-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.activity-info {
  padding: 2rem;
  color: var(--primary-color);
}

.activity-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.activity-meta {
  margin-bottom: 1rem;
}

.activity-date {
  color: var(--primary-color);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
  color: var(--primary-color);
}

.activity-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.activity-btn:hover {
  background-color: var(--primary-color);
}

@media (max-width: 1024px) {
  .landing-container {
    gap: 2rem;
  }

  .activity-image {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .landing {
    padding: 1.5rem;
  }

  .landing-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .info-container {
    text-align: center;
    padding: 1rem;
  }

  .masjid-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 480px) {
  .landing {
    padding: 1rem;
  }

  .activity-image {
    height: 180px;
  }

  .activity-info {
    padding: 1.5rem;
  }

  .activity-title {
    font-size: 1.3rem;
  }
}
</style>