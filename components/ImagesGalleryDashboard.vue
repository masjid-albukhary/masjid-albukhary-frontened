<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useNuxtApp} from "#app";

const {t} = useI18n();
const {$axios} = useNuxtApp();
const api = $axios();

interface ImageDetails {
  id: number;
  name_field: string;
  alert_field: string;
  upload_image: string;
}

const images = ref<ImageDetails[]>([]);
const isProcessing = ref(false);

const deleteImage = async (id: number) => {
  if (isProcessing.value) return;

  const isConfirmed = confirm(t('Are you sure you want to delete this image?'));
  if (!isConfirmed) return;

  isProcessing.value = true;

  try {
    await api.delete(`/content_manager/gallery/images/${id}/`);
    images.value = images.value.filter(image => image.id !== id);
  } catch (error) {
    console.error("Failed to delete the image:", error);
  } finally {
    isProcessing.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await api.get("/content_manager/gallery/images/");
    images.value = response.data;
  } catch (error: any) {
    console.error("Failed to load about content:", error);
  }
});
</script>

<template>
  <section class="images-gallery">
    <div class="images-gallery-container">
      <div class="images-gallery-item" v-for="image in images" :key="image.id">
        <div class="image-container">
          <img :src="image.upload_image" :alt="image.alert_field" class="image"/>

          <div class="image-details">
            <h3>{{ image.name_field }}</h3>
            <button @click="deleteImage(image.id)" :disabled="isProcessing" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.images-gallery {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.images-gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
}

.images-gallery-item {
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}

.image-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  text-align: center;
  width: 100%;
  overflow: hidden;
  margin: 1rem;
  background: var(--bg-color);
  padding: 1rem;
}

.image-container img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border-bottom: 2px solid #f1f1f1;
}

.image-details {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-details h3 {
  font-size: 1rem;
  margin: 0;
  color: var(--primary-color);
}

.delete-btn {
  background-color: #ff4d4f;
  color: var(--text-color);
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #dc0f0b;
}

.delete-btn:disabled {
  background-color: #d3d3d3;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .images-gallery-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .image-details h3 {
    font-size: 1rem;
  }

  .delete-btn {
    font-size: 0.8rem;
  }
}
</style>