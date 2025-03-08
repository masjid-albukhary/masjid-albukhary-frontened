<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';

interface LandingItems {
  id: number;
  title: string;
  content: string;
  color: string;
  url: string;
}

const landingItems: LandingItems[] = [
  {id: 1, title: "Masjid 1", content: "This is the first masjid description.", color: "#3498db", url: "string"},
  {id: 2, title: "Masjid 2", content: "This is the second masjid description.", color: "#2ecc71", url: "string"},
  {id: 3, title: "Masjid 3", content: "This is the third masjid description.", color: "#e74c3c", url: "string"}
];

const activeIndex = ref(0);
let intervalId: number | null = null;

const nextItem = () => {
  activeIndex.value = (activeIndex.value + 1) % landingItems.length;
};

const prevItem = () => {
  activeIndex.value = (activeIndex.value - 1 + landingItems.length) % landingItems.length;
};

const goToItem = (index: number) => {
  activeIndex.value = index;
};

onMounted(() => {
  intervalId = setInterval(nextItem, 10000);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <section class="landing">
    <div class="landing-container">
      <div class="landing-card">
        <h1 class="title">Landing Page</h1>
        <h2 class="sub-title">{{ landingItems[activeIndex].title }}</h2>
        <p class="content"> {{ landingItems[activeIndex].content }}</p>
      </div>

      <div class="pagination">
        <span @click="prevItem" class="nav-btn">

          <UIcon
              name="mdi-chevron-left"          />

        </span>

        <div class="dots">
          <span
              v-for="(item, index) in landingItems"
              :key="item.id"
              class="dot"
              :class="{ active: index === activeIndex }"
              @click="goToItem(index)">
          </span>
        </div>

        <span @click="nextItem" class="nav-btn">
          <UIcon
              name="mdi-chevron-right"
          />
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url("../public/images/masjid-1.png");
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

/* Responsive Design */
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
