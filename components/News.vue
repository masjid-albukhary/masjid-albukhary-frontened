<script setup lang="ts">
import {computed, ref} from "vue";

interface News {
  id: number;
  src: string;
  alt: string;
  url: string;
}

const news: News[] = [
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

const visibleNews = computed(() => {
  return news.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < news.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = news.length - itemsPerPage.value;
  }
}

</script>

<template>

  <section class="news">
    <h1>
      <UIcon
          name="mdi-office-building"
      />
      Our news
    </h1>
    <div class="news-container">
      <div class="card" v-for="news in visibleNews" :key="news.id">
        <img
            :src="news.src"
            :alt="news.alt"
            class="card-news"
        />
        <div class="overlay">
          <UIcon name="mdi-office-building" class="news-icon"/>
          <NuxtLink :to="`/news/${news.id}`" class="news-title">
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
  padding: 3rem 1rem;
  text-align: center;
  background: var(--bg-color);
  max-width: 1200px;
  margin: 4rem auto;
}

h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.news {
  padding: 2rem;
  text-align: center;
}

.news-container {
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

.card-news {
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

.news-icon {
  font-size: 3rem;
  color: white;
}

.news-title {
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


.news {
  background: var(--bg-color);
}

</style>
