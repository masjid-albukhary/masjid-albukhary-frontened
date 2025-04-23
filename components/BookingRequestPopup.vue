<script setup lang="ts">
import {ref, reactive, watch} from 'vue';

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

const {t} = useI18n();
const props = defineProps<{
  isPopupVisible: boolean;
  selectedBookingRequestContent: BookingRequestContent | null;
}>();
const emit = defineEmits([
  'hideBookingRequestPopup',
  'submitBookingRequestContentChanges',
  'removeBookingRequestContent'
]);
const formData = reactive<BookingRequestContent>({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  postal_code: '',
  booking_date: '',
  guests: 0,
  time_slot: '',
  venue: '',
  services: '',
  other_docs: '',
  request_status: '',
  other_requests: '',
  submitted_at: '',
});
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

watch(() => props.selectedBookingRequestContent, (newContent) => {
  if (newContent) {
    formData.id = newContent.id;
    formData.first_name = newContent.first_name;
    formData.last_name = newContent.last_name;
    formData.email = newContent.email;
    formData.phone = newContent.phone;
    formData.address = newContent.address;
    formData.postal_code = newContent.postal_code;
    formData.booking_date = newContent.booking_date;
    formData.guests = newContent.guests;
    formData.time_slot = newContent.time_slot;
    formData.venue = newContent.venue;
    formData.services = newContent.services;
    formData.other_docs = newContent.other_docs;
    formData.other_requests = newContent.other_requests;
    formData.request_status = newContent.request_status;
    formData.other_docs = newContent.other_docs;
    formData.submitted_at = newContent.submitted_at;

    imagePreview.value = newContent.other_docs;
  }
}, {immediate: true});

const formFields = [
  {
    key: 'first_name',
    label: 'First Name',
    type: 'text',
    required: true,
  },
  {
    key: 'last_name',
    label: 'Last Name',
    type: 'text',
    required: true,
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'text',
    required: true,
  },
  {
    key: 'address',
    label: 'Address',
    type: 'text',
    required: true,
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
    type: 'text',
    required: true,
  },
  {
    key: 'booking_date',
    label: 'Booking Date',
    type: 'date',
    required: true,
  },
  {
    key: 'guests',
    label: 'Guests',
    type: 'number',
    required: true,
  },
  {
    key: 'time_slot',
    label: 'Time Slot',
    type: 'select',
    required: true,
    options: [
      { value: '10 AM', label: '10 AM' },
      { value: '11 AM', label: '11 AM' },
      { value: '2 PM (Mon-Thurs)', label: '2 PM (Mon-Thurs)' },
      { value: '3 PM (Mon-Thurs)', label: '3 PM (Mon-Thurs)' },
    ],
  },
  {
    key: 'venue',
    label: 'Venue',
    type: 'select',
    required: true,
    options: [
      { value: 'venue_1', label: 'Venue 1' },
      { value: 'venue_2', label: 'Venue 2' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    type: 'select',
    required: true,
    options: [
      { value: 'circumcision event', label: 'Circumcision Event at Masjid Al-Bukhari' },
      { value: 'aqiqah', label: 'Aqiqah with Masjid Al-Bukhari' },
      { value: 'quran classes', label: 'Quran Classes (6 - 18 years old)' },
      { value: 'solemnisation', label: 'Solemnisation at Al-Bukhari Mosque' },
      { value: 'qurban event', label: 'Participate in Our Qurban Event' },
      { value: 'yasin tahlil', label: 'Yasin & Tahlil' },
      { value: 'funeral management', label: 'Jenazah or Funeral Management' },
      { value: 'catering', label: 'Catering from Our Own Kitchen' },
      { value: 'e wasiat', label: 'E-Wasiat' },
      { value: 'e khairat kematian', label: 'E-Khairat Kematian' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'request_status',
    label: 'Request Status',
    type: 'select',
    required: true,
    options: [
      {value: 'pending', label: 'Pending' },
      {value: 'confirmed', label: 'Confirmed' },
      {value: 'in_progress', label: 'In Progress' },
      {value: 'completed', label: 'Completed' },
      {value: 'cancelled', label: 'Cancelled' },
    ],
  },
  {
    key: 'other_docs',
    label: 'Other Documents',
    type: 'file',
    required: true,
  },
  {
    key: 'other_requests',
    label: 'Other Requests',
    type: 'textarea',
    required: false,
  },
];

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    imageFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSave = () => {
  const updatedContent = {...formData};

  if (imageFile.value) {
    updatedContent.other_docs = imageFile.value;
  }

  emit('submitBookingRequestContentChanges', updatedContent);
};
const handleDelete = () => {
  emit('removeBookingRequestContent');
};
const closePopup = () => {
  imageFile.value = null;
  imagePreview.value = null;
  emit('hideBookingRequestPopup');
};
</script>

<template>
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup-container">

      <div class="popup-header">
        <h2>{{ t('admin.popup.booking_title') }}</h2>
        <button @click="closePopup" class="close-button">&times;</button>
      </div>

      <div class="popup-content">
        <form @submit.prevent="handleSave">

          <div
              class="form-group"
              v-for="field in formFields"
              :key="field.key"
          >
            <label :for="field.key">{{ field.label }}:</label>

            <input
                v-if="['text','email', 'date','number','url', 'date'].includes(field.type)"
                :id="field.key"
                v-model="formData[field.key]"
                type="text"
                :required="field.required"
                class="form-control"
            />

            <select
                v-if="['select'].includes(field.type)"
                :id="field.key"
                v-model="formData[field.key]"
                type="text"
                :required="field.required"
                class="form-control"
            >
              <option v-for="option in field.options"
                      :key="option.value"
                      :value="option.value"
              >{{
                  option.label
                }}
              </option>

            </select>

            <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.key"
                v-model="formData[field.key]"
                rows="5"
                :required="field.required"
                class="form-control"
            ></textarea>

            <div v-else-if="field.type === 'file'">
              <input
                  :id="field.key"
                  type="file"
                  :accept="field.accept || ''"
                  @change="handleImageChange"
                  class="form-control-file"
              />
              <small class="file-help-text">Select a new image to replace the existing one (optional)</small>

              <div class="image-preview-container" v-if="imagePreview">
                <img
                    :src="imagePreview"
                    alt="Image preview"
                    class="image-preview"
                />
              </div>
            </div>
          </div>


          <div class="button-group">
            <button type="submit" class="save-button">Save Changes</button>
            <button type="button" @click="handleDelete" class="delete-button">Delete</button>
            <button type="button" @click="closePopup" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  padding: 1rem;
  overflow-y: auto;
}

.popup-container {
  background-color: var(--bg-hover-color);
  border-radius: .5rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem 1rem;
  border-bottom: 1px solid #eee;
  background-color: var(--bg-color);
}

.popup-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.close-button {
  background-color: #e53935;
  border: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.close-button:hover {
  background-color: #c62828;
}

.popup-content {
  padding: 5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin-bottom: .5rem;
}

.form-group label {
  flex: 1 1 100%;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.form-control,
textarea.form-control {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease-in-out,;
}

.form-control:focus,
textarea.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.form-control-file {
  margin-top: 0.5rem;
}

.image-preview-container {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: var(--bg-color);
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}

.image-preview {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.file-help-text {
  font-size: 0.875rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.button-group button {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.save-button {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.save-button:hover {
  background-color: var(--secondary-color);
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.cancel-button {
  background-color: var(--bg-color);
  color: var(--primary-color);
}

.cancel-button:hover {
  background-color: var(--bg-hover-color);
  color: var(--secondary-color);
}

@media (max-width: 600px) {
  .popup-content {
    padding: 1rem;
  }

  .form-group {
    flex-direction: column;
  }

  .popup-header h2 {
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .button-group button {
    width: 100%;
  }
}
</style>
