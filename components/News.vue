<script setup lang="ts">
interface News {
  id: number;
  title: string;
  description: string;
  date: string;
  link?: string;
  image?: string;
  category?: string;
  author?: string;
}

const news: News[] = [
  {
    id: 1,
    title: "Community Iftar Gathering",
    description: "Join us for a communal Iftar at Al Bukhary Mosque this Friday.",
    date: "2025-03-06",
    link: "/news/community-iftar",
    image: "/images/iftar.jpg",
    category: "Event",
    author: "Admin",
  },
  {
    id: 2,
    title: "New Library Section Opened",
    description: "The mosque's library now includes a new section for Islamic studies and children's books.",
    date: "2025-02-28",
    link: "/news/library-update",
    image: "/images/library.jpg",
    category: "Update",
    author: "Library Team",
  },
  {
    id: 3,
    title: "Ramadan Timetable Released",
    description: "Check out the updated prayer and fasting schedule for Ramadan 2025.",
    date: "2025-02-25",
    link: "/news/ramadan-timetable",
    image: "/images/ramadan.jpg",
    category: "Announcement",
    author: "Mosque Management",
  },
  {
    id: 4,
    title: "Volunteer Opportunities Available",
    description: "We are looking for volunteers to assist with mosque activities and charity events.",
    date: "2025-02-20",
    link: "/news/volunteer",
    image: "/images/volunteer.jpg",
    category: "Event",
    author: "Community Outreach",
  }
];

// Group news items in chunks of 3
const groupedNews = [];
for (let i = 0; i < news.length - 1; i += 3) {
  groupedNews.push(news.slice(i, i + 3));
}
const lastNewsItem = news[news.length - 1];
</script>

<template>
  <section class="news-section">
    <div class="container">
      <h2>Latest News</h2>

      <div v-for="(group, index) in groupedNews" :key="'group-' + index" class="news-group">
        <div v-for="newsItem in group" :key="newsItem.id" class="news-card">
          <img v-if="newsItem.image" :src="newsItem.image" :alt="newsItem.title" class="news-image">
          <div class="news-content">
            <h3>{{ newsItem.title }}</h3>
            <p class="date">{{ newsItem.date }}</p>
            <p>{{ newsItem.description }}</p>
            <p v-if="newsItem.author"><strong>By:</strong> {{ newsItem.author }}</p>
            <a v-if="newsItem.link" :href="newsItem.link" class="read-more">Read More</a>
          </div>
        </div>
      </div>

      <!-- Special styling for the last news item -->
      <div v-if="lastNewsItem" class="last-news">
        <div class="news-card special">
          <img v-if="lastNewsItem.image" :src="lastNewsItem.image" :alt="lastNewsItem.title" class="news-image">
          <div class="news-content">
            <h3>{{ lastNewsItem.title }}</h3>
            <p class="date">{{ lastNewsItem.date }}</p>
            <p>{{ lastNewsItem.description }}</p>
            <p v-if="lastNewsItem.author"><strong>By:</strong> {{ lastNewsItem.author }}</p>
            <a v-if="lastNewsItem.link" :href="lastNewsItem.link" class="read-more">Read More</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news-section {
  padding: 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 800px;
  margin: auto;
}

.news-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.news-card {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.news-content {
  padding: 1rem;
}

h2 {
  text-align: center;
}

.date {
  color: gray;
  font-size: 0.9rem;
}

.read-more {
  display: inline-block;
  margin-top: 10px;
  color: blue;
  text-decoration: underline;
}

.last-news {
  margin-top: 2rem;
}

.special {
  background: #fffae6;
  border: 2px solid #ffcc00;
  padding: 1.5rem;
}
</style>
