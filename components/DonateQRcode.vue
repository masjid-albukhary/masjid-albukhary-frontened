<script setup lang="ts">
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const qrCode = "./images/masjid%20albukhary%20kl%20QR%20code.png";
</script>

<template>
  <section class="donation-section">
    <h2 class="donation-title">{{t('donation.title')}}</h2>
    <div class="donation-container">
      <div class="donation-image-wrapper">
        <img :src="qrCode" alt="Masjid Albukhary KL QR Code" class="donation-image"/>
      </div>
    </div>
  </section>
</template>

<style scoped>
.donation-section {
  padding: 4rem 1rem;
  margin: 0 auto;
}

.donation-title{
  text-align: center;
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 4rem;
}

.donation-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.donation-image-wrapper {
  flex: 1 1 300px;
  max-width: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  align-items: center;
  margin: 0 auto;
}

.donation-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .donation-section {
    padding: 2rem 1rem;
  }

  .donation-image-wrapper {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>
