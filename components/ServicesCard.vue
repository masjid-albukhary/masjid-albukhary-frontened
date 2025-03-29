<script setup lang="ts">
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

interface Service {
  id: number
  title: string
  facilities: string[]
  price: string
}

const services: Service[] = [
  {
    id: 1,
    title: "Circumcision Event at Masjid Al-Bukhari",
    facilities: [
      "Pre-event briefing",
      "Certified medical practitioners",
      "Comfortable environment",
      "Post-care guidance",
      "Souvenir for participants",
      "Refreshments provided"
    ],
    price: "RMXXX",
  },
  {
    id: 2,
    title: "Aqiqah with Masjid Al-Bukhari",
    facilities: [
      "Livestock selection",
      "Shariah-compliant process",
      "Meat distribution service",
      "Certificate of completion",
      "Dua recitation",
      "Live event streaming option"
    ],
    price: "RMXXX",
  },
  {
    id: 3,
    title: "Quran Classes (6 - 18 years old)",
    facilities: [
      "Experienced Quran teachers",
      "Tajweed & memorization",
      "Small class sizes",
      "Flexible timings",
      "Monthly progress reports",
      "Online & offline classes"
    ],
    price: "RMXXX per month",
  },
  {
    id: 4,
    title: "Zakat Fitrah",
    facilities: [
      "Official collection point",
      "Transparent distribution",
      "Guidance on calculations",
      "Multiple payment options",
      "Support for needy families",
      "Official receipt provided"
    ],
    price: "RMXXX",
  },
  {
    id: 5,
    title: "Solemnisation at Al-Bukhari Mosque",
    facilities: [
      "Spacious & serene venue",
      "Official marriage solemnizer",
      "Customized wedding package",
      "Photography services available",
      "Marriage counseling session",
      "Islamic legal documentation"
    ],
    price: "RMXXX",
  },
  {
    id: 6,
    title: "Participate in Our Qurban Event",
    facilities: [
      "Qurban livestock selection",
      "Shariah-compliant slaughter",
      "Meat distribution service",
      "Live event participation",
      "Certificate of Qurban",
      "Charitable contribution option"
    ],
    price: "RMXXX per share",
  },
  {
    id: 7,
    title: "Yasin & Tahlil",
    facilities: [
      "Dedicated prayer session",
      "Imam-led recitation",
      "Spiritual gathering space",
      "Supplication for the deceased",
      "Refreshments included",
      "Live streaming option"
    ],
    price: "RMXXX",
  },
  {
    id: 8,
    title: "Jenazah or Funeral Management",
    facilities: [
      "24/7 service availability",
      "Complete Islamic funeral rites",
      "Burial arrangement",
      "Transportation service",
      "Family support & guidance",
      "Funeral prayer session"
    ],
    price: "RMXXX",
  },
  {
    id: 9,
    title: "Catering from Our Own Kitchen",
    facilities: [
      "Halal-certified kitchen",
      "Customized menu options",
      "Event catering services",
      "Delivery available",
      "Freshly prepared meals",
      "Bulk order discounts"
    ],
    price: "RMXXX per pax",
  },
  {
    id: 10,
    title: "E-Wasiat",
    facilities: [
      "Digital will drafting",
      "Islamic legal compliance",
      "Secure online storage",
      "Professional guidance",
      "Easy document retrieval",
      "Affordable pricing"
    ],
    price: "RMXXX",
  },
  {
    id: 11,
    title: "E-Khairat Kematian",
    facilities: [
      "Membership-based coverage",
      "Immediate financial aid",
      "Shariah-compliant fund",
      "Jenazah management support",
      "No medical check-up required",
      "Simple registration process"
    ],
    price: "RMXXX per year",
  }
];

const currentServiceIndex = ref(0);

const itemsPerPage = ref(3);


const visibleService = computed(() => {
  return services.slice(currentServiceIndex.value, currentServiceIndex.value + itemsPerPage.value);
});

function nextServicePage() {
  if (currentServiceIndex.value + itemsPerPage.value < services.length) {
    currentServiceIndex.value += itemsPerPage.value;
  } else {
    currentServiceIndex.value = 0;
  }
}

function prevServicePage() {
  if (currentServiceIndex.value - itemsPerPage.value >= 0) {
    currentServiceIndex.value -= itemsPerPage.value;
  } else {
    currentServiceIndex.value = services.length - itemsPerPage.value;
  }
}


</script>

<template>
  <section class="service-section">
    <div class="service-header">
      <h2 class="service-title">{{ t('service.service_title') }}</h2>
      <p class="service-description">
        {{ t('service.service_description') }}
      </p>
    </div>

    <div class="service-grid">
      <div class="service-card" v-for="service in visibleService" :key="service.id">
        <div class="service-card-icon">
          <UIcon name="mdi-home-modern" class="service-icon" />
        </div>

        <div class="service-card-header">
          <h3 class="service-card-title">{{ service.title }}</h3>
        </div>

        <div class="service-card-content">
          <ul class="service-facilities">
            <li v-for="(facility, index) in service.facilities" :key="index">
              <UIcon name="mdi-office-building" class="service-icon" />
              {{ facility }}
            </li>
          </ul>
        </div>

        <div class="service-card-footer">
          <span class="service-price">{{ service.price }}</span>
        </div>

        <router-link to="/services-form" class="booking-structure-btn">
          <UIcon name="mdi-register" class="register-icon" />
          {{ t('booking.booking_structure.button') }}
        </router-link>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevServicePage" class="nav-button">
        <UIcon name="mdi-arrow-left" />
      </button>
      <button @click="nextServicePage" class="nav-button">
        <UIcon name="mdi-arrow-right" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.service-section {
  padding: 4rem 1rem;
  text-align: center;
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.service-header {
  max-width: 800px;
  margin-bottom: 2rem;
}

.service-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.service-description {
  font-size: 1.1rem;
  color: var(--secondary-color);
  line-height: 1.6;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.service-card {
  background: linear-gradient(135deg, var(--secondary-color) 20%, var(--primary-color) 100%);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.service-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.service-card-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.service-card-icon .service-icon {
  font-size: 2.5rem;
  color: white;
}

.service-card-title {
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
}

.service-facilities {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.service-facilities li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.service-facilities li:hover {
  opacity: 1;
}

.service-icon {
  font-size: 1.3rem;
  color: white;
}

.service-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffd700;
  margin-top: 1rem;
}

.booking-structure-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  padding: 0.8rem 1.8rem;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
}

.booking-structure-btn:hover {
  background: var(--secondary-color);
  transform: scale(1.1);
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}

.nav-button {
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.nav-button:hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}
</style>

