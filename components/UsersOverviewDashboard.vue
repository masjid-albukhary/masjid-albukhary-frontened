<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNuxtApp } from '#app';
import UserInfoPopup from '~/components/UserInfoPopup.vue';

interface UserDetails {
  id: number;
  user: string;
  name: string;
  email: string;
  user_type: string;
  phone: string;
  dob: string;
}

const userColumns = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'phone', label: 'Phone No', sortable: true },
  { key: 'user_type', label: 'User Type', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

const contentData = ref<UserDetails[]>([]);
const { locale } = useI18n();
const { $axios } = useNuxtApp();
const api = $axios();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const contentDetails = ref<Record<string, any>>({});
const isPopupVisible = ref(false);
const currentContent = ref<UserDetails | null>(null);
const isLoading = ref(true);
const filteredRows = computed(() => {
  let result = contentData.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.name.toLowerCase().includes(query) ||
        content.user.toLowerCase().includes(query) ||
        content.email.toLowerCase().includes(query)

    );
  }

  return result;
});
const totalItems = computed(() => filteredRows.value.length);
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRows.value.slice(start, end);
});

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};

const updateContent = async (updatedContent: UserDetails) => {
  if (!currentContent.value) return;

  try {
    const response = await api.put(`/profiles/${updatedContent.id}/`, updatedContent);
    const index = contentData.value.findIndex(content => content.id === updatedContent.id);
    if (index !== -1) {
      contentData.value[index] = { ...updatedContent };
    }

    alert('Content updated successfully!');
    closePopup();
  } catch (error) {
    console.error('Failed to update content:', error);
    alert('Failed to update content. Please try again later.');
  }
};

const deleteContent = async () => {
  if (!currentContent.value) return;

  if (confirm('Are you sure you want to delete this content?')) {
    try {
      const deletedContent = currentContent.value;
      await api.delete(`/profiles/${deletedContent.id}/`);
      console.log('Content deleted successfully');

      alert('Content deleted successfully!');
      contentData.value = contentData.value.filter(content => content.id !== deletedContent.id);
      closePopup();
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content. Please try again later.');
    }
  }
};

const openPopup = (content: UserDetails) => {
  currentContent.value = { ...content };
  contentDetails.value = {
    "ID": content.id,
    "Name": content.name,
    "Username": content.user,
    "Email": content.email,
    "User Type": content.user_type,
    "Phone": content.phone,
    "Date of Birth": content.dob,
  };
  isPopupVisible.value = true;
};
const closePopup = () => {
  isPopupVisible.value = false;
  currentContent.value = null;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/profiles/");
    contentData.value = response.data;
    console.log("Content loaded:", contentData.value.length, "items");
    console.log("Current Locale:", locale.value);
  } catch (error: any) {
    console.error("Failed to load services content:", error);
    alert("Error loading content. Please try again later.");
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
          <input v-model="searchQuery" placeholder="Search by user..." class="search-box"/>
        </div>

        <div v-if="isLoading" class="loading-state">
          Loading user...
        </div>

        <div v-else-if="contentData.length === 0" class="empty-state">
          No content available.
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in userColumns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedRows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.phone}}</td>
              <td>{{ row.user_type }}</td>
              <td>
                <button @click="openPopup(row)" class="view-button">View</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!isLoading && contentData.length > 0" class="pagination-controls">
          <button class="pagination-button" :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">
            ⬅ Prev
          </button>
          <span>Page {{ currentPage }} of {{ Math.ceil(totalItems / pageSize) || 1 }}</span>
          <button class="pagination-button" :disabled="currentPage >= Math.ceil(totalItems / pageSize)"
                  @click="handlePageChange(currentPage + 1)">
            Next ➡
          </button>
        </div>
      </main>
    </div>

    <UserInfoPopup
        v-if="isPopupVisible"
        :isPopupVisible="isPopupVisible"
        :contentDetails="contentDetails"
        :currentContent="currentContent"
        @closePopup="closePopup"
        @updateContent="updateContent"
        @deleteContent="deleteContent"
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