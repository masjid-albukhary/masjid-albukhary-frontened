<script setup>
import {defineEmits, defineProps} from 'vue'

const {t} = useI18n();

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show'])

const closePopup = () => {
  emit('update:show', false)
}
const today = new Date();
</script>

<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-container" @click.stop>
      <div class="notification">
        <div class="logo-box">
          <img src="/images/Masjid-submit-popup.png" alt="submit popup image">
        </div>
        <div class="thank-info">
          <h2>{{t('contact.popup.title')}}</h2>
          <p>
            {{t('contact.popup.message')}}
          </p>
          <h2>{{t('contact.popup.thanksMessage')}}</h2>
        </div>
      </div>
      <hr class="divider">
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  animation: fadeIn 0.4s ease-in-out;
}

.popup-container {
  background: var(--bg-color);
  padding: 20px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  position: relative;
  text-align: center;
  z-index: 1003;
  animation: fadeIn 0.4s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .popup-container {
    border-radius: 0;
    max-width: 95%;
    padding: 15px;
  }

  h2 {
    font-size: 1.2rem;
    line-height: 2rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6rem;
  }
}

.logo-box {
  width: 200px;
  margin: 0 auto 3rem auto;
}

.logo-box img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

span {
  margin: 0 5px;
}

.thank-info {
  margin-top: -3rem;
}

h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  line-height: 2.5rem;
}

p {
  font-size: 1.2rem;
  line-height: 2rem;
  color: var(--primary-color);
  text-align: justify;
  margin: 5% 3%;
}

.divider {
  margin: 5% 3%;
  border: 1px solid var(--primary-color);
}
</style>
