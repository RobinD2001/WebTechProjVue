<script setup>
	import { onMounted, ref } from "vue";
	import { getDailyLeaderboard, getWeeklyLeaderboard } from "@/composables/useStats";
	import LeaderboardList from "@/components/leaderboard/LeaderboardList.vue";

	const dailyRows = ref([]);
	const weeklyRows = ref([]);
	const crosswordId = ref(null);
	const dailyPlacement = ref(null);
	const weeklyPlacement = ref(null);
	const loadingDaily = ref(false);
	const loadingWeekly = ref(false);
	const errorDaily = ref("");
	const errorWeekly = ref("");

	async function loadDaily() {
		loadingDaily.value = true;
		errorDaily.value = "";
		try {
			const { crosswordID, leaderboard, userPlacement } = await getDailyLeaderboard();
			console.log("Daily:", leaderboard);

			crosswordId.value = crosswordID ?? null;
			dailyRows.value = leaderboard || [];
			dailyPlacement.value = userPlacement || null;
		} catch (err) {
			errorDaily.value = err?.message || "Failed to load today's leaderboard.";
			dailyRows.value = [];
			dailyPlacement.value = null;
		} finally {
			loadingDaily.value = false;
		}
	}

	async function loadWeekly() {
		loadingWeekly.value = true;
		errorWeekly.value = "";
		try {
			const { leaderboard, userPlacement } = await getWeeklyLeaderboard();
			console.log("Weekly:", leaderboard);
			weeklyRows.value = leaderboard || [];
			weeklyPlacement.value = userPlacement || null;
		} catch (err) {
			errorWeekly.value = err?.message || "Failed to load weekly leaderboard.";
			weeklyRows.value = [];
			weeklyPlacement.value = null;
		} finally {
			loadingWeekly.value = false;
		}
	}

	async function refreshLeaderboards() {
		await Promise.all([loadDaily(), loadWeekly()]);
	}

	onMounted(() => {
		refreshLeaderboards();
	});
</script>

<template>
	<BContainer fluid class="leaderboard-page">
		<section class="intro">
			<p class="eyebrow">Community stats</p>
			<h1>Leaderboards</h1>
			<p class="lede">
				See today's fastest solvers and the most consistent players this week.
			</p>
		</section>

		<BRow class="g-4">
			<BCol lg="6">
				<LeaderboardList
					class="h-100"
					variant="daily"
					:puzzle-id="crosswordId"
					:items="dailyRows"
					:placement="dailyPlacement"
					:loading="loadingDaily"
					:error="errorDaily" />
			</BCol>

			<BCol lg="6">
				<LeaderboardList
					class="h-100"
					variant="weekly"
					:items="weeklyRows"
					:placement="weeklyPlacement"
					:loading="loadingWeekly"
					:error="errorWeekly" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<style scoped>
	.leaderboard-page {
		max-width: 1150px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 3rem;
		padding-top: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.intro {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.intro h1 {
		margin: 0;
		font-size: 2.4rem;
	}

	@media (max-width: 768px) {
		.intro h1 {
			font-size: 2rem;
		}
	}
</style>
