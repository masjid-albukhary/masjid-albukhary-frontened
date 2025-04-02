<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";
</script>

<template>
  <TranslationHeader/>
  <AdminHeader/>
  <section class="admin-container">
    <aside class="activities-aside">
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

.activities-aside {
  display: flex;
}

main {
  padding: 20px;
}

@media (max-width: 1024px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .activities-aside {
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
