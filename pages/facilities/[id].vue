<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {ref, onMounted, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useNuxtApp} from '#app'

const {locale, t} = useI18n()
const route = useRoute()
const {$axios} = useNuxtApp()
const api = $axios()

interface Facility {
  id: number
  name_en: string
  name_my: string
  category: string
  location: string
  description_en: string
  description_my: string
  features_en: string[] // Changed to array type
  features_my: string[] // Changed to array type
  capacity: number
  price: string
  photo: string
  created_at: string

  [key: string]: any
}

const currentFacility = ref<Facility | null>(null)
const allFacilities = ref<Facility[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const latestFacilities = computed(() => {
  if (!allFacilities.value.length) return []

  return allFacilities.value
      .filter(f => currentFacility.value ? f.id !== currentFacility.value.id : true)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
})
const featuresList = computed(() => {
  if (!currentFacility.value) return []
  return currentFacility.value[`features_${locale.value}`] || currentFacility.value.features_my || []
})

onMounted(async () => {
  try {
    console.log('Fetching facility data...')
    const response = await api.get(`/service_facility_management/facilities/${route.params.id}`)

    const facilitiesResponse = await api.get('/service_facility_management/facilities/')
    allFacilities.value = facilitiesResponse.data

    console.log('API response:', response.data)
    currentFacility.value = response.data
    isLoading.value = false
  } catch (err: any) {
    console.error('Error fetching facility:', err)
    isLoading.value = false
    error.value = err.message || "Failed to load facility data"
  }
})
</script>

<template>
  <Header/>
  <section class="facility-detail">
    <div v-if="isLoading" class="loading">
      <p>Loading facility information...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error loading facility: {{ error }}</p>
    </div>

    <div v-else-if="currentFacility" class="facility-content-container">

      <div class="facility-content">
        <h1 class="facility-title">{{ currentFacility[`name_${locale}`] || currentFacility.name_my }}</h1>

        <div class="facility-image">
          <img :src="currentFacility.photo" :alt="currentFacility[`name_${locale}`]" class="main-image">
        </div>

        <div class="facility-info">
          <div class="meta-info">
            <span class="category">
              <UIcon name="mdi-tag"/>
              {{ currentFacility.category }}
            </span>

            <span class="location">
              <UIcon name="mdi-map-marker"/>
              {{ currentFacility.location }}
            </span>

            <span class="capacity" v-if="currentFacility.capacity">
              <UIcon name="mdi-account-group"/>
              {{ currentFacility.capacity }}
            </span>

            <span class="price" v-if="currentFacility.price">
              <UIcon name="mdi-cash"/>
              {{ currentFacility.price }}
            </span>
          </div>

          <div class="description">
            <h2>{{ t('facilities.facility.description') }}</h2>
            <p>{{ currentFacility[`description_${locale}`] || currentFacility.description_my }}</p>
          </div>

          <div v-if="featuresList.length > 0" class="features-fallback">
            <h2 class="section-title">{{ t('facilities.facility.features') }}</h2>
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

      <div class="facilities-list-section" v-if="latestFacilities.length > 0">
        <h2 class="section-title">{{ t('facilities.latest_facilities') }}</h2>

        <div class="facilities-content">
          <div
              class="facility-card"
              v-for="facility in latestFacilities"
              :key="facility.id"
              @click="$router.push(`/facilities/${facility.id}`)"
          >
            <div class="facility-image">
              <img
                  :src="facility.photo"
                  :alt="facility[`name_${locale}`]"
                  class="facilities-image"
              />
            </div>
            <div class="facility-info">
              <h3 class="facilities-title">
                {{ facility[`name_${locale}`] || facility.name_my }}
              </h3>
              <p class="facility-category">{{ facility.category }}</p>

              <NuxtLink :to="`/facilities/${facility.id}`" class="facility-btn">
                <UIcon name="mdi-information-outline"/>
                Learn More
              </NuxtLink>

            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="not-found">
      <p>Facility not found</p>
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

.facility-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeInUp 0.6s ease-in-out;
}

.facility-content-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .facility-content-container {
    grid-template-columns: 3fr 1fr;
  }
}

.facility-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.facility-title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 2rem;
  animation: fadeInUp 0.5s ease;
}

.facility-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  margin: 0 auto 1rem auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  border-radius: 12px;
  animation: fadeInUp 0.8s ease;
}

.facility-info h1 {
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

.description{
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.7s ease;
}

.description p,
.features p {
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

.facilities-content {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.facility-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  margin: .2rem 0;
  border: solid 2px var(--bg-color);
  animation: fadeInUp 1s ease;
}

@media (min-width: 768px) {
  .facility-card {
    flex-direction: row;
    align-items: center;
  }
}

.facility-card img {
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

.facility-btn {
  color: var(--primary-color);
  padding: 1rem 0;
  text-decoration: none;
  display: inline-block;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.facility-btn:hover {
  transform: translateY(-2px);
}
</style>
