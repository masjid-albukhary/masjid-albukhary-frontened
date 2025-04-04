<script setup lang="ts">
import {ref, computed} from 'vue';

const columns = [
  {key: 'firstName', label: 'First Name', sortable: true},
  {key: 'contact', label: 'Contact Number', sortable: true},
  {key: 'venue', label: 'Venue', sortable: true},
  {key: 'status', label: 'Status', sortable: true},
  {key: 'actions', label: 'Actions', sortable: false}
];

const bookings = ref([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    contact: '123456789',
    address: '123 Main St, NY',
    postalCode: '10001',
    bookingDates: '2025-04-10 to 2025-04-12',
    guests: 3,
    timeSlot: '10:00 AM - 12:00 PM',
    venue: 'Grand Hall',
    services: 'Catering, Photography',
    otherRequests: 'Need extra chairs',
    status: 'Pending'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    contact: '987654321',
    address: '456 Oak Ave, CA',
    postalCode: '90210',
    bookingDates: '2025-05-05',
    guests: 2,
    timeSlot: '2:00 PM - 4:00 PM',
    venue: 'Conference Room',
    services: 'Projector, Sound System',
    otherRequests: 'Gluten-free snacks',
    status: 'Confirmed'
  },
  {
    id: 3,
    firstName: 'Ali',
    lastName: 'Khan',
    email: 'ali@example.com',
    contact: '112233445',
    address: '789 Elm St, TX',
    postalCode: '75001',
    bookingDates: '2025-06-15',
    guests: 5,
    timeSlot: '6:00 PM - 8:00 PM',
    venue: 'Banquet Hall',
    services: 'Live Music',
    otherRequests: 'Extra lighting',
    status: 'Cancelled'
  },
  {
    id: 4,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    contact: '123456789',
    address: '123 Main St, NY',
    postalCode: '10001',
    bookingDates: '2025-04-10 to 2025-04-12',
    guests: 3,
    timeSlot: '10:00 AM - 12:00 PM',
    venue: 'Grand Hall',
    services: 'Catering, Photography',
    otherRequests: 'Need extra chairs',
    status: 'Pending'
  },
  {
    id: 5,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    contact: '987654321',
    address: '456 Oak Ave, CA',
    postalCode: '90210',
    bookingDates: '2025-05-05',
    guests: 2,
    timeSlot: '2:00 PM - 4:00 PM',
    venue: 'Conference Room',
    services: 'Projector, Sound System',
    otherRequests: 'Gluten-free snacks',
    status: 'Confirmed'
  },
  {
    id: 6,
    firstName: 'Ali',
    lastName: 'Khan',
    email: 'ali@example.com',
    contact: '112233445',
    address: '789 Elm St, TX',
    postalCode: '75001',
    bookingDates: '2025-06-15',
    guests: 5,
    timeSlot: '6:00 PM - 8:00 PM',
    venue: 'Banquet Hall',
    services: 'Live Music',
    otherRequests: 'Extra lighting',
    status: 'Cancelled'
  }
]);

const currentPage = ref(1);
const pageSize = ref(5);
const searchQuery = ref('');
const statusFilter = ref('All');
const bookingDetails = ref<Record<string, any>>({});

const filteredRows = computed(() => {
  let result = bookings.value;

  if (statusFilter.value !== 'All') {
    result = result.filter(booking => booking.status === statusFilter.value);
  }

  if (searchQuery.value) {
    result = result.filter(booking =>
        Object.values(booking).some(value =>
            String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
        )
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

const isPopupVisible = ref(false);
const currentBooking = ref<any>(null);

const openPopup = (row: any) => {
  currentBooking.value = row;
  bookingDetails.value = {
    "Name": `${row.firstName} ${row.lastName}`,
    "Email": row.email,
    "Contact": row.contact,
    "Address": row.address,
    "Postal Code": row.postalCode,
    "Booking Dates": row.bookingDates,
    "Guests": row.guests,
    "Time Slot": row.timeSlot,
    "Venue": row.venue,
    "Services": row.services,
    "Other Requests": row.otherRequests,
    "Status": row.status
  };
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
};


</script>

<template>
  <section class="dashboard-wrapper">

    <div class="dashboard-container">
      <main class="content-area">

        <div class="content-header">
          <input v-model="searchQuery" placeholder="Search bookings..." class="search-box"/>
          <select v-model="statusFilter" class="filter-dropdown">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <table class="data-table">
          <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in paginatedRows" :key="row.id">
            <td>{{ row.firstName }}</td>
            <td>{{ row.contact }}</td>
            <td>{{ row.venue }}</td>
            <td :class="row.status.toLowerCase()">{{ row.status }}</td>
            <td>
              <button @click="openPopup(row)" class="view-button">View</button>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="pagination-controls">
          <button :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">⬅ Prev</button>
          <span>Page {{ currentPage }} of {{ Math.ceil(totalItems / pageSize) }}</span>
          <button :disabled="currentPage >= Math.ceil(totalItems / pageSize)"
                  @click="handlePageChange(currentPage + 1)">Next ➡
          </button>
        </div>
      </main>
    </div>

    <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
      <div class="popup" @click.stop>
        <div class="popup-header">
          <h3>Booking Details</h3>
          <button class="close-btn" @click="closePopup" aria-label="Close Popup">X</button>
        </div>
        <div class="popup-content">
          <div v-for="(value, key) in bookingDetails" :key="key" class="popup-detail">

            <span>{{ key }}:</span>
            <span> {{ value }}</span>

          </div>
        </div>
        <div class="popup-footer">
          <button @click="closePopup" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 20px;
  min-height: 100vh;
  height: 100%;
}

.content-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.filter-dropdown,
.search-box {
  padding: 8px;
  max-width: 200px;
  outline: none;
  border-radius: .5rem;
  border: 2px solid var(--text-hover);
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th, .data-table td {
  border: 2px solid var(--text-hover);
  padding: 10px;
  word-wrap: break-word;
}

.view-button {
  color: var(--text-color);
  outline: none;
  border: none;
  padding: .5rem 1rem;
  cursor: pointer;
  background-color: var(--primary-color);
  border-radius: .5rem;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.popup {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h3 {
  margin: 0;
}

.close-btn {
  background: #f44336;
  color: var(--text-color);
  border: none;
  padding: 8px 16px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.popup-content {
  margin-top: 20px;
  font-size: 16px;
}

.popup-detail {
  margin-bottom: 10px;
}

.popup-footer {
  margin-top: 20px;
  text-align: center;
}

.popup-footer .close-btn {
  background: var(--primary-color);
  border-radius: 4px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-dropdown,
  .search-box {
    max-width: 100%;
    margin: 1rem 0;
  }

  .data-table th, .data-table td {
    padding: 8px;
    font-size: 14px;
  }

  .view-button {
    padding: .4rem 1rem;
    font-size: 12px;
  }

  .popup {
    max-width: 90%;
    padding: 15px;
  }

  .popup-header h3 {
    font-size: 18px;
  }

  .popup-content {
    font-size: 14px;
  }

  .popup-footer .close-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .dashboard-wrapper {
    padding: 10px;
  }

  .filter-dropdown,
  .search-box {
    padding: 6px;
  }

  .data-table th, .data-table td {
    font-size: 12px;
    padding: 6px;
  }

  .popup {
    max-width: 95%;
    padding: 10px;
  }

  .popup-header h3 {
    font-size: 16px;
  }

  .view-button {
    font-size: 10px;
    padding: .3rem .8rem;
  }

  .popup-footer .close-btn {
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>
