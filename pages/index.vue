<script setup lang="ts">
import WeeklyTalkComponent from "~/components/WeeklyTalkComponent.vue";

definePageMeta({
  middleware: 'auth'
})

</script>

<template>
  <Header/>
  <Landing/>
  <WeeklyTalkComponent/>
  <ActivitiesUpcomingCard/>
  <BookingStructure/>
  <DonateQRcode/>
  <MapSection/>
  <Footer/>
</template>

<style scoped>

</style>