<script setup lang="ts">
import {ref, onMounted} from 'vue';

interface Link {
  link: string,
  label: string,
  icon: string,
}

const isLinksVisible = ref(false);
const isMobile = ref(false);

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
    link: "/news",
    label: "News",
    icon: "mdi-book",
  },
  {
    link: "/booking-venue",
    label: "Booking Venue",
    icon: "mdi-home",
  },
  {
    link: "/contact",
    label: "Contact",
    icon: "mdi-account",
  }
]

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
</script>

<template>
  <div class="header-container">
    <div class="header-wrapper">
      <div class="logo-container">
        <div class="logo">
          <a href="https://commercedc.com.my/">
            <img src="/images/masjid_albukary_logo.png" alt="AIU Logo"/>
          </a>
        </div>
        <button v-if="isMobile" @click="toggleLinksVisibility" class="menu-toggle-btn">
          <UIcon name="uil-bars"/>
        </button>
      </div>

      <nav v-if="isLinksVisible || !isMobile" class="navigation-menu">
        <ul class="navigation-links">
          <li v-for="link in links">
            <router-link :to="link.link">
              <UIcon
                  :name="link.icon"
              />
              {{ link.label }}
            </router-link>
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
  max-height: 100px;
  background-color: var(--primary-color);
  z-index: 1001;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
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
}

.navigation-links a {
  padding: 0 0.5rem;
  font-size: 1rem;
  text-decoration: none;
}

.navigation-links a:hover {
  transition: 0.3s ease-in-out;
}

.navigation-links li {
  display: inline-block;
  padding: 0.3rem;
  margin-right: 0.5rem;
  border-radius: 0.5rem;
  color: var(--text-color);
}

.navigation-links li:hover {
  color: var(--text-hover);
  transition: color 0.3s ease-in-out;
}

.navigation-links li:last-child {
  background: var(--text-color);
  color: var(--primary-color);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.navigation-links li:hover:last-child {
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
