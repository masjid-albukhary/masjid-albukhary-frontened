<script setup lang="ts">
import {computed, ref} from "vue";

interface News {
  id: number;
  src: string;
  alt: string;
  name: string;
  summary: string;
  description: string;
  location: string;
  contact: {
    phone: string;
    email: string;
  };
  category: string;
  capacity: number;
  price: number;
  availability: {
    day: string;
    time: string;
  }[];
  amenities: string[];
  bookingUrl: string;
  tags: string[];
  status: "Available" | "Booked";
}

const news= [
  {
    id: 1,
    name: "Masjid Event Hall",
    description: "A beautifully designed hall for community prayers and events.",
    category: "Religious Space",
    src: "images/masjid-about-bg.png",
    alt: "Masjid Video 1",
    bookingUrl: "https://www.youtube.com/watch?v=4pku9EburYQ",
    location: "456 Mosque Road, Downtown",
    capacity: 200,
    price: 150,
    availability: [
      { day: "Monday-Friday", time: "8:00 AM - 10:00 PM" },
      { day: "Saturday-Sunday", time: "9:00 AM - 11:00 PM" },
    ],
    amenities: ["Prayer Mats", "Sound System", "Air Conditioning", "Parking"],
    contact: { phone: "+987654321", email: "info@masjid.com" },
    tags: ["religious", "masjid", "prayer", "event"],
    status: "Available",
  },
  {
    id: 2,
    name: "Community Sports Complex",
    description: "A modern sports complex with facilities for football, basketball, and tennis.",
    category: "Sports Facility",
    src: "images/masjid-about-bg.png",
    alt: "Sports Complex",
    url: "https://www.example.com/sports-complex",
    location: "123 Stadium Road, City Center",
    capacity: 500,
    price: 200,
    availability: [
      { day: "Monday-Friday", time: "6:00 AM - 10:00 PM" },
      { day: "Saturday-Sunday", time: "7:00 AM - 11:00 PM" },
    ],
    amenities: ["Locker Rooms", "Floodlights", "Seating Area", "Cafeteria"],
    bookingUrl: "https://www.example.com/book-sports-complex",
    contact: { phone: "+123456789", email: "contact@sportscomplex.com" },
    tags: ["sports", "fitness", "stadium", "community"],
    status: "Available",
  },
  {
    id: 3,
    name: "Public Library Conference Room",
    description: "A quiet and professional space for meetings, workshops, and study sessions.",
    category: "Library",
    src: "images/masjid-about-bg.png",
    alt: "Library Conference Room",
    url: "https://www.example.com/library-room",
    location: "789 Book Street, Knowledge Town",
    capacity: 50,
    price: 50,
    availability: [
      { day: "Monday-Friday", time: "9:00 AM - 8:00 PM" },
      { day: "Saturday", time: "10:00 AM - 6:00 PM" },
    ],
    amenities: ["Wi-Fi", "Projector", "Whiteboard", "Bookshelf Access"],
    bookingUrl: "https://www.example.com/book-library-room",
    contact: { phone: "+112233445", email: "library@knowledge.com" },
    tags: ["library", "conference", "study", "workshop"],
    status: "Booked",
  },
  {
    id: 4,
    name: "City Hall Banquet Hall",
    description: "A grand hall for weddings, banquets, and formal events.",
    category: "Banquet Hall",
    src: "images/masjid-about-bg.png",
    alt: "City Hall Banquet",
    url: "https://www.example.com/city-hall-banquet",
    location: "222 City Square, Metropolitan Area",
    capacity: 300,
    price: 500,
    availability: [
      { day: "Monday-Saturday", time: "12:00 PM - 11:00 PM" },
    ],
    amenities: ["Catering", "Stage", "Lighting System", "Parking"],
    bookingUrl: "https://www.example.com/book-banquet-hall",
    contact: { phone: "+556677889", email: "events@cityhall.com" },
    tags: ["banquet", "wedding", "event", "reception"],
    status: "Available",
  },
  {
    id: 5,
    name: "Tech Innovation Hub",
    description: "A co-working space designed for startups, entrepreneurs, and developers.",
    category: "Co-Working Space",
    src: "images/masjid-about-bg.png",
    alt: "Tech Innovation Hub",
    url: "https://www.example.com/tech-hub",
    location: "88 Silicon Valley, Tech District",
    capacity: 100,
    price: 100,
    availability: [
      { day: "Monday-Friday", time: "8:00 AM - 10:00 PM" },
    ],
    amenities: ["High-Speed Wi-Fi", "Meeting Rooms", "Coffee Bar", "Tech Support"],
    bookingUrl: "https://www.example.com/book-tech-hub",
    contact: { phone: "+998877665", email: "support@techhub.com" },
    tags: ["coworking", "startup", "tech", "workspace"],
    status: "Available",
  },
  {
    id: 6,
    name: "Children's Activity Center",
    description: "An interactive and fun space for kids to learn and play.",
    category: "Children's Center",
    src: "images/masjid-about-bg.png",
    alt: "Kids Activity Center",
    url: "https://www.example.com/kids-center",
    location: "55 Happy Street, Family Town",
    capacity: 80,
    price: 75,
    availability: [
      { day: "Monday-Saturday", time: "10:00 AM - 7:00 PM" },
    ],
    amenities: ["Playground", "Art & Craft Zone", "Storytelling Area", "Supervision"],
    bookingUrl: "https://www.example.com/book-kids-center",
    contact: { phone: "+445566778", email: "kids@activitycenter.com" },
    tags: ["children", "play", "education", "family"],
    status: "Booked",
  }
];

const currentIndex = ref(0);
const itemsPerPage = ref(6);

const visibleNews = computed(() => {
  return news.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

function nextPage() {
  if (currentIndex.value + itemsPerPage.value < news.length) {
    currentIndex.value += itemsPerPage.value;
  } else {
    currentIndex.value = 0;
  }
}

function prevPage() {
  if (currentIndex.value - itemsPerPage.value >= 0) {
    currentIndex.value -= itemsPerPage.value;
  } else {
    currentIndex.value = news.length - itemsPerPage.value;
  }
}

</script>

<template>

  <section class="news">
    <h1>
      <UIcon
          name="mdi-office-building"
      />
      Our news
    </h1>
    <div class="news-container">
      <div class="card" v-for="news in visibleNews" :key="news.id">
        <img
            :src="news.src"
            :alt="news.alt"
            class="card-news"
        />
        <div class="overlay">
          <UIcon name="mdi-newspaper" class="news-icon" />
          <NuxtLink :to="`/news/${news.id}`" class="news-title">
            <UIcon name="mdi-information-outline" />
            Learn More
          </NuxtLink>

        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevPage" class="nav-button">
        <UIcon name="mdi-arrow-left"/>
      </button>
      <button @click="nextPage" class="nav-button">
        <UIcon name="mdi-arrow-right"/>
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

h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.news {
  padding: 2rem;
  text-align: center;
}

.news-container {
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

.card-news {
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

.news-icon {
  font-size: 3rem;
  color: white;
}

.news-title {
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
  font-size: 1.2rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  outline: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.nav-button:hover {
  background-color: var(--secondary-color);
  color: var(--text-color);
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


.news {
  background: var(--bg-color);
}

</style>
