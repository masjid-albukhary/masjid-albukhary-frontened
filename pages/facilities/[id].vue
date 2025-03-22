<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {ref, onMounted} from 'vue';

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
    src: "images/masjid-about-bg.png",
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
    src: "images/masjid-about-bg.png",
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
    src: "images/masjid-about-bg.png",
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
    src: "images/masjid-about-bg.png",
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
    id: 5,
    name: "Community Hall",
    description: "A spacious hall for events, gatherings, and conferences.",
    category: "Event Space",
    src: "images/masjid-about-bg.png",
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
    id: 6,
    name: "Small Meeting Room",
    description: "Perfect for business meetings and small team discussions.",
    category: "Meeting Room",
    src: "images/masjid-about-bg.png",
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

const goBack = () => {
  router.push('/facilities');
};
</script>

<template>
  <Header/>

  <section class="facility-details" v-if="facility">

    <div class="facility-container">

      <div class="facility-content">
        <h1 class="facility-title">{{ facility.name }}</h1>
        <img :src="facility.src" :alt="facility.alt" class="facility-image"/>
        <p>
          <UIcon
              name="mdi-marker"
              class="facility-icon"
          />
          <span>Category:</span>
          {{ facility.category }}
        </p>
        <p>
          <UIcon
              name="mdi-marker"
              class="facility-icon"
          />
          <span>Description:</span>
          {{ facility.description }}
        </p>
        <p>
          <UIcon
              name="mdi-marker"
              class="facility-icon"
          />
          <span>Location:</span>
          {{ facility.location }}
        </p>
        <p>
          <UIcon
              name="mdi-marker"
              class="facility-icon"
          />
          <span>Capacity:</span>
          {{ facility.capacity }}
          people
        </p>
        <p>
          <UIcon
              name="mdi-marker"
              class="facility-icon"
          />
          <span>Price:</span>
          ${{ facility.price }}
          per hour
        </p>
        <div class="amenities">
          <h2>Amenities</h2>
          <ul>
            <li
                v-for="amenity in facility.amenities"
                :key="amenity"

            >
              <UIcon
                  name="mdi-place"
                  class="facility-icon"
              />
              {{ amenity }}
            </li>
          </ul>
        </div>

      </div>

      <div class="facilities-book-form">
        <h2 class="form-title">Book your Wedding/Solemnisation Venue</h2>
        <p class="form-description">Please fill in the form below to complete your booking. We encourage you to read the
          stipulated terms and
          conditions here before submitting the form.
        </p>
        <router-link to="/booking-venue.vue" class="booking-btn">
          Register your Interest
        </router-link>
      </div>

    </div>

  </section>

  <p v-else class="loading">Loading...</p>

  <Footer/>
</template>

<style scoped>
.facility-details {
  margin: 2rem auto;
  padding: 2rem 0;
  background: var(--bg-color);
}

.facility-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 3rem;
}

.facility-title {
  font-size: 2rem;
  color: var(--primary-color);
}

.facility-image {
  width: 100%;
  height: 350px;
  margin: 1rem auto;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
}

.facility-container p {
  color: var(--primary-color);
  font-weight: normal;
}

.facility-container .facility-icon{
  margin-right: 1rem;
}
.facility-container p span{
  font-weight: bold;
  color: var(--secondary-color);
  margin-right: .5rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f8f8f8;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: gray;
  padding: 20px;
}

.facilities-book-form {
  align-items: center;
  display: block;
  margin: auto;
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
  color: var(--text-color);
  background-color: var(--primary-color);
}

.facilities-book-form .booking-btn:hover {
  background-color: var(--secondary-color);
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
  transition: box-shadow .3s ease-in-out, background-color .3s ease-in-out;
}


</style>