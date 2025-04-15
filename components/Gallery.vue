<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useNuxtApp} from "#app";

interface Image {
  id: number;
  name_field: string;
  alert_field: string;
  gallery_image: string;
}

interface Video {
  id: number;
  name_field: string;
  alert_field: string;
  video_link: string;
  gallery_video: string;
}

const {$axios} = useNuxtApp();
const api = $axios()

const images = ref<Image[]>([]);
const videos = ref<Video[]>([]);

const currentImageIndex = ref(0);
const currentVideoIndex = ref(0);
const itemsPerPage = ref(3);

const selectedImage = ref<Image | null>(null);
const selectedVideo = ref<Video | null>(null);

const visibleImages = computed(() => {
  return images.value.slice(currentImageIndex.value, currentImageIndex.value + itemsPerPage.value);
});

const visibleVideos = computed(() => {
  return videos.value.slice(currentVideoIndex.value, currentVideoIndex.value + itemsPerPage.value);
});

function nextImagePage() {
  if (currentImageIndex.value + itemsPerPage.value < images.value.length) {
    currentImageIndex.value += itemsPerPage.value;
  } else {
    currentImageIndex.value = 0;
  }
}

function prevImagePage() {
  if (currentImageIndex.value - itemsPerPage.value >= 0) {
    currentImageIndex.value -= itemsPerPage.value;
  } else {
    currentImageIndex.value = images.value.length - itemsPerPage.value;
  }
}

function nextVideoPage() {
  if (currentVideoIndex.value + itemsPerPage.value < videos.value.length) {
    currentVideoIndex.value += itemsPerPage.value;
  } else {
    currentVideoIndex.value = 0;
  }
}

function prevVideoPage() {
  if (currentVideoIndex.value - itemsPerPage.value >= 0) {
    currentVideoIndex.value -= itemsPerPage.value;
  } else {
    currentVideoIndex.value = videos.value.length - itemsPerPage.value;
  }
}

function openPopup(image: Image) {
  selectedImage.value = image;
}

function closePopup() {
  selectedImage.value = null;
  selectedVideo.value = null;
}

onMounted(async () => {
  try {
    const imageResponse = await api.get("/content_manager/gallery/images/");
    images.value = imageResponse.data;
    console.log("Images:", images.value);

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
  }
});

</script>


<template>
  <section class="images-gallery">
    <h1>
      <UIcon
          name="mdi-folder-multiple-image"
      />
      Masjid Albukhary Images Gallery
    </h1>

    <div class="images-gallery-container">
      <div class="card" v-for="image in visibleImages" :key="image.id" @click="openPopup(image)">
        <img :src="image.gallery_image" :alt="image.alert_field" class="card-image"/>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevImagePage" class="nav-button">
        <UIcon
            name="mdi-arrow-right-circle"
        />
      </button>
      <button @click="nextImagePage" class="nav-button">
        <UIcon
            name="mdi-arrow-right-circle"
        />
      </button>
    </div>

    <div v-if="selectedImage" class="popup-overlay">
      <div class="popup-content">
        <span class="close-btn" @click="closePopup">
          <UIcon
              name="mdi-close"
          /></span>

        <img :src="selectedImage.gallery_image" :alt="selectedImage.gallery_image" class="popup-image"/>
      </div>
    </div>

  </section>

  <section class="video-gallery">
    <h1>
      <UIcon
          name="mdi-movie-open-play"
      />
      Masjid Albukhary Video Gallery
    </h1>
    <div class="video-gallery-container">
      <div class="card" v-for="video in visibleVideos" :key="video.id">
        <a :href="video.video_link" target="_blank" class="video-link">
          <img :src="video.gallery_video" :alt="video.alert_field" class="card-video"/>
          <div class="overlay">
            <UIcon name="mdi-play-circle-outline" class="play-icon"/>
            <p class="video-title">{{ video.alert_field }}</p>
          </div>
        </a>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevVideoPage" class="nav-button">
        <UIcon name="mdi-arrow-left-circle"/>
      </button>
      <button @click="nextVideoPage" class="nav-button">
        <UIcon name="mdi-arrow-right-circle"/>
      </button>
    </div>
  </section>
</template>

<style scoped>

section {
  width: 100%;
  padding: 3rem 1rem;
  text-align: center;
  background: var(--bg-color);
}

h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.images-gallery-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  flex: 1 1 30%;
  max-width: 350px;
  max-height: 250px;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}

.card-image {
  border-radius: 5px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  transition: transform 0.2s ease-in-out;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-image:hover {
  transform: scale(1.05);
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 2rem;
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

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.popup-content {
  position: relative;
  background: var(--bg-color);
  padding: 1rem;
  border-radius: 10px;
  max-width: 800px;
  max-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-image {
  width: 500px;
  max-height: 500px;
  height:auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: 5px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--primary-color);
}


@media (max-width: 768px) {
  .card {
    flex: 1 1 45%;
  }
}

@media (max-width: 480px) {
  .card {
    flex: 1 1 100%;
  }
}

.video-gallery {
  background: var(--bg-hover-color);
  background-repeat: no-repeat;
  background-size: cover;
  padding: 2rem;
  text-align: center;
}

.video-gallery-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.card-video {
  width: 100%;
  max-width: 300px;
  height: auto;
  max-height: 200px;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out;
  object-fit: cover;
  display: block;
}

.video-link {
  display: block;
  position: relative;
}

.card:hover .card-video {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 200px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.card:hover .overlay {
  opacity: 1;
}

.play-icon {
  font-size: 3rem;
  color: white;
}

.video-title {
  color: white;
  font-size: 1.2rem;
  margin-top: 10px;
}


</style>
