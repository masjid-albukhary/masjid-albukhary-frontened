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
    price: "RMXXX",
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
              <UIcon name="mdi-check-circle" class="service-icon" />
              {{ facility }}
            </li>
          </ul>
        </div>

        <div class="service-card-footer">
          <router-link to="/services-form" class="booking-structure-btn">

            <UIcon name="mdi-calendar-check" class="register-icon" />
            {{ t('service.button') }}
          </router-link>

          <span class="service-price">
            {{ service.price }}
          </span>
        </div>
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
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
  max-width: 400px;
}

.service-card:hover {
  transform: scale(1.01);
  box-shadow: rgba(149, 157, 165, 0.4) 0 8px 24px;
}

.service-card-icon {
  background: rgba(255, 255, 255, 0.3);
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

.service-card-content{
  min-height: 220px;
}

.service-facilities {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.service-facilities li {
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  transition: all 0.3s ease-in;
}

.service-facilities li:hover {
  opacity: 1;
  color: var(--text-hover);
}

.service-icon {
  font-size: 1.3rem;
}

.service-card-footer{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.service-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text-hover);
  margin: 0 auto;
  padding: .5rem 1rem;
  background: transparent;
}

.booking-structure-btn {
  color: var(--text-color);
  border-radius: 10px;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
  margin: 0 auto;
  padding: .5rem 1rem;
  background: var(--primary-color);
}

.booking-structure-btn:hover {
  background: var(--secondary-color);
  color: var(--text-hover);
}

.register-icon {
  margin-right: 0.75rem;
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

