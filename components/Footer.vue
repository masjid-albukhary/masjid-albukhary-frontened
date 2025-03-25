<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const links = [
  { link: "/", labelKey: "footer.links.home", icon: "mdi-home" },
  { link: "/about", labelKey: "footer.links.about", icon: "mdi-information" },
  { link: "/news", labelKey: "footer.links.news", icon: "mdi-newspaper-variant" },
  { link: "/booking-venue", labelKey: "footer.links.booking", icon: "mdi-calendar-check" },
  { link: "/facilities", labelKey: "footer.links.facilities", icon: "mdi-domain" },
  { link: "/gallery", labelKey: "footer.links.gallery", icon: "mdi-image-multiple" },
  { link: "/contact", labelKey: "footer.links.contact", icon: "mdi-email" }
];

const currentYear = new Date().getFullYear();

const media = [
  { icon: "mdi-facebook", link: "https://www.facebook.com/mabkl.fb/", labelKey: "footer.media.facebook" },
  { icon: "mdi-youtube", link: "https://www.youtube.com", labelKey: "footer.media.youtube" },
  { icon: "mdi-whatsapp", link: "https://www.whatsapp.com", labelKey: "footer.media.whatsapp" }
];

const generalInfo = [
  {
    labelKey: "footer.generalInfo.address",
    link: "https://maps.google.com",
    icon: "mdi-location"
  },
  {
    labelKey: "footer.generalInfo.phone",
    link: "tel:0392210554",
    icon: "ic-baseline-phone"
  },
  {
    labelKey: "footer.generalInfo.email",
    link: "mailto:info@masjidalbukharykl.com",
    icon: "ic-baseline-email"
  }
];

</script>

<template>
  <footer class="footer">
    <div class="main-container">

      <div class="info-container">
        <div class="box" v-for="info in generalInfo" :key="info.icon">
          <span class="icon">
            <UIcon :name="info.icon"/>
          </span>
          <p class="info">
            <a :href="info.link">{{ t(info.labelKey) }}</a>
          </p>
        </div>
      </div>

      <hr class="divider">

      <div class="links-container">

        <div class="links">
          <h2>{{ t('footer.quickLinks') }}</h2>
          <ul>
            <li v-for="link in links" :key="link.link" class="link">
              <router-link :to="link.link">
                <span>
                  <UIcon :name="link.icon"/>
                </span>
                {{ t(link.labelKey) }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="others-links-section">
          <h2>{{ t('footer.socialMedia') }}</h2>
          <ul>
            <li v-for="item in media" :key="item.icon">
              <a :href="item.link" target="_blank">
                <span>
                  <UIcon :name="item.icon"/>
                </span>
                {{ t(item.labelKey) }}
              </a>
            </li>
          </ul>
        </div>

        <div class="bank-details">
          <h2>{{ t('footer.bankDetails') }}</h2>
          <img src="../public/images/bank-muamalat-logo.png" alt="bank muamalat logo" class="bank-img"/>
          <h4>{{ t('footer.accountNo') }}: 9823793924023</h4>
        </div>

      </div>

      <hr class="divider">

      <div class="footer-bottom">
        <p>&copy; Copyright
          <a href="http://www.masjidalbukharykl.com/">Al Bukhary Mosque {{ currentYear }}</a>
        </p>
      </div>

    </div>
  </footer>
</template>


<style scoped>
footer {
  padding: 1em 0;
  background-color: var(--background-color);

  a {
    text-decoration: none;
    color: var(--text-color);
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--text-hover);
  }
}

.main-container {
  display: block;
  padding: 0 100px;
}

@media (max-width: 800px) {
  .main-container {
    padding: 0;
  }
}

.info-container,
.links-container {
  display: flex;
  flex-direction: row;
}

.info-container div {
  flex: 25%;
}

.info-container div,
.links-container div {
  flex: 30%;
}

@media (max-width: 800px) {
  .info-container {
    display: block;
  }

  .links-container {
    display: block;
  }
}

.box {
  display: block;
  text-align: center;
  margin: 20px;
}

.box span {
  font-size: 3rem;
  color: var(--text-color);
}

.box > p {
  color: var(--text-color);
}

.box span:hover,
.box > p:hover,
.box a:hover {
  color: var(--text-hover);
  transition: color 0.3s ease-in-out;
}

@media (max-width: 800px) {
  .box {
    text-align: start;
    margin: 0 5rem;
  }
}

.divider {
  margin: 1rem 0;
  border: 2px solid var(--text-color);
}

.links,
.others-links-section,
.bank-details {
  margin: 0 5rem;
}

.links h2,
.bank-details h2,
.others-links-section h2 {
  color: var(--text-color);
  font-size: 1.5rem;
  margin: 15px 0;
}

.links ul li,
.others-links-section ul li {
  list-style: none;
  font-size: 1rem;
}

.links ul li a span,
.others-links-section li a span {
  color: var(--text-color);
  margin-right: .5rem;
}

.links ul li a span:hover,
.others-links-section li a span:hover,
.links ul li a:hover,
.others-links-section li a:hover {
  color: var(--text-hover);
  transition: .3s ease-in-out;
}

.bank-details {
  display: block;
}

.bank-details .bank-img {
  width: 150px;
  height: 70px;
}

.bank-details h4 {
  font-size: 1rem;
  color: var(--text-color);
}

@media (max-width: 800px) {
  .container-form div {
    margin: 3rem 0;
  }
}

.footer-bottom {
  text-align: start;
  font-size: 1.2rem;
  color: var(--text-color);
  padding: 2rem 0;
}

.footer-bottom a {
  color: var(--text-color);
}

a:hover {
  color: var(--text-color);
}

@media (max-width: 1200px) {
  .footer-bottom {
    margin: 0 3rem;
  }

  .footer-bottom a {
    color: var(--text-color);
  }

  a:hover {
    color: var(--text-hover);
  }
}
</style>
