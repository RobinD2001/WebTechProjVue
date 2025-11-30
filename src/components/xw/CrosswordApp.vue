<script setup>
	import { ref, reactive, computed } from "vue";
	import Cell from "@/components/xw/Cell.vue";
	import CluesWrapper from "@/components/xw/CluesWrapper.vue";
	import WinnerModal from "./WinnerModal.vue";

	const gridSize = reactive({ rows: 0, cols: 0 });
	const grid = ref([]);
	const showWinner = ref(false);

	const curCell = reactive({ row: -1, col: -1 });
	const nextCell = reactive({ row: -1, col: -1 });

	const downSelected = ref(true);
	const selectedAcrossId = ref(null);
	const selectedDownId = ref(null);

	const props = defineProps({
		date: String,
	});

	function setGrid(payload) {
		gridSize.rows = payload.size.rows;
		gridSize.cols = payload.size.cols;

		const { clueNumbers, acrossIds, downIds } = payload;
		console.log(payload);

		grid.value = Array.from({ length: gridSize.rows }, (_, r) =>
			Array.from({ length: gridSize.cols }, (_, c) => {
				const hasAcross = acrossIds[r][c] != null;
				const hasDown = downIds[r][c] != null;

				return {
					id: `${r}-${c}`,
					row: r,
					col: c,
					value: "",
					acrossClueId: acrossIds[r][c],
					downClueId: downIds[r][c],
					clueNumber: clueNumbers[r][c],
					isHighlighted: false,
					isSelected: false,
					isBlock: !hasAcross && !hasDown,
				};
			})
		);
	}

	function updateCellValue(row, col, newValue) {
		grid.value[row][col].value = newValue;
		checkValidation();
	}

	function checkValidation() {
		return grid.value;
	}

	function updateCellSelection(newRow, newCol) {
		const cell = grid.value[newRow][newCol];

		if (curCell.row === newRow && curCell.col === newCol) {
			downSelected.value = !downSelected.value;
		}

		curCell.row = newRow;
		curCell.col = newCol;

		for (let r = 0; r < gridSize.rows; r++) {
			for (let c = 0; c < gridSize.cols; c++) {
				grid.value[r][c].isSelected = r === newRow && c === newCol;
			}
		}

		let clueId = downSelected.value ? cell.downClueId : cell.acrossClueId;

		if (clueId == null) {
			clueId = !downSelected.value ? cell.downClueId : cell.acrossClueId;
			downSelected.value = !downSelected.value;
		}

		if (downSelected.value) {
			selectedDownId.value = clueId;
			selectedAcrossId.value = null;
			nextCell.row = curCell.row + 1;
			nextCell.col = curCell.col;
		} else {
			selectedAcrossId.value = clueId;
			selectedDownId.value = null;
			nextCell.row = curCell.row;
			nextCell.col = curCell.col + 1;
		}

		if (
			nextCell.row >= gridSize.rows ||
			nextCell.col >= gridSize.cols ||
			grid.value[nextCell.row][nextCell.col].isBlock
		) {
			nextCell.row = -1;
			nextCell.col = -1;
		}

		highlightByClue(downSelected.value, clueId);
	}

	function handleClueSelected(clue) {
		if (clue.down) {
			selectedDownId.value = clue.id;
			selectedAcrossId.value = null;
			downSelected.value = true;
		} else {
			selectedAcrossId.value = clue.id;
			selectedDownId.value = null;
			downSelected.value = false;
		}

		let first = null;
		for (let r = 0; r < gridSize.rows; r++) {
			for (let c = 0; c < gridSize.cols; c++) {
				const cell = grid.value[r][c];
				if (
					(!clue.down && cell.acrossClueId === clue.id) ||
					(clue.down && cell.downClueId === clue.id)
				) {
					first = cell;
					break;
				}
			}
			if (first) break;
		}

		if (first) {
			curCell.row = first.row;
			curCell.col = first.col;
			for (let r = 0; r < gridSize.rows; r++) {
				for (let c = 0; c < gridSize.cols; c++) {
					grid.value[r][c].isSelected = r === first.row && c === first.col;
				}
			}
		}
		highlightByClue(clue.down, clue.id);
	}

	function clearHighlights() {
		for (let r = 0; r < gridSize.rows; r++) {
			for (let c = 0; c < gridSize.cols; c++) {
				grid.value[r][c].isHighlighted = false;
			}
		}
	}

	function highlightByClue(down, clueId) {
		clearHighlights();
		if (clueId == 0) return;

		for (let r = 0; r < gridSize.rows; r++) {
			for (let c = 0; c < gridSize.cols; c++) {
				const cell = grid.value[r][c];
				if (c === curCell.col && r == curCell.row) {
					continue;
				}

				if (down) {
					if (cell.downClueId === clueId) {
						cell.isHighlighted = true;
					}
				} else {
					if (cell.acrossClueId === clueId) {
						cell.isHighlighted = true;
					}
				}
			}
		}
	}

	function handleTyped(row, col) {
		const step = 1;

		const rows = gridSize.rows;
		const cols = gridSize.cols;
		const current = grid.value[row][col];

		const isDown = downSelected.value;
		const clueId = isDown ? current.downClueId : current.acrossClueId;
		if (clueId == null) return;

		let r = row;
		let c = col;

		if (isDown) r += step;
		else c += step;

		if (r < 0 || r >= rows || c < 0 || c >= cols) return;

		const nextCell = grid.value[r][c];

		if (nextCell.isBlock) return null;

		updateCellSelection(r, c);
		return;
	}

	function handleArrowKey(row, col, key) {
		const cell = grid.value[row][col];
		//console.log(curCell);

		const isDownAxis = key === "ArrowUp" || key === "ArrowDown";
		const isCurrentDown = downSelected.value;
		const isOrthogonal = isDownAxis !== isCurrentDown;

		const hasAcross = cell.acrossClueId != null;
		const hasDown = cell.downClueId != null;
		const isCrossroad = hasAcross && hasDown;

		if (isCrossroad && isOrthogonal) {
			downSelected.value = !downSelected.value;
			const newClueId = downSelected.value ? cell.downClueId : cell.acrossClueId;
			highlightByClue(downSelected.value, newClueId);
			return;
		}

		let targetRow = row;
		let targetCol = col;

		if (key === "ArrowUp") targetRow--;
		if (key === "ArrowDown") targetRow++;
		if (key === "ArrowLeft") targetCol--;
		if (key === "ArrowRight") targetCol++;

		if (
			targetRow < 0 ||
			targetRow >= gridSize.rows ||
			targetCol < 0 ||
			targetCol >= gridSize.cols
		) {
			return;
		}

		const targetCell = grid.value[targetRow][targetCol];
		if (targetCell.isBlock) return;

		updateCellSelection(targetRow, targetCol);

		const clueId = downSelected.value ? targetCell.downClueId : targetCell.acrossClueId;

		if (clueId != null) {
			highlightByClue(downSelected.value, clueId);
		}
	}

	function findPrevInClue(row, col) {
		const rows = gridSize.rows;
		const cols = gridSize.cols;
		const current = grid.value[row][col];

		const isDown = downSelected.value;
		const clueId = isDown ? current.downClueId : current.acrossClueId;
		if (clueId == null) return null;

		let r = row;
		let c = col;

		if (isDown) r -= 1;
		else c -= 1;

		if (r < 0 || r >= rows || c < 0 || c >= cols) return null;

		const cell = grid.value[r][c];
		if (cell.isBlock) return null;

		return { row: r, col: c };
	}

	function handleBackspace(row, col) {
		curCell.row = row;
		curCell.col = col;

		if (grid.value[row][col].value == "") {
			const prev = findPrevInClue(row, col);

			if (prev) {
				grid.value[prev.row][prev.col].value = "";
				updateCellSelection(prev.row, prev.col);
				return;
			}
		}
		grid.value[row][col].value = "";
	}

	function handleCrosswordSolved() {
		showWinner.value = true;
	}
</script>

<template>
	<BContainer class="mb-5 crossword-shell">
		<BRow class="g-4">
			<BCol id="xw_grid">
				<BContainer class="xw-board p-3 rounded-4">
					<BRow v-for="(row, rId) in grid" :key="rId" class="g-1">
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
