<script setup lang="ts">
import {computed, ref} from "vue";

interface Image {
  id: number;
  src: string;
  alt: string;
}

interface Video {
  id: number;
  src: string;
  alt: string;
}

const images: Image[] = [
  {id: 1, src: "/images/masjid-about-bg.png", alt: "Masjid About 1"},
  {id: 2, src: "/images/masjid-about-bg.png", alt: "Masjid About 2"},
  {id: 3, src: "/images/masjid-about-bg.png", alt: "Masjid About 3"},
  {id: 4, src: "/images/masjid-about-bg.png", alt: "Masjid About 4"},
  {id: 5, src: "/images/masjid-about-bg.png", alt: "Masjid About 5"},
];

const videos: Video[] = [
  {id: 1, src: "videos/about-albukhary-masjid.mp4", alt: "Masjid Video 1"},
  {id: 2, src: "videos/about-albukhary-masjid.mp4", alt: "Masjid Video 2"},
  {id: 3, src: "videos/about-albukhary-masjid.mp4", alt: "Masjid Video 3"},
  {id: 4, src: "videos/about-albukhary-masjid.mp4", alt: "Masjid Video 4"},
  {id: 5, src: "videos/about-albukhary-masjid.mp4", alt: "Masjid Video 5"},
];

const currentIndex = ref(0);
const itemsPerPage = ref(3);
const selectedImage = ref<Image | null>(null);
const selectedVideo = ref<Video | null>(null);

const visibleImages = computed(() => {
  return images.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

const visibleVideos = computed(() => {
  return videos.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < images.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = images.length - itemsPerPage.value;
  }
}

function openPopup(image: Image) {
  selectedImage.value = image;
}

function closePopup() {
  selectedImage.value = null;
  selectedVideo.value = null;
}
</script>


<template>
  <section class="images-gallery">
    <h1>Masjid Albukhary Gallery</h1>
    <div class="container">
      <div class="card" v-for="image in visibleImages" :key="image.id" @click="openPopup(image)">
        <img :src="image.src" :alt="image.alt" class="card-image"/>
      </div>
    </div>
    <div class="buttons">
      <button @click="prevPage" class="nav-button">
        <UIcon
            name="mdi-arrow-left"
        />
      </button>
      <button @click="nextPage" class="nav-button">
        <UIcon
            name="mdi-arrow-right"
        />
      </button>
    </div>

    <div v-if="selectedImage" class="popup-overlay">
      <div class="popup-content">
        <span class="close-btn" @click="closePopup">
          <UIcon
              name="mdi-close"
          /></span>

        <img :src="selectedImage.src" :alt="selectedImage.alt" class="popup-image"/>
      </div>
    </div>

  </section>

  <section class="video-gallery">

    <div class="container">
      <div class="card" v-for="video in visibleVideos" :key="video.id">
        <video ref="videoPlayer" class="card-video" controls>
          <source :src="video.src" type="video/mp4"/>
        </video>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevPage" class="nav-button">
        <UIcon
            name="mdi-arrow-left"
        />
      </button>
      <button @click="nextPage" class="nav-button">
        <UIcon
            name="mdi-arrow-right"
        />
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

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  flex: 1 1 30%;
  max-width: 320px;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  transform: skew(10deg, 5deg);
  transition: transform 0.2s ease-in-out;
}

.card-image:hover{
  transform: scale(1.05);
}

.card-video{
  width: 350px;
  height: 300px;
  border-radius: 5px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 2rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  outline: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.nav-button:hover {
  background-color: var(--secondary-color);
  color: var(--text-color);
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
  z-index: 1000;
}

.popup-content {
  position: relative;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  max-width: 80%;
  max-height: 80%;
}

.popup-image {
  max-width: 90%;
  max-height: 80vh;
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
  background-image: url("../public/images/masjid-about-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

</style>
