<script setup lang="ts">

const aboutItem = [
  {
    id: 1,
    title: "Our Vision",
    content: "To be a beacon of Islamic knowledge, spirituality, and community service, fostering unity and inclusivity while upholding the principles of faith, education, and social welfare.",
    image: "images/Masjid-Al-Bukhary.png",
  },
  {
    id: 2,
    title: "Our Mission",
    content: "" +
        "Spiritual Growth: Provide a welcoming space for prayer, worship, and reflection, promoting a deep connection with Allah." +
        "Education & Knowledge: Offer Islamic teachings, Quranic studies, and community learning programs to nurture faith and understanding." +
        "Community Service: Engage in charitable activities, supporting those in need and strengthening community bonds." +
        "Youth & Leadership Development: Empower the younger generation with guidance, mentorship, and leadership programs." +
        "Interfaith Harmony: Promote mutual respect and understanding among diverse communities through dialogue and collaboration.",
    image: "images/Masjid-Al-Bukhary.png",
  },
];

</script>

<template>

  <section class="about-section">
    <h1 class="about-title">Masjid Al Bukhary Kuala Lumpur Official</h1>
    <div class="about-content">

      <div class="description">
        <h3>Get know more about Albukhary Foundation</h3>
        <p class="description-text">
          One simple act of kindness that took place four decades ago marked the beginning of Albukhary Foundation’s
          journey. When Syed Mokhtar brought home his first salary of RM1,500 as a rice trader in 1974, his mother,
          Sharifah Rokiah, reminded him that while they lived a humble life, there were others in the community who were
          poorer. She encouraged him to keep half for the family, and distribute the remaining RM750 to 15 needy
          families in their community.
        </p>
      </div>

      <div class="video-container">
        <video ref="videoPlayer" class="video" controls>
          <source src="../public/videos/about-albukhary-masjid.mp4" type="video/mp4"/>
        </video>
      </div>
    </div>
  </section>

  <section class="about-section">
    <div class="about-grid" v-for="item in aboutItem" :key="item.id">
      <template v-if="item.id % 2 !== 0">
        <div class="text-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.content }}</p>
        </div>
        <div class="image-content">
          <img :src="item.image" :alt="item.title" class="image" loading="lazy"/>
        </div>
      </template>
      <template v-else>
        <div class="image-content">
          <img :src="item.image" :alt="item.title" class="image" loading="lazy"/>
        </div>
        <div class="text-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.content }}</p>
        </div>
      </template>
    </div>

  </section>
</template>

<style scoped>
section {
  margin: 5rem auto;
  max-width: 1200px;
  padding: 0 1rem;
  display: block;
  height: 100%;
}

.about-title {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  font-weight: bold;
  margin-bottom: 2rem;
}

.about-content {
  background-image: url("../public/images/masjid-about-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 5rem auto;
  box-shadow: rgba(149, 157, 165, 0.5) 0 8px 24px;
  padding: 2rem 4rem;
}

.video-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.video {
  width: 450px;
  height: 400px;
  border-radius: 20px;
  margin: -5rem auto 0 auto;
  background-color: var(--primary-color);
  border: none;
  overflow: hidden;
}

.about-content h3 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.about-content p {
  text-align: justify;
  font-size: 1rem;
  color: var(--primary-color);
}


@media (max-width: 1024px) {
  .about-title {
    font-size: 1.5rem;
  }

  .about-content {
    display: block;
    margin: 5rem auto;
  }

  .video-container {
    margin: 3rem auto;
  }

  .video {
    width: 450px;
    height: 400px;
    margin: 0 auto -5rem auto;
  }

  .about-content h3 {
    font-size: 1.2rem;
    margin: 2rem auto;
  }
}

@media (max-width: 768px) {

  .about-title {
    font-size: 1.5rem;
  }

  .about-content {
    display: block;
    gap: 0 2rem;
    margin: auto;
    padding: 1rem;
  }

  .video {
    width: 450px;
    height: 400px;
    margin: 0 auto -5rem auto;
  }

  .about-content h3 {
    font-size: 1.2rem;
    margin: 2rem auto;
  }
}

@media (max-width: 480px) {

  .about-title {
    font-size: 1.5rem;
  }

  .about-content {
    display: block;
    margin: 5rem auto;
    padding: 1rem;
  }

  .video {
    width: 450px;
    height: 400px;
    margin: 0 auto -5rem auto;
  }

  .about-content h3 {
    font-size: 1.2rem;
    margin: 2rem auto;
  }
}

.about-grid {
  width: 90%;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.about-title,
.item-title {
  text-align: start;
  font-size: 1.8rem;
  color: var(--secondary-color);
  font-weight: bold;
  border-bottom: 2px solid var(--secondary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.item-description {
  text-align: justify;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--secondary-color);
}

.image-content {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-content img {
  width: 100%;
  max-width: 450px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.image-content img:hover {
  transform: scale(1.05);
}

@media (max-width: 1024px) {

  .about-content {
    display: block;
  }

  .about-grid {
    gap: 2rem;
    width: 90%;
  }

  .about-title {
    font-size: 1.8rem;
  }

  .item-title {
    font-size: 1.5rem;
  }

  .item-description {
    font-size: 1rem;
  }

  .image-content img {
    max-width: 450px;
  }
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
  }

  .about-section {
    margin: 3rem auto;
  }

  .about-title {
    font-size: 1.7rem;
  }

  .item-title {
    font-size: 1.4rem;
    text-align: center;
  }

  .item-description {
    font-size: 1rem;
    text-align: center;
  }

  .image-content img {
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .about-section {
    margin: 2rem auto;
  }

  .about-title {
    font-size: 1.5rem;
  }

  .item-title {
    font-size: 1.2rem;
  }

  .item-description {
    font-size: 0.95rem;
    text-align: justify;
  }

  .image-content img {
    max-width: 350px;
  }
}
</style>


