<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useNuxtApp} from '#app';
import BookingRequestPopup from '~/components/BookingRequestPopup.vue';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';


interface BookingContent {
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
  other_docs: string;
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
const bookingContentList = ref<BookingContent[]>([]);
const {$axios} = useNuxtApp();
const api = $axios();

const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref('');
const isPopupVisible = ref(false);
const selectedBookingContent = ref<BookingContent | null>(null);
const isLoading = ref(true);

const filteredBookingContent = computed(() => {
  let result = bookingContentList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(content =>
        content.first_name.toLowerCase().includes(query) ||
        content.last_name.toLowerCase().includes(query) ||
        content.venue.toLowerCase().includes(query) ||
        content.request_status.toLowerCase().includes(query)
    );
  }
  return result;
});

const totalItems = computed(() => filteredBookingContent.value.length);
const paginatedBookingContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredBookingContent.value.slice(start, start + pageSize.value);
});
const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= Math.ceil(totalItems.value / pageSize.value)) {
    currentPage.value = newPage;
  }
};

const showBookingContentPopup = (content: BookingContent) => {
  selectedBookingContent.value = {...content};
  isPopupVisible.value = true;
};
const hideBookingContentPopup = () => {
  isPopupVisible.value = false;
  selectedBookingContent.value = null;
};

const submitBookingContentChanges = async (updatedContent: BookingContent) => {
  if (!selectedBookingContent.value) return;

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
  formData.append('submitted_at', updatedContent.submitted_at);

  // Handle other_docs (new upload or re-send existing file)
  if (updatedContent.other_docs instanceof File) {
    // User uploaded a new file
    formData.append('other_docs', updatedContent.other_docs);
  } else {
    // User did not upload a new file — resend the existing one
    try {
      const response = await fetch(updatedContent.other_docs); // should be a valid URL
      const blob = await response.blob();

      // Extract filename from URL or fallback
      const fileName = updatedContent.other_docs.split('/').pop() || 'existing_file.jpg';

      // Create a File object to send
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

    // Update the local list with the latest data from the response
    const index = bookingContentList.value.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      bookingContentList.value[index] = response.data;
    }

    alert('Content updated successfully!');
    hideBookingContentPopup();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed. Please try again.');
    if (error.response) {
      console.error('Backend error:', error.response.data);
    }
  }
};

const removeBookingContent = async () => {
  if (!selectedBookingContent.value) return;
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await api.delete(`/requests/booking_requests/${selectedBookingContent.value.id}/`);
      bookingContentList.value = bookingContentList.value.filter(c => c.id !== selectedBookingContent.value?.id);
      alert('Content deleted successfully!');
      hideBookingContentPopup();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  }
};

const generatePDF = () => {
  try {
    const doc = new jsPDF('p', 'pt', 'a4');

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('Report on Booking Masjid Services', 40, 40);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 60);

    const filteredData = filteredBookingContent.value.map((request, index) => [
      index + 1,
      request.first_name,
      request.last_name,
      request.booking_date,
      request.phone,
      request.venue,
      request.services,
      request.request_status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['#', 'First Name', 'Last Name', 'Date', 'Phone', 'Venue', 'Services', 'Status']],
      body: filteredData,
      styles: {
        fontSize: 9,
        cellPadding: 5,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 80 }
    });

    const fileName = `Booking_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

  } catch (error) {
    // console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please check console for details.');
  }
};

onMounted(async () => {
  try {
    const response = await api.get("/requests/booking_requests/");
    bookingContentList.value = response.data;
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

          <div class="download-btn-wrapper">
            <button @click="generatePDF" class="download-button">Download Report</button>
          </div>

        </div>

        <div v-if="isLoading" class="loading-state">Loading content...</div>

        <div v-else-if="filteredBookingContent.length === 0" class="empty-state">No content available.</div>

        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in paginatedBookingContent" :key="row.id">
              <td>{{ row.first_name }}</td>
              <td>{{ row.last_name }}</td>
              <td>{{ row.booking_date }}</td>
              <td>{{ row.venue }}</td>
              <td>{{ row.request_status }}</td>
              <td>
                <button @click="showBookingContentPopup(row)" class="view-button">View</button>
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
        v-if="isPopupVisible && selectedBookingContent"
        :isPopupVisible="isPopupVisible"
        :selectedBookingContent="selectedBookingContent"
        @hideBookingContentPopup="hideBookingContentPopup"
        @submitBookingContentChanges="submitBookingContentChanges"
        @removeBookingContent="removeBookingContent"
    />
  </section>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 1rem;
  background: white;
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

.download-button{
  padding: 0.5rem;
  border: 1px solid #ddd;
  background-color: var(--primary-color);
  color: var(--text-color);
  border-radius: 4px;
  min-width: 200px;
  outline: none;
  transition: all 0.3s ease-in-out;
}

.download-button:hover {
  color: var(--text-hover);
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
  background-color: var(--bg-hover-color);
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