<script setup>
import { useRouter } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { ref } from 'vue'

const expandedGroups = ref(new Set())

const toggleGroup = (groupLabel) => {
  if (expandedGroups.value.has(groupLabel)) {
    expandedGroups.value.delete(groupLabel)
  } else {
    expandedGroups.value.add(groupLabel)
  }
}

const { t } = useI18n()
const router = useRouter()
const groupedLinks = computed(() => [
  {
    label: t('admin_sidebar.dashboard_section'),
    icon: "mdi-view-dashboard-outline",
    children: [
      { link: "/admin/", label: t('admin_sidebar.admin'), icon: "mdi-account-cog-outline" },
      { link: "/admin/booking-dashboard", label: t('admin_sidebar.booking_overview'), icon: "mdi-calendar-clock" }
    ]
  },
  {
    label: t('admin_sidebar.about_section'),
    icon: "mdi-information-outline",
    children: [
      { link: "/admin/about-content-dashboard", label: t('admin_sidebar.about_content_dashboard'), icon: "mdi-file-document-edit-outline" },
      { link: "/admin/about-form", label: t('admin_sidebar.about_content_form'), icon: "mdi-file-document-edit-outline" }
    ]
  },
  {
    label: t('admin_sidebar.facility_section'),
    icon: "mdi-office-building",
    children: [
      { link: "/admin/facility-form", label: t('admin_sidebar.facility_form'), icon: "mdi-office-building-cog" },
      { link: "/admin/facility-management-dashboard", label: t('admin_sidebar.facilities_dashboard'), icon: "mdi-domain" }
    ]
  },
  {
    label: t('admin_sidebar.news_section'),
    icon: "mdi-newspaper",
    children: [
      { link: "/admin/news-form", label: t('admin_sidebar.news_form'), icon: "mdi-newspaper-variant-multiple" },
      { link: "/admin/news-content-dashboard", label: t('admin_sidebar.news_dashboard'), icon: "mdi-newspaper-variant-multiple" }
    ]
  },
  {
    label: t('admin_sidebar.services_section'),
    icon: "mdi-clipboard-text-outline",
    children: [
      { link: "/admin/services-form", label: t('admin_sidebar.service_form'), icon: "mdi-clipboard-plus-outline" },
      { link: "/admin/services-overview-dashboard", label: t('admin_sidebar.service_dashboard'), icon: "mdi-clipboard-text-multiple-outline" }
    ]
  },
  {
    label: t('admin_sidebar.users_section'),
    icon: "mdi-account-group-outline",
    children: [
      { link: "/admin/users-dashboard", label: t('admin_sidebar.users_dashboard'), icon: "mdi-account-multiple-outline" },
      { link: "/admin/register-new-admin", label: t('admin_sidebar.users_form'), icon: "mdi-user-plus-outline" }
    ]
  },
  {
    label: t('admin_sidebar.media_section'),
    icon: "mdi-folder-multiple-image",
    children: [
      { link: "/admin/image-gallery-dashboard", label: t('admin_sidebar.images_dashboard'), icon: "mdi-images" },
      { link: "/admin/video-gallery-dashboard", label: t('admin_sidebar.videos_dashboard'), icon: "mdi-video" }
    ]
  }
])
const handleLogout = () => {
  console.log('Logging out...')
  router.push('/')
}
</script>

<template>
  <aside class="sidebar">
    <h2 class="admin-title">{{ t('admin_sidebar.admin_title') }}</h2>

    <nav>
      <ul class="admin-nav">

        <li v-for="group in groupedLinks" :key="group.label" class="admin-group">
          <div class="admin-nav-item group-toggle" @click="toggleGroup(group.label)">
            <span class="icon">
              <UIcon :name="group.icon" />
            </span>
            <span class="label">{{ group.label }}</span>
<!--            <span class="chevron">{{ expandedGroups.has(group.label) ? '' : '' }}</span>-->
          </div>

          <ul v-if="expandedGroups.has(group.label)">
            <li
                v-for="link in group.children"
                :key="link.label"
                class="admin-nav-item child"
                @click="router.push(link.link)"
            >
              <span class="icon">
                <UIcon :name="link.icon" />
              </span>
              <span class="label">{{ link.label }}</span>
            </li>
          </ul>
        </li>

      </ul>
    </nav>
  </aside>
</template>

<style scoped>

.sidebar {
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
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