<script setup lang="ts">
import {useRoute} from "vue-router";
import {ref, onMounted} from "vue";

const route = useRoute();
const newsInfo = ref<{
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

const news = [
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
    src: "images/sports-complex.jpg",
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
    src: "images/library-room.jpg",
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
    src: "images/banquet-hall.jpg",
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
    src: "images/tech-hub.jpg",
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
    src: "images/kids-center.jpg",
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

onMounted(() => {
  const id = Number(route.params.id);
  newsInfo.value = news.find((item) => item.id === id) || null;
});
</script>

<template>
  <NavBar/>

  <section class="news-details" v-if="newsInfo">
    <div class="news-container">
      <div class="news-content">
        <h1 class="news-title">{{ newsInfo.name }}</h1>
        <img :src="newsInfo.src" :alt="newsInfo.alt" class="news-image"/>

        <div class="news-meta">
          <p>
            <UIcon name="mdi-marker" class="news-icon"/>
            <span>Category:</span> {{ newsInfo.category }}
          </p>
          <p>
            <UIcon name="mdi-marker" class="news-icon"/>
            <span>Description:</span> {{ newsInfo.description }}
          </p>
          <p>
            <UIcon name="mdi-map-marker" class="news-icon"/>
            <span>Location:</span> {{ newsInfo.location }}
          </p>
          <p>
            <UIcon name="mdi-account-group" class="news-icon"/>
            <span>Capacity:</span> {{ newsInfo.capacity }} people
          </p>
          <p>
            <UIcon name="mdi-cash" class="news-icon"/>
            <span>Price:</span> ${{ newsInfo.price }} per hour
          </p>
        </div>

        <div class="amenities">
          <h2>Amenities</h2>
          <ul>
            <li v-for="amenity in newsInfo.amenities" :key="amenity">
              <UIcon name="mdi-checkbox-marked-circle-outline" class="news-icon"/>
              {{ amenity }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <p v-else class="loading">Loading...</p>

  <News/>
  <Footer/>
</template>

<style scoped>
.news-details {
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
}

.news-container {
  width: 90%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.news-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1rem;
}

.news-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 24px;
}

.news-meta p {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0.5rem 0;
}

.news-icon {
  margin-right: 0.5rem;
  color: var(--secondary-color);
  font-size: 1.3rem;
}

.news-meta span {
  font-weight: bold;
  color: var(--secondary-color);
  margin-right: 0.3rem;
}

.amenities {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f9f9f9;
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
  background: #fff;
  padding: 0.7rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 8px;
}

@media (max-width: 768px) {
  .news-title {
    font-size: 1.8rem;
  }

  .news-meta p {
    font-size: 1rem;
  }

  .news-container {
    width: 95%;
  }

  .news-image {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .news-title {
    font-size: 1.6rem;
  }

  .news-meta p {
    font-size: 0.95rem;
  }

  .news-image {
    max-height: 250px;
  }
}
</style>
