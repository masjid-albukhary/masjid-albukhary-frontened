<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const links = [
  { link: "/", labelKey: "footer.links.home", icon: "mdi-home" },
  { link: "/about", labelKey: "footer.links.about", icon: "mdi-information" },
  { link: "/activities", labelKey: "footer.links.news", icon: "mdi-calendar-star" },
  { link: "/services", labelKey: "footer.links.services", icon: "mdi-calendar-check" },
  { link: "/facilities", labelKey: "footer.links.facilities", icon: "mdi-domain" },
  { link: "/gallery", labelKey: "footer.links.gallery", icon: "mdi-image-multiple" },
  { link: "/contact", labelKey: "footer.links.contact", icon: "mdi-email" }
]

const media = [
  { icon: "mdi-facebook", link: "https://www.facebook.com/mabkl.fb/", labelKey: "footer.media.facebook" },
  { icon: "mdi-youtube", link: "https://www.youtube.com", labelKey: "footer.media.youtube" },
  { icon: "mdi-whatsapp", link: "https://www.whatsapp.com", labelKey: "footer.media.whatsapp" }
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">

      <div class="footer-top">

        <div class="footer-section logo-section">
          <router-link to="/">
            <img src="/images/masjid_albukary_logo.png" alt="Masjid Logo" class="logo-img" />
          </router-link>
        </div>

        <div class="footer-section">
          <h2>{{ t('footer.quickLinks') }}</h2>
          <ul>
            <li v-for="item in links" :key="item.link">
              <router-link :to="item.link">
                <UIcon :name="item.icon" class="icon" />
                {{ t(item.labelKey) }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h2>{{ t('footer.socialMedia') }}</h2>
          <ul>
            <li v-for="item in media" :key="item.icon">
              <a :href="item.link" target="_blank">
                <UIcon :name="item.icon" class="icon" />
                {{ t(item.labelKey) }}
              </a>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h2>{{ t('footer.bankDetails') }}</h2>
          <img src="/images/bank-muamalat-logo.png" alt="Muamalat Bank logo" class="bank-img" />
          <h4>{{ t('footer.accountNo') }}: 9823 7939 2402</h4>
        </div>

      </div>

      <hr class="divider" />

      <div class="footer-bottom">
        <p>
          &copy; {{ currentYear }}
          <a href="http://www.masjidalbukharykl.com/" target="_blank">
            Al Bukhary Mosque
          </a>. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--background-color);
  padding: 2rem 1rem;
  color: var(--text-color);
}

.container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.footer-section {
  min-width: 200px;
}

.footer-section h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-align: start;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--text-hover);
}

.logo-img {
  width: 250px;
}

.bank-img {
  width: 120px;
  margin: 1rem 0;
  text-align: start;
  align-items: start;
}

.divider {
  border: none;
  border-top: 1px solid var(--text-color);
  margin: 2rem 0;
}

.footer-bottom {
  text-align: center;
  font-size: 0.9rem;
}

.footer-bottom a {
  color: var(--text-color);
  text-decoration: underline;
}

.footer-bottom a:hover {
  color: var(--text-hover);
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-section {
    flex: none;
    width: 100%;
    text-align: start;
  }
  .bank-img {
    text-align: start;
    align-items: start;
  }
}
</style>
