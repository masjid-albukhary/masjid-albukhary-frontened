<script setup lang="ts">

interface Link {
  link: string;
  label: string;
  icon: string;
}

interface Media {
  icon: string;
  link: string;
  name: string;
}

interface GeneralInfo {
  icon: string;
  link: string;
  label: string;
}

const currentYear = new Date().getFullYear();

const links: Link[] = [
  {
    link: "/home",
    label: "Home",
    icon: "mdi-home",
  },
  {
    link: "/about",
    label: "About",
    icon: "mdi-info",
  },
  {
    link: "/contact",
    label: "Contact",
    icon: "mdi-account",
  }
];

const media: Media[] = [
  {
    name: "Facebook",
    link: "https://www.facebook.com",
    icon: "mdi-facebook"
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com",
    icon: "mdi-instagram"
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com",
    icon: "mdi-youtube"
  },
  {
    name: "WhatsApp",
    link: "https://www.whatsapp.com",
    icon: "mdi-whatsapp"
  }
];

const generalInfo: GeneralInfo[] = [
  {
    label: "Jln Hang Tuah, Bukit Bintang, 55200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    link: "https://www.google.com/maps/place/Al+Bukhary+Mosque/@3.139085,101.7046321,17z/data=!3m1!4b1!4m6!3m5!1s0x31cc49d85ba20b57:0x52b2f325845db520!8m2!3d3.139085!4d101.7046321!16s%2Fm%2F03h5jrk?entry=ttu&g_ep=EgoyMDI1MDMwMi4wIKXMDSoASAFQAw%3D%3D",
    icon: "mdi-location"
  },
  {
    label: "(60) 4774 7300",
    link: "tel:+6047747300",
    icon: "ic-baseline-phone",
  },
  {
    label: "info@am.org",
    link: "mailto:info@aiu.edu.my",
    icon: "ic-baseline-email",
  }
];

</script>

<template>
  <div class="footer">
    <div class="main-container">

      <div class="info-container">
        <div class="box" v-for="info in generalInfo" :key="info.icon">
          <span class="icon">
            <UIcon :name="info.icon"/>
          </span>
          <p class="info">
            <a :href="info.link" v-if="info.link">{{ info.label }}</a>
            <span v-else>{{ info.label }}</span>
          </p>
        </div>
      </div>

      <hr class="divider">

      <div class="links-container">

        <div class="links">
          <h2>Quick Links</h2>
          <ul>
            <li v-for="link in links" :key="link.link" class="link">
              <router-link :to="link.link">
                <span>
                  <UIcon :name="link.icon"/>
                </span>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="others-links-section">
          <h2>Social Media </h2>
          <ul>
            <li v-for="media in media" :key="media.name">
              <a :href="media.link" target="_blank">
                <span>
                  <UIcon :name="media.icon"/>
                </span>
                {{ media.name }}
              </a>
            </li>
          </ul>
        </div>

        <div class="bank-details">
          <h2>Bank Details </h2>
          <img src="../public/images/bank-muamalat-logo.png" alt="bank muamalat logo" class="bank-img"/>
          <h4>Account No:9823793924023</h4>
        </div>
      </div>

      <hr class="divider">
      <div class="footer-bottom">
        <p>&copy; Copyright <a href="https://aiu.edu.my/">Al Bukhary Mosque {{ currentYear }}</a></p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.footer {
  padding: 1em 0;
  background-color: var(--background-color);
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
  color: var(--primary-color);
}

.box > p {
  color: var(--primary-color);
}

.divider {
  margin: 1rem 0;
  border: 2px solid var(--primary-color);
}

.links,
.others-links-section,
.bank-details {
  margin: 0 5rem;
}

.links h2,
.bank-details h2,
.others-links-section h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 15px 0;
}

.links ul li,
.bank-details h4,
.others-links-section ul li {
  list-style: none;
  font-size: 1rem;
}

.links ul li a span,
.others-links-section li a span {
  color: var(--primary-color);
  margin-right: .5rem;
}

.links ul li a,
.others-links-section li a {
  color: var(--primary-color);
  margin-right: .5rem;
}

.links ul li a:hover,
.others-links-section li a:hover {
  color: var(--primary-color);
  transition: .3s ease-in-out;
}

.bank-details {
  display: block;
}

.bank-details .bank-img {
  width: 150px;
  height: 70px;
}

.bank-details h4{
  font-size: 1rem;
  color: var(--primary-color);
}

@media (max-width: 800px) {

  .container-form div {
    margin: 3rem 0;
  }
}

@media (max-width: 1200px) {
  .links ul li span {
    display: none;
  }

  .others-links-section ul li span {
    display: none;
  }
}

.footer-bottom {
  text-align: start;
  font-size: 1.2rem;
  color: var(--primary-color);
  padding: 2rem 0;
}

.footer-bottom a {
  color: var(--primary-color);
}

a:hover {
  color: var(--secondary-color);
}
</style>
