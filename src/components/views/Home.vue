<script setup>
	import { onMounted, ref } from "vue";
	import { getDailyLeaderboard } from "@/composables/useStats";
	import Preview from "@/components/xw/Preview.vue";
	import Auth from "@/components/auth/Auth.vue";
	import LeaderboardList from "@/components/leaderboard/LeaderboardList.vue";

	const showAuth = ref(false);
	const leaderboard = ref([]);
	const loadingLeaderboard = ref(false);
	const errorLeaderboard = ref("");

	const openAuth = () => {
		showAuth.value = true;
	};

	async function loadMiniLeaderboard() {
		loadingLeaderboard.value = true;
		errorLeaderboard.value = "";
		try {
			const data = await getDailyLeaderboard();
			leaderboard.value = data?.leaderboard || [];
		} catch (err) {
			errorLeaderboard.value = err?.message || "Failed to load leaderboard.";
			leaderboard.value = [];
		} finally {
			loadingLeaderboard.value = false;
		}
	}

	onMounted(() => {
		loadMiniLeaderboard();
	});
</script>

<template>
	<BContainer fluid class="home">
		<section class="hero">
			<p class="eyebrow">v0.19</p>
			<h1>Daily Mini Crosswords</h1>
			<p class="tagline">A fresh Mini every morning. Quick. Clever. Always free.</p>
			<div class="hero-actions">
				<BButton variant="outline-dark" class="cta">
					<span class="cta-icon">▶</span>
					Play Now
				</BButton>
				<BButton variant="text" class="link-btn" :to="{ name: 'crossword' }">
					Yesterday's puzzle →
				</BButton>
			</div>
		</section>

		<BRow class="align-items-stretch">
			<BCol lg="7">
				<BCard class="panel h-100" body-class="p-0">
					<Preview />
				</BCard>
			</BCol>

			<BCol lg="5">
				<LeaderboardList
					variant="daily"
					:items="leaderboard"
					:loading="loadingLeaderboard"
					:error="errorLeaderboard"
					:limit="5">
					<template #footer>
						<BButton variant="text" class="link-btn mt-2" @click="openAuth">
							Log in to track your stats →
						</BButton>
						<Auth v-model="showAuth" />
					</template>
				</LeaderboardList>
			</BCol>
		</BRow>

		<BRow class="cta-grid g-3">
			<BCol lg="4">
				<BCard class="panel sction h-100">
					<h4>Fun fact of the day</h4>
					<p class="mb-0">Crossword were invented in some year i don't know.</p>
				</BCard>
			</BCol>
			<BCol lg="4">
				<BCard class="panel action h-100">
					<h4>Yesterday's Mini</h4>
					<p>In case you missed it.</p>
					<BButton variant="text" class="link-btn" :to="{ name: 'crossword' }">
						Play →
					</BButton>
				</BCard>
			</BCol>
			<BCol lg="4">
				<BCard class="panel action h-100">
					<h4>Random Mini</h4>
					<p>A surprise one from the vault.</p>
					<BButton variant="text" class="link-btn" :to="{ name: 'random' }">
						Play →
					</BButton>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<style scoped>
	.home {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.hero-actions {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.panel h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.leaderboard .center {
		display: block;
		margin: 0 auto;
	}

	.action {
		margin-top: 0;
		margin-bottom: 0.3rem;
	}

	@media (max-width: 980px) {
		.hero-actions {
			flex-direction: column;
		}
	}
</style>
