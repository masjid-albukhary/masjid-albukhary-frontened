<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useI18n } from "#i18n";
import { useRouter } from 'vue-router';

const { t } = useI18n();
const isLinksVisible = ref(false);
const isMobile = ref(false);
const isScrolled = ref(false);

const links = computed(() => [
  { path: "/", label: t('menu.home'), icon: "mdi-home" },
  { path: "/about", label: t('menu.about'), icon: "mdi-information" },
  { path: "/activities", label: t('menu.news'), icon: "mdi-calendar-star" },
  { path: "/services", label: t('menu.services'), icon: "mdi-calendar-clock" },
  { path: "/facilities", label: t('menu.facilities'), icon: "mdi-domain" },
  { path: "/gallery", label: t('menu.gallery'), icon: "mdi-image-multiple" },
  { path: "/contact", label: t('menu.contact'), icon: "mdi-email" }
]);

const toggleLinksVisibility = () => {
  isLinksVisible.value = !isLinksVisible.value;
};
const closeMenu = () => {
  if (isMobile.value && isLinksVisible.value) {
    isLinksVisible.value = false;
  }
};
const scrollToSection = (elementId: string) => {
  closeMenu();
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
const navigateTo = (path: string) => {
  closeMenu();
  router.push(path);
};
const {setLocale, locale} = useI18n();
const router = useRouter();
const currentLang = locale.value;
const toggleLanguage = async () => {
  const newLang = currentLang === 'ms' ? 'en' : 'ms';

  await setLocale(newLang);

  const currentPath = router.currentRoute.value.path;
  const pathWithoutLang = currentPath.replace(/^\/(en|ms)/, '');

  const cleanPath = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;

  const newPath = newLang === 'ms' ? `${cleanPath}` : `/en${cleanPath}`;

  router.push(newPath);
};

onMounted(() => {
  const checkMobileSize = () => {
    isMobile.value = window.innerWidth <= 1200;
    isLinksVisible.value = !isMobile.value;
  };

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
  };

  checkMobileSize();
  handleScroll();

  window.addEventListener('resize', checkMobileSize);
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {});
  window.removeEventListener('scroll', () => {});
});
</script>

<template>
  <section class="landing-sec" id="landing" aria-label="Landing Section">
    <div class="container">
      <header class="header-section" :class="{ 'header-scrolled': isScrolled }">
        <div class="header-container">
          <div class="logo-container">
            <div class="logo">
              <router-link to="/" aria-label="Masjid Albukary Home">
                <img src="/images/masjid_albukary_logo.png" alt="Masjid Albukary Logo"/>
              </router-link>
            </div>

            <button
                v-if="isMobile"
                @click="toggleLinksVisibility"
                class="menu-toggle-btn"
                :aria-expanded="isLinksVisible"
                aria-controls="navigation-menu"
                aria-label="Toggle navigation menu"
            >
              <UIcon :name="isLinksVisible ? 'uil-times' : 'uil-bars'" aria-hidden="true" />
            </button>
          </div>

          <Transition name="menu-fade">
            <nav id="navigation-menu" class="menu" v-show="isLinksVisible || !isMobile">
              <ul class="navigation-links">
                <li v-for="link in links" :key="link.path">
                  <a
                      :href="link.path"
                      @click.prevent="link.path === '/' ? navigateTo('/') : link.path.startsWith('#') ? scrollToSection(link.path.substring(1)) : navigateTo(link.path)"
                      :aria-current="$route && $route.path === link.path ? 'page' : undefined"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>

              <button @click="toggleLanguage" class="translation-btn">
                {{ currentLang === 'en' ? 'Malay' : 'English' }}
              </button>

            </nav>
          </Transition>

        </div>
      </header>

      <section class="landing-container">
        <div class="info-container">
          <h1 class="masjid-title">
            {{ t(`landing.title`, { locale }) || t('landing.title_en') }}
          </h1>
          <div class="cta-buttons">
            <a href="#upcomingActivitiesCard" class="cta-button primary-btn">
              {{ t('landing.discover_projects') || 'Discover my Projects' }}
            </a>
            <router-link to="/about" class="cta-button secondary-btn">
              {{ t('landing.learn_more') || 'Learn More' }}
            </router-link>
          </div>
        </div>

      </section>
    </div>
  </section>
</template>

<style scoped>
.header-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 0 auto;
  transition: all 0.3s ease;
  background-color: transparent;
}

.header-scrolled {
  position: fixed;
  background-color: var(--bg-color);
  color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.3rem 1rem;
  animation: slideDown 0.3s ease-out;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 1400px;
  color: var(--primary-color);
}

.logo-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  width: 70px;
  height: 50px;
  display: block;
}

.menu-toggle-btn {
  display: none;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--primary-color);
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.menu-toggle-btn:hover {
  transform: scale(1.1);
}

.menu-toggle-btn:focus {
  outline: 2px solid var(--secondary-color);
  outline-offset: 2px;
}

.menu {
  display: flex;
  align-items: center;
}

.navigation-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1.5rem;
}

.navigation-links li {
  display: inline-block;
}

.navigation-links a {
  padding: 0.5rem;
  font-size: 1rem;
  text-decoration: none;
  color: var(--secondary-color);
  font-weight: bold;
  position: relative;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navigation-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  color: var(--primary-color);
  background-color: var(--primary-color);
  transition: width 0.3s ease-in-out;
}

.navigation-links a:hover {
  color: var(--primary-color);
}

.navigation-links a:hover::after,
.navigation-links a[aria-current="page"]::after {
  width: 100%;
}

.navigation-links a:focus {
  outline: 2px solid var(--secondary-color);
  outline-offset: 2px;
}

.translation-btn {
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  text-decoration: none;
  color: var(--secondary-color);
  background: transparent;
  font-weight: bold;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.landing-sec {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  background-image: url("/images/al-bukhary-mosque-kuala-lumpur.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.landing-sec::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  width: 100%;
}

.landing-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
  align-items: center;
}

.info-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  animation: fadeIn 1s ease-out;
  padding: 2rem;
}

.masjid-title {
  font-size:  2.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
  line-height: 1.2;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cta-button {
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  border: none;
  outline: none;
  min-width: 180px;
}

.primary-btn {
  background-color: var(--text-color);
  color: var(--primary-color);
}

.secondary-btn {
  background-color: transparent;
  color: var(--text-hover);
  border: 2px solid var(--text-hover);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.secondary-btn:hover {
  background-color: rgba(var(--primary-color-rgb, 0, 0, 0), 0.1);
  transform: translateY(-3px);
}

.cta-button:focus {
  outline: 2px solid var(--secondary-color);
  outline-offset: 2px;
}

.cta-button:active {
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .landing-container {
    grid-template-columns: 1fr;
    padding: 5rem 1rem 2rem;
  }

  .info-container {
    order: 1;
    max-width: 600px;
    margin: 0 auto;
  }

  .hero-image-container {
    order: 2;
  }
}

@media (max-width: 767px) {
  .menu-toggle-btn {
    display: block;
  }

  .logo-container {
    width: 100%;
  }

  .menu {
    display: block;
    width: 100%;
    background-color: var(--primary-color);
    position: absolute;
    top: 100%;
    left: 0;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1002;
  }

  .navigation-links {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .navigation-links li {
    width: 100%;
    text-align: start;
    padding: 0.5rem 0;
  }

  .navigation-links li:last-child {
    margin-top: 0.5rem;
  }

  .navigation-links li:last-child a {
    display: block;
    width: 100%;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-button {
    width: 100%;
  }

  .info-container {
    text-align: center;
    padding: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .primary-btn:hover,
  .secondary-btn:hover,
  .cta-button:active,
  .menu-toggle-btn:hover {
    transition: none;
    transform: none;
    animation: none;
  }
}
</style>