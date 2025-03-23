<script setup>
import { useI18n } from "#i18n";
import { useRouter } from 'vue-router';

const { locale } = useI18n();
const router = useRouter();

const switchLanguage = (lang) => {
  locale.value = lang;
  console.log(`Language switched to: ${locale.value}`);

  const currentRoute = router.currentRoute.value;
  let path = currentRoute.path;
  const langPattern = /^\/(en|ar|ms)/;

  if (lang === 'en') {
    path = path.replace(langPattern, '');
  } else {
    if (!langPattern.test(path)) {
      path = `/${lang}${path}`;
    } else {
      path = path.replace(langPattern, `/${lang}`);
    }
  }

  router.push(path);
};
</script>

<template>
  <nav class="translate-navbar">
    <div class="translate-navbar-container">
      <button @click="switchLanguage('en')" aria-label="English">
        <UIcon name="twemoji-flag-united-kingdom" class="flag-icon" />
        English
      </button>
      <button @click="switchLanguage('ms')" aria-label="Bahasa Melayu">
        <UIcon name="twemoji-flag-malaysia" class="flag-icon" />
        Bahasa Melayu
      </button>
    </div>
  </nav>
</template>

<style scoped>
.translate-navbar {
  width: 100%;
  background-color: var(--bg-color);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  box-shadow: rgba(149, 157, 165, 0.7) 0 8px 24px;
}

.translate-navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 15px;
}

.translate-navbar-container button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  color: var(--primary-color);
  padding: 8px 15px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  outline: none;
  border: none;
  transition: all 0.3s ease-in-out;
}

.translate-navbar-container button:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
}

.flag-icon {
  font-size: 1.5rem;
}
</style>
