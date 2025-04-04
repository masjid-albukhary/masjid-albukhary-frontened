<script setup lang="ts">
import {computed, ref} from "vue";

const {t} = useI18n();

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
  {
    id: 5,
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
    id: 6,
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

const currentIndex = ref(0);
const itemsPerPage = ref(3);
const visibleFacilities = computed(() => {
  return facilities.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < facilities.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = facilities.length - itemsPerPage.value;
  }
}

</script>

<template>

  <section class="facilities">
    <h1 class="title"> {{t('facilities.title')}}</h1>
    <div class="facilities-container">
      <div class="card" v-for="facility in visibleFacilities" :key="facility.id">
        <img
            :src="facility.src"
            :alt="facility.alt"
            class="card-facilities"
        />
        <div class="overlay">
          <UIcon name="mdi-office-building" class="facilities-icon"/>
          <NuxtLink :to="`/facilities/${facility.id}`" class="facilities-title">
            <UIcon name="mdi-information-outline" />
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
  text-align: center;
  background: var(--bg-color);
  margin: auto;
}

h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: start;
}

.facilities {
  padding: 2rem;
  text-align: center;
}

.facilities-container {
  max-width: 1200px;
  margin: 0 auto;
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

.card-facilities {
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

.facilities-icon {
  font-size: 3rem;
  color: white;
}

.facilities-title {
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
  background-color: transparent;
  color: var(--primary-color);
  border: none;
  outline: none;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.nav-button:hover {
  transform: scale(1.05);
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


.facilities {
  background: var(--bg-color);
}

</style>
