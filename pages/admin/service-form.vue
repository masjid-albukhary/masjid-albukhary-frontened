<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";

</script>

<template>
  <AdminHeader/>
  <section class="admin-container">
    <aside class="services-aside">
      <AdminSideBar/>
    </aside>
    <main>
      <ServicesForm/>
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

.services-aside {
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

  .services-aside {
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
