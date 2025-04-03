<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {ref, onMounted} from 'vue';

const {t} = useI18n();

const route = useRoute();
const router = useRouter();
const facility = ref<{
  id: number;
  name: string;
  description: string;
  category: string;
  src: string;
  alt: string;
  url: string | null;
  location: string;
  capacity: number;
  price: number;
  availability: { day: string; time: string }[];
  amenities: string[];
  bookingUrl: string;
  contact: { phone: string; email: string };
  tags: string[];
  status: string;
} | null>(null);

const facilities = [
  {
    id: 1,
    name: "Community Hall",
    description: "A spacious hall for events, gatherings, and conferences.",
    category: "Event Space",
    src: "/images/masjid-about-bg.png",
    alt: "Community Hall",
    url: "https://www.youtube.com/watch?v=example",
    location: "123 Main Street, City Center",
    capacity: 150,
    price: 200,
    availability: [
      {day: "Monday-Friday", time: "9:00 AM - 9:00 PM"},
      {day: "Saturday-Sunday", time: "10:00 AM - 11:00 PM"}
    ],
    amenities: ["WiFi", "Projector", "Air Conditioning", "Parking"],
    bookingUrl: "https://www.example.com/book-community-hall",
    contact: {
      phone: "+123456789",
      email: "booking@example.com"
    },
    tags: ["event", "hall", "conference", "wedding"],
    status: "Available"
  },
  {
    id: 2,
    name: "Small Meeting Room",
    description: "Perfect for business meetings and small team discussions.",
    category: "Meeting Room",
    src: "/images/masjid-about-bg.png",
    alt: "Meeting Room",
    url: null,
    location: "456 Office Street, Business Park",
    capacity: 10,
    price: 50,
    availability: [
      {day: "Monday-Friday", time: "8:00 AM - 8:00 PM"}
    ],
    amenities: ["WiFi", "Whiteboard", "Air Conditioning"],
    bookingUrl: "https://www.example.com/book-meeting-room",
    contact: {
      phone: "+987654321",
      email: "contact@meetingrooms.com"
    },
    tags: ["business", "meeting", "office"],
    status: "Booked"
  },
  {
    id: 3,
    name: "Community Hall",
    description: "A spacious hall for events, gatherings, and conferences.",
    category: "Event Space",
    src: "/images/masjid-about-bg.png",
    alt: "Community Hall",
    url: "https://www.youtube.com/watch?v=example",
    location: "123 Main Street, City Center",
    capacity: 150,
    price: 200,
    availability: [
      {day: "Monday-Friday", time: "9:00 AM - 9:00 PM"},
      {day: "Saturday-Sunday", time: "10:00 AM - 11:00 PM"}
    ],
    amenities: ["WiFi", "Projector", "Air Conditioning", "Parking"],
    bookingUrl: "https://www.example.com/book-community-hall",
    contact: {
      phone: "+123456789",
      email: "booking@example.com"
    },
    tags: ["event", "hall", "conference", "wedding"],
    status: "Available"
  },
  {
    id: 4,
    name: "Small Meeting Room",
    description: "Perfect for business meetings and small team discussions.",
    category: "Meeting Room",
    src: "/images/masjid-about-bg.png",
    alt: "Meeting Room",
    url: null,
    location: "456 Office Street, Business Park",
    capacity: 10,
    price: 50,
    availability: [
      {day: "Monday-Friday", time: "8:00 AM - 8:00 PM"}
    ],
    amenities: ["WiFi", "Whiteboard", "Air Conditioning"],
    bookingUrl: "https://www.example.com/book-meeting-room",
    contact: {
      phone: "+987654321",
      email: "contact@meetingrooms.com"
    },
    tags: ["business", "meeting", "office"],
    status: "Booked"
  },
];

onMounted(() => {
  const id = Number(route.params.id);
  facility.value = facilities.find((f) => f.id === id) || null;
});

</script>

<template>
  <TranslationHeader/>
  <Header/>

  <section class="facility-details" v-if="facility">

    <div class="facility-container">

      <div class="facility-content">

        <h1 class="facility-title">{{ facility.name }}</h1>

        <img :src="facility.src" :alt="facility.alt" class="facility-image"/>

        <p>
          <UIcon
              name="mdi-tag-outline"
              class="facility-icon"
          />
          <span>Category:</span>
          {{ facility.category }}
        </p>
        <p>
          <UIcon
              name="mdi-text-box-outline"
              class="facility-icon"
          />
          <span>Description:</span>
          {{ facility.description }}
        </p>
        <p>
          <UIcon
              name="mdi-map-marker-outline"
              class="facility-icon"
          />
          <span>Location:</span>
          {{ facility.location }}
        </p>
        <p>
          <UIcon
              name="mdi-account-group"
              class="facility-icon"
          />
          <span>Capacity:</span>
          {{ facility.capacity }} people
        </p>
        <p>
          <UIcon
              name="mdi-currency-usd"
              class="facility-icon"
          />
          <span>Price:</span>
          ${{ facility.price }} per hour
        </p>

        <div class="amenities">
          <h2 class="amenities-title">{{t('facilities.amenities')}}</h2>
          <ul>
            <li
                v-for="amenity in facility.amenities"
                :key="amenity"

            >
              <UIcon
                  name="mdi-cogs"
                  class="facility-icon"
              />
              {{ amenity }}
            </li>
          </ul>
        </div>

      </div>

      <div class="facilities-book-form">
        <h2 class="form-title">{{ t('facilities.facilities_form.title') }}</h2>
        <p class="form-description">{{ t('facilities.facilities_form.description') }} </p>
        <router-link to="/services-form.vue" class="booking-btn">
          {{ t('facilities.facilities_form.button') }}
        </router-link>
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.facility-details {
  margin: 0 auto;
  padding: 4rem 0;
  background: var(--bg-color);
  animation: fadeIn 1s ease-in-out;
}

.facility-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 3rem;
  animation: slideIn 0.8s ease-in-out;
}

.facility-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.facility-image {
  width: 100%;
  height: 350px;
  margin: 1rem auto;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
  transition: transform 0.3s ease;
}

.facility-image:hover {
  transform: scale(1.05);
}

.facility-container p {
  color: var(--primary-color);
  font-weight: normal;
  padding: .5rem;
  margin: .5rem 0;
}

.facility-container .facility-icon {
  margin-right: 1rem;
}

.facility-container p span {
  font-weight: bold;
  color: var(--secondary-color);
  margin-right: .5rem;
}

ul {
  list-style: none;
  padding: 0;
  color: var(--primary-color);
}

li {
  background: #f5f5f5;
  padding: .5rem;
  margin: .5rem 0;
  animation: fadeIn 0.6s ease-in-out;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: var(--primary-color);
  padding: 20px;
}

.facilities-book-form {
  align-items: center;
  display: block;
  margin: auto;
}

.amenities-title{
  margin: 1rem 0;
  font-weight: bold;
  color: var(--primary-color);
}
.facilities-book-form .form-title {
  margin: 1rem 0;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.facilities-book-form .form-description {
  margin: 1rem 0;
  font-weight: normal;
  font-size: 1rem;
  color: var(--primary-color);
  text-align: justify;
}

.facilities-book-form .booking-btn {
  padding: .5rem 1rem;
  display: flex;
  margin: 1rem auto;
  font-weight: normal;
  font-size: 1rem;
  outline: none;
  border: none;
  text-decoration: none;
  color: var(--text-color);
  background-color: var(--primary-color);
  transition: color .3s ease-in-out, background-color .3s ease-in-out;
}

.facilities-book-form .booking-btn:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
}

@media (max-width: 768px) {
  .facility-container {
    width: 90%;
    margin: 0 auto;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .facility-title {
    font-size: 1.8rem;
  }

  .facility-image {
    height: auto;
  }

  .facility-container p,
  .facility-container li {
    font-size: 1rem;
  }

  .facilities-book-form .form-title {
    font-size: 1.5rem;
  }

  .facilities-book-form .form-description {
    font-size: 1rem;
  }

  .facilities-book-form .booking-btn {
    padding: .6rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .facility-title {
    width: 90%;
    margin: 0 auto;
    font-size: 1.6rem;
  }

  .facility-image {
    height: 250px;
  }

  .facilities-book-form .form-title {
    font-size: 1.4rem;
  }

  .facilities-book-form .form-description {
    font-size: 0.9rem;
  }

  .facilities-book-form .booking-btn {
    padding: .5rem 1.2rem;
    font-size: 0.8rem;
  }
}
</style>
