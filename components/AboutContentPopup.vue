<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isPopupVisible: Boolean,
  currentDetails: Object,
  currentContent: Object,
});

const emit = defineEmits(['closePopup', 'updateBooking', 'deleteBooking']);

const closePopup = () => {
  emit('closePopup');
};

const updateBooking = () => {
  emit('updateBooking');
};

const deleteBooking = () => {
  emit('deleteBooking');
};
</script>

<template>
  <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
    <div class="popup" @click.stop>
      <div class="popup-header">
        <h3>Booking Details</h3>
        <button class="close-btn" @click="closePopup" aria-label="Close Popup">
          <UIcon
              name="mdi-close"
          />
        </button>
      </div>
      <div class="popup-content">
        <div v-for="(value, key) in currentContent" :key="key" class="popup-detail">
          <span>{{ key }}:</span>
          <span >{{ value }}</span>
        </div>
      </div>

      <div class="popup-footer">
        <button @click="updateBooking" class="update-btn">Update</button>
        <button @click="deleteBooking" class="delete-btn">Delete</button>
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
  scroll-behavior: smooth;
  text-align: center;
  max-height: 90vh;
  position: relative;
  overflow-y: auto;
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
  background: red;
  color: var(--text-color);
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
  text-align: start;
  margin-right: 1rem;
}

.popup-footer {
  margin-top: 20px;
  text-align: center;
}

.update-btn {
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
}

.delete-btn {
  background-color: #f44336;
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
    margin-bottom: .5rem;
  }

  .data-table th, .data-table td {
    padding: 8px;
    font-size: 14px;
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
  .popup {
    width: 95%;
    max-width: 95%;
  }

  .popup-detail {
    grid-template-columns: 1fr;
  }

  .popup-detail span {
    margin-bottom: .5rem;
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

  .popup-footer .close-btn {
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>

