<script setup>
import { useRouter } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()
const links = computed(() => [
  { link: "/admin", label: t('admin_sidebar.admin'), icon: "mdi-user" },
  { link: "/admin/booking-dashboard", label: t('admin_sidebar.booking_overview'), icon: "mdi-calendar-clock" },
  { link: "/admin/facility-form", label: t('admin_sidebar.facility_form'), icon: "mdi-office-building" },
  { link: "/admin/news-form", label: t('admin_sidebar.news_form'), icon: "mdi-post" },
  { link: "/admin/about-content-management", label: t('admin_sidebar.about_content_form'), icon: "mdi-file-document-edit" },
  { link: "/admin/service-form", label: t('admin_sidebar.service_form'), icon: "mdi-calendar-star" },
])


const handleLogout = () => {
  console.log('Logging out...')
  router.push('/')
}
</script>

<template>
  <aside class="sidebar">
    <h2 class="admin-title">{{t('admin_sidebar.admin_title')}}</h2>

    <nav>
      <ul class="admin-nav">

        <li
            v-for="link in links"
            :key="link.label"
            class="admin-nav-item"
            @click="link.action === 'logout' ? handleLogout() : router.push(link.link)"
        >
          <span class="icon">
            <UIcon
                :name="link.icon"
            />
          </span>
          <span class="label">{{ link.label }}</span>

        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>

.sidebar {
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
  padding: 20px;
}

.admin-title {
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: normal;
  text-align: center;
  margin-bottom: 20px;
}

.admin-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  color: var(--text-color);
  font-size: 1rem;
  transition: color 0.3s ease-in-out;
  cursor: pointer;
}

.admin-nav-item:hover {
  color: var(--text-hover);
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.label {
  flex-grow: 1;
}
</style>