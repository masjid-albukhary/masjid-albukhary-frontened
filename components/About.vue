<script setup lang="ts">
import {onMounted, ref,} from "vue";
import {useI18n} from "vue-i18n";
import {useNuxtApp} from "#app";

const {locale, t} = useI18n();
const {$axios} = useNuxtApp();
const api = $axios()
const isLoading = ref(false);

interface AboutContent {
  id: number;
  title_en: string;
  title_my: string;
  content_en: string;
  content_my: string;
  about_image: string;

  [key: string]: any;
}

const aboutItem = ref<AboutContent[]>([]);

onMounted(async () => {
  try {
    const response = await api.get("/content_manager/about_us_content/");
    aboutItem.value = response.data;

    // console.log(aboutItem.value);
    // console.log("Current Locale:", locale.value);
  } catch (error: any) {
    console.error("Failed to load about content:", error);
    if (error.response) {
      // console.error("Error response:", error.response.data);
      // console.error("Error status:", error.response.status);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  } finally {
    isLoading.value = false;
  }
});

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


  <div v-if="isLoading" class="loading-state">Loading content...</div>

  <div v-else-if="aboutItem.length === 0" class="empty-state">No About content available.</div>

  <section v-else class="about-section">
    <div class="about-grid" v-for="(item, index) in aboutItem" :key="item.id">
      <template v-if="index % 2 === 0">
        <div class="text-content">
          <h2 class="item-title">
            {{ item['title_' + locale] || item.title_my }}
          </h2>
          <p class="item-description">
            {{ item['content_' + locale] || item.content_my }}
          </p>
        </div>
        <div class="image-content">
          <img
              :src="item.about_image"
              :alt="item.title"
              class="image"
              loading="lazy"
          />
        </div>
      </template>
      <template v-else>
        <div class="image-content">
          <img
              :src="item.about_image"
              :alt="item.title"
              class="image"
              loading="lazy"
          />
        </div>
        <div class="text-content">
          <h2 class="item-title">
            {{ item['title_' + locale] || item.title_my }}
          </h2>
          <p class="item-description">
            {{ item['content_' + locale] || item.content_my }}
          </p>
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

.empty-state {
  width: 100%;
  text-align: center;
  font-style: italic;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 2rem;
  color: var(--primary-color);
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


