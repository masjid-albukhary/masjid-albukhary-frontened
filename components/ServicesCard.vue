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
      <h2 class="service-title">{{t('service.service_title')}}</h2>
      <p class="service-description">
        {{t('service.service_description')}}
        </p>
    </div>

    <div class="service-grid">
      <div class="service-card" v-for="service in visibleService" :key="service.id">

        <div class="service-card-icon">

          <UIcon name="mdi-home-modern"  class="service-icon"/>

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
section {
  padding: 3rem 1rem;
  text-align: center;
  background: var(--bg-color);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.service-card-icon {
  background-color: var(--primary-color);
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -4rem auto 0;
  border-radius: 50%;
}

.service-card-icon .service-icon {
  background: var(--text-hover);
  font-size: 2.5rem;
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.service-header {
  max-width: 800px;
  margin: 2rem auto;
}

.service-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.service-description {
  font-size: 1rem;
  color: var(--secondary-color);
  line-height: 1.6;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: var(--secondary-color);
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.service-card-header {
  text-align: center;
  margin-bottom: 1rem;
}

.service-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.service-facilities {
  list-style: none;
  padding: 0;
}

.service-facilities li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.service-icon {
  font-size: 1.2rem;
  color: white;
}

.service-card-footer {
  text-align: center;
  margin-top: 1rem;
}

.service-price {
  font-size: 1.2rem;
  font-weight: bold;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}

.nav-button {
  padding: 0.75rem 1.5rem;
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
