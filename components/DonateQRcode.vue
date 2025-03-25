<script setup lang="ts">
const qrCode = "./images/masjid%20albukhary%20kl%20QR%20code.png";
</script>

<template>
  <section class="donation-section">
    <div class="donation-container">
      <div class="donations-images">
        <div class="donation-image-wrapper">
          <img :src="qrCode" alt="Masjid Albukhary KL QR Code" class="ppam-image" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.donation-section {
  padding: 4rem 1rem;
  margin: 0 auto;
}

.donation-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.donations-images {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}

.donation-image-wrapper {
  flex: 1 1 300px;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.ppam-image {
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
