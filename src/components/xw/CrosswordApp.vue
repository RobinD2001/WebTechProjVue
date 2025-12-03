<script setup>
	import { ref, watch } from "vue";
	import Cell from "@/components/xw/Cell.vue";
	import CluesWrapper from "@/components/xw/CluesWrapper.vue";
	import WinnerModal from "./WinnerModal.vue";
	import CrosswordTimer from "./CrosswordTimer.vue";
	import { addSolve } from "@/composables/useXW";
	import { useGridFactory } from "@/composables/xw/useGridFactory";
	import { useSelection } from "@/composables/xw/useSelection";
	import { useNavigation } from "@/composables/xw/useNavigation";
	import { useCrosswordTimer } from "@/composables/xw/useCrosswordTimer";

	const props = defineProps({
		date: String,
	});

	const showWinner = ref(false);

	const { grid, gridSize, setGrid, checkValidation } = useGridFactory();
	const selection = useSelection(grid, gridSize);
	const navigation = useNavigation(grid, gridSize, selection);
	const { timerDisplay, timerClass, startCountdown, stopTimer, elapsedMs } = useCrosswordTimer();

	const {
		curCell,
		nextCell,
		downSelected,
		selectedAcrossId,
		selectedDownId,
		updateCellSelection,
		handleClueSelected,
	} = selection;

	const { handleTyped, handleArrowKey, handleBackspace } = navigation;

	watch(
		() => props.date,
		() => {
			startCountdown();
		}
	);

	function updateCellValue(row, col, newValue) {
		grid.value[row][col].value = newValue;
		checkValidation();
	}

	function handleCrosswordSolved() {
		stopTimer();
		showWinner.value = true;
		addSolve(elapsedMs.value, props.date);
	}
</script>

<template>
	<BContainer class="mb-5 crossword-shell">
		<BRow class="justify-content-end mb-2">
			<BCol cols="auto">
				<CrosswordTimer :display="timerDisplay" :state="timerClass" />
			</BCol>
		</BRow>
		<BRow class="g-4">
			<BCol id="xw_grid" aria-label="Crossword grid container">
				<BContainer
					class="xw-board p-3 rounded-4"
					role="grid"
					:aria-label="`Crossword grid for ${props.date || 'today'}`">
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

			<CluesWrapper
				:selectedDownId="selectedDownId"
				:selectedAcrossId="selectedAcrossId"
				:date="props.date"
				:grid="checkValidation()"
				@grid-calculated="setGrid"
				@clueSelected="handleClueSelected"
				@crosswordSolved="handleCrosswordSolved" />
		</BRow>
	</BContainer>
	<WinnerModal v-model="showWinner" />
</template>

<style scoped>
	.crossword-shell {
		background: transparent;
	}

	.xw-board {
		background: var(--card);
		border: 2px solid var(--border);
		box-shadow: var(--shadow);
	}

	#xw_grid {
		min-width: 360px;
	}
</style>
