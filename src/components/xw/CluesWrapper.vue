<script setup>
	import { ref, watch } from "vue";
	import ClueList from "@/components/xw/ClueList.vue";
	import { getXWFromDate } from "@/composables/useXW.js";

	const props = defineProps({
		selectedDownId: Number,
		selectedAcrossId: Number,
		date: String,
		grid: Array,
	});
	const emit = defineEmits([
		"gridCalculated",
		"clueSelected",
		"crosswordSolved",
		"activeClueChange",
	]);

	const clues = ref([]);
	const clueChecks = ref([]);

	async function loadClues(date) {
		try {
			clues.value = await getXWFromDate(date);
		} catch (e) {
			console.error("Error while getting Crossword data: ", e);
			clues.value = [];
		}
	}

	watch(
		() => props.date,
		(date) => {
			if (!date) {
				clues.value = [];
				console.error("No date supplied!");
				return;
			}

			loadClues(date);
		},
		{ immediate: true }
	);

	function getClueKey(isAcross, id) {
		return `${isAcross ? "across" : "down"}-${id}`;
	}

	function aggregateValues(grid) {
		const aggregated = {};

		for (const row of grid) {
			for (const cell of row) {
				if (!cell || cell.isBlock) continue;

				if (cell.acrossClueId != null) {
					const key = getClueKey(true, cell.acrossClueId);
					aggregated[key] = (aggregated[key] ?? "") + (cell.value ?? "");
				}

				if (cell.downClueId != null) {
					const key = getClueKey(false, cell.downClueId);
					aggregated[key] = (aggregated[key] ?? "") + (cell.value ?? "");
				}
			}
		}

		return aggregated;
	}

	function validateGrid(grid) {
		if (!grid || grid.length === 0 || clues.value.length === 0) {
			clueChecks.value = [];
			return;
		}

		const filledByKey = aggregateValues(grid);

		const results = clues.value.map((clue) => {
			const key = getClueKey(clue.is_across, clue.start_number);
			const answer = (clue.answer ?? "").toUpperCase();
			const filled = (filledByKey[key] ?? "").toUpperCase();
			const isComplete = filled.length === answer.length && answer.length > 0;

			return {
				id: clue.start_number,
				isAcross: clue.is_across,
				answer,
				filled,
				matches: isComplete && filled === answer,
			};
		});

		clueChecks.value = results;
		let finished = true;
		for (const clue of clueChecks.value) {
			if (!clue.matches) finished = false;
		}
		if (finished) {
			// Emit once all answers match to keep solve detection independent of UI state.
			emit("crosswordSolved");
		}

		// console.table(
		// 	results.map((r) => ({
		// 		clue: `${r.isAcross ? "A" : "D"}${r.id}`,
		// 		filled: r.filled,
		// 		answer: r.answer,
		// 		matches: r.matches,
		// 	}))
		// );
	}

	watch(
		[() => props.grid, () => clues.value],
		([grid]) => {
			validateGrid(grid);
		},
		{ immediate: true, deep: true }
	);

	function setGrid(payload) {
		emit("gridCalculated", payload);
	}
	function handleClueSelected(payload) {
		emit("clueSelected", payload);
	}

	function emitActiveClue() {
		const isAcross = props.selectedAcrossId != null;
		const selectedId = isAcross ? props.selectedAcrossId : props.selectedDownId;
		if (!selectedId) {
			emit("activeClueChange", null);
			return;
		}

		const clue = clues.value.find(
			(c) => c.start_number === selectedId && c.is_across === isAcross
		);
		emit("activeClueChange", clue ?? null);
	}

	watch(
		[() => props.selectedAcrossId, () => props.selectedDownId, () => clues.value],
		() => emitActiveClue(),
		{ immediate: true, deep: true }
	);
</script>

<template>
	<ClueList
		:selectedDownId="props.selectedDownId"
		:selectedAcrossId="props.selectedAcrossId"
		:clues="clues"
		@grid-calculated="setGrid"
		@clueSelected="handleClueSelected" />
</template>
