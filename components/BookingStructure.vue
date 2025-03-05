<script setup lang="ts">
const booking_steps = [
  {
    step: 1,
    content: "Fill out the hall booking form with your details and preferred hall.",
    icon: "mdi-info"
  },
  {
    step: 2,
    content: "Our team will review your request within 3 days.",
    icon: "mdi-clock-check"
  },
  {
    step: 3,
    content: "If approved, contact you through WhatsApp message .",
    icon: "mdi-email-check"
  },
  {
    step: 4,
    content: "Finalize your arrangements and get ready for a memorable event!",
    icon: "mdi-celebration"
  }
];
</script>

<template>
  <section class="booking-structure">
    <h2 class="booking-structure-title">How to Book a Hall</h2>

    <div class="container">
      <div class="steps-booking-structure-container">
        <ul class="booking-structure-list">
          <li v-for="step in booking_steps" :key="step.step">
            <UIcon :name="step.icon" class="booking-structure-icon" />
            <span>{{ step.content }}</span>
          </li>
        </ul>
      </div>
      <div class="image-booking-structure-container">
        <img src="/images/booking-image.png" alt="booking-structure-image" class="booking-structure-image">
      </div>
    </div>

    <router-link to="/" class="booking-structure-btn">
      <UIcon name="mdi-register" class="register-icon" />
      Book Now
    </router-link>
  </section>
</template>


<style scoped>
.booking-structure {
  width: 100%;
  background-color: var(--bg-color);
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
  text-align: center;
}

.booking-structure .container {
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: center;
}

.booking-structure h2 {
  text-align: center;
  margin-bottom: var(--text-size-h2);
  font-size: var(--text-size-h2);
  padding-top: 2rem;
  color: var(--text-hover);
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
  color: var(--text-hover);
}

.booking-structure-icon {
  color: var(--primary-color);
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.booking-structure-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  width: auto;
  color: var(--bg-color);
  text-align: center;
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

  .booking-structure-icon {
    font-size: 1.5rem;
    margin-right: 0;
  }

  .booking-structure-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
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
