<script setup>
	import { ref } from 'vue';
	import Auth from '@/components/auth/Auth.vue';

	const showAuth = ref(false);
	const openAuth = () => {
		showAuth.value = true;
	};
</script>

<template>
	<div class="home">
		<section class="hero">
			<p class="eyebrow">Today's Mini</p>
			<h1>Today's Mini Crossword</h1>
			<p class="tagline">A fresh Mini every morning. Quick. Clever. Always free.</p>
			<div class="hero-actions">
				<BButton variant="outline-dark" class="cta">
					<span class="cta-icon">▶</span>
					Play Now
				</BButton>
				<button class="link-btn" type="button">Yesterday's puzzle →</button>
			</div>
		</section>

		<hr class="divider" />

		<section class="main-grid">
			<div class="panel puzzle">
				<h3>Puzzle of the Day</h3>
				<div class="puzzle-preview" >
					<div class="grid link-btn" :to="daily">
						<div class="cell number" aria-label="1 across">1</div>
						<div class="cell number" aria-label="2 across">2</div>
						<div class="cell block"></div>
						<div class="cell block"></div>
						<div class="cell"></div>
						<div class="cell block"></div>
						<div class="cell highlight number">5</div>
						<div class="cell highlight number">5</div>
						<div class="cell block"></div>
						<div class="cell"></div>
						<div class="cell block"></div>
						<div class="cell block"></div>
						<div class="cell block"></div>
						<div class="cell number">6</div>
						<div class="cell number">6</div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
						<div class="cell"></div>
					</div>
				</div>
				<button class="link-btn" type="button" @click="openAuth">Log in to track your stats →
				</button>
				<Auth v-model="showAuth"/>
			</div>

			<div class="panel leaderboard">
				<h3>Today's Fastest Solvers</h3>
				<table class="table sketch">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Player</th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>PuzzleMaster22</td>
							<td>00:23</td>
						</tr>
						<tr>
							<td>2</td>
							<td>Roxy</td>
							<td>00:25</td>
						</tr>
						<tr>
							<td>3</td>
							<td>User #128</td>
							<td>00:28</td>
						</tr>
						<tr>
							<td>4</td>
							<td>Jo</td>
							<td>00:30</td>
						</tr>
						<tr>
							<td>5</td>
							<td>QuickSolve</td>
							<td>00:33</td>
						</tr>
					</tbody>
				</table>
				<button class="link-btn center" type="button">See full leaderboard →</button>
			</div>
		</section>

		<section class="cta-grid">
			<div class="panel blurb">
				<p>
					A mini crossword you can solve in under a minute. New puzzle every morning. No
					clutter. Just play.
				</p>
			</div>
			<div class="panel action">
				<h4>Yesterday's Mini</h4>
				<p>Try to beat your time.</p>
				<button class="link-btn" type="button">Play →</button>
			</div>
			<div class="panel action">
				<h4>Random Mini</h4>
				<p>A surprise 5x5 from the vault.</p>
				<button class="link-btn" type="button">Play →</button>
			</div>
		</section>
	</div>
</template>

<style scoped>
.home {
	max-width: 1100px;
	margin: 0 auto;
	padding: 3rem 1.5rem 4rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.hero {
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.eyebrow {
	margin: 0;
	font-weight: 600;
	text-decoration: underline;
}

.hero h1 {
	margin: 0;
	font-size: 2.6rem;
}

.tagline {
	margin: 0;
	font-size: 1.1rem;
}

.hero-actions {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
}

.cta {
	font-size: 1.05rem;
	padding: 0.85rem 1.6rem;
	border-width: 2px;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}

.cta-icon {
	font-size: 0.9rem;
}

.link-btn {
	background: transparent;
	border: none;
	padding: 0;
	font: inherit;
	text-decoration: underline;
	color: inherit;
	cursor: pointer;
}

.divider {
	margin: 0;
	border: none;
	border-top: 1px solid #c5bca2;
}

.main-grid {
	display: grid;
	grid-template-columns: 1.1fr 0.9fr;
	gap: 1.5rem;
}

.panel {
	border: 1px solid #c5bca2;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.75);
	padding: 1.4rem;
	box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08);
}

.panel h3 {
	margin-top: 0;
	margin-bottom: 1rem;
}

.puzzle-preview {
	display: flex;
	justify-content: center;
	padding: 0.5rem 0 0.8rem;
}

.grid {
	display: grid;
	grid-template-columns: repeat(5, 42px);
	grid-template-rows: repeat(5, 42px);
	gap: 2px;
	border: 1px solid #b6ae94;
	padding: 6px;
	background: #f6f1e3;
}

.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fdfaf3;
	border: 1px solid #c8c1a8;
	font-weight: 700;
	position: relative;
}

.cell.number {
	align-items: flex-start;
	justify-content: flex-start;
	padding: 4px;
	font-size: 0.7rem;
}

.cell.block {
	background: #262626;
	border-color: #1c1c1c;
}

.cell.highlight {
	background: #c0d6e6;
}

.timer {
	text-align: center;
	font-weight: 700;
	font-size: 1.05rem;
	margin-top: 0.5rem;
	margin-bottom: 0.4rem;
}

.leaderboard .table {
	margin-bottom: 0.75rem;
}

.leaderboard table th,
.leaderboard table td {
	padding: 0.35rem 0.5rem;
}

.leaderboard .center {
	display: block;
	margin: 0 auto;
}

.cta-grid {
	display: grid;
	grid-template-columns: 2fr 1fr 1fr;
	gap: 1rem;
}

.blurb {
	display: flex;
	align-items: center;
	font-size: 1rem;
}

.action h4 {
	margin-top: 0;
	margin-bottom: 0.4rem;
}

.action p {
	margin: 0 0 0.5rem;
}

.footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.95rem;
}

.footer .links {
	display: flex;
	gap: 1.5rem;
}

@media (max-width: 980px) {
	.main-grid {
		grid-template-columns: 1fr;
	}

	.cta-grid {
		grid-template-columns: 1fr;
	}

	.hero-actions {
		flex-direction: column;
	}
}
</style>
