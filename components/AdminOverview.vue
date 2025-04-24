<script setup lang="ts"></script>

<template>
  <section class="admin-overview">
    <div class="admin-overview-overview">

      <div class="admin-overview-overview-header">
        <h2>Welcome back </h2>
        <img src="../public/images/admin%20mosque.png" alt="admin mosque">
      </div>

      <div class="admin-overview-overview-content"></div>

    </div>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  height: 100vh;
}

.admin-overview-overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  padding: 2rem;
  flex-wrap: wrap;
}

.admin-overview-overview-header h2 {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0;
  text-align: center;
}


.admin-overview-overview-header img {
  width: 200px;
  height: 120px;
  object-fit: contain;
}


@media (max-width: 1024px) {
  .admin-overview-overview-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .admin-overview-overview-header h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .admin-overview-overview-header img {
    width: 180px;
    height: 100px;
  }
}

@media (max-width: 768px) {
  .admin-overview-overview-header {
    padding: 1rem;
  }

  .admin-overview-overview-header h2 {
    font-size: 1.5rem;
  }

  .admin-overview-overview-header img {
    width: 150px;
    height: 90px;
  }
}

@media (max-width: 480px) {
  .admin-overview-overview-header {
    flex-direction: column;
    text-align: center;
    padding: 0.8rem;
  }

  .admin-overview-overview-header h2 {
    font-size: 1.3rem;
  }

  .admin-overview-overview-header img {
    width: 150px;
    height: 90px;
  }
}

.admin-overview-overview-content {
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: .5rem;
  width: 90%;
  max-width: 1200px;
}


@media (max-width: 768px) {
  .admin-overview-overview-content {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

}

@media (max-width: 480px) {
  .admin-overview-overview-content {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

</style>
