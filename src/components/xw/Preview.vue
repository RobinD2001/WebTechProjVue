<script setup>
import { ref, computed, onMounted } from "vue";
import { getXWFromDate } from "@/composables/useXW.js";

const today = new Date().toISOString().slice(0, 10);
const clues = ref([]);
const loading = ref(true);
const error = ref(null);

const gridSize = computed(() => {
	if (!clues.value.length) return { rows: 0, cols: 0 };
	let rows = 0;
	let cols = 0;

	for (const clue of clues.value) {
		const len = (clue.answer ?? "").length;
		if (clue.is_across) {
			rows = Math.max(rows, clue.row + 1);
			cols = Math.max(cols, clue.col + len);
		} else {
			rows = Math.max(rows, clue.row + len);
			cols = Math.max(cols, clue.col + 1);
		}
	}

	return { rows, cols };
});

const grid = computed(() => {
	const { rows, cols } = gridSize.value;
	if (!rows || !cols) return [];

	const board = Array.from({ length: rows }, (_, r) =>
		Array.from({ length: cols }, (_, c) => ({
			row: r,
			col: c,
			isBlock: true,
			clueNumber: null,
		}))
	);

	for (const clue of clues.value) {
		const len = (clue.answer ?? "").length;
		if (len === 0) continue;

		if (clue.is_across) {
			for (let i = 0; i < len; i++) {
				const cell = board[clue.row][clue.col + i];
				cell.isBlock = false;
				if (i === 0) cell.clueNumber = clue.start_number;
			}
		} else {
			for (let i = 0; i < len; i++) {
				const cell = board[clue.row + i][clue.col];
				cell.isBlock = false;
				if (i === 0) cell.clueNumber = clue.start_number;
			}
		}
	}

	return board;
});

const cellSize = computed(() => {
	if (!gridSize.value.cols) return 48;
	// 5 columns => 60px (300 / 5). Scales with column count.
	return 300 / gridSize.value.cols;
});

async function loadToday() {
	loading.value = true;
	error.value = null;
	try {
		clues.value = await getXWFromDate(today);
	} catch (e) {
		console.error(e);
		error.value = "Could not load today's crossword.";
		clues.value = [];
	} finally {
		loading.value = false;
	}
}

onMounted(loadToday);
</script>

<template>
	<BContainer class="preview-page">
		<div class="header">
			<div>
				<p class="eyebrow mb-1">Preview</p>
				<h2 class="mb-0">Today's Mini</h2>
			</div>
		</div>
		<div class="grid-wrapper">
			<router-link
				class="grid-link"
				:to="{ name: 'daily' }"
				role="img"
				:aria-label="`Preview grid for ${today}`">
				<div
					class="grid"
					:style="{
						gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize}px)`,
						gridTemplateRows: `repeat(${gridSize.rows}, ${cellSize}px)`,
					}">
					<div
						v-for="cell in grid.flat()"
						:key="`${cell.row}-${cell.col}`"
						:class="['cell', { block: cell.isBlock }]">
						<span v-if="cell.clueNumber" class="clue-number">{{ cell.clueNumber }}</span>
					</div>
				</div>
			</router-link>
		</div>
	</BContainer>
</template>

<style scoped>
.preview-page {
	max-width: 900px;
	margin: 0 auto;
	padding: 2rem 1.5rem 3rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.eyebrow {
	margin: 0;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.75rem;
	color: var(--accent-strong);
}

.grid {
	display: inline-grid;
	gap: 2px;
	padding: 10px;
	border: 2px solid var(--border);
	border-radius: 12px;
	box-shadow: var(--shadow);
}

.cell {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fdfaf3;
	border: 1px solid var(--border);
	border-radius: 6px;
}

.cell.block {
	background: #262626;
	border-color: #1c1c1c;
}

.clue-number {
	position: absolute;
	top: 4px;
	left: 5px;
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--muted);
}

.grid-wrapper {
	text-align: center;
}

.grid-link {
	display: inline-block;
	color: inherit;
	text-decoration: none;
}
</style>
