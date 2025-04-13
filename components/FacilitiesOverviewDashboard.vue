<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import FacilitiesPopup from '~/components/FacilitiesPopup.vue';

interface FacilityContent {
  id: number;
  name_en: string;
  name_my: string;
  description_en: string;
  description_my: string;
  features_en: string [];
  features_my: string [];
  category: string;
  capacity: string;
  price: string;
  location: string;
  photo: string;
  submitted_at: string;
}

const columns = [
  { key: 'name_en', label: 'Facility Name' },
  { key: 'category', label: 'Facility Category' },
  { key: 'capacity', label: 'Facility Capacity' },
  { key: 'actions', label: 'Actions' },
];
const facilityContentList = ref<FacilityContent[]>([]);
const { $axios } = useNuxtApp();
const api = $axios();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedFacilityContent = ref<FacilityContent | null>(null);
const isLoading = ref(true);

const filteredFacilityContent = computed(() => {
  let result = facilityContentList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.name_en.toLowerCase().includes(query) ||
        content.capacity.toLowerCase().includes(query) ||
        content.category.toLowerCase().includes(query)
    );
  }
  return result;
});

const totalItems = computed(() => filteredFacilityContent.value.length);
const paginatedFacilityContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredFacilityContent.value.slice(start, start + pageSize.value);
});
const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};

const showFacilityContentPopup = (content: FacilityContent) => {
  selectedFacilityContent.value = { ...content };
  isPopupVisible.value = true;
};
const hideFacilityContentPopup = () => {
  isPopupVisible.value = false;
  selectedFacilityContent.value = null;
};

const submitFacilityContentChanges = async (updatedContent: FacilityContent) => {
  if (!selectedFacilityContent.value) return;

  const formData = new FormData();
  formData.append('name_en', updatedContent.name_en);
  formData.append('name_my', updatedContent.name_my);
  formData.append('features_en', JSON.stringify(updatedContent.features_en));
  formData.append('features_my', JSON.stringify(updatedContent.features_my));
  formData.append('description_en', updatedContent.description_en);
  formData.append('description_my', updatedContent.description_my);
  formData.append('location', updatedContent.location);
  formData.append('category', updatedContent.category);
  formData.append('capacity', updatedContent.capacity);
  formData.append('price', updatedContent.price);

  formData.append('photo', updatedContent.photo);
  formData.append('submitted_at', updatedContent.submitted_at);

  if (updatedContent.photo instanceof File) {
    formData.append('other_docs', updatedContent.photo);
  } else {
    try {
      const response = await fetch(updatedContent.photo);
      const blob = await response.blob();

      const fileName = updatedContent.photo.split('/').pop() || 'existing_file.jpg';

      const file = new File([blob], fileName, { type: blob.type });
      formData.append('photo', file);
    } catch (err) {
      console.error('Failed to fetch and resend existing image:', err);
      alert('Failed to load existing image for resubmission.');
      return;
    }
  }

  try {
    const response = await api.put(
        `service_facility_management/facilities/${updatedContent.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    const index = facilityContentList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      facilityContentList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideFacilityContentPopup();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      console.error('Backend error:', error.response.data);
    }
  }
};

const removeFacilityContent = async () => {
  if (!selectedFacilityContent.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`service_facility_management/facilities/${selectedFacilityContent.value.id}/`);
      facilityContentList.value = facilityContentList.value.filter(c => c.id !== selectedFacilityContent.value?.id);
      alert('Content deleted successfully!');
      hideFacilityContentPopup();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  }
};

onMounted(async () => {
  try {
    const response = await api.get("service_facility_management/facilities/");
    facilityContentList.value = response.data;
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

        <div v-else-if="filteredFacilityContent.length === 0" class="empty-state">No content available.</div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedFacilityContent" :key="row.id">
              <td>{{ row.name_en }}</td>
              <td>{{ row.category }}</td>
              <td>{{ row.capacity }}</td>
              <td>
                <button @click="showFacilityContentPopup(row)" class="view-button">View</button>
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

    <FacilitiesPopup
        v-if="isPopupVisible && selectedFacilityContent"
        :isPopupVisible="isPopupVisible"
        :selectedFacilityContent="selectedFacilityContent"
        @hideFacilityContentPopup="hideFacilityContentPopup"
        @submitFacilityContentChanges="submitFacilityContentChanges"
        @removeFacilityContent="removeFacilityContent"
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