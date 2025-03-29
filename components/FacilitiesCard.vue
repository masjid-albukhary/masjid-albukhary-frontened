<script setup lang="ts">
import {computed, ref} from "vue";

interface Facility {
  id: number;
  src: string;
  alt: string;
  url: string;
}

const facilities: Facility[] = [
  {
    id: 1,
    src: "images/masjid-about-bg.png",
    alt: "Masjid Video 1",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 2,
    src: "images/masjid-about-bg.png",
    alt: "Masjid Video 2",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 3,
    src: "images/masjid-about-bg.png",
    alt: "Masjid Video 3",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 4,
    src: "images/masjid-about-bg.png",
    alt: "Masjid Video 4",
    url: "https://www.youtube.com/watch?v=4pku9EburYQ"
  },
  {
    id: 5,
    src: "images/masjid-about-bg.png",
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
      />
      Our Facilities
    </h1>
    <div class="facilities-container">
      <div class="card" v-for="facility in visibleFacilities" :key="facility.id">
        <img
            :src="facility.src"
            :alt="facility.alt"
            class="card-facilities"
        />
        <div class="overlay">
          <UIcon name="mdi-office-building" class="facilities-icon"/>
          <NuxtLink :to="`/facilities/${facility.id}`" class="facilities-title">
            <UIcon name="mdi-information-outline" />
            Learn More
          </NuxtLink>

        </div>
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
  text-align: center;
  background: var(--bg-color);
  margin: auto;
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
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  flex: 1 1 calc(33.33% - 1rem);
  max-width: 400px;
  position: relative;
  height: 250px;
  overflow: hidden;
  cursor: pointer;
}

.card-facilities {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
    flex: 1 1 calc(50% - 1rem);
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
