<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useNuxtApp} from "#app";

interface Video {
  id: number;
  name_field: string;
  alert_field: string;
  video_link: string;
  gallery_video: string;
  video_type: string;
}

const {t} = useI18n();
const {$axios} = useNuxtApp();
const api = $axios()
const VIDEO_TYPE_LABELS: Record<string, string> = {
  "weekly talk": "Weekly Talk",
  "general": "General",
};
const videos = ref<Video[]>([]);
const currentVideoIndex = ref(0);
const itemsPerPage = ref(4);
const isLoading = ref(false);

function nextVideoPage() {
  if (currentVideoIndex.value + itemsPerPage.value < filteredVideos.value.length) {
    currentVideoIndex.value += itemsPerPage.value;
  } else {
    currentVideoIndex.value = 0;
  }
}

function prevVideoPage() {
  if (currentVideoIndex.value - itemsPerPage.value >= 0) {
    currentVideoIndex.value -= itemsPerPage.value;
  } else {
    currentVideoIndex.value = Math.max(0, filteredVideos.value.length - itemsPerPage.value);
  }
}

const filteredVideos = computed(() => {
  if (!videos.value.length) return [];
  return videos.value.filter(video => video.video_type === 'weekly talk');
});
const latestWeeklyTalks = computed(() => {
  return filteredVideos.value.slice(
      currentVideoIndex.value,
      currentVideoIndex.value + itemsPerPage.value
  );
});

onMounted(async () => {
  try {
    const videoResponse = await api.get("/content_manager/gallery/videos/");
    videos.value = videoResponse.data;
    console.log("Videos:", videos.value);
  } catch (error) {
    console.error("Failed to load data:", error);
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
  <section class="video-gallery">
    <h1 class="section-title">{{ t('weekly_talk') }}</h1>

    <div v-if="isLoading" class="loading-state">Loading content...</div>

    <div v-else-if="latestWeeklyTalks.length === 0" class="empty-state">No content available.</div>


    <div v-else class="videos-gallery-container">
      <div
          class="card"
          v-for="(video, index) in latestWeeklyTalks"
          :key="video.id"
          :style="{ '--delay': index * 0.1 + 's' }"
      >
        <div class="card-image">
          <img
              :src="video.gallery_video"
              :alt="video.alert_field"
              class="card-video"
              loading="lazy"
          />
        </div>

        <div class="video-info">
          <p class="video-title">
            <UIcon name="mdi-format-title" class="icon"/>
            {{ video.name_field }}
          </p>

          <p class="video-type">
            <UIcon name="mdi-label" class="icon"/>
            {{ VIDEO_TYPE_LABELS[video.video_type] || video.video_type }}
          </p>

          <a
              :href="video.video_link"
              target="_blank"
              class="video-link"
              aria-label="Watch video"
          >
            <UIcon name="mdi-play-circle" class="icon"/>
            {{ t('watch_video') }}
          </a>
        </div>
      </div>
    </div>

    <div class="pagination-controls">
      <button
          @click="prevVideoPage"
          class="nav-button"
          aria-label="Previous videos"
      >
        <UIcon name="mdi-arrow-left-circle"/>
      </button>
      <button
          @click="nextVideoPage"
          class="nav-button"
          aria-label="Next videos"
      >
        <UIcon name="mdi-arrow-right-circle"/>
      </button>
    </div>
  </section>
</template>

<style scoped>
.video-gallery {
  width: 100%;
  padding: 3rem 1rem;
  text-align: center;
  background: var(--bg-color);
  overflow: hidden;
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

.section-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--primary-color);
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  animation: fadeInUp 0.8s ease-out;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--secondary-color);
  animation: growWidth 0.6s ease-out 0.3s both;
}

.videos-gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10rem 10rem 10rem 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  transform: translateY(20px);
  opacity: 0;
  animation: fadeInUp 0.6s ease-out var(--delay) forwards;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-image {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
}

.card-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .card-video {
  transform: scale(1.05);
}

.video-info {
  padding: 1.5rem;
  text-align: left;
  color: var(--primary-color);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.video-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
}

.video-type {
  font-size: 0.9rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.video-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: var(--primary-color);
  color: var(--text-hover);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: auto;
  width: fit-content;
}

.video-link:hover {
  background-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon {
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
}

.video-link:hover .icon {
  transform: scale(1.2);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1.5rem;
}

.nav-button {
  padding: 0.75rem;
  font-size: 1.8rem;
  background: transparent;
  color: var(--primary-color);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  color: var(--secondary-color);
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

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

@keyframes growWidth {
  from {
    width: 0;
  }
  to {
    width: 60px;
  }
}

@media (max-width: 768px) {
  .videos-gallery-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .video-info {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .videos-gallery-container {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .nav-button {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
}
</style>