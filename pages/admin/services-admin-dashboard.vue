<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";
import AdminOverview from "~/components/AdminOverview.vue";

definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <AdminHeader/>
  <section class="services-admin-container">
    <aside class="services-aside">
      <AdminSideBar/>
    </aside>
    <main>

    </main>
  </section>
  <AdminFooter/>
</template>

<style scoped>
.services-admin-container {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 20px;
}

.services-aside {
  display: flex;
  background-color: var(--bg-color);
}

main {
  padding: 20px;
}

@media (max-width: 1024px) {
  .services-admin-container {
    grid-template-columns: 1fr;
  }

  .services-aside {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .services-admin-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
