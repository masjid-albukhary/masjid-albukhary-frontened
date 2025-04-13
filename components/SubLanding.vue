<script setup lang="ts">

const {locale, t} = useI18n()

</script>

<template>
  <section class="landing">

    <div class="landing-container">
      <div class="info-container">
        <h2 class="section-title">
          {{ t('landing.title', {locale}) || t('landing.title_en') }}
        </h2>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}

.landing {
  padding: 2rem;
  display: flex;
  align-items: center;
  background-image: url("/images/sub_landing_image.png");
  backdrop-filter: blur(12px);
  background-size: cover;
  background-position: center;
  color: var(--text-hover);
  height: 30vh;
  max-height: 250px;
  animation: fadeIn 1.2s ease-out;
  position: relative;
  overflow: hidden;
}

.landing::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.03);
  animation: pulseLight 8s infinite alternate;
  z-index: 0;
}

@keyframes pulseLight {
  0% {
    background-color: rgba(255, 255, 255, 0.03);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.08);
  }
}

.landing-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
  animation: slideUp 1s ease-out 0.3s both;
}

.info-container {
  padding: 2rem;
  animation: fadeIn 1s ease-out 0.5s both;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-hover);
  position: relative;
  padding-bottom: 0.5rem;
  animation: fadeIn 0.8s ease-out 0.8s both;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 250px;
  height: 3px;
  background-color: var(--text-hover);
  animation: growWidth 0.6s ease-out 1s both;
}

@keyframes growWidth {
  from {
    width: 0;
  }
  to {
    width: 60px;
  }
}

@media (max-width: 1024px) {
  .landing-container {
    gap: 2rem;
    animation-delay: 0.2s;
  }
}

@media (max-width: 768px) {
  .landing {
    padding: 1.5rem;
  }

  .landing-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    animation: slideUp 0.8s ease-out 0.2s both;
  }

  .info-container {
    text-align: center;
    padding: 1rem;
    animation-delay: 0.3s;
  }


  .section-title {
    font-size: 1.5rem;
    animation-delay: 0.5s;
  }

  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
    animation: growWidthCenter 0.6s ease-out 0.6s both;
  }

  @keyframes growWidthCenter {
    from {
      width: 0;
    }
    to {
      width: 60px;
    }
  }

}

@media (max-width: 480px) {
  .landing {
    padding: 1rem;
  }

}
</style>