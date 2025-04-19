<script setup lang="ts">
const { locale, t } = useI18n()
</script>

<template>
  <section class="sub-landing">
    <div class="content-wrapper">
      <h2 class="title">
        {{ t('landing.title', { locale }) || t('landing.title_en') }}
      </h2>
    </div>
  </section>
</template>

<style scoped>
.sub-landing {
  position: relative;
  padding: 3rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/images/sub_landing_image.png");
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(10px);
  color: var(--text-hover);
  min-height: 50vh;
  animation: fadeIn 1s ease-out;
  overflow: hidden;
}

.sub-landing::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.05);
  animation: pulseLight 8s infinite alternate;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  animation: slideUp 1s ease-out 0.3s both;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeIn 0.8s ease-out 0.6s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseLight {
  0% {
    background-color: rgba(255, 255, 255, 0.03);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.08);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }

}

@media (max-width: 480px) {
  .sub-landing {
    padding: 2rem 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

}
</style>
