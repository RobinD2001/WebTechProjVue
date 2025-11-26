<script setup>
import { useAuth } from "@/composables/useAuth";
const { logout } = useAuth();
</script>

<template>
  <h1>Profile</h1>
  <router-link :to="{ name: 'home' }">
    <button @click="logout()" class="btn btn-warning">Logout</button>
  </router-link>
</template>
