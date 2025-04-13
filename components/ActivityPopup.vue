<script setup lang="ts">
import {ref, reactive, watch} from 'vue';

interface ActivityContent {
  id: number;
  title_en: string;
  title_my: string;
  description_en: string;
  description_my: string;
  summary_content_en: string;
  summary_content_my: string;
  activity_date: string | null;
  time: string;
  activity_type: string | null;
  activity_status: string | null;
  location: string;
  target_audience: string;
  poster: File | null;
  estimated_participants: string;
}

const props = defineProps<{
  isPopupVisible: boolean;
  selectedActivityContent: ActivityContent | null;
}>();
const emit = defineEmits([
  'hideActivityContentPopup',
  'submitActivityContentChanges',
  'removeActivityContent'
]);

const formData = reactive<ActivityContent>({
  id: 0,
  title_en: '',
  title_my: '',
  description_en: '',
  description_my: '',
  summary_content_en: '',
  summary_content_my: '',
  activity_date: '',
  time: '',
  activity_type: '',
  activity_status: '',
  location: '',
  target_audience: '',
  estimated_participants: '',
  poster: '',
});
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
watch(() => props.selectedActivityContent, (newContent) => {
  if (newContent) {
    formData.id = newContent.id;
    formData.title_en = newContent.title_en;
    formData.title_my = newContent.title_my;
    formData.description_en = newContent.description_en;
    formData.description_my = newContent.description_my;
    formData.summary_content_en = newContent.summary_content_en;
    formData.summary_content_my = newContent.summary_content_my;
    formData.activity_date = newContent.activity_date;
    formData.time = newContent.time;
    formData.activity_type = newContent.activity_type;
    formData.activity_status = newContent.activity_status;
    formData.location = newContent.location;
    formData.target_audience = newContent.target_audience;
    formData.estimated_participants = newContent.estimated_participants;

    formData.poster = newContent.poster;

    imagePreview.value = newContent.poster;
  }
}, {immediate: true});
const formFields = [
  {
    key: 'title_en',
    label: 'Title (English)',
    type: 'text',
    required: true
  },
  {
    key: 'title_my',
    label: 'Title (Malay)',
    type: 'text',
    required: true
  },
  {
    key: 'description_en',
    label: 'Description (English)',
    type: 'textarea',
    required: true
  },
  {
    key: 'description_my',
    label: 'Description (Malay)',
    type: 'textarea',
    required: true
  },
  {
    key: 'summary_content_en',
    label: 'Summary Content (English)',
    type: 'textarea',
    required: true
  },
  {
    key: 'summary_content_my',
    label: 'Summary Content (Malay)',
    type: 'textarea',
    required: true
  },
  {
    key: 'activity_date',
    label: 'Activity Date',
    type: 'date',
    required: true
  },
  {
    key: 'time',
    label: 'Time',
    type: 'text',
    required: true
  },
  {
    key: 'activity_type',
    label: 'Activity Type',
    type: 'select',
    required: true,
    options: [
      { label: 'Talk', value: 'talk' },
      { label: 'Quran Class', value: 'quran_class' },
      { label: 'Community Event', value: 'community_event' },
      { label: 'Fundraising', value: 'fundraising' },
      { label: 'Volunteer', value: 'volunteer' },
      { label: 'Others', value: 'others' }
    ]
  },
  {
    key: 'location',
    label: 'Location',
    type: 'text',
    required: true
  },
  {
    key: 'target_audience',
    label: 'Target Audience',
    type: 'text',
    required: false
  },
  {
    key: 'activity_status',
    label: 'Activity Status',
    type: 'select',
    required: false,
    options: [
      { label: 'Upcoming', value: 'upcoming' },
      { label: 'Ongoing', value: 'ongoing' },
      { label: 'Completed', value: 'completed' }
    ]
  },
  {
    key: 'poster',
    label: 'Poster',
    type: 'file',
    required: true
  },
  {
    key: 'estimated_participants',
    label: 'Estimated Participants',
    type: 'text',
    required: false
  }
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
    updatedContent.poster = imageFile.value;
  }


  emit('submitActivityContentChanges', updatedContent);
};
const handleDelete = () => {
  emit('removeActivityContent');
};
const closePopup = () => {
  emit('hideActivityContentPopup');
};

</script>

<template>
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup-container">

      <div class="popup-header">
        <h2>About Booking Details</h2>
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
