import { reactive, ref } from "vue";

export function useGridFactory() {
	const gridSize = reactive({ rows: 0, cols: 0 });
	const grid = ref([]);

	function setGrid(payload) {
		gridSize.rows = payload.size.rows;
		gridSize.cols = payload.size.cols;

		const { clueNumbers, acrossIds, downIds } = payload;

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

	function checkValidation() {
		return grid.value;
	}

	return {
		grid,
		gridSize,
		setGrid,
		checkValidation,
	};
}
