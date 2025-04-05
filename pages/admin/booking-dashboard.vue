<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";

definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <AdminHeader/>
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
section{
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.news-aside {
  display: flex;
  min-height: 100vh;
  height: 100%;
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
