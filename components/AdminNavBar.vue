<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ImageUploadPopup from "~/components/ImageUploadPopup.vue";
import VideoUploadPopup from "~/components/VideoUploadPopup.vue";

interface Link {
  link?: string;
  label: string;
  icon: string;
  popup?: "image" | "video"; // Distinguish between popups
}

const isLinksVisible = ref(false);
const isMobile = ref(false);
const isImagePopupVisible = ref(false);
const isVideoPopupVisible = ref(false);

const links: Link[] = [
  { link: "/admin", label: "Admin", icon: "mdi-user" },
  { link: "/admin/news-form", label: "News Form", icon: "mdi-file-document" },
  { link: "/admin/facility-form", label: "Facility Form", icon: "mdi-domain" },
  { label: "Upload Image", icon: "mdi-camera", popup: "image" },
  { label: "Upload Video", icon: "mdi-video", popup: "video" },
  { link: "", label: "Logout", icon: "mdi-logout" }
];

function toggleLinksVisibility() {
  isLinksVisible.value = !isLinksVisible.value;
}

function togglePopup(type: "image" | "video") {
  if (type === "image") {
    isImagePopupVisible.value = !isImagePopupVisible.value;
  } else {
    isVideoPopupVisible.value = !isVideoPopupVisible.value;
  }
  isLinksVisible.value = false; // Close menu in mobile view
}

onMounted(() => {
  const updateMobileState = () => {
    isMobile.value = window.innerWidth <= 1200;
  };

  window.addEventListener('resize', updateMobileState);
  updateMobileState(); // Initial check

  onUnmounted(() => {
    window.removeEventListener('resize', updateMobileState);
  });
});
</script>

<template>
  <div class="header-container">
    <ImageUploadPopup :show="isImagePopupVisible" @update:show="isImagePopupVisible = $event" />
    <VideoUploadPopup :show="isVideoPopupVisible" @update:show="isVideoPopupVisible = $event" />

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
          <li v-for="link in links" :key="link.label">
            <button v-if="link.popup" @click="togglePopup(link.popup)" class="popup-button">
              <UIcon :name="link.icon" />
              {{ link.label }}
            </button>
            <router-link v-else :to="link.link">
              <UIcon :name="link.icon" />
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
  background-color: var(--background-color);
  padding: 0.5rem 1rem;
  max-height: 300px;
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
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

.navigation-links li{
  display: inline-block;
  padding: 0.3rem;
  margin-right: 0.5rem;
  border-radius: 0.5rem;
  color: var(--text-color);
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
