<script setup lang="ts">
import {computed, ref} from "vue";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const Activity = ref<{
  id: number;
  name: string;
  description: string;
  activity_type: string;
  src: string;
  alt: string;
  date: string;
  url: string | null;
  location: string;
  time: string;
  target_audience: string;
  estimated_participants: number;
  price: number;
  amenities: string[];
  bookingUrl: string;
  activity_status: string;
} | null>(null);

const activities = [
  {
    id: 1,
    name: "Quran Recitation Competition",
    description: "An annual competition where participants showcase their Quran recitation skills.",
    activity_type: "Religious Event",
    src: "/images/masjid-about-bg.png",
    alt: "Quran Recitation Competition",
    target_audience: "Children & Adults",
    bookingUrl: "https://www.example.com/quran-competition",
    location: "Masjid Al-Noor, Main Prayer Hall",
    estimated_participants: 100,
    price: 0,
    date: "2024-11-15",
    time: "10:00 AM - 2:00 PM",
    amenities: ["Prayer Mats", "Sound System", "Seating Area"],
    contact: { phone: "+60123456789", email: "events@masjid.com" },
    tags: ["quran", "recitation", "competition", "islamic"],
    activity_status: "Upcoming",
  },
  {
    id: 2,
    name: "Islamic Parenting Workshop",
    description: "A workshop focused on raising children with Islamic values in a modern world.",
    activity_type: "Educational Seminar",
    src: "/images/masjid-about-bg.png",
    alt: "Islamic Parenting Workshop",
    target_audience: "Parents & Guardians",
    bookingUrl: "https://www.example.com/parenting-workshop",
    location: "Masjid Al-Falah, Community Hall",
    estimated_participants: 80,
    price: 10,
    date: "2024-10-05",
    time: "2:00 PM - 5:00 PM",
    amenities: ["Projector", "Refreshments", "Childcare Area"],
    contact: { phone: "+60987654321", email: "info@masjid.com" },
    tags: ["parenting", "education", "family", "workshop"],
    activity_status: "Open for Registration",
  },
  {
    id: 3,
    name: "Weekly Tafsir Class",
    description: "An in-depth weekly study session on the meaning of the Quran.",
    activity_type: "Religious Class",
    src: "/images/masjid-about-bg.png",
    alt: "Tafsir Class",
    target_audience: "General Public",
    bookingUrl: "https://www.example.com/tafsir-class",
    location: "Masjid An-Nur, Lecture Room 2",
    estimated_participants: 50,
    price: 0,
    date: "Every Friday",
    time: "7:30 PM - 9:00 PM",
    amenities: ["Wi-Fi", "Books & Materials", "Tea & Coffee"],
    contact: { phone: "+6045678912", email: "classes@masjid.com" },
    tags: ["tafsir", "quran", "study", "religious"],
    activity_status: "Ongoing",
  },
  {
    id: 4,
    name: "Ramadan Iftar Program",
    description: "A community event providing free iftar meals for those breaking their fast.",
    activity_type: "Charity Event",
    src: "/images/masjid-about-bg.png",
    alt: "Ramadan Iftar Program",
    target_audience: "Everyone",
    bookingUrl: "https://www.example.com/ramadan-iftar",
    location: "Masjid Al-Rahman, Open Courtyard",
    estimated_participants: 300,
    price: 0,
    date: "2024-03-20 to 2024-04-19",
    time: "Maghrib Time",
    amenities: ["Food & Drinks", "Seating Area", "Volunteer Assistance"],
    contact: { phone: "+60311223344", email: "iftar@masjid.com" },
    tags: ["ramadan", "iftar", "charity", "community"],
    activity_status: "Planned",
  },
  {
    id: 5,
    name: "Masjid Clean-Up Drive",
    description: "A volunteer-driven event to clean and beautify the masjid premises.",
    activity_type: "Community Service",
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Clean-Up Drive",
    target_audience: "Volunteers",
    bookingUrl: "https://www.example.com/clean-up-drive",
    location: "Masjid Al-Huda, Entire Premises",
    estimated_participants: 50,
    price: 0,
    date: "2024-08-10",
    time: "8:00 AM - 12:00 PM",
    amenities: ["Cleaning Supplies", "Refreshments", "Safety Gear"],
    contact: { phone: "+60155667788", email: "volunteer@masjid.com" },
    tags: ["community", "cleaning", "volunteer", "service"],
    activity_status: "Upcoming",
  },
  {
    id:6,
    name: "Ramadan Iftar Program",
    description: "A community event providing free iftar meals for those breaking their fast.",
    activity_type: "Charity Event",
    src: "/images/masjid-about-bg.png",
    alt: "Ramadan Iftar Program",
    target_audience: "Everyone",
    bookingUrl: "https://www.example.com/ramadan-iftar",
    location: "Masjid Al-Rahman, Open Courtyard",
    estimated_participants: 300,
    price: 0,
    date: "2024-03-20 to 2024-04-19",
    time: "Maghrib Time",
    amenities: ["Food & Drinks", "Seating Area", "Volunteer Assistance"],
    contact: { phone: "+60311223344", email: "iftar@masjid.com" },
    tags: ["ramadan", "iftar", "charity", "community"],
    activity_status: "Planned",
  },
  {
    id: 7,
    name: "Masjid Clean-Up Drive",
    description: "A volunteer-driven event to clean and beautify the masjid premises.",
    activity_type: "Community Service",
    src: "/images/masjid-about-bg.png",
    alt: "Masjid Clean-Up Drive",
    target_audience: "Volunteers",
    bookingUrl: "https://www.example.com/clean-up-drive",
    location: "Masjid Al-Huda, Entire Premises",
    estimated_participants: 50,
    price: 0,
    date: "2024-08-10",
    time: "8:00 AM - 12:00 PM",
    amenities: ["Cleaning Supplies", "Refreshments", "Safety Gear"],
    contact: { phone: "+60155667788", email: "volunteer@masjid.com" },
    tags: ["community", "cleaning", "volunteer", "service"],
    activity_status: "Upcoming",
  },
];

const currentIndex = ref(0);
const itemsPerPage = ref(6);

const visibleActivities = computed(() => {
  return activities.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < activities.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = activities.length - itemsPerPage.value;
  }
}

</script>

<template>

  <section class="activities">

    <h1 class="title">

      <UIcon
          name="mdi-chevron-right"
      />

      {{ t('activities.title') }}

    </h1>

    <div class="activities-container">
      <div class="card" v-for="activities in visibleActivities" :key="activities.id">
        <img
            :src="activities.src"
            :alt="activities.alt"
            class="card-activities"
        />
        <div class="overlay">
          <UIcon name="mdi-newspaper" class="activities-icon"/>
          <NuxtLink :to="`/activities/${activities.id}`" class="activities-title">
            <UIcon name="mdi-information-outline"/>
            Learn More
          </NuxtLink>

        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevPage" class="nav-button">
        <UIcon name="mdi-arrow-left-circle"/>
      </button>
      <button @click="nextPage" class="nav-button">
        <UIcon name="mdi-arrow-right-circle"/>
      </button>

    </div>
  </section>
</template>

<style scoped>

section {
  width: 100%;
  padding: 3rem 1rem;
  text-align: center;
  margin: 0 auto;
}

section .title {
  align-items: center;
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0 2rem 3rem 2rem;
}

.activities {
  padding: 1.5rem;
  text-align: start;
}

.activities-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  flex: 1 1 calc(33.33% - 1rem);
  max-width: 400px;
  position: relative;
  height: 250px;
  overflow: hidden;
  cursor: pointer;
}

.card-activities {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.card:hover .overlay {
  opacity: 1;
}

.activities-icon {
  font-size: 3rem;
  color: white;
}

.activities-title {
  color: white;
  font-size: 1.2rem;
  margin-top: 10px;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 2rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  color: var(--primary-color);
  border: none;
  outline: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.nav-button:hover {
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .card {
    flex: 1 1 calc(50% - 1rem);
  }
}

@media (max-width: 480px) {
  .card {
    flex: 1 1 100%;
  }
}


.activities {
  background: var(--bg-color);
}

</style>
