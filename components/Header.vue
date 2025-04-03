<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const isLinksVisible = ref(false);
const isMobile = ref(false);

import {computed} from 'vue';

const links = computed(() => [
  {link: "/", label: t('menu.home'), icon: "mdi-home"},
  {link: "/about", label: t('menu.about'), icon: "mdi-information"},
  {link: "/activities", label: t('menu.news'), icon: "mdi-calendar-star"},
  {link: "/services", label: t('menu.services'), icon: "mdi-calendar-clock"},
  {link: "/facilities", label: t('menu.facilities'), icon: "mdi-domain"},
  {link: "/gallery", label: t('menu.gallery'), icon: "mdi-image-multiple"},
  {link: "/contact", label: t('menu.contact'), icon: "mdi-email"}
]);


function toggleLinksVisibility() {
  isLinksVisible.value = !isLinksVisible.value;
  console.log('Links visibility toggled:', isLinksVisible.value);
}

onMounted(() => {
  isMobile.value = window.innerWidth <= 1200;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 1200;
  });
});

// const logo = "/images/masjid_albukary_logo.png"
</script>

<template>
  <div class="header-container">
    <div class="header-wrapper">
      <div class="logo-container">
        <div class="logo">

          <a href="http:www.masjidalbukharykl.com/">
            <img src="/images/masjid_albukary_logo.png" alt="masjid Albukary Logo"/>
          </a>

        </div>

        <button v-if="isMobile" @click="toggleLinksVisibility" class="menu-toggle-btn">
          <UIcon name="uil-bars"/>
        </button>
      </div>

      <nav v-if="isLinksVisible || !isMobile" class="navigation-menu">
        <ul class="navigation-links">
          <li v-for="link in links" :key="link.link">
            <a :href="link.link">
              <UIcon :name="link.icon"/>
              {{ t(link.label) }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>


<style scoped>
.header-container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  z-index: 1002;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo img {
  width: 100px;
  height: 70px;
}

.header-title h2 {
  font-size: 1.5rem;
  font-weight: normal;
  text-transform: uppercase;
  color: var(--text-color);
}

.navigation-links {
  display: inline-flex;
  list-style: none;
  padding: 0;
  margin: 0;
  transition: 0.3s ease-in-out;
}

.navigation-links li {
  display: inline-block;
  padding: 0.3rem;
  margin-right: 0.5rem;
  border-radius: 0.5rem;
}

.navigation-links a {
  padding: 0 0.5rem;
  font-size: 1rem;
  text-decoration: none;
  color: var(--text-color);
}

.navigation-links a:hover {
  color: var(--text-hover);
  transition: color 0.3s ease-in-out;
}

.navigation-links li:last-child a {
  padding: .5rem;
  border-radius: 0.5rem;
  background: var(--text-color);
  color: var(--primary-color);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.navigation-links li:hover:last-child a {
  background-color: var(--text-hover);
  color: var(--secondary-color);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

@media (max-width: 1200px) {
  .header-wrapper {
    display: block;
  }

  .header-title h2 {
    display: none;
  }

  .logo-container {
    display: flex;
    justify-content: space-between;
  }

  .menu-toggle-btn {
    font-size: 2rem;
    margin: 0 1rem;
    color: var(--text-hover);
    background: transparent;
  }

  .navigation-links {
    display: block;
    margin: 1rem 0;
  }

  .navigation-links li {
    display: block;
    margin-left: 0.5rem;
  }
}
</style>
