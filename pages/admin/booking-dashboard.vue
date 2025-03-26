<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";
</script>

<template>
  <TranslationHeader/>
  <AdminHeader/>
  <section class="admin-container">
    <aside class="news-aside">
      <AdminSideBar/>
    </aside>
    <main>

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
