<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { getStats } from "@/composables/useStats";

const { logout, user } = useAuth();

const stats = ref(null);
const loading = ref(false);
const error = ref("");

const statsApi = getStats();

const username = computed(() => user.value?.username || user.value?.name || "Player");

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
		<BRow class="align-items-center mb-4">
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
