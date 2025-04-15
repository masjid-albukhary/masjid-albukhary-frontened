<script setup lang="ts">
</script>

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

.admin-overview-overview-content .box {
  background: var(--primary-color);
  color: var(--text-color);
  text-align: center;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  border-radius: 15px;
  transition:var(--transition);
}

.admin-overview-overview-content .box:hover {
  transform: translateY(-5px);
  box-shadow: rgba(149, 157, 165, 0.4) 0 12px 28px;
}

.admin-overview-overview-content .box .box-title {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.admin-overview-overview-content .box .box-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 1.2rem;
}

.admin-overview-overview-content .box .box-content .icon {
  font-size: 1.2rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .admin-overview-overview-content {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .admin-overview-overview-content .box {
    padding: 1rem;
  }

  .admin-overview-overview-content .box .box-title {
    font-size: 1.8rem;
  }

  .admin-overview-overview-content .box .box-content {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-overview-overview-content {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .admin-overview-overview-content .box {
    padding: 0.8rem;
  }

  .admin-overview-overview-content .box .box-title {
    font-size: 1.5rem;
  }

  .admin-overview-overview-content .box .box-content {
    font-size: 0.9rem;
  }

  .admin-overview-overview-content .box .box-content .icon {
    font-size: 1.6rem;
  }
}

</style>
