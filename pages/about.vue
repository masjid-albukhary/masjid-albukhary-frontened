<script setup lang="ts">

import Header from "~/components/Header.vue";

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <Header/>
  <landing/>
  <About/>
  <MemeberCard/>
  <Contact/>
  <Footer/>
</template>

<style scoped>

</style>