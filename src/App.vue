<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <Header />
  <!-- <router-link :to="{ name: 'admin' }"
    ><button class="btn btn-warning">Admin-Page</button></router-link
  > -->
  <router-view></router-view>
  <Footer />
</template>

<style scoped></style>
