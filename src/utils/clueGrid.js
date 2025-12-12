/**
 * Converts a flat clue list into grid metadata consumed by the crossword UI.
 * Keeping this logic in one place prevents drift between previews, admin tools,
 * and the main player when we change how grids are shaped.
 */
export function buildGridPayloadFromClues(list = []) {
	if (!Array.isArray(list) || list.length === 0) {
		return emptyGridPayload();
	}

	let rows = 0;
	let cols = 0;

	for (const clue of list) {
		const len = (clue.answer ?? "").length;
		if (len === 0) continue;

		if (clue.is_across) {
			rows = Math.max(rows, clue.row + 1);
			cols = Math.max(cols, clue.col + len);
		} else {
			rows = Math.max(rows, clue.row + len);
			cols = Math.max(cols, clue.col + 1);
		}
	}

	const clueNumbers = Array.from({ length: rows }, () => Array(cols).fill(0));
	const acrossIds = Array.from({ length: rows }, () => Array(cols).fill(null));
	const downIds = Array.from({ length: rows }, () => Array(cols).fill(null));

	for (const clue of list) {
		const len = (clue.answer ?? "").length;
		if (len === 0) continue;

		if (clue.is_across) {
			for (let i = 0; i < len; i++) {
				acrossIds[clue.row][clue.col + i] = clue.id ?? clue.start_number;
				if (i === 0) clueNumbers[clue.row][clue.col + i] = clue.start_number;
			}
		} else {
			for (let i = 0; i < len; i++) {
				downIds[clue.row + i][clue.col] = clue.id ?? clue.start_number;
				if (i === 0) clueNumbers[clue.row + i][clue.col] = clue.start_number;
			}
		}
	}

	return {
		size: { rows, cols },
		clueNumbers,
		acrossIds,
		downIds,
	};
}

export function emptyGridPayload() {
	return {
		size: { rows: 0, cols: 0 },
		clueNumbers: [],
		acrossIds: [],
		downIds: [],
	};
}
