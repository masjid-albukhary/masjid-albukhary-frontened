<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <Header/>
  <SubLanding/>
  <BookingForm/>
  <Footer/>
</template>

<style scoped>

</style>