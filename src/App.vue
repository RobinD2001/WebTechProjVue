<script setup>
    import Auth from "@/components/auth/Auth.vue";
    import { RouterView, RouterLink } from "vue-router";
</script>

<template>
    <Auth />
    <router-view></router-view>
    <router-link :to="{name:'admin'}"><button>Admin-Page</button></router-link> 
</template>

<style scoped>
</style>
