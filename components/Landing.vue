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
/* Base animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

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
  animation: fadeIn 1.2s ease-out;
  position: relative;
  overflow: hidden;
}

/* Add a subtle light pulse effect to the background */
.landing::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.03);
  animation: pulseLight 8s infinite alternate;
  z-index: 0;
}

@keyframes pulseLight {
  0% { background-color: rgba(255,255,255,0.03); }
  100% { background-color: rgba(255,255,255,0.08); }
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: white;
  animation: fadeIn 0.8s ease-out;
}

.landing-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
  animation: slideUp 1s ease-out 0.3s both;
}

.info-container {
  padding: 2rem;
  animation: fadeIn 1s ease-out 0.5s both;
}

.masjid-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-hover);
  background: var(--primary-color);
  padding: 1rem;
  border-radius: 2rem 0;
  font-weight: 600;
  animation: scaleIn 0.8s ease-out 0.7s both;
  transform-origin: left center;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #f8f8f8;
  position: relative;
  padding-bottom: 0.5rem;
  animation: fadeIn 0.8s ease-out 0.8s both;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
  animation: growWidth 0.6s ease-out 1s both;
}

@keyframes growWidth {
  from { width: 0; }
  to { width: 60px; }
}

.activity-highlight {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  animation: slideUp 0.8s ease-out 0.9s both;
}

.activity-highlight:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
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
  position: relative;
}

.activity-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
}

.activity-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s ease;
  animation: scaleIn 0.8s ease-out 1s both;
}

.activity-highlight:hover .activity-img {
  transform: scale(1.05) rotate(0.5deg);
}

.activity-info {
  padding: 2rem;
  color: var(--primary-color);
  animation: fadeIn 0.8s ease-out 1.1s both;
}

.activity-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.activity-highlight:hover .activity-title {
  color: var(--primary-dark);
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
  transition: all 0.3s ease;
}

.activity-highlight:hover .activity-date {
  transform: translateX(3px);
}

.icon {
  margin-right: 0.5rem;
  color: var(--primary-color);
  animation: float 3s ease-in-out infinite;
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
  animation: fadeIn 0.8s ease-out 1.2s both;
}

.activity-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments with animation timing tweaks */
@media (max-width: 1024px) {
  .landing-container {
    gap: 2rem;
    animation-delay: 0.2s;
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
    animation: slideUp 0.8s ease-out 0.2s both;
  }

  .info-container {
    text-align: center;
    padding: 1rem;
    animation-delay: 0.3s;
  }

  .masjid-title {
    font-size: 2rem;
    transform-origin: center;
    animation-delay: 0.4s;
  }

  .section-title {
    font-size: 1.5rem;
    animation-delay: 0.5s;
  }

  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
    animation: growWidthCenter 0.6s ease-out 0.6s both;
  }

  @keyframes growWidthCenter {
    from { width: 0; }
    to { width: 60px; }
  }

  .activity-highlight {
    animation-delay: 0.6s;
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