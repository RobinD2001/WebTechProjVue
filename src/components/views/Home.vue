<script setup>
import { ref } from "vue";
import Preview from "@/components/xw/Preview.vue";
import Auth from "@/components/auth/Auth.vue";

const showAuth = ref(false);
const openAuth = () => {
	showAuth.value = true;
};

const leaderboard = [
	{ rank: 1, player: "PuzzleMaster22", time: "00:23" },
	{ rank: 2, player: "Roxy", time: "00:25" },
	{ rank: 3, player: "User #128", time: "00:28" },
	{ rank: 4, player: "Jo", time: "00:30" },
	{ rank: 5, player: "QuickSolve", time: "00:33" },
];

const tableFields = [
	{ key: "rank", label: "Rank" },
	{ key: "player", label: "Player" },
	{ key: "time", label: "Time" },
];
</script>

<template>
	<BContainer fluid class="home">
		<section class="hero">
			<p class="eyebrow">Minily</p>
			<h1>Daily Mini Crosswords</h1>
			<p class="tagline">A fresh Mini every morning. Quick. Clever. Always free.</p>
			<div class="hero-actions">
				<BButton variant="outline-dark" class="cta">
					<span class="cta-icon">▶</span>
					Play Now
				</BButton>
				<BButton variant="link" class="link-btn"
					:to="{ name: 'crossword' }">
					Yesterday's puzzle →
				</BButton>
			</div>
		</section>


		<BRow class="g-4 align-items-stretch">
			<BCol lg="7">
				<BCard class="panel h-100" body-class="p-0">
					<div class="panel-body">
						<Preview />
					</div>
				</BCard>
			</BCol>

			<BCol lg="5">
				<BCard class="panel h-100">
					<h3 class="mb-3">Today's Fastest Solvers</h3>
					<BTable
						:items="leaderboard"
						:fields="tableFields"
						small
						responsive
						striped
						class="mb-2" />	
        <BButton variant="link" class="link-btn" @click="openAuth">
            Log in to track your stats →
        </BButton>
        <Auth v-model="showAuth" />
				</BCard>
			</BCol>
		</BRow>

		<BRow class="cta-grid g-3">
			<BCol lg="4">
				<BCard class="panel blurb h-100">
					<h4>Fun fact of the day</h4>
					<p class="mb-0">
						Crossword were invented in some year i don't know.	
					</p>
				</BCard>
			</BCol>
			<BCol lg="4">
				<BCard class="panel action h-100">
					<h4>Yesterday's Mini</h4>
					<p>In case you missed it.</p>
					<BButton variant="link" class="link-btn"
						:to="{ name: 'crossword' }">
						Play →
					</BButton>
				</BCard>
			</BCol>
			<BCol lg="4">
				<BCard class="panel action h-100">
					<h4>Random Mini</h4>
					<p>A surprise one from the vault.</p>
					<BButton variant="link" class="link-btn"
						:to="{ name: 'crossword' }">
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
	flex-wrap: wrap;
}

.cta {
	font-size: 1.05rem;
	padding: 0.85rem 1.6rem;
	border-width: 2px;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	border-color: var(--accent);
	color: var(--accent);
	background: transparent;
}

.cta-icon {
	font-size: 0.9rem;
}

.cta:hover,
.cta:focus {
	background: var(--accent);
	color: #f8f4ea;
}

.link-btn {
	background: transparent;
	border: none;
	padding: 0;
	font-weight: 600;
	text-decoration: underline;
	color: var(--accent);
	cursor: pointer;
	box-shadow: none;
}

.link-btn:hover,
.link-btn:focus {
	color: var(--accent-strong);
}

.divider {
	margin: 0;
	border: none;
	border-top: 1px solid var(--border);
}

.panel {
	border: 1px solid var(--border);
	border-radius: 8px;
	background: var(--card);
	padding: 1.4rem;
	box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08);
}

.panel-body {
	padding: 0;
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

.timer {
	text-align: center;
	font-weight: 700;
	font-size: 1.05rem;
	margin-top: 0.5rem;
	margin-bottom: 0.4rem;
}

.leaderboard .center {
	display: block;
	margin: 0 auto;
}

.blurb {
	display: flex;
	align-items: start;
	font-size: 1rem;
}

.action h4 {
	margin-top: 0;
	margin-bottom: 0.4rem;
}

.action p {
	margin: 0 0 0.5rem;
}


@media (max-width: 980px) {
	.hero-actions {
		flex-direction: column;
	}
}
</style>
