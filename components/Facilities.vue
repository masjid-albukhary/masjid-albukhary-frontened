<script setup lang="ts">
import {computed, ref} from "vue";

interface Video {
  id: number;
  src: string;
  alt: string;
  url: string;
}

const facilities: Video[] = [
  {
    id: 1,
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Video 1",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 2,
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Video 2",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 3,
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Video 3",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 4,
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Video 4",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 5,
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Video 5",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
];

const currentIndex = ref(0);
const itemsPerPage = ref(3);

const visibleFacilities = computed(() => {
  return facilities.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < facilities.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = facilities.length - itemsPerPage.value;
  }
}

</script>


<template>

  <section class="facilities">
    <h1>
      <UIcon
          name="mdi-office-building"
      />Our Facilities</h1>
    <div class="facilities-container">
      <div class="card" v-for="video in visibleFacilities" :key="video.id">
        <a :href="video.url" target="_blank" class="video-link">
          <img :src="video.src" :alt="video.alt" class="card-facilities"/>
          <div class="overlay">
            <UIcon name="mdi-office-building" class="facilities-icon"/>
            <p class="facilities-title">
              <UIcon
                  name="mdi-information-outline"
              />
              Learn More
            </p>

          </div>
        </a>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevPage" class="nav-button">
        <UIcon name="mdi-arrow-left"/>
      </button>
      <button @click="nextPage" class="nav-button">
        <UIcon name="mdi-arrow-right"/>
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
  max-width: 1200px;
}

h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.facilities {
  padding: 2rem;
  text-align: center;
}

.facilities-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.card {
  position: relative;
  width: 300px;
  height: 250px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}

.video-link {
  display: block;
  position: relative;
}

.card-facilities {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out;
}

.card:hover .card-facilities {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 105%;
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

.facilities-icon {
  font-size: 3rem;
  color: white;
}

.facilities-title {
  color: white;
  font-size: 1.2rem;
  margin-top: 10px;
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

.facilities {
  background: var(--bg-color);
}

</style>
