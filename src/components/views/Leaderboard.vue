<script setup>
const globalAverageLeaders = [
	{ rank: 1, player: "CrosswordCat", avgTime: "00:41" },
	{ rank: 2, player: "SpeedyScribe", avgTime: "00:44" },
	{ rank: 3, player: "GridGuru", avgTime: "00:46" },
	{ rank: 4, player: "DownAndAcross", avgTime: "00:48" },
	{ rank: 5, player: "PencilAndPaper", avgTime: "00:51" },
	{ rank: 6, player: "WordWeaver", avgTime: "00:54" },
	{ rank: 7, player: "BoxedIn", avgTime: "00:56" },
	{ rank: 8, player: "QuickQuill", avgTime: "00:58" },
	{ rank: 9, player: "AcrossFirst", avgTime: "01:01" },
	{ rank: 10, player: "LateNightSolver", avgTime: "01:03" },
];

const todayFastest = [
	{ rank: 1, player: "FlashFill", time: "00:14" },
	{ rank: 2, player: "Inkless", time: "00:16"},
	{ rank: 3, player: "CornerCheck", time: "00:18" },
	{ rank: 4, player: "PuzzlePulse", time: "00:19" },
	{ rank: 5, player: "NeonGrid", time: "00:21" },
	{ rank: 6, player: "ClueCatcher", time: "00:22" },
	{ rank: 7, player: "MinuteMaven", time: "00:23" },
	{ rank: 8, player: "SwiftSolve", time: "00:24" },
	{ rank: 9, player: "SharpDown", time: "00:25" },
	{ rank: 10, player: "BoxedBeat", time: "00:26" },
];

const globalFields = [
	{ key: "rank", label: "Rank" },
	{ key: "player", label: "Player" },
	{ key: "avgTime", label: "Avg Time (14 puzzles)" },
];

const todayFields = [
	{ key: "rank", label: "Rank" },
	{ key: "player", label: "Player" },
	{ key: "time", label: "Time" },
];
</script>

<template>
	<BContainer fluid class="leaderboard-page">
		<section class="intro">
			<p class="eyebrow">Community stats</p>
			<h1>Leaderboards</h1>
			<p class="lede">
				Track the fastest solvers across the last two weeks and see who topped today's puzzle.
			</p>
		</section>

		<BRow class="g-4">
			<BCol lg="6">
				<BCard class="board-card h-100">
					<div class="card-header">
						<div>
							<p class="eyebrow">Global board</p>
							<h3>Average solve time</h3>
							<p class="muted">Rolling average across the last 14 puzzles.</p>
						</div>
						<BBadge variant="success" pill>14-day</BBadge>
					</div>
					<BTable
						:items="globalAverageLeaders"
						:fields="globalFields"
						small
						responsive
						striped
						head-variant="light"
						class="mb-0 board-table" />
				</BCard>
			</BCol>

			<BCol lg="6">
				<BCard class="board-card h-100">
					<div class="card-header">
						<div>
							<p class="eyebrow">Daily sprint</p>
							<h3>Today's fastest</h3>
							<p class="muted">Times recorded for the current day's puzzle.</p>
						</div>
						<BBadge variant="primary" pill>Today</BBadge>
					</div>
					<BTable
						:items="todayFastest"
						:fields="todayFields"
						small
						responsive
						striped
						head-variant="light"
						class="mb-0 board-table" />
				</BCard>
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

.eyebrow {
	margin: 0;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.75rem;
	color: var(--accent-strong);
}

.intro h1 {
	margin: 0;
	font-size: 2.4rem;
}

.lede {
	margin: 0;
	font-size: 1.05rem;
}


.stat-band .label {
	display: block;
	font-size: 0.85rem;
	color: var(--muted);
}

.stat-band strong {
	color: var(--accent);
	font-size: 1.05rem;
}

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

@media (max-width: 768px) {
	.intro h1 {
		font-size: 2rem;
	}

	.card-header {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
