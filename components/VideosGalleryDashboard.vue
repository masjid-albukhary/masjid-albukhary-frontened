<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useNuxtApp} from '#app';
import VideoGalleryContentPopup from '~/components/VideoGalleryContentPopup.vue';

interface VideoGalleryContent {
  id: number;
  name_field: string;
  alert_field: string;
  video_link: string;
  gallery_video: string;
  video_type: string;
  created_at: string;
}

const columns = [
  {key: 'gallery_video', label: 'Video '},
  {key: 'name_field', label: 'Name Field'},
  {key: 'alert_field', label: 'Alert Field'},
  {key: 'created_at', label: 'Pushed Date'},
  {key: 'actions', label: 'Actions'},
];
const videoGalleryContentList = ref<VideoGalleryContent[]>([]);
const {$axios} = useNuxtApp();
const api = $axios();
const {t} = useI18n();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedVideoGalleryContent = ref<VideoGalleryContent | null>(null);
const isLoading = ref(true);

const filteredVideoGalleryContent = computed(() => {
  let result = videoGalleryContentList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.name_field.toLowerCase().includes(query) ||
        content.name_field.toLowerCase().includes(query) ||
        content.created_at.toLowerCase().includes(query)
    );
  }
  return result;
});
const totalItems = computed(() => filteredVideoGalleryContent.value.length);
const paginatedVideoGalleryContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredVideoGalleryContent.value.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};
const showVideoGalleryContentPopup = (content: VideoGalleryContent) => {
  selectedVideoGalleryContent.value = {...content};
  isPopupVisible.value = true;
};
const hideVideoGalleryContentPopup = () => {
  isPopupVisible.value = false;
  selectedVideoGalleryContent.value = null;
};

const submitVideoGalleryContentChanges = async (updatedContent: VideoGalleryContent) => {
  if (!selectedVideoGalleryContent.value) return;

  const formData = new FormData();
  formData.append('name_field', updatedContent.name_field);
  formData.append('alert_field', updatedContent.alert_field);
  formData.append('video_link', updatedContent.video_link);
  formData.append('video_type', updatedContent.video_type);
  formData.append('video_type', updatedContent.video_type);

  if (updatedContent.gallery_video instanceof File) {
    formData.append('gallery_video', updatedContent.gallery_video);
  } else if (updatedContent.gallery_video !== selectedVideoGalleryContent.value.gallery_video) {
    formData.append('gallery_video', updatedContent.gallery_video);
  }

  try {
    const response = await api.put(`/content_manager/gallery/videos/${updatedContent.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update the local list with the latest data from the response
    const index = videoGalleryContentList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      // Use the response data to update the list, which will include the new image URL
      videoGalleryContentList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideVideoGalleryContentPopup();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      console.error('Backend error:', error.response.data);
    }
  }
};

const removeVideoGalleryContent = async () => {
  if (!selectedVideoGalleryContent.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`/content_manager/gallery/videos/${selectedVideoGalleryContent.value.id}/`);
      videoGalleryContentList.value = videoGalleryContentList.value.filter(c => c.id !== selectedVideoGalleryContent.value?.id);
      alert('Content deleted successfully!');
      hideVideoGalleryContentPopup();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(async () => {
  try {
    const response = await api.get("/content_manager/gallery/videos/");
    videoGalleryContentList.value = response.data;
  } catch (error) {
    console.error("Error loading content:", error);
    alert("Error loading content.");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section class="dashboard-wrapper">
    <div class="dashboard-container">
      <main class="content-area">

        <div class="content-header">
          <input v-model="searchQuery" placeholder="Search by title..." class="search-box"/>
        </div>

        <div v-if="isLoading" class="loading-state">Loading content...</div>

        <div v-else-if="filteredVideoGalleryContent.length === 0" class="empty-state">No About content available.</div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedVideoGalleryContent" :key="row.id">
              <td>
                <img :src="row.gallery_video" :alt="row.alert_field" class="image-container">

              </td>
              <td>{{ row.name_field }}</td>
              <td>{{ row.alert_field }}</td>
              <td>{{ formatDate(row.created_at) }}</td>
              <td>
                <button @click="showVideoGalleryContentPopup(row)" class="view-button">
                  {{ t('admin.view_details') }}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-controls" v-if="!isLoading && totalItems > 0">
          <button class="pagination-button" :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">⬅
            Prev
          </button>
          <span>Page {{ currentPage }} of {{ Math.ceil(totalItems / pageSize) }}</span>
          <button class="pagination-button" :disabled="currentPage >= Math.ceil(totalItems / pageSize)"
                  @click="handlePageChange(currentPage + 1)">Next ➡
          </button>
        </div>
      </main>
    </div>

    <VideoGalleryContentPopup
        v-if="isPopupVisible && selectedVideoGalleryContent"
        :isPopupVisible="isPopupVisible"
        :selectedVideoGalleryContent="selectedVideoGalleryContent"
        @hideVideoGalleryContentPopup="hideVideoGalleryContentPopup"
        @submitVideoGalleryContentChanges="submitVideoGalleryContentChanges"
        @removeVideoGalleryContent="removeVideoGalleryContent"
    />
  </section>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 1rem;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.search-box {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 300px;
  outline: none;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.image-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.view-button {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.view-button:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  color: var(--primary-color);
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-hover);
  background-color: var(--primary-color);
  border-radius: 4px;
}
</style>