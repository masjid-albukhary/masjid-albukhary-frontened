<script setup lang="ts">
import {ref, reactive, watch} from 'vue';

interface VideoGalleryContent {
  id: number;
  name_field: string;
  alert_field: string;
  video_link: string;
  gallery_video: string;
  video_type: string;
  created_at: string;
}

const props = defineProps<{
  isPopupVisible: boolean;
  selectedVideoGalleryContent: VideoGalleryContent | null;
}>();
const emit = defineEmits([
  'hideVideoGalleryContentPopup',
  'submitVideoGalleryContentChanges',
  'removeVideoGalleryContent'
]);
const formData = reactive<VideoGalleryContent>({
  id: 0,
  name_field: '',
  alert_field: '',
  video_link: '',
  video_type: '',
  gallery_video: '',
  created_at: ''
});
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
watch(() => props.selectedVideoGalleryContent, (newContent) => {
  if (newContent) {
    formData.id = newContent.id;
    formData.name_field = newContent.name_field;
    formData.alert_field = newContent.alert_field;
    formData.video_link = newContent.video_link;
    formData.video_type = newContent.video_type;
    formData.gallery_video = newContent.gallery_video;
    formData.created_at = newContent.created_at;

    imagePreview.value = newContent.gallery_video;
  }
}, {immediate: true});


const formFields = [
  {
    key: 'name_field',
    label: 'Name field',
    type: 'text',
    required: true
  },
  {
    key: 'alert_field',
    label: 'Alert Field',
    type: 'text',
    required: true
  },
  {
    key: 'video_link',
    label: 'Video Link',
    type: 'url',
    required: true
  },
  {
    key: 'video_type',
    label: 'Video Type',
    type: 'select',
    options: [
      {value: 'weekly talk', label: 'Weekly Talk'},
      {value: 'general', label: 'General'},
    ],
    required: true
  },
  {
    key: 'gallery_video',
    label: 'Upload New Image',
    type: 'file',
    required: false,
    accept: 'image/*'
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
    updatedContent.gallery_video = imageFile.value;
  }

  emit('submitVideoGalleryContentChanges', updatedContent);
};

const handleDelete = () => {
  emit('removeVideoGalleryContent');
};

const closePopup = () => {
  emit('hideVideoGalleryContentPopup');
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
