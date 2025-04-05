<script setup lang="ts">

import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";

definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <AdminHeader/>
  <section class="users-container">
    <aside class="users-aside">
      <AdminSideBar/>
    </aside>
    <main>
    </main>
  </section>
  <AdminFooter/>
</template>

<style scoped>
section {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 20px;
}

.users-aside {
  display: flex;
  background-color: var(--bg-color);
}

main {
  padding: 20px;
}

@media (max-width: 1024px) {
  section {
    grid-template-columns: 1fr;
  }

  .users-aside {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  section {
    display: flex;
    flex-direction: column;
  }
}
</style>
