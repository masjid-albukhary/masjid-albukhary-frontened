<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const aboutItem = [
  {
    id: 1,
    title: t("about.items[0].title"),
    content: t("about.items[0].content"),
    image: "images/Masjid-Al-Bukhary.png",
  },
  {
    id: 2,
    title: t("about.items[1].title"),
    content: t("about.items[1].content"),
    image: "images/Masjid-Al-Bukhary.png",
  },
]
</script>

<template>
  <section class="about-section">
    <h1 class="about-title">{{ t('about.title') }}</h1>
    <div class="about-content">
      <div class="description">
        <h3>{{ t('about.descriptionTitle') }}</h3>
        <p class="description-text">{{ t('about.descriptionText') }}</p>
      </div>

      <div class="video-container">
        <video ref="videoPlayer" class="video" controls>
          <source src="../public/videos/about-albukhary-masjid.mp4" type="video/mp4"/>
        </video>
      </div>
    </div>
  </section>

  <section class="about-section">
    <div class="about-grid" v-for="(item, index) in aboutItem" :key="index">
      <template v-if="index % 2 === 0">
        <div class="text-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.content }}</p>
        </div>
        <div class="image-content">
          <img src="../public/images/Masjid-Al-Bukhary.png" :alt="item.title" class="image" loading="lazy"/>
        </div>
      </template>
      <template v-else>
        <div class="image-content">
          <img src="../public/images/Masjid-Al-Bukhary.png" :alt="item.title" class="image" loading="lazy"/>
        </div>
        <div class="text-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.content }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
section {
  margin: 5rem auto;
  max-width: 1200px;
  padding: 0 1rem;
  display: block;
  height: 100%;
}

.about-title {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  font-weight: bold;
  margin-bottom: 2rem;
}

.about-content {
  background-image: url("../public/images/masjid-about-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 5rem auto;
  box-shadow: rgba(149, 157, 165, 0.5) 0 8px 24px;
  padding: 2rem 4rem;
}

.video-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.video {
  width: 100%;
  max-width: 450px;
  height: auto;
  aspect-ratio: 16/9;
  border-radius: 20px;
  background-color: var(--primary-color);
  border: none;
  overflow: hidden;
  margin-top: -8rem;
}

.about-content h3 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.about-content p {
  text-align: justify;
  font-size: 1rem;
  color: var(--primary-color);
}

@media (max-width: 1024px) {
  .about-title {
    font-size: 1.5rem;
  }

  .about-content {
    display: block;
    padding: 2rem;
  }

  .video-container {
    margin: 3rem auto;
  }

  .video {
    max-width: 100%;
    margin-top: 0;
  }

  .about-content h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .about-title {
    font-size: 1.5rem;
  }

  .about-content {
    display: block;
    gap: 0;
    padding: 1rem;
  }

  .video {
    max-width: 100%;
    margin-top: 0;

  }

  .about-content h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .about-title {
    font-size: 1.3rem;
  }

  .about-content {
    display: block;
    padding: 1rem;
  }

  .video {
    max-width: 100%;
    margin-top: 0;

  }

  .about-content h3 {
    font-size: 1.1rem;
  }
}

.about-grid {
  width: 100%;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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
  color: var(--secondary-color);
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
  aspect-ratio: 16/9;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.image-content img:hover {
  transform: scale(1.005);
}

@media (max-width: 1024px) {
  .about-content {
    display: block;
  }

  .about-grid {
    gap: 2rem;
    width: 100%;
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
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
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
    max-width: 100%;
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
    text-align: justify;
  }

  .image-content img {
    max-width: 100%;
  }
}
</style>


