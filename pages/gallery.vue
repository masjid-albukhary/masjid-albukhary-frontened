<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <Header/>
  <SubLanding/>
  <Gallery/>
  <WeeklyTalkComponent/>
  <Footer/>
</template>

<style scoped>

</style>