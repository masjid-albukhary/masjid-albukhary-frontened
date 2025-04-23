<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useNuxtApp} from '#app';
import BookingRequestPopup from '~/components/BookingRequestPopup.vue';
import {useI18n} from "vue-i18n";
import { jsPDF } from 'jspdf';

interface BookingRequestContent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  booking_date: string;
  guests: number;
  time_slot: string;
  venue: string;
  services: string;
  other_docs: string | File;
  request_status: string;
  other_requests: string;
  submitted_at: string;
}

const columns = [
  {key: 'first_name', label: 'First Name'},
  {key: 'last_name', label: 'Last Name'},
  {key: 'booking_date', label: 'Booking Date'},
  {key: 'venue', label: 'Venue'},
  {key: 'request_status', label: 'Status'},
  {key: 'actions', label: 'Actions'},
];
const bookingRequestContentList = ref<BookingRequestContent[]>([]);
const {$axios} = useNuxtApp();
const api = $axios();
const {t} = useI18n();
const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedBookingRequestContent = ref<BookingRequestContent | null>(null);
const isLoading = ref(true);

const filteredBookingRequestContent = computed(() => {
  let result = bookingRequestContentList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.first_name.toLowerCase().includes(query) ||
        content.last_name.toLowerCase().includes(query) ||
        content.venue.toLowerCase().includes(query) ||
        content.booking_date.toLowerCase().includes(query) ||
        content.request_status.toLowerCase().includes(query)
    );
  }
  return result;
});
const totalItems = computed(() => filteredBookingRequestContent.value.length);
const paginatedBookingRequestContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredBookingRequestContent.value.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};
const showBookingRequestPopup = (content: BookingRequestContent) => {
  selectedBookingRequestContent.value = {...content};
  isPopupVisible.value = true;
};
const hideBookingRequestPopup = () => {
  isPopupVisible.value = false;
  selectedBookingRequestContent.value = null;
};


const generatePDF = () => {
  // Create new PDF document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text('Booking Requests Report', 15, 15);

  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

  // Prepare table data
  const tableData = filteredBookingRequestContent.value.map(item => [
    item.first_name,
    item.last_name,
    item.booking_date,
    item.venue,
    item.request_status
  ]);

  // Add table
  doc.autoTable({
    head: [['First Name', 'Last Name', 'Booking Date', 'Venue', 'Status']],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }
  });

  // Save the PDF
  doc.save(`booking_requests_${new Date().toISOString().split('T')[0]}.pdf`);
};

const submitBookingRequestContentChanges = async (updatedContent: BookingRequestContent) => {
  if (!selectedBookingRequestContent.value) return;

  const formData = new FormData();
  formData.append('first_name', updatedContent.first_name);
  formData.append('last_name', updatedContent.last_name);
  formData.append('email', updatedContent.email);
  formData.append('phone', updatedContent.phone);
  formData.append('address', updatedContent.address);
  formData.append('postal_code', updatedContent.postal_code);
  formData.append('booking_date', updatedContent.booking_date);
  formData.append('guests', updatedContent.guests.toString());
  formData.append('time_slot', updatedContent.time_slot);
  formData.append('venue', updatedContent.venue);
  formData.append('services', updatedContent.services);
  formData.append('request_status', updatedContent.request_status);
  formData.append('other_requests', updatedContent.other_requests);

  formData.append('other_docs', updatedContent.other_docs);
  formData.append('submitted_at', updatedContent.submitted_at);

  if (updatedContent.other_docs instanceof File) {
    formData.append('other_docs', updatedContent.other_docs);
  } else {
    try {
      const response = await fetch(updatedContent.other_docs);
      const blob = await response.blob();

      const fileName = updatedContent.other_docs.split('/').pop() || 'existing_file.jpg';

      const file = new File([blob], fileName, {type: blob.type});
      formData.append('other_docs', file);
    } catch (err) {
      console.error('Failed to fetch and resend existing image:', err);
      alert('Failed to load existing image for resubmission.');
      return;
    }
  }

  try {
    const response = await api.put(
        `/requests/booking_requests/${updatedContent.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    const index = bookingRequestContentList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      bookingRequestContentList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideBookingRequestPopup();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      console.error('Backend error:', error.response.data);
    }
  }
};
const removeBookingRequestContent = async () => {
  if (!selectedBookingRequestContent.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`/requests/booking_requests/${selectedBookingRequestContent.value.id}/`);
      bookingRequestContentList.value = bookingRequestContentList.value.filter(c => c.id !== selectedBookingRequestContent.value?.id);
      alert('Content deleted successfully!');
      hideBookingRequestPopup();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  }
};

onMounted(async () => {
  try {
    const response = await api.get("/requests/booking_requests/");
    bookingRequestContentList.value = response.data;
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
          <button @click="generatePDF" class="download-btn">{{ t('admin_header.download') }}</button>
        </div>

        <div v-if="isLoading" class="loading-state">Loading content...</div>

        <div v-else-if="filteredBookingRequestContent.length === 0" class="empty-state">No About content available.
        </div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedBookingRequestContent" :key="row.id">
              <td>{{ row.first_name }}</td>
              <td>{{ row.last_name }}</td>
              <td>{{ row.booking_date }}</td>
              <td>{{ row.venue }}</td>
              <td>{{ row.request_status }}</td>
              <td>
                <button @click="showBookingRequestPopup(row)" class="view-button">View</button>
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

    <BookingRequestPopup
        v-if="isPopupVisible && selectedBookingRequestContent"
        :isPopupVisible="isPopupVisible"
        :selectedBookingRequestContent="selectedBookingRequestContent"
        @hideBookingRequestPopup="hideBookingRequestPopup"
        @submitBookingRequestContentChanges="submitBookingRequestContentChanges"
        @removeBookingRequestContent="removeBookingRequestContent"
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
  gap: 1rem;
}

.search-box {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 300px;
  outline: none;
}

.download-btn {
  padding: 0.5rem;
  border: 1px solid var(--bg-color);
  border-radius: 4px;
  min-width: 200px;
  outline: none;
  background-color: var(--primary-color);
  color: var(--text-color);
  transition: all 0.4s ease-in-out;
}

.download-btn:hover {
  border: 1px solid var(--bg-hover-color);
  background-color: var(--secondary-color);
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