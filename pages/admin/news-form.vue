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
      <ActivitiesForm/>
    </main>
  </section>
  <AdminFooter/>
</template>

<style scoped>
.admin-container {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 20px;
}

.news-aside {
  display: flex;
  background-color: var(--bg-color);
}

main {
  padding: 20px;
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
