<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNuxtApp } from '#app';
import ContactMessagePopup from '~/components/ContactMessagePopup.vue';

interface ContactData {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  subject: string;
  message: string;
  submitted_at: string;
}

interface ApiError {
  response?: {
    data: any;
    status: number;
  };
  request?: any;
  message?: string;
}

const columns = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'contact_number', label: 'Contact Number', sortable: false },
  { key: 'subject', label: 'Subject', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
];

const contactData = ref<ContactData[]>([]);
const { locale } = useI18n();
const { $axios } = useNuxtApp();
const api = $axios();
const searchQuery = ref('');
const bookingDetails = ref<Record<string, any>>({});
const isPopupVisible = ref(false);
const currentBooking = ref<ContactData | null>(null);

const isLoading = ref(false);
const isProcessing = ref(false);
const notification = ref({ show: false, message: '', type: 'success' });

const currentPage = ref(1);
const itemsPerPage = ref(10);

const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return contactData.value.filter((row) =>
      row.name.toLowerCase().includes(query) ||
      row.subject.toLowerCase().includes(query) ||
      row.contact_number.toLowerCase().includes(query)
  );
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = currentPage.value * itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage.value));
});

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const loadContactMessages = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/requests/contact_message/');
    contactData.value = response.data;
    console.log('Contact messages loaded:', contactData.value.length);
    console.log('Current Locale:', locale.value);
  } catch (error: ApiError) {
    handleApiError(error, 'Failed to load contact messages');
  } finally {
    isLoading.value = false;
  }
};

const handleApiError = (error: ApiError, defaultMessage: string) => {
  console.error(defaultMessage, error);
  let errorMessage = defaultMessage;

  if (error.response) {
    console.error('Error response:', error.response.data);
    console.error('Error status:', error.response.status);
    if (error.response.data?.detail) {
      errorMessage += `: ${error.response.data.detail}`;
    }
  } else if (error.request) {
    console.error('Error request:', error.request);
    errorMessage += ': No response received from server';
  } else if (error.message) {
    console.error('Error message:', error.message);
    errorMessage += `: ${error.message}`;
  }

  showNotification(errorMessage, 'error');
};

const confirmDeleteBooking = () => {
  if (confirm('Are you sure you want to delete this contact message?')) {
    deleteBooking();
  }
};

const deleteBooking = async () => {
  if (!currentBooking.value || isProcessing.value) return;

  isProcessing.value = true;
  try {
    const deletedBooking = currentBooking.value;
    await api.delete(`/requests/contact_message/${deletedBooking.id}/`);

    contactData.value = contactData.value.filter(b => b.id !== deletedBooking.id);
    showNotification('Booking deleted successfully!', 'success');
    closePopup();
  } catch (error: any) {
    handleApiError(error, 'Failed to delete booking');
  } finally {
    isProcessing.value = false;
  }
};

const openPopup = (row: ContactData) => {
  currentBooking.value = { ...row }; // Create a copy to avoid direct mutation
  bookingDetails.value = {
    'Name': row.name,
    'Email': row.email,
    'Contact': row.contact_number,
    'Title': row.subject,
    'Message': row.message,
  };
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
  currentBooking.value = null;
};

onMounted(() => {
  loadContactMessages();
});
</script>

<template>
  <section class="dashboard-wrapper">
    <div class="dashboard-container">
      <main class="content-area">
        <div class="content-header">
          <input
              v-model="searchQuery"
              placeholder="Search by name, subject, or contact number..."
              class="search-box"
          />
        </div>

        <div v-if="notification.show" :class="['notification', notification.type]">
          {{ notification.message }}
        </div>

        <div v-if="isLoading" class="loading-indicator">
          Loading contact messages...
        </div>

        <div v-else-if="contactData.length === 0" class="empty-state">
          No contact messages found.
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.contact_number }}</td>
              <td>{{ row.subject }}</td>
              <td>
                <button @click="openPopup(row)" class="view-button">View</button>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="pagination-controls">
            <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1 || isLoading"
                class="pagination-button"
            >
              Previous
            </button>
            <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages || isLoading"
                class="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>

    <ContactMessagePopup
        v-if="isPopupVisible"
        :isPopupVisible="isPopupVisible"
        :bookingDetails="bookingDetails"
        :currentBooking="currentBooking"
        :isProcessing="isProcessing"
        @closePopup="closePopup"
        @deleteBooking="confirmDeleteBooking"
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
  transition:  all 0.2s ease-in-out;
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

.page-info {
  font-size: 0.9rem;
}

.loading-indicator {
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

.notification {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

</style>