<script setup>
	import Header from "@/components/layout/Header.vue";
	import Footer from "@/components/layout/Footer.vue";
	import { RouterView, RouterLink } from "vue-router";
	/*
	TODO: Leaderboard, Home, Archive, HowTo
	*/

</script>

<template>
	<Header />
	<router-view></router-view>
	<Footer />
</template>

<style></style>
