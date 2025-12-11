<script setup>
	import { computed } from "vue";
	import { useI18n } from "vue-i18n";

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
		emptyText: { type: String, default: "" },
	});

	const { t } = useI18n();

	const variantDefaults = computed(() => ({
		daily: {
			eyebrow: t("leaderboardList.daily.eyebrow"),
			title: t("leaderboardList.daily.title"),
			subtitle: t("leaderboardList.daily.subtitle"),
			emptyText: t("leaderboardList.daily.empty"),
			fields: [
				{
					key: "rank",
					label: t("leaderboardList.columns.rank"),
					thStyle: { width: "90px" },
				},
				{ key: "player", label: t("leaderboardList.columns.player") },
				{ key: "time", label: t("leaderboardList.columns.time") },
			],
		},
		weekly: {
			eyebrow: t("leaderboardList.weekly.eyebrow"),
			title: t("leaderboardList.weekly.title"),
			subtitle: t("leaderboardList.weekly.subtitle"),
			emptyText: t("leaderboardList.weekly.empty"),
			fields: [
				{
					key: "rank",
					label: t("leaderboardList.columns.rank"),
					thStyle: { width: "90px" },
				},
				{ key: "player", label: t("leaderboardList.columns.player") },
				{ key: "avg", label: t("leaderboardList.columns.avg") },
			],
		},
	}));

	const resolvedVariant = computed(
		() => variantDefaults.value[props.variant] ?? variantDefaults.value.daily
	);
	const fields = computed(() => resolvedVariant.value.fields);

	const normalizedItems = computed(() =>
		props.items.map((entry, idx) => normalizeEntry(entry, idx, props.placement))
	);
	const displayItems = computed(() => {
		if (!props.limit || props.limit < 1) return normalizedItems.value;
		return normalizedItems.value.slice(0, props.limit);
	});

	const resolvedTitle = computed(
		() => props.title || resolvedVariant.value.title || "Leaderboard"
	);

	const resolvedSubtitle = computed(() => {
		if (props.subtitle) return props.subtitle;
		if (props.variant === "daily") {
			if (props.puzzleId)
				return t("leaderboardList.dailySubtitleWithId", { id: props.puzzleId });
			return resolvedVariant.value.subtitle || "";
		}
		return resolvedVariant.value.subtitle || "";
	});

	const resolvedEyebrow = computed(() => props.eyebrow || resolvedVariant.value.eyebrow || "");
	const resolvedEmptyText = computed(
		() =>
			props.emptyText || resolvedVariant.value.emptyText || t("leaderboardList.weekly.empty")
	);

	function formatSeconds(value) {
		if (value === null || value === undefined || Number.isNaN(value))
			return t("leaderboardList.noValue");
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

	function normalizeEntry(entry, idx, usr) {
		const rank = entry?.rank ?? idx + 1;
		const player = entry?.username;
		const rawTime = props.variant === "weekly" ? entry?.averageTime : entry?.time;
		const formattedTime = formatSeconds(rawTime);
		const isUser = rank == usr?.rank;

		return props.variant === "weekly"
			? { rank, player, avg: formattedTime, isUser }
			: { rank, player, time: formattedTime, isUser };
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
		</div>

		<div v-if="loading" class="state">
			<BSpinner small class="me-2" />
			<span>{{ $t("leaderboardList.loading") }}</span>
		</div>
		<BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>
		<div v-else>
			<BTable
				:items="displayItems"
				:fields="fields"
				small
				responsive
				striped
				head-variant="light"
				class="mb-0 board-table">
				<template #cell(rank)="data">
					<span>{{ data.item.rank }}</span>
					<BBadge v-if="data.item.isUser" variant="success" pill class="ms-2">{{
						$t("leaderboardList.placementBadge")
					}}</BBadge>
				</template>
			</BTable>
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
