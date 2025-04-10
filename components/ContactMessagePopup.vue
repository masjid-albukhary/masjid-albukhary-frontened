<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isPopupVisible: Boolean,
  contentDetails: Object,
  currentContent: Object,
});

const emit = defineEmits(['closePopup', 'deleteContent', 'updateContent']);

const closePopup = () => {
  emit('closePopup');
};

const deleteContent = () => {
  emit('deleteContent');
};

const updateContent = () => {
  emit('updateContent', props.currentContent); // pass the current content back to parent
};
</script>

<template>
  <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
    <div class="popup" @click.stop>
      <div class="popup-header">
        <h3>Service Details</h3>
        <button class="close-btn" @click="closePopup" aria-label="Close Popup">
          <UIcon name="mdi-close" />
        </button>
      </div>

      <div class="popup-content">
        <div v-for="(value, key) in contentDetails" :key="key" class="popup-detail">
          <span>{{ key }}:</span>
          <span>{{ value }}</span>
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.popup {
  background-color: var(--bg-hover-color);
  padding: 2rem;
  width: 60%;
  max-width: 60%;
  max-height: 90vh;
  position: relative;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: red;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

.popup-content {
  margin-top: 20px;
  font-size: 16px;
}

.popup-detail {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.popup-detail span {
  background-color: var(--bg-color);
  padding: 10px;
  word-wrap: break-word;
}

.popup-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.update-btn {
  background-color: #3498db;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
}

.delete-btn {
  background-color: red;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .popup {
    width: 95%;
    max-width: 95%;
  }

  .popup-detail {
    grid-template-columns: 1fr;
  }

  .popup-detail span {
    margin-bottom: 0.5rem;
  }
}
</style>
