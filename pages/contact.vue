<script setup lang="ts">

import Contact from "~/components/Contact.vue";

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <Header/>
  <SubLanding/>
  <Contact/>
  <Footer/>
</template>

<style scoped>

</style>