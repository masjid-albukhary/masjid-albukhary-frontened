<script setup lang="ts">


const aboutItem = [
  {
    id: 1,
    title: "about.aboutUs.title",
    content: "about.aboutUs.content",
    image: "images/Masjid-Al-Bukhary.png",
  },
  {
    id: 2,
    title: "about.vision.title",
    content: "about.vision.content",
    image: "images/Masjid-Al-Bukhary.png",
  },
  {
    id: 3,
    title: "about.mission.title",
    content: "about.mission.content",
    image: "images/Masjid-Al-Bukhary.png",
  },
];
</script>

<template>
  <div class="about-section">
    <h1 class="about-title">about sectionTitle </h1>
    <div class="about-grid" v-for="item in aboutItem" :key="item.id">
      <template v-if="item.id % 2 !== 0">
        <div class="text-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.content }}</p>
        </div>
        <div class="image-content">
          <img :src="item.image" :alt="item.title" class="image" loading="lazy"/>
        </div>
      </template>
      <template v-else>
        <div class="image-content">
          <img :src="item.image" :alt="item.title" class="image" loading="lazy"/>
        </div>
        <div class="text-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.content }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.about-section {
  margin: 5rem auto;
  max-width: 1200px;
  padding: 0 1rem;
}

.about-title {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  font-weight: bold;
  margin-bottom: 2rem;
}

.about-grid {
  width: 85%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  align-items: center;
}

.about-title,
.item-title {
  text-align: start;
  font-size: 1.8rem;
  color: var(--secondary-color);
  font-weight: bold;
  border-bottom: 2px solid var(--secondary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.item-description {
  text-align: justify;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color);
}

.image-content {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-content img {
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.image-content img:hover {
  transform: scale(1.05);
}

@media (max-width: 1024px) {
  .about-grid {
    gap: 2rem;
    width: 90%;
  }

  .about-title {
    font-size: 1.8rem;
  }

  .item-title {
    font-size: 1.5rem;
  }

  .item-description {
    font-size: 1rem;
  }

  .image-content img {
    max-width: 450px;
  }
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    text-align: center;
  }

  .about-section {
    margin: 3rem auto;
  }

  .about-title {
    font-size: 1.7rem;
  }

  .item-title {
    font-size: 1.4rem;
    text-align: center;
  }

  .item-description {
    font-size: 1rem;
    text-align: center;
  }

  .image-content img {
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .about-section {
    margin: 2rem auto;
  }

  .about-title {
    font-size: 1.5rem;
  }

  .item-title {
    font-size: 1.2rem;
  }

  .item-description {
    font-size: 0.95rem;
  }

  .image-content img {
    max-width: 350px;
  }
}
</style>


