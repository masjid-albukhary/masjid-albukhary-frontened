<script setup>
import { useRouter } from 'nuxt/app'

const router = useRouter()

const links = [
  { link: "/admin", label: "Admin", icon: "mdi-account-cog" },
  { link: "/admin/booking-dashboard", label: "Booking Overview", icon: "mdi-calendar-check" },
  { link: "/admin/facility-form", label: "Facility Form", icon: "mdi-domain" },
  { link: "/admin/activity-form", label: "Activity Form", icon: "mdi-run" },
  { link: "/admin/news-form", label: "News Form", icon: "mdi-newspaper-variant" },
];

const handleLogout = () => {
  console.log('Logging out...')
  router.push('/')
}
</script>

<template>
  <aside class="sidebar">
    <h2 class="admin-title">Admin Panel</h2>

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
  height: 100vh;
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