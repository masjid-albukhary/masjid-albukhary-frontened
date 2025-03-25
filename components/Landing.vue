<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface LandingItems {
  id: number;
  title: string;
  content: string;
  color: string;
  url: string;
}

const landingItems: LandingItems[] = [
  { id: 1, title: "Masjid 1", content: "This is the first masjid description.", color: "#3498db", url: "string" },
  { id: 2, title: "Masjid 2", content: "This is the second masjid description.", color: "#2ecc71", url: "string" },
  { id: 3, title: "Masjid 3", content: "This is the third masjid description.", color: "#e74c3c", url: "string" },
  { id: 4, title: "Masjid 4", content: "This is the fourth masjid description.", color: "#f1c40f", url: "string" },
  { id: 5, title: "Masjid 5", content: "This is the fifth masjid description.", color: "#9b59b6", url: "string" },
  { id: 6, title: "Masjid 6", content: "This is the sixth masjid description.", color: "#34495e", url: "string" },
];

const activeIndex = ref(0);
let intervalId: number | null = null;

// Loading state
const isLoading = ref(true);

const nextItem = () => {
  activeIndex.value = (activeIndex.value + 1) % landingItems.length;
};

const prevItem = () => {
  activeIndex.value = (activeIndex.value - 1 + landingItems.length) % landingItems.length;
};

const goToItem = (index: number) => {
  activeIndex.value = index;
};

const getVisibleBullets = computed(() => {
  const totalItems = landingItems.length;
  const maxBullets = 3;

  if (totalItems <= maxBullets) {
    return landingItems.map((item, index) => ({ ...item, index }));
  }

  let start = Math.max(0, activeIndex.value - 1);
  start = Math.min(start, totalItems - maxBullets);

  return landingItems.slice(start, start + maxBullets).map((item, i) => ({
    ...item,
    index: start + i,
  }));
});

onMounted(() => {

  setTimeout(() => {
    isLoading.value = false;
    intervalId = setInterval(nextItem, 5000);
  }, 1500);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <section class="landing">
    <div v-if="isLoading" class="loading">
      Loading...
    </div>

    <div v-else class="landing-container">
      <div class="landing-card">
        <h1 class="title">Landing Page</h1>
        <h2 class="sub-title">{{ landingItems[activeIndex].title }}</h2>
        <p class="content">{{ landingItems[activeIndex].content }}</p>
      </div>

      <div class="pagination">
        <span @click="prevItem" class="nav-btn">
          <UIcon name="mdi-chevron-left" />
        </span>

        <div class="dots">
          <span
              v-for="item in getVisibleBullets"
              :key="item.id"
              class="dot"
              :class="{ active: item.index === activeIndex }"
              @click="goToItem(item.index)"
          ></span>
        </div>

        <span @click="nextItem" class="nav-btn">
          <UIcon name="mdi-chevron-right" />
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url("/images/masjid-4.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  padding: 20px;
}

.landing-container {
  position: relative;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  max-width: 800px;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


@media (max-width: 1024px) {
  .landing-container {
    width: 80%;
  }
}

@media (max-width: 768px) {
  .landing-container {
    width: 90%;
    padding: 15px;
  }

  .nav-btn {
    font-size: 20px;
    padding: 8px;
  }

  .dot {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  section {
    padding: 10px;
  }

  .landing-container {
    width: 95%;
    padding: 10px;
  }

  .landing-card {
    padding: 15px;
  }

  .nav-btn {
    font-size: 18px;
    padding: 6px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}

.landing-card {
  padding: 20px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
}

.dots {
  display: flex;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: gray;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.dot.active {
  background-color: black;
}
</style>
