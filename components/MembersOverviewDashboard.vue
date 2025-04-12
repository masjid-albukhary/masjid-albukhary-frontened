<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import MemberInfoPopup from '~/components/MemberInfoPopup.vue';

interface MemberDetails {
  id: number;
  name: string;
  role: string;
  photo: string;
  created_at: string;
}

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'photo', label: 'Photo' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Actions' },
];

const memberDetailsList = ref<MemberDetails[]>([]);
const { $axios } = useNuxtApp();
const api = $axios();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedMemberDetails = ref<MemberDetails | null>(null);
const isLoading = ref(true);

const filteredMemberDetails = computed(() => {
  let result = memberDetailsList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.name.toLowerCase().includes(query) ||
        content.role.toLowerCase().includes(query)
    );
  }
  return result;
});

const totalItems = computed(() => filteredMemberDetails.value.length);
const paginatedMemberDetails = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredMemberDetails.value.slice(start, start + pageSize.value);
});
const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};

const showMemberDetailsPopup = (content: MemberDetails) => {
  selectedMemberDetails.value = { ...content };
  isPopupVisible.value = true;
};
const hideMemberDetailsPopup = () => {
  isPopupVisible.value = false;
  selectedMemberDetails.value = null;
};

const submitMemberDetailsChanges = async (updatedContent: MemberDetails) => {
  if (!selectedMemberDetails.value) return;

  const formData = new FormData();
  formData.append('name', updatedContent.name);
  formData.append('role', updatedContent.role);

  if (updatedContent.photo instanceof File) {
    formData.append('photo', updatedContent.photo);
  } else {
    try {
      const response = await fetch(updatedContent.photo);
      const blob = await response.blob();

      const fileName = updatedContent.photo.split('/').pop() || 'existing_file.jpg';

      const file = new File([blob], fileName, { type: blob.type });
      formData.append('photophoto', file);
    } catch (err) {
      console.error('Failed to fetch and resend existing image:', err);
      alert('Failed to load existing image for resubmission.');
      return;
    }
  }

  try {
    const response = await api.put(
        `/content_manager/member/${updatedContent.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    const index = memberDetailsList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      memberDetailsList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideMemberDetailsPopup();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      console.error('Backend error:', error.response.data);
    }
  }
};

const removeMemberDetails = async () => {
  if (!selectedMemberDetails.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`/content_manager/member/${selectedMemberDetails.value.id}/`);
      memberDetailsList.value = memberDetailsList.value.filter(c => c.id !== selectedMemberDetails.value?.id);
      alert('Content deleted successfully!');
      hideMemberDetailsPopup();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  }
};

onMounted(async () => {
  try {
    const response = await api.get("/content_manager/member/");
    memberDetailsList.value = response.data;
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

        <div v-else-if="filteredMemberDetails.length === 0" class="empty-state">No content available.</div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedMemberDetails" :key="row.id">
              <td>{{ row.id }}</td>
              <td
                  class="member-photo"
              >
                <img
                    :src="row.photo"
                    :alt="row.name"
                    class="image"
                />
              </td>
              <td>{{ row.name }}</td>
              <td>{{ row.role }}</td>
              <td>
                <button @click="showMemberDetailsPopup(row)" class="view-button">View</button>
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

    <MemberInfoPopup
        v-if="isPopupVisible && selectedMemberDetails"
        :isPopupVisible="isPopupVisible"
        :selectedMemberDetails="selectedMemberDetails"
        @hideMemberDetailsPopup="hideMemberDetailsPopup"
        @submitMemberDetailsChanges="submitMemberDetailsChanges"
        @removeMemberDetails="removeMemberDetails"
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

.member-photo img {
  width: 50px;
  height: 50px;
  object-fit: cover;
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