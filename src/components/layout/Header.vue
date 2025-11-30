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
	<BNavbar toggleable="sm" class="bg-body-tertiary mb" aria-label="Main navigation">
		<BContainer fluid class="d-flex align-items-center">
			<BNavbarBrand to="/" tag="router-link" aria-label="Go to homepage">
				<img src="/favicon-32x32.png" alt="Crossword app logo" />
			</BNavbarBrand>
			<BNavbarToggle target="header-nav" class="ms-auto d-sm-none"></BNavbarToggle>
			<BCollapse
				id="header-nav"
				is-nav
				class="ms-sm-4 flex-grow-1 d-sm-flex align-items-center">
				<BNavbarNav class="me-sm-auto mb-2 mb-sm-0">
					<BNavItem :to="{ name: 'daily' }" tag="router-link">Daily Puzzle</BNavItem>
					<BNavItem :to="{ name: 'crossword' }" tag="router-link">Archive</BNavItem>
					<BNavItem :to="{ name: 'leaderboard' }" tag="router-link">Leaderboard</BNavItem>
					<BNavItem :to="{ name: 'howto' }" tag="router-link">How to play</BNavItem>
				</BNavbarNav>
				<BNavItem class="d-flex user ms-sm-3">
					<router-link
						v-if="isAuthenticated"
						class="icon-btn"
						:to="{ name: 'profile' }"
						aria-label="Profile">
						<font-awesome-icon :icon="faUser" />
					</router-link>
					<BButton
						v-else
						variant="outline-dark"
						class="btn"
						aria-label="Login"
						@click="openAuth">
            sign in
					</BButton>
				</BNavItem>
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

.user {
  margin-left: 2em;
}
</style>
