<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const booking_steps = [
  {
    step: 1,
    content: t('service.booking_structure.steps[0].content'),
    icon: "mdi-info"
  },
  {
    step: 2,
    content: t('service.booking_structure.steps[1].content'),
    icon: "mdi-clock-check"
  },
  {
    step: 3,
    content: t('service.booking_structure.steps[2].content'),
    icon: "mdi-email-check"
  },
  {
    step: 4,
    content: t('service.booking_structure.steps[3].content'),
    icon: "mdi-celebration"
  }
]
</script>

<template>
  <section class="booking-structure">
    <h2 class="booking-structure-title">{{ t('service.booking_structure.title') }}</h2>

    <div class="container">
      <div class="steps-booking-structure-container">
        <ul class="booking-structure-list">
          <li v-for="step in booking_steps" :key="step.step">
            <UIcon :name="step.icon" class="booking-structure-icon" />
            <span>{{ step.content }}</span>
          </li>
        </ul>
      </div>
    </div>

    <router-link to="/services-form" class="booking-structure-btn">
      <UIcon name="mdi-register" class="register-icon" />
      {{ t('service.button') }}
    </router-link>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.booking-structure .container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: center;
}

.booking-structure h2 {
  text-align: center;
  margin-bottom: var(--text-size-h2);
  font-size: 2rem;
  padding-top: 2rem;
  color: var(--primary-color);
}

.booking-structure .booking-structure-list {
  list-style: none;
  padding: 2rem 0;
  margin: 0;
}

.booking-structure li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: var(--primary-color);
  text-align: justify;
}

.booking-structure-icon {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.booking-structure-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  color: var(--bg-color);
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin: 2rem auto;
}

.booking-structure-btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

.register-icon {
  margin-right: 0.75rem;
}

.booking-structure-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 auto;
  display: block;
}

@media (max-width: 1024px) {
  .booking-structure .container {
    grid-template-columns: 1fr;
    text-align: start;
  }

  .booking-structure-btn {
    font-size: 0.95rem;
    padding: 0.65rem 1.25rem;
  }

  .booking-structure-image {
    max-width: 250px;
  }
}

@media (max-width: 800px) {
  .booking-structure-icon {
    display: none;
  }

  .booking-structure .booking-structure-list {
    padding: 1rem 0;
  }
}

@media (max-width: 768px) {
  .booking-structure h2 {
    font-size: 1.75rem;
  }

  .booking-structure li {
    font-size: 1rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .booking-structure-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .booking-structure-image {
    max-width: 220px;
  }
}

@media (max-width: 480px) {
  .booking-structure h2 {
    font-size: 1.5rem;
  }

  .booking-structure li {
    font-size: 0.9rem;
  }

  .booking-structure-btn {
    width: 100%;
    max-width: 200px;
  }

  .booking-structure-image {
    max-width: 200px;
  }
}
</style>
