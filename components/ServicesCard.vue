<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useNuxtApp } from "#app";

const { locale, t } = useI18n();
const { $axios } = useNuxtApp();
const api = $axios();

interface Service {
  id: number;
  title_en: string;
  title_my: string;
  description_en: string;
  description_my: string;
  features_en: string;
  features_my: string;
  capacity: number;
  price: number;
  facilities?: string[];
  [key: string]: any;
}

const services = ref<Service[]>([]);
const currentServiceIndex = ref(0);
const itemsPerPage = ref(3);
const loading = ref(true);
const error = ref<string | null>(null);

const visibleService = computed(() => {
  return services.value.slice(currentServiceIndex.value, currentServiceIndex.value + itemsPerPage.value);
});

function nextServicePage() {
  if (currentServiceIndex.value + itemsPerPage.value < services.value.length) {
    currentServiceIndex.value += itemsPerPage.value;
  } else {
    currentServiceIndex.value = 0;
  }
}

function prevServicePage() {
  if (currentServiceIndex.value - itemsPerPage.value >= 0) {
    currentServiceIndex.value -= itemsPerPage.value;
  } else {
    currentServiceIndex.value = services.value.length - itemsPerPage.value;
  }
}

onMounted(async () => {
  try {
    const response = await api.get("/service_facility_management/services/");
    services.value = response.data;
    console.log(services.value);
    console.log("Current Locale:", locale.value);
  } catch (error: any) {
    console.error("Failed to load about content:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    error.value = "Failed to load services. Please try again later.";
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <section class="service-section">

    <div class="service-header">
      <h2 class="service-title">{{ t('service.title') }}</h2>
      <p class="service-description">
        {{ t('service.description') }}
      </p>
    </div>

    <div v-if="loading">Loading services...</div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="!loading && services.length > 0" class="service-grid">

      <div class="service-card" v-for="service in visibleService" :key="service.id">

        <div class="service-card-icon">
          <UIcon name="mdi-home-modern" class="service-icon" />
        </div>

        <div class="service-card-header">
          <h3 class="service-card-title">
            {{ service['title_' + locale] || service.title_en || 'No Title Available' }}
          </h3>
        </div>

        <div class="service-card-content">
          <ul class="service-facilities">
            <li v-for="(feature, index) in (service[`features_${locale}`] || service.features_en || '').split(',')" :key="index">
              <UIcon name="mdi-cogs" class="service-icon" />
              {{ feature.trim() }}
            </li>
          </ul>
        </div>

        <div class="service-card-footer">
          <span class="service-price">
            RM / {{ service.price }}
          </span>

          <router-link to="/services-form" class="booking-structure-btn">
            {{ t('service.button') }}
          </router-link>
        </div>

      </div>

    </div>

    <div v-if="!loading && services.length === 0" class="no-services-message">
      No services available at the moment.
    </div>

    <div class="buttons" v-if="!loading && services.length > 0">

      <button @click="prevServicePage" class="nav-button">
        <UIcon name="mdi-arrow-left-circle" />
      </button>

      <button @click="nextServicePage" class="nav-button">
        <UIcon name="mdi-arrow-right-circle" />
      </button>

    </div>

  </section>
</template>

<style scoped>
section {
  padding: 4rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px !important;
  margin: 0 auto;
}

.service-header {
  max-width: 800px;
  margin-bottom: 2rem;
}

.service-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.service-description {
  font-size: 1.1rem;
  color: var(--secondary-color);
  line-height: 1.6;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.service-card {
  background: linear-gradient(135deg, var(--secondary-color) 20%, var(--primary-color) 100%);
  padding: 2rem 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
  max-width: 400px;
}

.service-card:hover {
  box-shadow: rgba(149, 157, 165, 0.4) 0 8px 24px;
}

.service-card-icon {
  background: rgba(255, 255, 255, 0.3);
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.service-card-icon .service-icon {
  font-size: 2.5rem;
  color: white;
}

.service-card-title {
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
}

.service-card-content{
  min-height: 220px;
}

.service-facilities {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.service-facilities li {
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  transition: all 0.3s ease-in;
}

.service-facilities li:hover {
  opacity: 1;
  color: var(--text-hover);
}

.service-icon {
  font-size: 1.3rem;
}

.service-card-footer{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.service-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text-hover);
  margin: 0 auto;
  padding: .5rem 1rem;
  background: transparent;
}

.booking-structure-btn {
  color: var(--text-color);
  border-radius: 10px;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
  margin: 0 auto;
  padding: .5rem 1rem;
  background: var(--primary-color);
}

.booking-structure-btn:hover {
  background: var(--secondary-color);
  color: var(--text-hover);
}

.register-icon {
  margin-right: 0.75rem;
}


.buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}

.nav-button {
  padding: 0.8rem 1.8rem;
  font-size: 1.5rem;
  background: transparent;
  color: var(--primary-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s, transform 0.2s;
}

.nav-button:hover {
  transform: scale(1.05);
  color: var(--secondary-color);
}
</style>
