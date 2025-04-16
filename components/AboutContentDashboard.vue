<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import AboutContentPopup from '~/components/AboutContentPopup.vue';

interface AboutContent {
  id: number;
  title_en: string;
  title_my: string;
  content_en: string;
  content_my: string;
  about_image: string;
  created_at: string;
}
const columns = [
  { key: 'title_en', label: 'Title English' },
  { key: 'title_my', label: 'Title Malay' },
  { key: 'created_at', label: 'Pushed Date' },
  { key: 'actions', label: 'Actions' },
];
const aboutContentList = ref<AboutContent[]>([]);
const { $axios } = useNuxtApp();
const api = $axios();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedAboutContent = ref<AboutContent | null>(null);
const isLoading = ref(true);

const filteredAboutContent = computed(() => {
  let result = aboutContentList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.title_en.toLowerCase().includes(query) ||
        content.title_my.toLowerCase().includes(query)
    );
  }
  return result;
});
const totalItems = computed(() => filteredAboutContent.value.length);
const paginatedAboutContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredAboutContent.value.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};
const showAboutContentPopup = (content: AboutContent) => {
  selectedAboutContent.value = { ...content };
  isPopupVisible.value = true;
};
const hideAboutContentPopup = () => {
  isPopupVisible.value = false;
  selectedAboutContent.value = null;
};

const submitAboutContentChanges = async (updatedContent: AboutContent) => {
  if (!selectedAboutContent.value) return;

  const formData = new FormData();
  formData.append('title_en', updatedContent.title_en);
  formData.append('title_my', updatedContent.title_my);
  formData.append('content_en', updatedContent.content_en);
  formData.append('content_my', updatedContent.content_my);

  if (updatedContent.about_image instanceof File) {
    formData.append('about_image', updatedContent.about_image);
  } else if (updatedContent.about_image !== selectedAboutContent.value.about_image) {
    formData.append('about_image', updatedContent.about_image);
  }

  try {
    const response = await api.put(`/content_manager/about_us_content/${updatedContent.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update the local list with the latest data from the response
    const index = aboutContentList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      // Use the response data to update the list, which will include the new image URL
      aboutContentList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideAboutContentPopup();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      console.error('Backend error:', error.response.data);
    }
  }
};

const removeAboutContent = async () => {
  if (!selectedAboutContent.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`/content_manager/about_us_content/${selectedAboutContent.value.id}/`);
      aboutContentList.value = aboutContentList.value.filter(c => c.id !== selectedAboutContent.value?.id);
      alert('Content deleted successfully!');
      hideAboutContentPopup();
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
    const response = await api.get("/content_manager/about_us_content/");
    aboutContentList.value = response.data;
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
          <input v-model="searchQuery" placeholder="Search by title..." class="search-box" />
        </div>

        <div v-if="isLoading" class="loading-state">Loading content...</div>

        <div v-else-if="filteredAboutContent.length === 0" class="empty-state">No About content available.</div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedAboutContent" :key="row.id">
              <td>{{ row.title_en }}</td>
              <td>{{ row.title_my }}</td>
              <td>{{ formatDate(row.created_at) }}</td>
              <td>
                <button @click="showAboutContentPopup(row)" class="view-button">View</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-controls" v-if="!isLoading && totalItems > 0">
          <button class="pagination-button" :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">⬅ Prev</button>
          <span>Page {{ currentPage }} of {{ Math.ceil(totalItems / pageSize) }}</span>
          <button class="pagination-button" :disabled="currentPage >= Math.ceil(totalItems / pageSize)" @click="handlePageChange(currentPage + 1)">Next ➡</button>
        </div>
      </main>
    </div>

    <AboutContentPopup
        v-if="isPopupVisible && selectedAboutContent"
        :isPopupVisible="isPopupVisible"
        :selectedAboutContent="selectedAboutContent"
        @hideAboutContentPopup="hideAboutContentPopup"
        @submitAboutContentChanges="submitAboutContentChanges"
        @removeAboutContent="removeAboutContent"
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