<script setup>
	import { computed } from "vue";

	const props = defineProps({
		variant: { type: String, default: "daily" }, // "daily" or "weekly"
		items: { type: Array, default: () => [] }, // raw leaderboard rows from API
		placement: { type: Object, default: null }, // raw placement from API
		loading: { type: Boolean, default: false },
		error: { type: String, default: "" },
		limit: { type: Number, default: null },
		puzzleId: { type: [String, Number], default: null },
		title: { type: String, default: "" },
		subtitle: { type: String, default: "" },
		eyebrow: { type: String, default: "" },
		badge: { type: String, default: "" },
		badgeVariant: { type: String, default: "" },
		emptyText: { type: String, default: "" },
	});

	const variantDefaults = {
		daily: {
			eyebrow: "Daily sprint",
			title: "Today's fastest",
			subtitle: null,
			badge: "Today",
			badgeVariant: "primary",
			emptyText: "No solves recorded yet.",
			fields: [
				{ key: "rank", label: "Rank", thStyle: { width: "90px" } },
				{ key: "player", label: "Player" },
				{ key: "time", label: "Time" },
			],
		},
		weekly: {
			eyebrow: "Consistency",
			title: "Rolling weekly average",
			subtitle: "Average solve time across the last 7 puzzles.",
			badge: "7-day",
			badgeVariant: "info",
			emptyText: "No data yet.",
			fields: [
				{ key: "rank", label: "Rank", thStyle: { width: "90px" } },
				{ key: "player", label: "Player" },
				{ key: "avg", label: "Avg Time" },
			],
		},
	};

	const resolvedVariant = computed(() => variantDefaults[props.variant] ?? variantDefaults.daily);
	const fields = computed(() => resolvedVariant.value.fields);

	const normalizedItems = computed(() => props.items.map(normalizeEntry));
	const displayItems = computed(() => {
		if (!props.limit || props.limit < 1) return normalizedItems.value;
		return normalizedItems.value.slice(0, props.limit);
	});

	const resolvedPlacement = computed(() => normalizePlacement(props.placement));

	const resolvedTitle = computed(
		() => props.title || resolvedVariant.value.title || "Leaderboard"
	);

	const resolvedSubtitle = computed(() => {
		if (props.subtitle) return props.subtitle;
		if (props.variant === "daily") {
			if (props.puzzleId) return `Puzzle #${props.puzzleId}`;
			return "Times update as players finish.";
		}
		return resolvedVariant.value.subtitle || "";
	});

	const resolvedEyebrow = computed(() => props.eyebrow || resolvedVariant.value.eyebrow || "");
	const resolvedBadge = computed(() => props.badge || resolvedVariant.value.badge || "");
	const resolvedBadgeVariant = computed(
		() => props.badgeVariant || resolvedVariant.value.badgeVariant || "primary"
	);
	const resolvedEmptyText = computed(
		() => props.emptyText || resolvedVariant.value.emptyText || "No data yet."
	);

	function formatSeconds(value) {
		if (value === null || value === undefined || Number.isNaN(value)) return "no value";
		if (typeof value === "string") return value;
		const totalSeconds = Math.round(Number(value));
		if (!Number.isFinite(totalSeconds)) return "-";

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		const pad = (val) => String(val).padStart(2, "0");
		return hours > 0
			? `${hours}:${pad(minutes)}:${pad(seconds)}`
			: `${minutes}:${pad(seconds)}`;
	}

	function normalizeEntry(entry, idx) {
		const rank = entry?.rank ?? idx + 1;
		const player = entry?.username;
		const rawTime = props.variant === "weekly" ? entry?.averageTime : entry?.time;
		const formattedTime = formatSeconds(rawTime);

		return props.variant === "weekly"
			? { rank, player, avg: formattedTime }
			: { rank, player, time: formattedTime };
	}

	function normalizePlacement(placement) {
		if (!placement) return null;
		const player = placement.username ?? placement.user ?? placement.name ?? "You";
		const rank = placement.rank ?? placement.position ?? placement.place ?? null;
		const rawTime =
			placement.time ?? placement.solveTime ?? placement.average ?? placement.avgTime ?? null;
		return {
			player,
			rank,
			time: formatSeconds(rawTime),
		};
	}
</script>

<template>
	<BCard class="board-card h-100">
		<div class="card-header">
			<div>
				<p v-if="resolvedEyebrow" class="eyebrow">{{ resolvedEyebrow }}</p>
				<h3>{{ resolvedTitle }}</h3>
				<p v-if="resolvedSubtitle" class="muted">{{ resolvedSubtitle }}</p>
			</div>
			<BBadge v-if="resolvedBadge" :variant="resolvedBadgeVariant" pill>{{
				resolvedBadge
			}}</BBadge>
		</div>

		<div v-if="loading" class="state">
			<BSpinner small class="me-2" />
			<span>Loading leaderboard…</span>
		</div>
		<BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>
		<div v-else>
			<div v-if="resolvedPlacement" class="placement">
				<BBadge variant="success" class="me-2">You</BBadge>
				<span>#{{ resolvedPlacement.rank ?? "—" }} · {{ resolvedPlacement.time }}</span>
			</div>
			<BTable
				:items="displayItems"
				:fields="fields"
				small
				responsive
				striped
				head-variant="light"
				class="mb-0 board-table" />
			<p v-if="!displayItems.length" class="muted text-center my-3">
				{{ resolvedEmptyText }}
			</p>
		</div>
		<slot name="footer" />
	</BCard>
</template>

<style scoped>
	.board-card {
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--card);
		box-shadow: var(--shadow);
		padding: 1.25rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.card-header h3 {
		margin: 0.1rem 0;
	}

	.card-header .muted {
		margin: 0;
		color: var(--muted);
	}

	.board-table :deep(th),
	.board-table :deep(td) {
		vertical-align: middle;
	}

	.state {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--muted);
	}

	.placement {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 0.6rem;
		font-weight: 600;
		color: var(--accent);
	}
</style>
