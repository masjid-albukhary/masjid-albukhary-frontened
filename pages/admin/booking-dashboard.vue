<script setup lang="ts">
import AdminHeader from "~/components/AdminHeader.vue";
import AdminSideBar from "~/components/AdminSideBar.vue";

definePageMeta({
  middleware: 'auth'
});
</script>

<template>
  <AdminHeader />
  <section class="admin-layout">
    <aside class="admin-sidebar">
      <AdminSideBar />
    </aside>
    <main class="admin-main">
      <BookingDashboard/>
    </main>
  </section>
  <AdminFooter />
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 20px;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 0;
  margin: 0;
}

.admin-sidebar {
  display: flex;
  padding: 0;
  border-radius: 8px;
}

.admin-main {
  width: 100%;
  padding: 20px;
}

@media (max-width: 1024px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    justify-content: center;
  }
}


@media (max-width: 768px) {
  .admin-layout {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .admin-sidebar {
    margin-bottom: 20px;
  }
}
</style>
