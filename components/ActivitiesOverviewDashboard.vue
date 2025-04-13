<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useNuxtApp} from '#app';
import ActivityPopup from '~/components/ActivityPopup.vue';

interface ActivityContent {
  id: number;
  title_en: string;
  title_my: string;
  description_en: string;
  description_my: string;
  summary_content_en: string;
  summary_content_my: string;
  activity_date: string;
  time: string;
  activity_type: string;
  activity_status: string;
  location: string;
  target_audience: string;
  poster: string;
  estimated_participants: string;
}

const columns = [
  {key: 'title_en', label: 'Title English'},
  {key: 'activity_status', label: 'Activity Status'},
  {key: 'activity_date', label: 'Booking Date'},
  {key: 'activity_type', label: 'Activity Type'},
  {key: 'actions', label: 'Actions'},
];
const activityContentList = ref<ActivityContent[]>([]);
const {$axios} = useNuxtApp();
const api = $axios();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedActivityContent = ref<ActivityContent | null>(null);
const isLoading = ref(true);
const poster = ref<File | null>(null);

const filteredActivityContent = computed(() => {
  let result = activityContentList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.title_en.toLowerCase().includes(query) ||
        content.activity_type.toLowerCase().includes(query) ||
        content.activity_status.toLowerCase().includes(query)
    );
  }
  return result;
});

const totalItems = computed(() => filteredActivityContent.value.length);
const paginatedActivityContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredActivityContent.value.slice(start, start + pageSize.value);
});
const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};

const showActivityContentPopup = (content: ActivityContent) => {
  selectedActivityContent.value = {...content};
  isPopupVisible.value = true;
};
const hideActivityContentPopup = () => {
  isPopupVisible.value = false;
  selectedActivityContent.value = null;
};

const submitActivityContentChanges = async (updatedContent: ActivityContent) => {
  if (!selectedActivityContent.value) return;

  const formData = new FormData();

  formData.append('title_en', updatedContent.title_en);
  formData.append('title_my', updatedContent.title_my);
  formData.append('description_en', updatedContent.description_en);
  formData.append('description_my', updatedContent.description_my);
  formData.append('summary_content_en', updatedContent.summary_content_en);
  formData.append('summary_content_my', updatedContent.summary_content_my);
  formData.append('activity_date', updatedContent.activity_date );
  formData.append('time', updatedContent.time);
  formData.append('activity_type', updatedContent.activity_type);
  formData.append('activity_status', updatedContent.activity_status);
  formData.append('location', updatedContent.location);
  formData.append('target_audience', updatedContent.target_audience);
  formData.append('estimated_participants', updatedContent.estimated_participants);
  formData.append('poster', updatedContent.poster);


  if (updatedContent.poster instanceof File) {
    // User uploaded a new file
    formData.append('poster', updatedContent.poster);
  } else {
    try {
      const response = await fetch(updatedContent.poster);
      const blob = await response.blob();

      const fileName = updatedContent.poster.split('/').pop() || 'existing_file.jpg';

      const file = new File([blob], fileName, {type: blob.type});
      formData.append('poster', file);
    } catch (err) {
      // console.error('Failed to fetch and resend existing image:', err);
      alert('Failed to load existing image for resubmission.');
      return;
    }
  }

  try {
    const response = await api.put(
        `content_manager/activities/${updatedContent.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    const index = activityContentList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      activityContentList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideActivityContentPopup();
  } catch (error) {
    // console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      // console.error('Backend error:', error.response.data);
    }
  }
};

const removeActivityContent = async () => {
  if (!selectedActivityContent.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`content_manager/activities/${selectedActivityContent.value.id}/`);
      activityContentList.value = activityContentList.value.filter(c => c.id !== selectedActivityContent.value?.id);
      alert('Content deleted successfully!');
      hideActivityContentPopup();
    } catch (error) {
      // console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  }
};

onMounted(async () => {
  try {
    const response = await api.get("content_manager/activities/");
    activityContentList.value = response.data;
  } catch (error) {
    // console.error("Error loading content:", error);
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

        <div v-else-if="filteredActivityContent.length === 0" class="empty-state">No content available.</div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedActivityContent" :key="row.id">
              <td>{{ row.title_en }}</td>
              <td>{{ row.activity_status }}</td>
              <td>{{ row.activity_date }}</td>
              <td>{{ row.activity_type }}</td>
              <td>
                <button @click="showActivityContentPopup(row)" class="view-button">View</button>
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

    <ActivityPopup
        v-if="isPopupVisible && selectedActivityContent"
        :isPopupVisible="isPopupVisible"
        :selectedActivityContent="selectedActivityContent"
        @hideActivityContentPopup="hideActivityContentPopup"
        @submitActivityContentChanges="submitActivityContentChanges"
        @removeActivityContent="removeActivityContent"
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