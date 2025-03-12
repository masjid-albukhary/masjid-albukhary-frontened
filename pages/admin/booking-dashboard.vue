<script setup lang="ts">

import AdminNavBar from "~/components/AdminNavBar.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";
</script>

<template>
  <AdminNavBar/>
  <section class="admin-container">
    <aside class="news-aside">
      <AdminSideBar/>
    </aside>
    <main>
      <BookingDashboard/>
    </main>
  </section>
  <AdminFooter/>
</template>

<style scoped>
.admin-container {
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.news-aside {
  display: flex;
  z-index: 1001;
  height: 100vh;
  background-color: var(--bg-color);
}

@media (max-width: 1024px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .news-aside {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .admin-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
