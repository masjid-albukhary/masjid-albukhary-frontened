<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";

definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <AdminHeader/>
  <section class="news-admin-container">
    <aside class="news-admin-aside">
      <AdminSideBar/>
    </aside>
    <main>

    </main>
  </section>
  <AdminFooter/>
</template>

<style scoped>
section{
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.news-admin-aside {
  display: flex;
  min-height: 100vh;
  height: 100%;
  background-color: var(--bg-color);
}

@media (max-width: 1024px) {
  section {
    grid-template-columns: 1fr;
  }

  .news-admin-aside {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .news-admin-aside {
    display: flex;
    flex-direction: column;
  }
}
</style>
