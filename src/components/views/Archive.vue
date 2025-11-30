<script setup>
import { ref } from "vue";
import CrosswordApp from "@/components/xw/CrosswordApp.vue";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const yesterdayString = yesterday.toISOString().slice(0, 10);

const selectedDate = ref(yesterdayString);
const currentPuzzle = ref(yesterdayString);

const loadPuzzle = () => {
	currentPuzzle.value = selectedDate.value;
};
</script>

<template>
	<BContainer fluid class="archive-page">
		<section class="intro">
			<h1>Find a past Mini</h1>
			<p class="lede">Pick a date to load that day's mini crossword.</p>
		</section>

		<BCard class="panel">
			<BForm @submit.prevent="loadPuzzle">
				<BRow class="gy-2 gx-3 align-items-end">
					<BCol md="4">
						<BFormGroup label="Puzzle date" label-for="archive-date" label-class="fw-bold">
							<BFormInput
								id="archive-date"
								type="date"
								v-model="selectedDate"
								:max="today.toISOString().slice(0, 10)"
								required />
						</BFormGroup>
					</BCol>
					<BCol md="2" class="mb-3 mx-3">
						<BButton type="submit" variant="primary" class="w-100">Load crossword</BButton>
					</BCol>
					<BCol md="4" class="text-md-end stats mb-3">
						<div class="stat">
							<span class="label">Difficulty</span>
							<strong>{{ currentPuzzle?.difficulty }}</strong>
						</div>
						<div class="stat">
							<span class="label">Average time</span>
							<strong>{{ currentPuzzle?.avgTime }}</strong>
						</div>
					</BCol>
				</BRow>
			</BForm>
		</BCard>

		<BCard class="panel puzzle-card" v-if="currentPuzzle">
			<div class="header">
				<div>
					<p class="eyebrow mb-1">Selected puzzle</p>
					<h3 class="mb-0">{{ currentPuzzle.title }}</h3>
					<p class="muted mb-0">Loaded from {{ selectedDate }}</p>
				</div>
			</div>
			<CrosswordApp :date="selectedDate"></CrosswordApp>
		</BCard>
	</BContainer>
</template>

<style scoped>
.archive-page {
	max-width: 960px;
	margin: 0 auto;
    padding: 0;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.intro {
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.eyebrow {
	margin: 0;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.75rem;
	color: var(--accent-strong);
}

.lede {
	margin: 0;
	font-size: 1.05rem;
}

.panel {
	border: 1px solid var(--border);
	border-radius: 10px;
	background: var(--card);
	box-shadow: var(--shadow);
}

.stats {
	display: flex;
	gap: 1.5rem;
	justify-content: flex-end;
}

.stat .label {
	display: block;
	font-size: 0.85rem;
	color: var(--muted);
}

.stat strong {
	color: var(--accent);
}

.puzzle-card .header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1rem;
}

.muted {
	color: var(--muted);
}

.grid {
	display: grid;
	grid-template-rows: repeat(5, 1fr);
	gap: 4px;
	padding: 10px;
	border: 1px solid var(--border);
	background: var(--bg-alt);
	border-radius: 8px;
}

.grid-row {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
}

.cell {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fdfaf3;
	border: 1px solid var(--border);
	font-weight: 700;
	min-height: 48px;
	border-radius: 4px;
}

.cell.block {
	background: #262626;
	border-color: #1c1c1c;
}

@media (max-width: 768px) {
	.stats {
		justify-content: flex-start;
	}
}
</style>
