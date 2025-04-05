<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import ImageUploaderModal from '~/components/ImageUploaderModal.vue'
import VideoUploaderModal from '~/components/VideoUploaderModal.vue'

import {useI18n} from 'vue-i18n'

interface Link {
  link?: string
  label: string
  icon: string
  popup?: 'image' | 'video' | 'member'
}

const {t} = useI18n()
const isLinksVisible = ref(false)
const isMobile = ref(false)
const isImagePopupVisible = ref(false)

const isVideoPopupVisible = ref(false)
const isNewMemberPopupVisible = ref(false)

const links: Link[] = [
  { label: t('admin_header.upload_image'), icon: 'mdi-image', popup: 'image' },
  { label: t('admin_header.upload_video'), icon: 'mdi-video', popup: 'video' },
  { label: t('admin_header.upload_new_member'), icon: 'mdi-account-plus', popup: 'member' },
  { label: t('admin_header.logout'), icon: 'mdi-logout', link: 'logout' }
];


const toggleLinksVisibility = () => {
  isLinksVisible.value = !isLinksVisible.value
}

const togglePopup = (type: 'image' | 'video' | 'member') => {
  if (type === 'image') {
    isImagePopupVisible.value = !isImagePopupVisible.value
  } else if (type === 'video') {
    isVideoPopupVisible.value = !isVideoPopupVisible.value
  } else if (type === 'member') {
    isNewMemberPopupVisible.value = !isNewMemberPopupVisible.value // Corrected handling for member popups
  }
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

const logo = "/images/masjid_albukary_logo.png"

function logout() {
  const token = useCookie('token');
  const refreshToken = useCookie('refresh_token');

  token.value = null;
  refreshToken.value = null;

  navigateTo('/login');
}

function handleLinkClick(item: Link) {
  if (item.popup) {
    togglePopup(item.popup)
  } else if (item.link === 'logout') {
    logout()
  } else if (item.link) {
    navigateTo(item.link)
  }

  isLinksVisible.value = false
}



</script>

<template>
  <TranslationHeader/>
  <header class="header-container">

    <ImageUploaderModal :show="isImagePopupVisible" @update:show="isImagePopupVisible = $event"/>
    <VideoUploaderModal :show="isVideoPopupVisible" @update:show="isVideoPopupVisible = $event"/>
    <NewMemberUploaderModal :show="isNewMemberPopupVisible" @update:show="isNewMemberPopupVisible = $event"/>


    <div class="header-wrapper">

      <div class="logo-container">
        <a href="http://www.masjidalbukharykl.com/" class="logo">
          <img :src="logo" alt="AIU Logo"/>
        </a>

        <button v-if="isMobile" @click="toggleLinksVisibility" class="menu-toggle-btn">
          <UIcon name="uil-bars"/>
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
              <UIcon :name="link.icon"/>
              {{ link.label }}
            </button>

            <a v-else :href="link.link" class="nav-link">
              <UIcon :name="link.icon"/>
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
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  z-index: 1002;

  button {
    padding: .5rem 1rem;
    background-color: transparent;
    color: var(--text-color);
    transition: color 200ms ease;
  }

  button:hover {
    color: var(--text-hover);
  }
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
