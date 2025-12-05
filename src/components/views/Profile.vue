<script setup>
	import { onMounted, ref, computed } from "vue";
	import { useRouter } from "vue-router";
	import { useAuth } from "@/composables/useAuth";
	import { getStats } from "@/composables/useStats";
	import { resolveUsername } from "@/utils/user";
	import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

	const { logout, user } = useAuth();
	const router = useRouter();

	const stats = ref(null);
	const loading = ref(false);
	const error = ref("");

	const statsApi = getStats();

	const username = computed(() => resolveUsername(user.value) ?? "Guest");

	const goBack = () => {
		if (window?.history?.length > 1) {
			router.back();
		} else {
			router.push({ name: "home" });
		}
	};

	function formatDate(value) {
		if (!value) return "—";
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
	}

	function formatSeconds(value) {
		if (value === null || value === undefined) return "—";
		const totalSeconds = Math.round(Number(value));
		if (!Number.isFinite(totalSeconds)) return "—";
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${String(seconds).padStart(2, "0")}`;
	}

	async function loadStats() {
		loading.value = true;
		error.value = "";
		try {
			stats.value = await statsApi.getUser();
		} catch (err) {
			error.value = err?.message || "Failed to load profile stats.";
			stats.value = null;
		} finally {
			loading.value = false;
		}
	}

	onMounted(() => {
		loadStats();
	});
</script>

<template>
	<BContainer class="profile-page py-4">
		<BRow class="align-items-center mb-4 g-3">
			<BCol cols="auto">
				<BButton
					variant="outline-dark"
					class="back-btn"
					aria-label="Go back"
					@click="goBack">
					<FontAwesomeIcon :icon="faChevronLeft" />
				</BButton>
			</BCol>
			<BCol>
				<h1 class="mb-2">Profile</h1>
				<p class="mb-0">Welcome back, {{ username }}.</p>
			</BCol>
			<BCol cols="auto">
				<router-link :to="{ name: 'home' }">
					<BButton variant="warning" @click="logout()">Logout</BButton>
				</router-link>
			</BCol>
		</BRow>

		<BAlert v-if="error" variant="danger" show>{{ error }}</BAlert>

		<BCard class="panel">
			<div class="d-flex align-items-center justify-content-between mb-3">
				<h4 class="mb-0">Your Stats</h4>
				<BSpinner v-if="loading" small />
			</div>

			<div v-if="!loading && stats" class="stats-grid">
				<div class="stat">
					<div class="label">Joined</div>
					<div class="value">{{ formatDate(stats.joinedAt) }}</div>
				</div>
				<div class="stat">
					<div class="label">Last played</div>
					<div class="value">{{ formatDate(stats.lastPlayedAt) }}</div>
				</div>
				<div class="stat">
					<div class="label">Puzzles solved</div>
					<div class="value">{{ stats.totalSolved ?? 0 }}</div>
				</div>
				<div class="stat">
					<div class="label">Current streak</div>
					<div class="value">{{ stats.currentStreak ?? 0 }} days</div>
				</div>
				<div class="stat">
					<div class="label">Best streak</div>
					<div class="value">{{ stats.bestStreak ?? 0 }} days</div>
				</div>
				<div class="stat">
					<div class="label">Avg (14 days)</div>
					<div class="value">{{ formatSeconds(stats.average14Days) }}</div>
				</div>
				<div class="stat">
					<div class="label">Avg (overall)</div>
					<div class="value">{{ formatSeconds(stats.averageOverall) }}</div>
				</div>
			</div>

			<p v-else-if="!loading" class="mb-0 muted">No stats available.</p>
		</BCard>
	</BContainer>
</template>

<style scoped>
	.profile-page {
		max-width: 900px;
	}

	.back-btn {
		width: 2em;
		height: 2em;
		border-radius: 50%;
		font-size: 1.4rem;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding-top: 0.4em;
		margin-bottom: 1.5em;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}

	.stat {
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.9rem 1rem;
		background: var(--card);
		box-shadow: var(--shadow);
	}

	.label {
		font-size: 0.9rem;
		color: var(--muted);
	}

	.value {
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--accent);
	}
</style>
