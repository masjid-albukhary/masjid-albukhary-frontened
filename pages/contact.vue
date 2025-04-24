<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
import Contact from "~/components/Contact.vue";


</script>

<template>
  <Header/>
  <SubLanding/>
  <Contact/>
  <Footer/>
</template>

<style scoped>

</style>