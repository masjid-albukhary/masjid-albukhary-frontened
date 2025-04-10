<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useNuxtApp} from "#app";

const {t} = useI18n();
const {$axios} = useNuxtApp();
const api = $axios();

interface VideoDetails {
  id: number;
  name_field: string;
  alert_field: string;
  video_link: string;
  upload_image: string;
}

const videos = ref<VideoDetails[]>([]);
const isProcessing = ref(false);

const deleteVideo = async (id: number) => {
  if (isProcessing.value) return;

  const isConfirmed = confirm(t('Are you sure you want to delete this video?'));
  if (!isConfirmed) return;

  isProcessing.value = true;

  try {
    await api.delete(`/content_manager/gallery/images/${id}/`);
    videos.value = videos.value.filter(video => video.id !== id);
  } catch (error) {
    console.error("Failed to delete the video:", error);
  } finally {
    isProcessing.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await api.get("/content_manager/gallery/videos/");
    videos.value = response.data;
  } catch (error: any) {
    console.error("Failed to load about content:", error);
  }
});


const currentIndex = ref(0);
const itemsPerPage = ref(6);

const visibleVideos = computed(() => {
  return videos.value.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < videos.value.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = videos.value.length - itemsPerPage.value;
  }
}


</script>

<template>
  <section class="videos-gallery">
    <div class="videos-gallery-container">

      <div class="videos-gallery-item" v-for="video in visibleVideos" :key="video.id">
        <div class="video-container">
          <img :src="video.upload_image" :alt="video.alert_field" class="video-image"/>

          <div class="video-details">
            <div class="box-info">
              <span>{{ t('Name Field') }}:</span>
              <span>{{ video.name_field }}</span>
            </div>
            <div class="box-info">
              <span>{{ t('Link') }}:</span>
              <span><a :href="video.video_link" target="_blank">{{ t('Watch Video') }}</a></span>
            </div>
            <button @click="deleteVideo(video.id)" :disabled="isProcessing" class="delete-btn">{{
                t('Delete')
              }}
            </button>
          </div>
        </div>
      </div>

      <div class="videos-gallery-buttons">
        <button @click="prevPage" class="nav-button">
          <UIcon name="mdi-arrow-left-circle"/>
        </button>
        <button @click="nextPage" class="nav-button">
          <UIcon name="mdi-arrow-right-circle"/>
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.videos-gallery {
  padding: 30px 20px;
  display: flex;
  justify-content: center;
  background-color: #f9f9f9;
}

.videos-gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
}

.videos-gallery-item {
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  border: 1px solid var(--text-hover);
}

.video-container {
  padding: 20px;
  text-align: center;
}

.video-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.video-details {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.box-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.box-info span:first-child {
  font-weight: 600;
  color: var(--primary-color);
}

.box-info span {
  margin-left: 8px;
  color: var(--primary-color);
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

a:hover {
  text-decoration: underline;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #dc0f0b;
}

.delete-btn:disabled {
  background-color: #d3d3d3;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .video-container {
    padding: 15px;
  }

  .video-image {
    height: 150px;
  }

  .delete-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}

.videos-gallery-buttons {
  display: flex;
  justify-content: center;
  margin: 1.5rem auto;
  gap: 2rem;
  align-items: center;
}

.nav-button {
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  background: transparent;
  color: var(--primary-color);
  border: none;
  outline: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.nav-button:hover {
  color: var(--secondary-color);
}

</style>
