export function useNavigation(grid, gridSize, selection) {
	const { downSelected, updateCellSelection } = selection;

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
	}

	function handleArrowKey(row, col, key) {
		const cell = grid.value[row][col];

		const isDownAxis = key === "ArrowUp" || key === "ArrowDown";
		const isCurrentDown = downSelected.value;
		const isOrthogonal = isDownAxis !== isCurrentDown;

		const hasAcross = cell.acrossClueId != null;
		const hasDown = cell.downClueId != null;
		const isCrossroad = hasAcross && hasDown;

		if (isCrossroad && isOrthogonal) {
			// Users expect arrow keys to flip direction on intersections instead of jumping.
			downSelected.value = !downSelected.value;
			const newClueId = downSelected.value ? cell.downClueId : cell.acrossClueId;
			selection.selectedDownId.value = downSelected.value ? newClueId : null;
			selection.selectedAcrossId.value = downSelected.value ? null : newClueId;
			selection.highlightByClue(downSelected.value, newClueId);
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
			selection.highlightByClue(downSelected.value, clueId);
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
		selection.curCell.row = row;
		selection.curCell.col = col;

		if (grid.value[row][col].value === "") {
			const prev = findPrevInClue(row, col);

			if (prev) {
				grid.value[prev.row][prev.col].value = "";
				updateCellSelection(prev.row, prev.col);
				return;
			}
		}
		grid.value[row][col].value = "";
	}

	return {
		handleTyped,
		handleArrowKey,
		handleBackspace,
		findPrevInClue,
	};
}
