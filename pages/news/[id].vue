<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

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
      { day: "Monday-Friday", time: "9:00 AM - 9:00 PM" },
      { day: "Saturday-Sunday", time: "10:00 AM - 11:00 PM" },
    ],
    amenities: ["WiFi", "Projector", "Air Conditioning", "Parking"],
    bookingUrl: "https://www.example.com/book-community-hall",
    contact: { phone: "+123456789", email: "booking@example.com" },
    tags: ["event", "hall", "conference", "wedding"],
    status: "Available",
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
    availability: [{ day: "Monday-Friday", time: "8:00 AM - 8:00 PM" }],
    amenities: ["WiFi", "Whiteboard", "Air Conditioning"],
    bookingUrl: "https://www.example.com/book-meeting-room",
    contact: { phone: "+987654321", email: "contact@meetingrooms.com" },
    tags: ["business", "meeting", "office"],
    status: "Booked",
  },
];

onMounted(() => {
  const id = Number(route.params.id);
  newsInfo.value = news.find((item) => item.id === id) || null;
});
</script>

<template>
  <NavBar />

  <section class="news-details" v-if="newsInfo">
    <div class="news-container">
      <div class="news-content">
        <h1 class="news-title">{{ newsInfo.name }}</h1>
        <img :src="newsInfo.src" :alt="newsInfo.alt" class="news-image" />

        <div class="news-meta">
          <p>
            <UIcon name="mdi-marker" class="news-icon" />
            <span>Category:</span> {{ newsInfo.category }}
          </p>
          <p>
            <UIcon name="mdi-marker" class="news-icon" />
            <span>Description:</span> {{ newsInfo.description }}
          </p>
          <p>
            <UIcon name="mdi-map-marker" class="news-icon" />
            <span>Location:</span> {{ newsInfo.location }}
          </p>
          <p>
            <UIcon name="mdi-account-group" class="news-icon" />
            <span>Capacity:</span> {{ newsInfo.capacity }} people
          </p>
          <p>
            <UIcon name="mdi-cash" class="news-icon" />
            <span>Price:</span> ${{ newsInfo.price }} per hour
          </p>
        </div>

        <div class="amenities">
          <h2>Amenities</h2>
          <ul>
            <li v-for="amenity in newsInfo.amenities" :key="amenity">
              <UIcon name="mdi-checkbox-marked-circle-outline" class="news-icon" />
              {{ amenity }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <p v-else class="loading">Loading...</p>

  <News/>
  <Footer />
</template>

<style scoped>
.news-details {
  margin:0 auto;
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
