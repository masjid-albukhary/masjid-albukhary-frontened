<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useNuxtApp} from "#app";

interface Activity {
  id: number;
  title_en: string;
  title_my: string;
  description_en: string;
  description_my: string;
  summary_content_en: string;
  summary_content_my: string;
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

const {locale, t} = useI18n();
const {$axios} = useNuxtApp();
const isLoading = ref(false);
const api = $axios()
const activities = ref<Activity[]>([]);

const currentIndex = ref(0);
const itemsPerPage = ref(6);

const visibleActivities = computed(() => {
  return activities.value.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < activities.value.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = activities.value.length - itemsPerPage.value;
  }
}

onMounted(async () => {
  try {
    const response = await api.get("/content_manager/activities/");
    activities.value = response.data;

    console.log(activities.value);
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
  } finally {
    isLoading.value = false;
  }
});


</script>

<template>
  <section class="activities">
    <h1 class="title">
      {{ t('activities.title') }}
    </h1>

    <div v-if="isLoading" class="loading-state">Loading content...</div>

    <div v-else-if="visibleActivities.length === 0" class="empty-state">No activities available at the moment.</div>


    <div class="activities-card-container">
      <div
          class="activity-card"
          v-for="activities in visibleActivities"
          :key="activities.id"
      >
        <div class="activity-card_header">
          <div class="activity-card_title">
            {{ activities['title_' + locale] || activities.title_my }}
          </div>
        </div>
        <div class="activity-card_body">
          <div class="activity-card_image">
            <img
                :src="activities.poster"
                :alt="activities.title_my"
                class="card-activities"
                loading="lazy"
            />
          </div>
          <div class="activity-card_description">
            {{ activities['summary_content_' + locale] || activities.summary_content_my }}
          </div>
          <div class="activity-info">

            <div class="box">
              <span><UIcon name="mdi-calendar" class="activity-info-icon"/></span>
              <span>
                {{ t("activities.date") }} : {{ activities.activity_date }}
              </span>
            </div>

            <div class="box">
              <span><UIcon name="mdi-map-marker" class="activity-info-icon"/></span>
              <span>
                {{ t("activities.location") }} : {{ activities.location }}
              </span>
            </div>

            <div class="box">
              <span><UIcon name="mdi-account-group" class="activity-info-icon"/></span>
              <span>
                {{ t("activities.participants") }} : {{ activities.estimated_participants }}
              </span>
            </div>
            <div class="box">
              <span><UIcon name="mdi-alarm" class="activity-info-icon"/></span>
              <span>
                  {{ activities.activity_status }}
              </span>
            </div>

          </div>
        </div>
        <div class="activity-card-footer">
          <div class="activity-btn">
            <NuxtLink :to="`/activities/${activities.id}`">
              {{ t('activities.view_details') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevPage" class="nav-button">
        <UIcon name="mdi-arrow-left-circle"/>
      </button>
      <button @click="nextPage" class="nav-button">
        <UIcon name="mdi-arrow-right-circle"/>
      </button>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  max-width: 1440px;
  padding: 3rem 1rem;
  text-align: center;
  margin: 0 auto;
}

.empty-state {
  width: 100%;
  text-align: center;
  font-style: italic;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 2rem;
  color: var(--primary-color);
}

.title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.activities {
  padding: 1rem;
}

.activities-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  margin: 0 auto;
}

.activity-card {
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 2px solid var(--bg-color);
}

.activity-card_header {
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 2px solid var(--bg-color);
}

.activity-card_title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1.3;
  overflow: hidden;
}

.activity-card_body {
  padding: 1rem 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.activity-card_image {
  margin-bottom: 1rem;
  overflow: hidden;
}

.card-activities {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-card_description {
  font-size: 0.875rem;
  color: var(--text-hover);
  line-height: 1.5;
  margin-bottom: 1rem;
  overflow: hidden;
  font-weight: bold;
  flex-grow: 1;
}

.activity-info {
  display: block;
  align-items: start;
  text-align: start;
}

.activity-info div {
  display: flex;
  align-items: space-around;
  color: var(--primary-color);
  margin-bottom: 0.5rem;

  span:first-of-type {
    margin-right: .5rem;
  }
}

.activity-btn a {
  display: inline-block;
  width: 90%;
  margin: 1rem auto;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  background-color: var(--primary-color);
  padding: 0.625rem 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.activity-btn a:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  gap: 1.5rem;
}

.nav-button {
  padding: 0.5rem;
  font-size: 2rem;
  color: var(--primary-color);
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  color: var(--secondary-color);
  transform: scale(1.1);
}

@media (max-width: 1024px) {
  .activities-card-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  section {
    padding: 2rem 1rem;
  }

  .activities-card-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
    padding: 0.5rem;
  }

  .activity-card_header {
    padding: 1rem 1rem 0.5rem;
  }

  .activity-card_body {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    margin-bottom: 1.5rem;
  }

  .activities-card-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .buttons {
    margin-top: 2rem;
    gap: 1rem;
  }

  .nav-button {
    font-size: 1.75rem;
  }
}
</style>
