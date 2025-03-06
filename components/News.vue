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
    image: "/images/booking-image.png",
    category: "Event",
    author: "Admin",
  },
  {
    id: 2,
    title: "New Library Section Opened",
    description: "The mosque's library now includes a new section for Islamic studies and children's books.",
    date: "2025-02-28",
    link: "/news/library-update",
    image: "/images/booking-image.png",
    category: "Update",
    author: "Library Team",
  },
  {
    id: 3,
    title: "Ramadan Timetable Released",
    description: "Check out the updated prayer and fasting schedule for Ramadan 2025.",
    date: "2025-02-25",
    link: "/news/ramadan-timetable",
    image: "/images/booking-image.png",
    category: "Announcement",
    author: "Mosque Management",
  },
  {
    id: 4,
    title: "Volunteer Opportunities Available",
    description: "We are looking for volunteers to assist with mosque activities and charity events.",
    date: "2025-02-20",
    link: "/news/volunteer",
    image: "/images/booking-image.png",
    category: "Event",
    author: "Community Outreach",
  },

];

const groupedNews = [];
for (let i = 0; i < news.length - 1; i += 3) {
  groupedNews.push(news.slice(i, i + 3));
}
const lastNewsItem = news[news.length - 1];

</script>

<template>
  <section class="news-section">

    <h2 class="news-main-title">Recent News & Updates</h2>

    <div class="news-section-container">

      <div v-if="lastNewsItem" class="last-news">
        <div class="news-card special">
          <div class="news-image-special">

            <img v-if="lastNewsItem.image" :src="lastNewsItem.image" :alt="lastNewsItem.title" class="news-image">

          </div>
          <div class="news-content">
            <h3>{{ lastNewsItem.title }}</h3>
            <p class="date">{{ lastNewsItem.date }}</p>
            <p>{{ lastNewsItem.description }}</p>
            <a v-if="lastNewsItem.link" :href="lastNewsItem.link" class="read-more">Read More</a>
          </div>
        </div>
      </div>

      <div v-for="(group, index) in groupedNews" :key="'group-' + index" class="news-group">
        <div v-for="newsItem in group" :key="newsItem.id" class="news-card">
          <div class="image-news-container">
            <img v-if="newsItem.image" :src="newsItem.image" :alt="newsItem.title" class="news-image">
          </div>

          <div class="news-content">
            <h3>{{ newsItem.title }}</h3>
            <p class="date">{{ newsItem.date }}</p>
            <p>{{ newsItem.description }}</p>
            <a v-if="newsItem.link" :href="newsItem.link" class="read-more">Read More</a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.news-section {
  padding: 2rem;
  background-color: var(--bg-color);
  width: 100%;
}

.news-section .news-main-title {
  text-align: center;
  font-size: var(--text-size-h2);
  font-weight: bold;
  margin: 1rem auto;
  color: var(--primary-color);
}

.news-section-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.news-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.news-card {
  display: grid;
  grid-template-columns: 2fr 3fr;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: rgba(149, 157, 165, 0.1) 0 8px 24px;
}

.news-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px 0 0 5px;
}

.news-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  color: var(--primary-color);
  text-decoration: none;
}

.read-more:hover {
  color: var(--secondary-color);
  text-decoration: underline;
  transition: color 0.3s ease-in-out, text-decoration;
}

.last-news {
  margin-top: 2rem;
}

.special {
  display: block;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .news-section-container {
    grid-template-columns: 1fr;
  }

  .news-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .news-image {
    width: 100%;
    height: 200px;
    border-radius: 10px 10px 0 0;
  }
}
</style>
