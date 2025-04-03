<script setup lang="ts">
import {useRoute} from "vue-router";
import {ref, onMounted} from "vue";

const {t} = useI18n();
const route = useRoute();

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

onMounted(() => {
  const id = Number(route.params.id);
  Activity.value = activities.find((item) => item.id === id) || null;
});

</script>

<template>
  <Header/>

  <section class="activities-details" v-if="Activity">
    <div class="activities-container">
      <div class="activities-content">

        <h1 class="activities-title">{{ Activity.name }}</h1>

        <img :src="Activity.src" :alt="Activity.alt" class="activities-image"/>

        <div class="activities-meta">

          <p>
            <UIcon name="mdi-tag" class="activities-icon"/>
            <span>Category:</span> {{ Activity.activity_type }}
          </p>

          <p>
            <UIcon name="mdi-text-box-outline" class="activities-icon"/>
            <span>Description:</span> {{ Activity.description }}
          </p>

          <p>
            <UIcon name="mdi-map-marker" class="activities-icon"/>
            <span>Location:</span> {{ Activity.location }}
          </p>

          <p>
            <UIcon name="mdi-clock-time-four-outline" class="activities-icon"/>
            <span>Time:</span> {{ Activity.time }}
          </p>

          <p>
            <UIcon name="mdi-account-group-outline" class="activities-icon"/>
            <span>Capacity:</span> {{ Activity.estimated_participants }} people
          </p>

          <p>
            <UIcon name="mdi-cash-multiple" class="activities-icon"/>
            <span>Price:</span> {{ Activity.price }} per hour
          </p>

          <p>
            <UIcon name="mdi-calendar" class="activities-icon"/>
            <span>Date:</span> {{ Activity.date }}
          </p>


        </div>

        <div class="amenities">

          <h2 class="amenities-title">{{ t('facilities.amenities') }}</h2>

          <ul>
            <li v-for="amenity in Activity.amenities" :key="amenity">
              <UIcon name="mdi-checkbox-marked-circle-outline" class="activities-icon"/>
              {{ amenity }}
            </li>
          </ul>

        </div>

      </div>
    </div>
  </section>

  <p v-else class="loading">Loading...</p>
  
  <Footer/>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes imageZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

.activities-details {
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  animation: fadeIn 0.8s ease-in-out;
}

.activities-container {
  width: 90%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 1s ease-in-out;
}

.activities-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1rem;
  animation: fadeIn 1.2s ease-in-out;
}

.activities-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.4s ease-in-out;
}

.activities-meta{
  margin-top: 2rem;
}

.activities-meta p {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0.5rem 0;
  animation: fadeIn 1.4s ease-in-out;
}

.activities-icon {
  margin-right: 1rem !important;
  color: var(--secondary-color);
  font-size: 1.3rem;
}

.activities-meta span {
  font-weight: bold;
  color: var(--secondary-color);
  margin-right: 0.3rem;
}

.amenities {
  margin-top: 1.5rem;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f5f5f5;
  animation: fadeIn 1.6s ease-in-out;
}

.amenities h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.amenities ul {
  list-style: none;
  padding: 0;
}

.amenities li {
  display: flex;
  align-items: center;
  padding: 0.7rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

.amenities li:hover {
  background: rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .activities-title {
    font-size: 1.8rem;
  }

  .activities-meta p {
    font-size: 1rem;
    align-items: baseline;
    text-align: justify;
  }

  .activities-container {
    width: 95%;
  }

  .activities-image {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .activities-title {
    font-size: 1.6rem;
  }

  .activities-meta p {
    font-size: 0.95rem;
  }

  .activities-image {
    max-height: 250px;
  }
}
</style>
