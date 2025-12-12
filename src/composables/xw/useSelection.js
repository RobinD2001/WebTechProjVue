import { reactive, ref } from "vue";

export function useSelection(grid, gridSize) {
	const curCell = reactive({ row: -1, col: -1 });
	const nextCell = reactive({ row: -1, col: -1 });
	const downSelected = ref(true);
	const selectedAcrossId = ref(null);
	const selectedDownId = ref(null);

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
				if (c === curCell.col && r === curCell.row) {
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

	function updateCellSelection(newRow, newCol) {
		const cell = grid.value[newRow][newCol];

		if (curCell.row === newRow && curCell.col === newCol) {
			// Re-clicking the same cell flips direction to match common crossword UX.
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
			// If the active direction is missing, swap so the user is not stuck on blocks.
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

	return {
		curCell,
		nextCell,
		downSelected,
		selectedAcrossId,
		selectedDownId,
		updateCellSelection,
		handleClueSelected,
		clearHighlights,
		highlightByClue,
	};
}
