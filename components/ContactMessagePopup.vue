<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  isPopupVisible: Boolean,
  contentDetails: Object,
  currentContent: Object,
});

const emit = defineEmits(['closePopup', 'deleteContent', 'updateContent']);

const editableContent = ref({ ...props.currentContent });

watch(
    () => props.currentContent,
    (newContent) => {
      editableContent.value = { ...newContent }; // deep clone into ref
    },
    { deep: true, immediate: true }
);

const closePopup = () => {
  emit('closePopup');
};

const deleteContent = () => {
  emit('deleteContent');
};

const updateContent = () => {
  emit('updateContent', { ...editableContent.value });
};

const labelMapping: Record<string, string> = {
  id: 'ID',
  name: 'Name',
  email: 'Email',
  contact_number: 'Phone Number',
  subject: 'Subject',
  message: 'Message',
  submitted_at: 'Submitted at',
};
</script>

<template>
  <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
    <div class="popup" @click.stop>
      <div class="popup-header">
        <h3>Users Details</h3>
        <button class="close-btn" @click="closePopup" aria-label="Close Popup">
          <UIcon name="mdi-close" />
        </button>
      </div>

      <div class="popup-content">

        <div v-for="(value, key) in editableContent" :key="key" class="popup-detail">
          <label :for="key" class="key-label">
            {{ labelMapping[key] || key }}:
          </label>
          <input
              v-model="editableContent[key]"
              :id="key"
              class="popup-input"
              type="text"
          />

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
  word-wrap: break-word;
}

.popup-input{
  outline: none;
  border: 5px solid var(--bg-color);
  padding: .5rem;
}

.key-label {
  background: var(--bg-color);
  padding: 0.7rem;
}

.popup-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.update-btn {
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  transition: all 0.3 ease-in-out;
}

.update-btn:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
}

.delete-btn {
  background-color: red;
  color: var(--text-color);
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
