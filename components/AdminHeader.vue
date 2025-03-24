<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ImageUploadPopup from '~/components/ImageUploadPopup.vue'
import VideoUploadPopup from '~/components/VideoUploadPopup.vue'

import { useI18n } from 'vue-i18n'

interface Link {
  link?: string
  label: string
  icon: string
  popup?: 'image' | 'video'
}

const { t } = useI18n()
const isLinksVisible = ref(false)
const isMobile = ref(false)
const isImagePopupVisible = ref(false)

const isVideoPopupVisible = ref(false)

const links: Link[] = [
  { label: t('admin_header.upload_image'), icon: 'mdi-camera', popup: 'image' },
  { label: t('admin_header.upload_video'), icon: 'mdi-video', popup: 'video' },
  { link: '', label: t('admin_header.logout'), icon: 'mdi-logout' }
]
const toggleLinksVisibility = () => {
  isLinksVisible.value = !isLinksVisible.value
}

const togglePopup = (type: 'image' | 'video') => {
  if (type === 'image') isImagePopupVisible.value = !isImagePopupVisible.value
  else isVideoPopupVisible.value = !isVideoPopupVisible.value

  isLinksVisible.value = false
}

const updateMobileState = () => {
  isMobile.value = window.innerWidth <= 1200
}

onMounted(() => {
  updateMobileState()
  window.addEventListener('resize', updateMobileState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState)
})
</script>

<template>
  <header class="header-container">

    <ImageUploadPopup :show="isImagePopupVisible" @update:show="isImagePopupVisible = $event" />
    <VideoUploadPopup :show="isVideoPopupVisible" @update:show="isVideoPopupVisible = $event" />


    <div class="header-wrapper">

      <div class="logo-container">
        <a href="https://commercedc.com.my/" class="logo">
          <img src="/images/masjid_albukary_logo.png" alt="AIU Logo" />
        </a>

        <button v-if="isMobile" @click="toggleLinksVisibility" class="menu-toggle-btn">
          <UIcon name="uil-bars" />
        </button>
      </div>

      <nav v-if="isLinksVisible || !isMobile" class="navigation-menu">
        <ul class="navigation-links">
          <li v-for="link in links" :key="link.label" class="nav-item">
            <button
                v-if="link.popup"
                @click="togglePopup(link.popup)"
                class="popup-button"
            >
              <UIcon :name="link.icon" />
              {{ link.label }}
            </button>

            <a v-else :href="link.link" class="nav-link">
              <UIcon :name="link.icon" />
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  background-color: var(--background-color);
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
  padding: 0.5rem 1rem;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo img {
  width: 100px;
  height: 70px;
  object-fit: contain;
}

.menu-toggle-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--primary-color);
  cursor: pointer;
}

.navigation-menu {
  display: flex;
}

.navigation-links {
  display: flex;
  list-style: none;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link,
.popup-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover,
.popup-button:hover {
  color: var(--text-hover);
  transition: color 0.3s ease;
}

.nav-item:last-child .nav-link {
  background-color: var(--text-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-item:last-child .nav-link:hover {
  background-color: var(--text-hover);
  color: var(--secondary-color);
}

@media (max-width: 1200px) {
  .header-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo-container {
    display: block;
  }

  .navigation-menu {
    width: 100%;
  }

  .navigation-links {
    flex-direction: column;
    width: 100%;
  }

  .nav-item {
    width: 100%;
  }

  .menu-toggle-btn {
    margin-left: auto;
  }
}
</style>
