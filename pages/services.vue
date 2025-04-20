<script setup lang="ts"> import ServicesStructure from "~/components/ServicesStructure.vue";

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <Header/>
  <SubLanding/>
  <ServicesCard/>
  <ServicesStructure/>
  <Footer/>
</template>

<style scoped>

</style>