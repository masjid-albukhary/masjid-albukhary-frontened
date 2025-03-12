<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useNuxtApp} from "#app";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

let {$axios} = useNuxtApp()

interface StudentRequest {
  id: number
  date: string
  student: string
  studentIdNumber: string
  room_number: string
  nationality: string
  phone: string
  email: string
  gender: string
  request: string
  status: string
  extend?: boolean | string
}

const columns = [
  {key: 'name', label: 'Name', sortable: true},
  {key: 'status', label: 'Status', sortable: true},
  {key: 'extend', label: 'View', sortable: false,}
]
const requests = ref<StudentRequest[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const q = ref('');
// const api = $axios()
// const fetchData = async () => {
//
//   isLoading.value = true;
//   try {
//     // const response = await api.get("/maintenance-requests/");
//     requests.value = response.data.map((request: StudentRequest) => ({
//       ...request,
//       date: new Date().toLocaleDateString(),
//     }));
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     isLoading.value = false;
//   }
//
// }

const isPopupVisible = ref(false);
const currentRequest = ref({});

const openPopup = (row: StudentRequest) => {
  currentRequest.value = row;
  isPopupVisible.value = true;
};

const selectedFilter = ref('pending');

const filterOptions = [
  {value: 'pending', label: 'Pending'},
  {value: 'completed', label: 'Completed'},
  {value: 'rejected', label: 'Rejected'},
];

const filteredRows = computed(() => {
  let result = requests.value;

  if (selectedFilter.value) {
    result = result.filter(request => request.status === selectedFilter.value);
  }

  if (q.value) {
    result = result.filter(request => {
      return Object.values(request).some(value =>
          String(value).toLowerCase().includes(q.value.toLowerCase())
      );
    });
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

const generatePDF = () => {
  const doc = new jsPDF();
  doc.text(` Report on Student Maintenance Room Requests- ${selectedFilter.value.toUpperCase()}`, 14, 10);

  const filteredData = filteredRows.value.map((request, index) => [
    index + 1,
    request.student,
    request.room_number,
    request.nationality,
    request.phone,
    request.gender,
    request.status
  ]);

  autoTable(doc, {
    head: [['#', 'Name', 'Room No', 'Nationality', 'Phone', 'Gender', 'Status']],
    body: filteredData,
  });

  doc.save(` Maintenance requests-${selectedFilter.value}.pdf`);
};

// onMounted(() => {
//   fetchData();
// });

</script>

<template>
  <section class="booking-dashboard-wrapper">
    <div class="dashboard-container">

      <main class="content-area">
        <div class="content-wrapper">
          <div class="content-body">
            <div class="header-section">

              <div class="filter-wrapper">
                <input v-model="q" placeholder="Filter students..." class="filter-box"/>
              </div>

              <div class="filter-dropdown">
                <select class="filter-box" v-model="selectedFilter" @click="filteredRows">
                  <option value="" disabled selected>Filter students...</option>
                  <option v-for="option in filterOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="download-btn-wrapper">
                <button @click="generatePDF" class="download-button">Download Report</button>
              </div>

            </div>

            <UTable :columns="columns" :rows="paginatedRows">
              <template #extend-data="{ row }">
                <a @click="openPopup(row)" class="view-button">View</a>
                <Popup
                    :show="isPopupVisible"
                    @update:show="isPopupVisible = $event"
                    :request="currentRequest"
                />
              </template>
            </UTable>

            <div class="pagination-controls">
              <button :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)"
                      class="pagination-button">
                <UIcon name="mdi-arrow-left"/>
              </button>
              <span class="pagination-info">Page {{ currentPage }} of {{ Math.ceil(totalItems / pageSize) }}</span>
              <button :disabled="currentPage >= Math.ceil(totalItems / pageSize)"
                      @click="handlePageChange(currentPage + 1)" class="pagination-button">
                <UIcon name="mdi-arrow-right"/>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
section {
  display: block;
}

.dashboard-container {
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

.content-wrapper {
  flex: 10;
  background-color: #eee;
  padding: 0;
  height: 100vh;
}

.filter-wrapper,
.filter-dropdown,
.download-btn-wrapper {
  padding: 1rem;
}

.filter-box,
.download-button {
  padding: 5px;
  border-radius: 5px;
  border: none;
  outline: none;
  color: var(--secondary-color);
}

.download-button {
  background-color: var(--primary-color);
  color: var(--text-color) !important;
  border-radius: 10px 0 !important;
  transition: var(--transition);
}

.download-button:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover) !important;
}

.header-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0.5rem;
}

.view-button,
.pagination-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition);
}

.view-button:hover,
.pagination-button:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.pagination-info {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: 0.3s ease-in-out;
}

@media (max-width: 1200px) {
  .dashboard-container,
  .booking-dashboard-wrapper,
  .header-section {
    display: block;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 1rem;
  }
}
</style>

