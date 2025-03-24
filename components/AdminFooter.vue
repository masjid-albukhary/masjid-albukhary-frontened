<script setup lang="ts">

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer-admin-section">
    <div class="footer-container">
      <p>&copy; Copyright <a href="https://aiu.edu.my/">Al Bukhary Mosque {{ currentYear }}</a></p>
    </div>
  </footer>
</template>


<style scoped>
footer {
  margin: auto;
  background-color: var(--background-color);
  align-items: center;

  a {
    text-decoration: none;
    color: var(--text-color);
    transition: color 0.3s ease;
    text-align: center;
  }

  a:hover {
    text-decoration: underline;
    color: var(--text-hover);
    transition: color 0.3s ease;
  }
}

.footer-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  text-align: center;
  font-size: 1.2rem;
  padding: .5rem;
  color: var(--text-color);
  max-width: 1300px;
  background-color: var(--primary-color);
}

</style>