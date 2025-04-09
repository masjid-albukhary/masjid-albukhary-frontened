<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isPopupVisible: Boolean,
  contentDetails: Object,
  currentContent: Object,
});

const emit = defineEmits(['closePopup', 'deleteContent', 'updateContent', 'fileUploaded']);

const closePopup = () => {
  emit('closePopup');
};

const updateContent = () => {
  emit('updateContent');
};

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    emit('fileUploaded', file);
  }
};

const deleteContent = () => {
  emit('deleteContent');
};
</script>

<template>
  <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
    <div class="popup" @click.stop>
      <div class="popup-header">
        <h3>Content Details</h3>
        <button class="close-btn" @click="closePopup" aria-label="Close Popup">
          <UIcon name="mdi-close" />
        </button>
      </div>

      <div class="popup-detail">
        <label>Title (English):</label>
        <textarea
            v-model="currentContent.title_en"
            class="textarea"
            rows="2"
        ></textarea>
      </div>

      <div class="popup-detail">
        <label>Title (Malay):</label>
        <textarea
            v-model="currentContent.title_my"
            class="textarea"
            rows="2"
        ></textarea>
      </div>

      <div class="popup-detail">
        <label>Content (English):</label>
        <textarea
            v-model="currentContent.content_en"
            class="textarea"
            rows="4"
        ></textarea>
      </div>

      <div class="popup-detail">
        <label>Content (Malay):</label>
        <textarea
            v-model="currentContent.content_my"
            class="textarea"
            rows="4"
        ></textarea>
      </div>

      <div class="popup-detail">
        <label>File:</label>
        <div class="file-upload-container">
          <input
              type="file"
              @change="handleFileUpload"
              class="file-input"
          />
          <div v-if="currentContent.file && typeof currentContent.file === 'string'" class="current-file">
            Current file: {{ currentContent.file.split('/').pop() }}
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <button @click="updateContent" class="update-btn">Update</button>
        <button @click="deleteContent" class="delete-btn">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.popup {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #666;
}

.popup-detail {
  margin-bottom: 15px;
}

.popup-detail label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
}

.textarea,
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.file-input {
  width: 100%;
  margin-top: 5px;
}

.current-file {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #666;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.update-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.update-btn {
  background-color: #4caf50;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}
</style>