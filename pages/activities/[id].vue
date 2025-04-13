<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {ref, onMounted, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useNuxtApp} from '#app'

const {locale, t} = useI18n()
const route = useRoute()
const {$axios} = useNuxtApp()
const api = $axios()

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

  [key: string]: any;

}

const currentActivity = ref<Activity | null>(null)
const allActivities = ref<Activity[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const latestActivities = computed(() => {
  if (!allActivities.value.length) return []

  return allActivities.value
      .filter(f => currentActivity.value ? f.id !== currentActivity.value.id : true)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
})
const featuresList = computed(() => {
  if (!currentActivity.value) return []
  return currentActivity.value[`features_${locale.value}`] || currentActivity.value.features_my || []
})

onMounted(async () => {
  try {
    console.log('Fetching activity data...')
    const response = await api.get(`/content_manager/activities/${route.params.id}`)

    const activitiesResponse = await api.get('/content_manager/activities/')
    allActivities.value = activitiesResponse.data

    console.log('API response:', response.data)
    currentActivity.value = response.data
    isLoading.value = false
  } catch (err: any) {
    console.error('Error fetching activity:', err)
    isLoading.value = false
    error.value = err.message || "Failed to load activity data"
  }
})
</script>

<template>
  <Header/>
  <SubLanding/>
  <section class="activity-detail">
    <div v-if="isLoading" class="loading">
      <p>Loading activity information...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error loading activity: {{ error }}</p>
    </div>

    <div v-else-if="currentActivity" class="activity-content-container">

      <div class="activity-content">

        <h1 class="activity-title">{{ currentActivity[`title_${locale}`] || currentActivity.title_en }}</h1>

        <div class="activity-image">
          <img :src="currentActivity.poster" :alt="currentActivity[`title_${locale}`] || currentActivity.title_en"
               class="main-image">
        </div>

        <div class="activity-info">

          <div class="description">

            <h5 class="summary_content">
              {{ currentActivity[`summary_content_${locale}`] || currentActivity.summary_content_en }}
            </h5>

            <p class="description_content">{{
                currentActivity[`description_${locale}`] || currentActivity.description_my
              }}
            </p>

          </div>

          <div class="meta-info">

            <span>
              <UIcon name="mdi-calendar" class="activity-info-icon"/>
              {{ t("activities.date") }} : {{ currentActivity.activity_date }}
            </span>

            <span>
              <UIcon name="mdi-clock-time-four-outline" class="activity-info-icon"/>
              {{ t("activities.time") }} : {{ currentActivity.time }}
            </span>

            <span>
              <UIcon name="mdi-tag-multiple" class="activity-info-icon"/>
              {{ t("activities.type") }} : {{ currentActivity.activity_type }}
            </span>

            <span>
              <UIcon name="mdi-check-circle-outline" class="activity-info-icon"/>
              {{ t("activities.status") }} : {{ currentActivity.activity_status }}
            </span>

            <span>
              <UIcon name="mdi-map-marker" class="activity-info-icon"/>
              {{ t("activities.location") }} : {{ currentActivity.location }}
            </span>

            <span>
              <UIcon name="mdi-account-star-outline" class="activity-info-icon"/>
              {{ t("activities.target_audience") }} : {{ currentActivity.target_audience }}
            </span>

            <span>
              <UIcon name="mdi-account-group" class="activity-info-icon"/>
              {{ t("activities.participants") }} : {{ currentActivity.estimated_participants }}
            </span>


          </div>

          <div v-if="featuresList.length > 0" class="features-fallback">
            <h2 class="section-title">{{ t('activities.activity.features') }}</h2>
            <ul>
              <li v-for="(feature, index) in featuresList" :key="index">
                <span class="feature-icon">
                  <UIcon
                      name="mdi-mosque"
                  />
                </span>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div class="activities-list-section" v-if="latestActivities.length > 0">
        <h2 class="section-title">{{ t('activities.latest_activities') }}</h2>

        <div class="activities-content">
          <div
              class="activity-card"
              v-for="activity in latestActivities"
              :key="activity.id"
              @click="$router.push(`/activities/${activity.id}`)"
          >
            <div class="activity-image">
              <img
                  :src="activity.poster"
                  :alt="activity[`title_${locale}`|| activity.title_my ]"
                  class="activities-image"
              />
            </div>
            <div class="activity-info">
              <h3 class="activities-title">
                {{ activity[`title_${locale}`] || activity.title_my }}
              </h3>
              <p class="activity-category">{{ activity.category }}</p>

              <NuxtLink :to="`/activities/${activity.id}`" class="activity-btn">
                <UIcon name="mdi-information-outline"/>
                Learn More
              </NuxtLink>

            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="not-found">
      <p>activity not found</p>
    </div>
  </section>
  <BookingStructure/>
  <Footer/>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activity-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeInUp 0.6s ease-in-out;
}

.activity-content-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .activity-content-container {
    grid-template-columns: 3fr 1fr;
  }
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.activity-title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 2rem;
  animation: fadeInUp 0.5s ease;
}

.activity-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  margin: 0 auto 1rem auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  border-radius: 12px;
  animation: fadeInUp 0.8s ease;
}

.activity-info h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  animation: fadeInUp 0.6s ease;
}

.meta-info span {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
}

.description {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.7s ease;
}

.description p,
.features p,
h5 {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--primary-color);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li {
  font-size: 1.1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: fadeInUp 0.9s ease;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 2rem;
}

.activities-content {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.activity-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  margin: .2rem 0;
  border: solid 2px var(--bg-color);
  animation: fadeInUp 1s ease;
}

@media (min-width: 768px) {
  .activity-card {
    flex-direction: row;
    align-items: center;
  }
}

.activity-card img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}

.section-title {
  margin: 0 auto;
  color: var(--primary-color);
  font-size: 1.6rem;
  text-align: center;
}

.activity-btn {
  color: var(--primary-color);
  padding: 1rem 0;
  text-decoration: none;
  display: inline-block;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.activity-btn:hover {
  transform: translateY(-2px);
}
</style>
