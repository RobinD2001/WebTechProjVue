<script setup>
	import { ref } from "vue";
	import Auth from "@/components/auth/Auth.vue";
	import { useAuth } from "@/composables/useAuth";
  import { faUser } from "@fortawesome/free-regular-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

	const { isAuthenticated } = useAuth();
	const showAuth = ref(false);
	const openAuth = () => {
		showAuth.value = true;
	};
</script>

<template>
	<BNavbar toggleable="lg" class="bg-body-tertiary mb" aria-label="Main navigation">
		<BContainer fluid class="d-flex align-items-center">
			<BNavbarBrand to="/" tag="router-link" aria-label="Go to homepage">
				<img src="/favicon-32x32.png" alt="Crossword app logo" />
			</BNavbarBrand>
			<BNavbarToggle target="header-nav" class="ms-auto d-lg-none"></BNavbarToggle>
			<BCollapse
				id="header-nav"
				is-nav
				class="ms-lg-4 flex-grow-1 d-lg-flex align-items-center justify-content-between">
				<BNavbarNav class="me-auto mb-2 mb-lg-0">
					<BNavItem :to="{ name: 'daily' }" tag="router-link">Daily Puzzle</BNavItem>
					<BNavItem :to="{ name: 'daily' }" tag="router-link">Archive</BNavItem>
					<BNavItem :to="{ name: 'daily' }" tag="router-link">Leaderboard</BNavItem>
					<BNavItem :to="{ name: 'daily' }" tag="router-link">How to play</BNavItem>
				</BNavbarNav>
				<div class="d-flex">
					<router-link
						v-if="isAuthenticated"
						class="icon-btn"
						:to="{ name: 'profile' }"
						aria-label="Profile">
						<font-awesome-icon icon="user" />
					</router-link>
					<BButton
						v-else
						variant="outline-dark"
						class="icon-btn"
						aria-label="Login"
						@click="openAuth">
						<FontAwesomeIcon :icon="faUser" />
					</BButton>
				</div>
			</BCollapse>
		</BContainer>
	</BNavbar>
	<Auth v-model="showAuth" />
</template>

<style scoped>
.icon-btn {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 2px solid #333;
	color: #333;
	background: transparent;
	padding: 0;
}

.icon-btn:hover,
.icon-btn:focus {
	color: #000;
	border-color: #000;
}
</style>
