<script setup>
	import { computed, ref, watch } from "vue";
	import { useI18n } from "vue-i18n";
	import Cell from "@/components/xw/Cell.vue";
	import CluesWrapper from "@/components/xw/CluesWrapper.vue";
	import WinnerModal from "./WinnerModal.vue";
	import CrosswordTimer from "./CrosswordTimer.vue";
	import { addSolve, getXWInfo } from "@/composables/useXW";
	import { useGridFactory } from "@/composables/xw/useGridFactory";
	import { useSelection } from "@/composables/xw/useSelection";
	import { useNavigation } from "@/composables/xw/useNavigation";
	import { useCrosswordTimer } from "@/composables/xw/useCrosswordTimer";
	import { useAuth } from "@/composables/useAuth";
	import { readJson, writeJson, STORAGE_KEYS } from "@/utils/storage";

	const props = defineProps({
		date: String,
	});

	const { grid, gridSize, setGrid, checkValidation } = useGridFactory();
	const { timerDisplay, timerClass, startTimer, stopTimer, elapsedMs } = useCrosswordTimer();
	const { isAuthenticated } = useAuth();

	const selection = useSelection(grid, gridSize);
	const navigation = useNavigation(grid, gridSize, selection);
	const puzzleInfo = ref(null);
	const puzzleId = computed(() => puzzleInfo.value?.id ?? props.date ?? "unknown");
	const showWinner = ref(false);
	const activeClue = ref(null);
	const { t } = useI18n();
	const gridAriaLabel = computed(() =>
		props.date
			? t("crossword.gridAria", { date: props.date })
			: t("crossword.gridAriaToday")
	);

	const { curCell, selectedAcrossId, selectedDownId, updateCellSelection, handleClueSelected } =
		selection;

	const { handleTyped, handleArrowKey, handleBackspace } = navigation;

	const formattedElapsed = computed(() => {
		const totalSeconds = Math.floor((elapsedMs.value ?? 0) / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const seconds = Math.floor(totalSeconds % 60)
			.toString()
			.padStart(2, "0");
		if (hours > 0) {
			return `${hours}:${minutes}:${seconds}`;
		}
		return `${minutes}:${seconds}`;
	});

	watch(
		() => props.date,
		async () => {
			try {
				if (!props.date) {
					puzzleInfo.value = null;
				} else {
					// Keep puzzle metadata in sync with date changes (archive jumps, schedule).
					puzzleInfo.value = await getXWInfo(props.date);
				}
			} catch (err) {
				console.error("Failed to load puzzle info", err);
				puzzleInfo.value = null;
			}
			startTimer();
		},
		{ immediate: true }
	);

	function updateCellValue(row, col, newValue) {
		grid.value[row][col].value = newValue;
		checkValidation();
	}

	function persistSolveLocally() {
		const storedSolves = readJson(STORAGE_KEYS.solves, []);
		const solves = Array.isArray(storedSolves) ? storedSolves : [];

		// Cache solves so guests can sync once they authenticate.
		solves.push({
			id: puzzleId.value,
			timeMs: elapsedMs.value,
			recordedAt: new Date().toISOString(),
			releaseDate: props.date ?? null,
		});

		writeJson(STORAGE_KEYS.solves, solves);
	}

	async function handleCrosswordSolved() {
		stopTimer();
		showWinner.value = true;
		if (isAuthenticated.value) {
			await addSolve(elapsedMs.value, props.date);
		} else {
			persistSolveLocally();
		}
	}

	function handleActiveClueChange(clue) {
		activeClue.value = clue;
	}
</script>

<template>
	<BContainer class="mb-5 crossword-shell">
		<BRow class="mb-3">
			<BCol cols="12">
				<div class="top-line">
					<div class="active-clue-slot">
						<transition name="clue-fade">
							<div v-if="activeClue" class="active-clue" aria-live="polite">
								<span class="label">
									{{ activeClue.is_across ? $t("crossword.across") : $t("crossword.down") }}
								</span>
								<span class="body">
									<strong>{{ activeClue.start_number }}.</strong>
									{{ activeClue.question }}
								</span>
							</div>
						</transition>
					</div>
					<CrosswordTimer class="timer" :display="timerDisplay" :state="timerClass" />
				</div>
			</BCol>
		</BRow>
		<BRow class="g-4 align-items-start">
			<BCol id="xw_grid" aria-label="Crossword grid container" md="7" lg="7">
				<BContainer
					class="xw-board p-3 rounded-4"
					role="grid"
					:aria-label="gridAriaLabel">
					<BRow v-for="(row, rId) in grid" :key="rId" class="g-1" role="row">
						<BCol v-for="cell in row" :key="cell.col" class="p-0">
							<Cell
								:cell="cell"
								:isActive="cell.row === curCell.row && cell.col === curCell.col"
								@update:value="(val) => updateCellValue(cell.row, cell.col, val)"
								@update:isSelected="updateCellSelection(cell.row, cell.col)"
								@typed="(info) => handleTyped(cell.row, cell.col, info)"
								@move="(key) => handleArrowKey(cell.row, cell.col, key)"
								@backspace="() => handleBackspace(cell.row, cell.col)" />
						</BCol>
					</BRow>
				</BContainer>
			</BCol>

			<BCol md="5" lg="5">
				<CluesWrapper
					:selectedDownId="selectedDownId"
					:selectedAcrossId="selectedAcrossId"
					:date="props.date"
					:grid="checkValidation()"
					@activeClueChange="handleActiveClueChange"
					@grid-calculated="setGrid"
					@clueSelected="handleClueSelected"
					@crosswordSolved="handleCrosswordSolved" />
			</BCol>
		</BRow>
	</BContainer>
	<WinnerModal
		v-model="showWinner"
		:time-display="formattedElapsed"
		:is-authenticated="isAuthenticated"
		:puzzle-id="puzzleId" />
</template>

<style scoped>
	.crossword-shell {
		background: transparent;
	}

	.top-line {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-height: 68px;
	}

	.active-clue-slot {
		flex: 1;
		display: flex;
		align-items: center;
		min-height: 68px;
	}

	.xw-board {
		background: var(--card);
		border: 2px solid var(--border);
		box-shadow: var(--shadow);
	}

	#xw_grid {
		min-width: 360px;
	}

	.active-clue {
		display: flex;
		align-items: baseline;
		gap: 0.65rem;
		background: var(--card);
		border: 2px solid var(--border);
		border-radius: 12px;
		padding: 0.8rem 1rem;
		box-shadow: var(--shadow);
		font-size: 1.05rem;
		color: var(--accent-strong);
	}

	.clue-fade-enter-active,
	.clue-fade-leave-active {
		transition: all 180ms ease;
	}

	.clue-fade-enter-from,
	.clue-fade-leave-to {
		opacity: 0;
		transform: translateY(-6px);
	}

	.timer {
		margin-left: auto;
	}

	.active-clue .label {
		font-family: var(--font-heading);
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.95rem;
		color: var(--accent);
		letter-spacing: 0.02em;
	}

	.active-clue .body {
		flex: 1;
	}
</style>
